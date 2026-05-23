// ============================================================
// AI Spend Audit — Deterministic Audit Engine
// NO AI USED — pure rule-based logic
// ============================================================

import { getToolById, getPlanById } from '@/data/pricing';
import type {
  AuditEntry,
  AuditInput,
  AuditResult,
  Recommendation,
  ToolId,
} from '@/types';

// ─── Constants ───────────────────────────────────────────────

const CODING_TOOLS: ToolId[] = ['cursor', 'github-copilot', 'windsurf'];
const GENERAL_AI_TOOLS: ToolId[] = ['chatgpt', 'claude', 'gemini'];
const SMALL_TEAM_THRESHOLD = 3;

// ─── Rule: Downgrade low-seat team plans ─────────────────────
function checkTeamPlanWithFewUsers(entry: AuditEntry): Recommendation | null {
  const tool = getToolById(entry.toolId);
  const plan = getPlanById(entry.toolId, entry.planId);
  if (!tool || !plan) return null;

  const isTeamPlan =
    plan.name.toLowerCase().includes('team') ||
    plan.name.toLowerCase().includes('business');

  if (!isTeamPlan || entry.seats > SMALL_TEAM_THRESHOLD) return null;

  // Find the cheapest individual plan
  const individualPlan = tool.plans.find(
    (p) =>
      !p.name.toLowerCase().includes('team') &&
      !p.name.toLowerCase().includes('business') &&
      !p.name.toLowerCase().includes('enterprise') &&
      p.pricePerSeat > 0
  );

  if (!individualPlan) return null;

  const currentCost = plan.pricePerSeat * entry.seats;
  const suggestedCost = individualPlan.pricePerSeat * entry.seats;

  if (suggestedCost >= currentCost) return null;

  return {
    toolId: entry.toolId,
    toolName: tool.name,
    type: 'downgrade',
    currentPlanName: plan.name,
    suggestedPlanName: individualPlan.name,
    currentMonthlyCost: currentCost,
    suggestedMonthlyCost: suggestedCost,
    savingsAmount: currentCost - suggestedCost,
    reasoning: `${tool.name} ${plan.name} costs $${plan.pricePerSeat}/seat but with only ${entry.seats} user${entry.seats > 1 ? 's' : ''}, ${individualPlan.name} ($${individualPlan.pricePerSeat}/seat) covers all needs.`,
    confidence: 'high',
  };
}

// ─── Rule: Solo dev on enterprise/business plan ───────────────
function checkSoloDevOnHighTierPlan(entry: AuditEntry): Recommendation | null {
  const tool = getToolById(entry.toolId);
  const plan = getPlanById(entry.toolId, entry.planId);
  if (!tool || !plan) return null;

  if (entry.seats !== 1) return null;

  const isHighTier =
    plan.name.toLowerCase().includes('business') ||
    plan.name.toLowerCase().includes('enterprise');

  if (!isHighTier) return null;

  const proOrIndividualPlan = tool.plans.find(
    (p) =>
      (p.name.toLowerCase().includes('pro') ||
        p.name.toLowerCase().includes('individual') ||
        p.name.toLowerCase().includes('plus')) &&
      p.pricePerSeat > 0
  );

  if (!proOrIndividualPlan) return null;

  const currentCost = plan.pricePerSeat * entry.seats;
  const suggestedCost = proOrIndividualPlan.pricePerSeat * entry.seats;

  if (suggestedCost >= currentCost) return null;

  return {
    toolId: entry.toolId,
    toolName: tool.name,
    type: 'downgrade',
    currentPlanName: plan.name,
    suggestedPlanName: proOrIndividualPlan.name,
    currentMonthlyCost: currentCost,
    suggestedMonthlyCost: suggestedCost,
    savingsAmount: currentCost - suggestedCost,
    reasoning: `Solo developers don't need ${plan.name} features like SSO and admin controls. ${proOrIndividualPlan.name} has everything a single dev needs at ${Math.round((1 - suggestedCost / currentCost) * 100)}% less cost.`,
    confidence: 'high',
  };
}

