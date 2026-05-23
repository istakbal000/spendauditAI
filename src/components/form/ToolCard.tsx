'use client';

import { useState } from 'react';
import { Trash2, ChevronDown, Users, DollarSign } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { TOOLS } from '@/data/pricing';
import type { AuditEntry } from '@/types';

interface ToolCardProps {
  entry: AuditEntry;
  onChange: (updated: AuditEntry) => void;
  onRemove: () => void;
}

export default function ToolCard({ entry, onChange, onRemove }: ToolCardProps) {
  const [showDetails, setShowDetails] = useState(true);
  const tool = TOOLS.find((t) => t.id === entry.toolId);
  if (!tool) return null;

  const selectedPlan = tool.plans.find((p) => p.id === entry.planId) ?? tool.plans[0];
  const suggestedCost = selectedPlan.pricePerSeat * entry.seats;

  const categoryColors: Record<string, string> = {
    coding: 'from-indigo-500 to-violet-600',
    general: 'from-violet-500 to-pink-600',
    api: 'from-emerald-500 to-teal-600',
    writing: 'from-amber-500 to-orange-600',
  };
  const gradient = categoryColors[tool.category] ?? 'from-indigo-500 to-violet-600';

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/20 transition-colors">
      {/* Card Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg`}
          >
            {tool.name[0]}
          </div>
          <div>
            <div className="font-semibold text-white text-sm">{tool.name}</div>
            <div className="text-xs text-slate-500 capitalize">{tool.category} tool</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {entry.monthlySpend > 0 && (
            <span className="text-sm font-semibold text-emerald-400">
              {formatCurrency(entry.monthlySpend)}/mo
            </span>
          )}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Toggle details"
          >
            <ChevronDown
              size={16}
              className={cn('text-slate-400 transition-transform', showDetails && 'rotate-180')}
            />
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-slate-500 rounded-lg transition-colors"
            aria-label={`Remove ${tool.name}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      {showDetails && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Plan Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor={`plan-${entry.toolId}`}>
              Current Plan
            </label>
            <div className="relative">
              <select
                id={`plan-${entry.toolId}`}
                value={entry.planId}
                onChange={(e) => {
                  const newPlan = tool.plans.find((p) => p.id === e.target.value);
                  onChange({
                    ...entry,
                    planId: e.target.value,
                    monthlySpend: newPlan ? newPlan.pricePerSeat * entry.seats : entry.monthlySpend,
                  });
                }}
                className="w-full appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 cursor-pointer"
              >
                {tool.plans.map((plan) => (
                  <option key={plan.id} value={plan.id} className="bg-slate-900">
                    {plan.name} {plan.pricePerSeat > 0 ? `· $${plan.pricePerSeat}/seat` : '· Free'}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-3 text-slate-400 pointer-events-none" />
            </div>
            {selectedPlan.features[0] && (
              <p className="text-xs text-slate-600 mt-1">{selectedPlan.features[0]}</p>
            )}
          </div>

          {/* Seats */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor={`seats-${entry.toolId}`}>
              <Users size={11} className="inline mr-1" />
              Seats / Users
            </label>
            <input
              id={`seats-${entry.toolId}`}
              type="number"
              min={1}
              max={10000}
              value={entry.seats}
              onChange={(e) => {
                const seats = Math.max(1, parseInt(e.target.value) || 1);
                onChange({
                  ...entry,
                  seats,
                  monthlySpend: selectedPlan.pricePerSeat * seats,
                });
              }}
              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25"
            />
          </div>

          {/* Monthly Spend */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor={`spend-${entry.toolId}`}>
              <DollarSign size={11} className="inline mr-1" />
              Monthly Spend
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 text-sm">$</span>
              <input
                id={`spend-${entry.toolId}`}
                type="number"
                min={0}
                step={0.01}
                value={entry.monthlySpend}
                onChange={(e) =>
                  onChange({ ...entry, monthlySpend: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 pl-6 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25"
              />
            </div>
            {suggestedCost !== entry.monthlySpend && suggestedCost > 0 && (
              <button
                type="button"
                onClick={() => onChange({ ...entry, monthlySpend: suggestedCost })}
                className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 transition-colors"
              >
                Use suggested: {formatCurrency(suggestedCost)}/mo
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
