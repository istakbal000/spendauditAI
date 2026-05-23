import { describe, it, expect } from 'vitest';
import { runAudit } from '@/engine/audit';
import type { AuditInput } from '@/types';

// ─── Test 1: ChatGPT Team with 2 users → recommend Plus ─────
describe('Audit Engine — Downgrade Rules', () => {
  it('recommends downgrade from ChatGPT Team to Plus for small teams', () => {
    const input: AuditInput = {
      tools: [
        { toolId: 'chatgpt', planId: 'chatgpt-team', seats: 2, monthlySpend: 50 },
      ],
      teamSize: 2,
      primaryUseCase: 'mixed',
    };

    const result = runAudit(input);

    expect(result.monthlySavings).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);

    const rec = result.recommendations.find((r) => r.toolId === 'chatgpt');
    expect(rec).toBeDefined();
    expect(rec!.type).toBe('downgrade');
    expect(rec!.suggestedPlanName).toBe('Plus');
    expect(rec!.savingsAmount).toBe(10); // $25/seat → $20/seat × 2 = $10 savings
  });

  it('recommends downgrade from Cursor Business to Pro for solo developer', () => {
    const input: AuditInput = {
      tools: [
        { toolId: 'cursor', planId: 'cursor-business', seats: 1, monthlySpend: 40 },
      ],
      teamSize: 1,
      primaryUseCase: 'coding',
    };

    const result = runAudit(input);

    expect(result.monthlySavings).toBeGreaterThan(0);
    const rec = result.recommendations.find((r) => r.toolId === 'cursor');
    expect(rec).toBeDefined();
    expect(rec!.type).toBe('downgrade');
    expect(rec!.savingsAmount).toBe(20); // $40 → $20 = $20 savings
    expect(rec!.confidence).toBe('high');
  });

  it('recommends downgrade from Copilot Enterprise to Business for small team', () => {
    const input: AuditInput = {
      tools: [
        { toolId: 'github-copilot', planId: 'copilot-enterprise', seats: 5, monthlySpend: 195 },
      ],
      teamSize: 5,
      primaryUseCase: 'coding',
    };

    const result = runAudit(input);

    expect(result.monthlySavings).toBeGreaterThan(0);
    const rec = result.recommendations.find((r) => r.toolId === 'github-copilot');
    expect(rec).toBeDefined();
    expect(rec!.suggestedPlanName).toBe('Business');
    expect(rec!.savingsAmount).toBe(100); // (39-19) × 5 = $100/mo savings
  });
});

// ─── Test 2: Redundant coding tools → consolidation ─────────
describe('Audit Engine — Consolidation Rules', () => {
  it('flags multiple coding AI tools as redundant and recommends consolidation', () => {
    const input: AuditInput = {
      tools: [
        { toolId: 'cursor', planId: 'cursor-pro', seats: 3, monthlySpend: 60 },
        { toolId: 'github-copilot', planId: 'copilot-individual', seats: 3, monthlySpend: 30 },
        { toolId: 'windsurf', planId: 'windsurf-pro', seats: 3, monthlySpend: 45 },
      ],
      teamSize: 3,
      primaryUseCase: 'coding',
    };

    const result = runAudit(input);

    expect(result.monthlySavings).toBeGreaterThan(0);
    const consolidation = result.recommendations.find((r) => r.type === 'consolidate');
    expect(consolidation).toBeDefined();
    expect(consolidation!.savingsAmount).toBeGreaterThan(0);
  });

  it('flags 3+ general AI tools as redundant', () => {
    const input: AuditInput = {
      tools: [
        { toolId: 'chatgpt', planId: 'chatgpt-plus', seats: 1, monthlySpend: 20 },
        { toolId: 'claude', planId: 'claude-pro', seats: 1, monthlySpend: 20 },
        { toolId: 'gemini', planId: 'gemini-advanced', seats: 1, monthlySpend: 19.99 },
      ],
      teamSize: 1,
      primaryUseCase: 'writing',
    };

    const result = runAudit(input);

    expect(result.monthlySavings).toBeGreaterThan(0);
    const consolidation = result.recommendations.find((r) => r.type === 'consolidate');
    expect(consolidation).toBeDefined();
  });
});

// ─── Test 3: Already efficient → no recommendations ─────────
describe('Audit Engine — Efficient Stack', () => {
  it('returns no savings for a well-optimized stack', () => {
    const input: AuditInput = {
      tools: [
        { toolId: 'cursor', planId: 'cursor-pro', seats: 1, monthlySpend: 20 },
      ],
      teamSize: 1,
      primaryUseCase: 'coding',
    };

    const result = runAudit(input);

    // Solo dev on Pro plan is optimal — no downgrade possible
    expect(result.isEfficient).toBe(true);
    expect(result.monthlySavings).toBeLessThan(10);
    expect(result.recommendations.filter((r) => r.type === 'downgrade').length).toBe(0);
  });

  it('correctly calculates annual savings as 12× monthly savings', () => {
    const input: AuditInput = {
      tools: [
        { toolId: 'chatgpt', planId: 'chatgpt-team', seats: 2, monthlySpend: 50 },
      ],
      teamSize: 2,
      primaryUseCase: 'mixed',
    };

    const result = runAudit(input);

    expect(result.annualSavings).toBeCloseTo(result.monthlySavings * 12, 1);
  });
});

// ─── Test 4: Enterprise recommendations ─────────────────────
describe('Audit Engine — Enterprise Downgrade', () => {
  it('recommends Business over Enterprise for teams under 10 on Copilot', () => {
    const input: AuditInput = {
      tools: [
        { toolId: 'github-copilot', planId: 'copilot-enterprise', seats: 8, monthlySpend: 312 },
      ],
      teamSize: 10,
      primaryUseCase: 'coding',
    };

    const result = runAudit(input);

    expect(result.monthlySavings).toBeGreaterThan(0);
    const rec = result.recommendations[0];
    expect(rec.confidence).toBe('high');
    expect(rec.savingsAmount).toBe(160); // (39-19) × 8
  });
});

// ─── Test 5: Savings calculation correctness ─────────────────
describe('Audit Engine — Calculation Accuracy', () => {
  it('calculates current monthly spend as sum of all tool spends', () => {
    const input: AuditInput = {
      tools: [
        { toolId: 'cursor', planId: 'cursor-pro', seats: 2, monthlySpend: 40 },
        { toolId: 'chatgpt', planId: 'chatgpt-plus', seats: 2, monthlySpend: 40 },
        { toolId: 'claude', planId: 'claude-pro', seats: 1, monthlySpend: 20 },
      ],
      teamSize: 2,
      primaryUseCase: 'coding',
    };

    const result = runAudit(input);

    expect(result.currentMonthlySpend).toBe(100); // 40 + 40 + 20
  });

  it('optimized monthly spend is never negative', () => {
    const input: AuditInput = {
      tools: [
        { toolId: 'cursor', planId: 'cursor-business', seats: 1, monthlySpend: 40 },
        { toolId: 'github-copilot', planId: 'copilot-enterprise', seats: 1, monthlySpend: 39 },
        { toolId: 'windsurf', planId: 'windsurf-teams', seats: 1, monthlySpend: 35 },
      ],
      teamSize: 1,
      primaryUseCase: 'coding',
    };

    const result = runAudit(input);

    expect(result.optimizedMonthlySpend).toBeGreaterThanOrEqual(0);
    expect(result.savingsPercentage).toBeGreaterThanOrEqual(0);
    expect(result.savingsPercentage).toBeLessThanOrEqual(100);
  });
});