// ─── Rule: Multiple overlapping coding AI tools ───────────────
function checkRedundantCodingTools(entries: AuditEntry[]): Recommendation | null {
  const codingEntries = entries.filter((e) => CODING_TOOLS.includes(e.toolId));
  if (codingEntries.length < 2) return null;

  const totalCodingSpend = codingEntries.reduce(
    (sum, e) => sum + e.monthlySpend,
    0
  );

  // Find the cheapest coding tool the user has
  const cheapestEntry = codingEntries.reduce((prev, curr) =>
    curr.monthlySpend < prev.monthlySpend ? curr : prev
  );
  const cheapestTool = getToolById(cheapestEntry.toolId);
  const mostExpensiveEntry = codingEntries.reduce((prev, curr) =>
    curr.monthlySpend > prev.monthlySpend ? curr : prev
  );
  const mostExpensiveTool = getToolById(mostExpensiveEntry.toolId);

  if (!cheapestTool || !mostExpensiveTool) return null;

  const savings = totalCodingSpend - mostExpensiveEntry.monthlySpend;

  return {
    toolId: mostExpensiveEntry.toolId,
    toolName: mostExpensiveTool.name,
    type: 'consolidate',
    currentPlanName: codingEntries.map((e) => getToolById(e.toolId)?.name).join(' + '),
    suggestedPlanName: mostExpensiveTool.name,
    currentMonthlyCost: totalCodingSpend,
    suggestedMonthlyCost: mostExpensiveEntry.monthlySpend,
    savingsAmount: savings,
    reasoning: `You're paying for ${codingEntries.length} AI coding tools simultaneously. Developers typically use one primary editor — consolidate to ${mostExpensiveTool.name} and cancel the rest to save $${savings.toFixed(0)}/month.`,
    confidence: 'medium',
  };
}

// ─── Rule: Multiple overlapping general AI tools ──────────────
function checkRedundantGeneralAITools(entries: AuditEntry[]): Recommendation | null {
  const generalEntries = entries.filter((e) =>
    GENERAL_AI_TOOLS.includes(e.toolId) &&
    e.monthlySpend > 0
  );
  if (generalEntries.length < 3) return null;

  const totalSpend = generalEntries.reduce((sum, e) => sum + e.monthlySpend, 0);
  const keepEntry = generalEntries.reduce((prev, curr) =>
    curr.monthlySpend > prev.monthlySpend ? curr : prev
  );
  const keepTool = getToolById(keepEntry.toolId);
  if (!keepTool) return null;

  const savings = totalSpend - keepEntry.monthlySpend;

  return {
    toolId: keepEntry.toolId,
    toolName: keepEntry.toolId as string,
    type: 'consolidate',
    currentPlanName: generalEntries.map((e) => getToolById(e.toolId)?.name).join(' + '),
    suggestedPlanName: keepTool.name,
    currentMonthlyCost: totalSpend,
    suggestedMonthlyCost: keepEntry.monthlySpend,
    savingsAmount: savings,
    reasoning: `ChatGPT, Claude, and Gemini heavily overlap in capabilities. Pick your primary assistant and cancel the rest — most teams thrive with one. Consolidating saves $${savings.toFixed(0)}/month.`,
    confidence: 'medium',
  };
}

// ─── Rule: ChatGPT Team with ≤2 users → suggest Plus ─────────
function checkChatGPTTeamSmall(entries: AuditEntry[]): Recommendation | null {
  const entry = entries.find(
    (e) => e.toolId === 'chatgpt' && e.planId === 'chatgpt-team'
  );
  if (!entry || entry.seats > 2) return null;

  const currentCost = entry.monthlySpend;
  const plusCost = 20 * entry.seats;
  const savings = currentCost - plusCost;
  if (savings <= 0) return null;

  return {
    toolId: 'chatgpt',
    toolName: 'ChatGPT',
    type: 'downgrade',
    currentPlanName: 'Team',
    suggestedPlanName: 'Plus',
    currentMonthlyCost: currentCost,
    suggestedMonthlyCost: plusCost,
    savingsAmount: savings,
    reasoning: `ChatGPT Team requires a 2-seat minimum but offers admin features most small teams don't need. Plus gives full GPT-4o access at $5/seat less — identical AI capability.`,
    confidence: 'high',
  };
}

