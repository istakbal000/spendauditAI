'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, AlertCircle, Zap } from 'lucide-react';
import { z } from 'zod';
import { TOOLS, getDefaultPlan } from '@/data/pricing';
import { runAudit } from '@/engine/audit';
import { cn, formatCurrency } from '@/lib/utils';
import ToolCard from './ToolCard';
import ToolSelector from './ToolSelector';
import type { AuditEntry, PrimaryUseCase, ToolId } from '@/types';

const STORAGE_KEY = 'ai-spend-audit-form';

const USE_CASES: { id: PrimaryUseCase; label: string; icon: string }[] = [
  { id: 'coding', label: 'Coding', icon: '⌨️' },
  { id: 'writing', label: 'Writing', icon: '✍️' },
  { id: 'research', label: 'Research', icon: '🔍' },
  { id: 'data-analysis', label: 'Data Analysis', icon: '📊' },
  { id: 'mixed', label: 'Mixed / Other', icon: '🔀' },
];

const DEFAULT_TOOLS: AuditEntry[] = [
  { toolId: 'cursor', planId: 'cursor-pro', seats: 1, monthlySpend: 20 },
  { toolId: 'chatgpt', planId: 'chatgpt-plus', seats: 1, monthlySpend: 20 },
];

export default function SpendForm() {
  const router = useRouter();
  const [tools, setTools] = useState<AuditEntry[]>(DEFAULT_TOOLS);
  const [teamSize, setTeamSize] = useState(3);
  const [useCase, setUseCase] = useState<PrimaryUseCase>('mixed');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tools?.length) setTools(parsed.tools);
        if (parsed.teamSize) setTeamSize(parsed.teamSize);
        if (parsed.useCase) setUseCase(parsed.useCase);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tools, teamSize, useCase }));
    } catch { /* ignore */ }
  }, [tools, teamSize, useCase]);

  const totalSpend = tools.reduce((sum, t) => sum + t.monthlySpend, 0);

  const handleToolChange = useCallback((updated: AuditEntry) => {
    setTools((prev) => prev.map((t) => (t.toolId === updated.toolId ? updated : t)));
  }, []);

  const handleToolRemove = useCallback((toolId: ToolId) => {
    setTools((prev) => prev.filter((t) => t.toolId !== toolId));
  }, []);

  const handleToolAdd = useCallback((entry: AuditEntry) => {
    setTools((prev) => [...prev, entry]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (tools.length === 0) {
      setError('Add at least one AI tool to audit.');
      return;
    }
    if (teamSize < 1) {
      setError('Team size must be at least 1.');
      return;
    }

    setLoading(true);

    try {
      const result = runAudit({ tools, teamSize, primaryUseCase: useCase });

      // Fetch AI summary
      let summary = '';
      try {
        const res = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result),
        });
        if (res.ok) {
          const data = await res.json();
          summary = data.summary;
        }
      } catch { /* non-blocking */ }

      // Store in sessionStorage for results page
      sessionStorage.setItem('audit-result', JSON.stringify(result));
      sessionStorage.setItem('audit-summary', summary);

      router.push('/results');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">AI Spend Audit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Audit Your <span className="gradient-text">AI Stack</span>
        </h1>
        <p className="text-slate-400">
          Add the AI tools your team pays for. We&apos;ll find savings opportunities instantly.
        </p>
      </div>

      {/* Section 1: Tools */}
      <section className="mb-8 relative z-30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Your AI Tools
          </h2>
          {totalSpend > 0 && (
            <span className="text-sm text-slate-400">
              Total: <span className="text-white font-semibold">{formatCurrency(totalSpend)}/mo</span>
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {tools.length === 0 && (
            <div className="glass-card rounded-2xl p-8 text-center text-slate-500">
              <p className="mb-2">No tools added yet.</p>
              <p className="text-sm">Use the button below to add your AI tools.</p>
            </div>
          )}
          {tools.map((entry) => (
            <ToolCard
              key={entry.toolId}
              entry={entry}
              onChange={handleToolChange}
              onRemove={() => handleToolRemove(entry.toolId)}
            />
          ))}
          <ToolSelector
            selectedToolIds={tools.map((t) => t.toolId)}
            onAdd={handleToolAdd}
          />
        </div>
      </section>

      {/* Section 2: Team Context */}
      <section className="glass-card rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">
          Team Context
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Team Size */}
          <div>
            <label htmlFor="team-size" className="block text-sm text-slate-400 mb-2">
              Total team size
            </label>
            <input
              id="team-size"
              type="number"
              min={1}
              max={100000}
              value={teamSize}
              onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25"
              placeholder="e.g. 12"
            />
            <p className="text-xs text-slate-600 mt-1">Including non-technical roles</p>
          </div>

          {/* Primary Use Case */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Primary use case</label>
            <div className="grid grid-cols-2 gap-2">
              {USE_CASES.map((uc) => (
                <button
                  key={uc.id}
                  type="button"
                  onClick={() => setUseCase(uc.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-150',
                    useCase === uc.id
                      ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                      : 'bg-white/[0.03] border-white/8 text-slate-400 hover:bg-white/5 hover:border-white/15'
                  )}
                >
                  <span>{uc.icon}</span>
                  {uc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6 text-red-400 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || tools.length === 0}
        className={cn(
          'w-full btn-primary py-4 text-base',
          (loading || tools.length === 0) && 'opacity-60 cursor-not-allowed hover:transform-none hover:shadow-none'
        )}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Analyzing your stack…
          </>
        ) : (
          <>
            Run My Audit
            <ArrowRight size={18} />
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-600 mt-4">
        No account required · Results in seconds · 100% free
      </p>
    </form>
  );
}
