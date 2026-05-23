import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AuditResult } from '@/types';

const TIMEOUT_MS = 8000;

function buildPrompt(result: AuditResult): string {
  const toolList = result.input.tools
    .map((t) => `${t.toolId} (${t.seats} seat${t.seats > 1 ? 's' : ''}, $${t.monthlySpend}/mo)`)
    .join(', ');

  const topRecs = result.recommendations
    .slice(0, 3)
    .map((r) => `${r.toolName}: ${r.reasoning}`)
    .join('; ');

  return `You are a concise B2B SaaS analyst. Write an 80–120 word professional audit summary for a startup spending $${result.currentMonthlySpend.toFixed(0)}/month on AI tools.

Tools audited: ${toolList}
Team size: ${result.input.teamSize}
Use case: ${result.input.primaryUseCase}
Monthly savings opportunity: $${result.monthlySavings.toFixed(0)}
Annual savings opportunity: $${result.annualSavings.toFixed(0)}
Key findings: ${topRecs || 'Spending is already optimized.'}

Write 2–3 short paragraphs. Be direct and specific. Mention actual dollar amounts. No marketing hype. No bullet points. Professional tone similar to a CFO briefing.`;
}

function buildFallbackSummary(result: AuditResult): string {
  if (result.isEfficient) {
    return `Your AI tool stack of $${result.currentMonthlySpend.toFixed(0)}/month is well-optimized for a ${result.input.teamSize}-person team focused on ${result.input.primaryUseCase}. Your current plan selections align with your team size and usage patterns. No significant inefficiencies were detected in your current configuration. Continue monitoring usage as your team grows to ensure plans remain right-sized.`;
  }

  const topRec = result.recommendations[0];
  return `Your team is spending $${result.currentMonthlySpend.toFixed(0)}/month on AI tools, but our audit found $${result.monthlySavings.toFixed(0)}/month in potential savings — that's $${result.annualSavings.toFixed(0)} annually. ${topRec ? `The biggest opportunity is ${topRec.toolName}: ${topRec.reasoning}` : ''} With ${result.recommendations.length} optimization${result.recommendations.length > 1 ? 's' : ''} identified, your team could reduce AI spend by ${result.savingsPercentage}% without losing any meaningful capability.`;
}

export async function generateAuditSummary(
  result: AuditResult
): Promise<{ summary: string; isFallback: boolean }> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return { summary: buildFallbackSummary(result), isFallback: true };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini timeout')), TIMEOUT_MS)
    );

    const generatePromise = model.generateContent(buildPrompt(result));
    const response = await Promise.race([generatePromise, timeoutPromise]);
    const text = response.response.text().trim();

    if (!text || text.length < 50) {
      throw new Error('Gemini returned empty response');
    }

    return { summary: text, isFallback: false };
  } catch (error) {
    console.error('[Gemini] Summary generation failed:', error);
    return { summary: buildFallbackSummary(result), isFallback: true };
  }
}