// ─── Rule: Copilot Enterprise for small team ──────────────────
function checkCopilotEnterprise(entries: AuditEntry[]): Recommendation | null {
  const entry = entries.find(
    (e) => e.toolId === 'github-copilot' && e.planId === 'copilot-enterprise'
  );
  if (!entry || entry.seats > 10) return null;

  const currentCost = 39 * entry.seats;
  const businessCost = 19 * entry.seats;
  const savings = currentCost - businessCost;

  return {
    toolId: 'github-copilot',
    toolName: 'GitHub Copilot',
    type: 'downgrade',
    currentPlanName: 'Enterprise',
    suggestedPlanName: 'Business',
    currentMonthlyCost: currentCost,
    suggestedMonthlyCost: businessCost,
    savingsAmount: savings,
    reasoning: `Copilot Enterprise's personalized models and PR summaries are designed for large orgs. For teams under 10, Business has all essential features at exactly half the price.`,
    confidence: 'high',
  };
}

// ─── Rule: Windsurf Teams with few users → Pro ────────────────
function checkWindsurfTeamsSmall(entries: AuditEntry[]): Recommendation | null {
  const entry = entries.find(
    (e) => e.toolId === 'windsurf' && e.planId === 'windsurf-teams'
  );
  if (!entry || entry.seats > 3) return null;

  const currentCost = 35 * entry.seats;
  const proCost = 15 * entry.seats;
  const savings = currentCost - proCost;

  return {
    toolId: 'windsurf',
    toolName: 'Windsurf',
    type: 'downgrade',
    currentPlanName: 'Teams',
    suggestedPlanName: 'Pro',
    currentMonthlyCost: currentCost,
    suggestedMonthlyCost: proCost,
    savingsAmount: savings,
    reasoning: `Windsurf Teams requires 5+ seats minimum but you have ${entry.seats}. Individual Pro plans give the same AI capabilities at $20/seat less, saving $${savings.toFixed(0)}/month.`,
    confidence: 'high',
  };
}

// ─── Rule: Claude Team minimum seat waste ────────────────────
function checkClaudeTeamMinimum(entries: AuditEntry[]): Recommendation | null {
  const entry = entries.find(
    (e) => e.toolId === 'claude' && e.planId === 'claude-team'
  );
  if (!entry || entry.seats > 4) return null;

  const currentCost = 25 * entry.seats;
  const proCost = 20 * entry.seats;
  const savings = currentCost - proCost;

  return {
    toolId: 'claude',
    toolName: 'Claude',
    type: 'downgrade',
    currentPlanName: 'Team',
    suggestedPlanName: 'Pro',
    currentMonthlyCost: currentCost,
    suggestedMonthlyCost: proCost,
    savingsAmount: savings,
    reasoning: `Claude Team has a 5-seat minimum and costs $5/seat more than Pro. With ${entry.seats} users, individual Pro plans cover all AI needs without the team overhead.`,
    confidence: 'high',
  };
}

