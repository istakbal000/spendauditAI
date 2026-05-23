'use client';

import { ArrowRight, Sparkles, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CredexCTAProps {
  monthlySavings: number;
  annualSavings: number;
}

export default function CredexCTA({ monthlySavings, annualSavings }: CredexCTAProps) {
  const isHighSavings = monthlySavings > 500;
  const isMediumSavings = monthlySavings >= 100 && monthlySavings <= 500;

  if (!isHighSavings && !isMediumSavings) return null;

  if (isHighSavings) {
    return (
      <div
        className="rounded-3xl p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(239,68,68,0.08) 100%)',
          border: '1px solid rgba(245,158,11,0.25)',
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 60% at 80% 50%, rgba(245,158,11,0.08) 0%, transparent 70%)',
          }}
        />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-amber-400/10 flex items-center justify-center">
            <Sparkles size={24} className="text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full mb-3">
              🔥 HIGH SAVINGS OPPORTUNITY
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              You&apos;re leaving {formatCurrency(annualSavings)}/year on the table
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              This level of savings typically requires immediate action. Book a free 30-minute AI spend
              consultation to implement these changes — most teams see savings within the first billing cycle.
            </p>
          </div>
          <a
            href="#"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-amber-400 text-amber-950 hover:bg-amber-300 transition-colors whitespace-nowrap"
          >
            Book Free Consultation
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-400/10 flex items-center justify-center">
        <TrendingDown size={18} className="text-indigo-400" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-white mb-1">
          Save {formatCurrency(monthlySavings)}/month with a quick stack review
        </h3>
        <p className="text-slate-400 text-sm">
          A free 30-minute consultation can help you implement these changes faster.
        </p>
      </div>
      <a
        href="#"
        className="flex-shrink-0 btn-secondary text-sm px-5 py-2.5 whitespace-nowrap"
      >
        Book Consultation
      </a>
    </div>
  );
}
