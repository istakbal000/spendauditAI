'use client';

import { formatCurrency, getConfidenceColor, getConfidenceLabel } from '@/lib/utils';
import { TrendingDown, ArrowRight, GitMerge, Lightbulb, CheckCircle } from 'lucide-react';
import type { Recommendation } from '@/types';
import { cn } from '@/lib/utils';

const TYPE_CONFIG = {
  downgrade: {
    icon: TrendingDown,
    label: 'Downgrade',
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
  },
  consolidate: {
    icon: GitMerge,
    label: 'Consolidate',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
  },
  alternative: {
    icon: Lightbulb,
    label: 'Alternative',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  efficient: {
    icon: CheckCircle,
    label: 'Efficient',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  upgrade: {
    icon: TrendingDown,
    label: 'Upgrade',
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
  },
};

interface RecommendationCardProps {
  rec: Recommendation;
  rank: number;
}

export default function RecommendationCard({ rec, rank }: RecommendationCardProps) {
  const cfg = TYPE_CONFIG[rec.type] ?? TYPE_CONFIG.downgrade;
  const Icon = cfg.icon;

  return (
    <div className="glass-card rounded-2xl p-5 hover:border-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Type + Tool */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Rank */}
          <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-slate-500">
            {rank}
          </div>

          {/* Icon */}
          <div className={cn('flex-shrink-0 p-2 rounded-xl', cfg.bg)}>
            <Icon size={16} className={cfg.color} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-semibold text-white text-sm">{rec.toolName}</span>
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', cfg.bg, cfg.color)}>
                {cfg.label}
              </span>
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', getConfidenceColor(rec.confidence))}>
                {getConfidenceLabel(rec.confidence)}
              </span>
            </div>

            {/* Plan change */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <span className="line-through text-slate-500">{rec.currentPlanName}</span>
              <ArrowRight size={10} className="text-slate-600" />
              <span className="text-emerald-400 font-medium">{rec.suggestedPlanName}</span>
            </div>

            {/* Reasoning */}
            <p className="text-xs text-slate-400 leading-relaxed">{rec.reasoning}</p>
          </div>
        </div>

        {/* Right: Savings */}
        <div className="flex-shrink-0 text-right">
          <div className="text-lg font-bold text-emerald-400">
            -{formatCurrency(rec.savingsAmount)}
          </div>
          <div className="text-xs text-slate-500">per month</div>
          <div className="text-xs text-slate-600 mt-0.5">
            -{formatCurrency(rec.savingsAmount * 12)}/yr
          </div>
        </div>
      </div>
    </div>
  );
}