// ─── Rule: Suggest API over SaaS for developers ──────────────
function checkAPIvsSubscription(
  entries: AuditEntry[],
  useCase: string
): Recommendation | null {
  if (useCase !== 'coding' && useCase !== 'data-analysis') return null;

  const chatgptEntry = entries.find((e) => e.toolId === 'chatgpt' && e.monthlySpend >= 40);
  const hasAPIEntry = entries.some((e) => e.toolId === 'openai-api');

  if (!chatgptEntry || hasAPIEntry) return null;
  if (chatgptEntry.seats < 3) return null;

  const apiEstimate = chatgptEntry.monthlySpend * 0.6; // ~40% savings estimate
  const savings = chatgptEntry.monthlySpend - apiEstimate;

  return {
    toolId: 'chatgpt',
    toolName: 'ChatGPT',
    type: 'alternative',
    currentPlanName: 'ChatGPT Subscription',
    suggestedPlanName: 'OpenAI API',
    currentMonthlyCost: chatgptEntry.monthlySpend,
    suggestedMonthlyCost: apiEstimate,
    savingsAmount: savings,
    reasoning: `For a ${useCase} team, direct OpenAI API access typically costs 30–50% less than ChatGPT subscriptions at your scale. You pay only for actual usage instead of per-seat fees.`,
    confidence: 'low',
    alternativeToolId: 'openai-api',
  };
}

// ─── Main Audit Function ──────────────────────────────────────

export function runAudit(input: AuditInput): AuditResult {
  const { tools, teamSize, primaryUseCase } = input;
  const recommendations: Recommendation[] = [];

  // Run all rules
  for (const entry of tools) {
    const r1 = checkTeamPlanWithFewUsers(entry);
    if (r1) recommendations.push(r1);

    const r2 = checkSoloDevOnHighTierPlan(entry);
    if (r2) recommendations.push(r2);
  }

  const r3 = checkRedundantCodingTools(tools);
  if (r3) recommendations.push(r3);

  const r4 = checkRedundantGeneralAITools(tools);
  if (r4) recommendations.push(r4);

  const r5 = checkChatGPTTeamSmall(tools);
  if (r5 && !recommendations.some((r) => r.toolId === 'chatgpt' && r.type === 'downgrade')) {
    recommendations.push(r5);
  }

  const r6 = checkCopilotEnterprise(tools);
  if (r6) recommendations.push(r6);

  const r7 = checkWindsurfTeamsSmall(tools);
  if (r7) recommendations.push(r7);

  const r8 = checkClaudeTeamMinimum(tools);
  if (r8) recommendations.push(r8);

  const r9 = checkAPIvsSubscription(tools, primaryUseCase);
  if (r9) recommendations.push(r9);

  // Deduplicate — take highest-savings recommendation per tool
  const dedupedMap = new Map<string, Recommendation>();
  for (const rec of recommendations) {
    const existing = dedupedMap.get(rec.toolId);
    if (!existing || rec.savingsAmount > existing.savingsAmount) {
      dedupedMap.set(rec.toolId, rec);
    }
  }
  const finalRecommendations = Array.from(dedupedMap.values()).sort(
    (a, b) => b.savingsAmount - a.savingsAmount
  );

  // ─── Calculate totals ──────────────────────────────────────
  const currentMonthlySpend = tools.reduce((sum, e) => sum + e.monthlySpend, 0);
  const totalSavings = finalRecommendations.reduce(
    (sum, r) => sum + r.savingsAmount,
    0
  );
  const optimizedMonthlySpend = Math.max(0, currentMonthlySpend - totalSavings);
  const monthlySavings = totalSavings;
  const annualSavings = totalSavings * 12;
  const savingsPercentage =
    currentMonthlySpend > 0
      ? Math.min(100, Math.round((totalSavings / currentMonthlySpend) * 100))
      : 0;

  return {
    input,
    recommendations: finalRecommendations,
    currentMonthlySpend,
    optimizedMonthlySpend,
    monthlySavings,
    annualSavings,
    savingsPercentage,
    isEfficient: monthlySavings < 10,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Helpers ─────────────────────────────────────────────────

export function formatSavingsSummary(result: AuditResult): string {
  if (result.isEfficient) {
    return "You're already spending efficiently on AI tools.";
  }
  return `You could save $${result.monthlySavings.toFixed(0)}/month ($${result.annualSavings.toFixed(0)}/year) by optimizing your AI stack.`;
}
