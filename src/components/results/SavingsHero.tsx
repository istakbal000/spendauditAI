'use client';

import { formatCurrency } from '@/lib/utils';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import type { AuditResult } from '@/types';

interface SavingsHeroProps {
  result: AuditResult;
}

export default function SavingsHero({ result }: SavingsHeroProps) {
  const { monthlySavings, annualSavings, savingsPercentage, currentMonthlySpend, isEfficient } = result;

  if (isEfficient) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center glow-emerald">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-400/10 mb-4">
          <TrendingUp size={32} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          You&apos;re Already Efficient ✓
        </h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Your current AI stack of{' '}
          <span className="text-white font-semibold">{formatCurrency(currentMonthlySpend)}/month</span>{' '}
          is well-optimized. No significant savings opportunities were detected for your team size and use case.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.08) 100%)',
        border: '1px solid rgba(16,185,129,0.2)',
      }}
    >
      {/* Background glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-400/10 mb-4 pulse-glow">
          <TrendingDown size={28} className="text-emerald-400" />
        </div>

        <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold mb-3">
          Potential Monthly Savings
        </p>

        <div className="text-6xl sm:text-7xl font-black gradient-text-emerald mb-3 leading-none">
          {formatCurrency(monthlySavings)}
        </div>

        <div className="flex items-center justify-center gap-6 flex-wrap mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{formatCurrency(annualSavings)}</div>
            <div className="text-xs text-slate-500">saved annually</div>
          </div>
          <div className="w-px h-10 bg-white/10 hidden sm:block" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{savingsPercentage}%</div>
            <div className="text-xs text-slate-500">cost reduction</div>
          </div>
          <div className="w-px h-10 bg-white/10 hidden sm:block" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{formatCurrency(currentMonthlySpend)}</div>
            <div className="text-xs text-slate-500">current spend</div>
          </div>
        </div>

        <p className="text-emerald-300/80 text-sm font-medium">
          {result.recommendations.length} optimization{result.recommendations.length !== 1 ? 's' : ''} identified across your AI stack
        </p>
      </div>
    </div>
  );
}
