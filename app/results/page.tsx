'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Loader2, Bot, AlertTriangle, Zap } from 'lucide-react';
import SavingsHero from '@/components/results/SavingsHero';
import RecommendationCard from '@/components/results/RecommendationCard';
import SavingsChart from '@/components/results/SavingsChart';
import ShareButtons from '@/components/results/ShareButtons';
import CredexCTA from '@/components/results/CredexCTA';
import LeadCaptureModal from '@/components/results/LeadCaptureModal';
import type { AuditResult } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [summary, setSummary] = useState('');
  const [auditId, setAuditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('audit-result');
      const sum = sessionStorage.getItem('audit-summary');
      if (!raw) {
        router.push('/audit');
        return;
      }
      setResult(JSON.parse(raw));
      setSummary(sum ?? '');
    } catch {
      router.push('/audit');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLeadSuccess = (id: string) => {
    setAuditId(id);
    setShowModal(false);
    // Clean up sessionStorage
    sessionStorage.removeItem('audit-result');
    sessionStorage.removeItem('audit-summary');
  };

  if (loading) {
    return (
      <main className="mesh-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-indigo-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading your audit results…</p>
        </div>
      </main>
    );
  }

  if (!result) return null;

  return (
    <main className="mesh-bg min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/audit"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft size={14} />
            Re-run audit
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Zap size={12} className="text-indigo-400" />
            AI Spend Audit
          </div>
        </div>

        {/* Savings Hero */}
        <section className="mb-8" aria-label="Savings summary">
          <SavingsHero result={result} />
        </section>

        {/* AI Summary */}
        {summary && (
          <section className="glass-card rounded-2xl p-6 mb-8" aria-label="AI summary">
            <div className="flex items-center gap-2 mb-4">
              <Bot size={16} className="text-indigo-400" />
              <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                AI Audit Summary
              </span>
              <span className="text-xs text-slate-600 ml-auto">Powered by Gemini</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Charts */}
        {result.recommendations.length > 0 && (
          <section className="mb-8" aria-label="Savings charts">
            <SavingsChart result={result} />
          </section>
        )}

        {/* High-savings CTA */}
        {result.monthlySavings >= 100 && (
          <section className="mb-8">
            <CredexCTA
              monthlySavings={result.monthlySavings}
              annualSavings={result.annualSavings}
            />
          </section>
        )}

        {/* Recommendations */}
        {result.recommendations.length > 0 ? (
          <section className="mb-8" aria-label="Recommendations">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Recommendations ({result.recommendations.length})
            </h2>
            <div className="flex flex-col gap-3">
              {result.recommendations.map((rec, i) => (
                <RecommendationCard key={`${rec.toolId}-${i}`} rec={rec} rank={i + 1} />
              ))}
            </div>
          </section>
        ) : (
          <section className="glass-card rounded-2xl p-6 mb-8 text-center">
            <AlertTriangle size={20} className="text-emerald-400 mx-auto mb-2" />
            <p className="text-slate-300 font-medium">No significant optimizations found</p>
            <p className="text-slate-500 text-sm mt-1">
              Your AI stack looks well-optimized for your team size and use case.
            </p>
          </section>
        )}

        {/* Spend Summary cards */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8" aria-label="Spend summary">
          {[
            { label: 'Current/mo', value: formatCurrency(result.currentMonthlySpend), color: 'text-slate-300' },
            { label: 'Optimized/mo', value: formatCurrency(result.optimizedMonthlySpend), color: 'text-indigo-300' },
            { label: 'Save/mo', value: formatCurrency(result.monthlySavings), color: 'text-emerald-400' },
            { label: 'Save/year', value: formatCurrency(result.annualSavings), color: 'text-emerald-400' },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-4 text-center">
              <div className={cn('text-xl font-bold', s.color)}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Save & Share */}
        <section className="space-y-4">
          {/* Share (only if saved) */}
          {auditId ? (
            <ShareButtons auditId={auditId} monthlySavings={result.monthlySavings} />
          ) : (
            /* Save CTA */
            <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-400/10 flex items-center justify-center">
                <Mail size={18} className="text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Save & share your results</h3>
                <p className="text-slate-400 text-sm">
                  Get a permanent link, email summary, and save your audit for later.
                </p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap"
              >
                <Mail size={15} />
                Save Results
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Lead Capture Modal */}
      {showModal && (
        <LeadCaptureModal
          result={result}
          summary={summary}
          onSuccess={handleLeadSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
