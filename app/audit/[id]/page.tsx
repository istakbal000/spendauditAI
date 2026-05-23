import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Bot, Zap } from 'lucide-react';
import RecommendationCard from '@/components/results/RecommendationCard';
import SavingsHero from '@/components/results/SavingsHero';
import { formatCurrency, cn, getBaseUrl } from '@/lib/utils';
import type { AuditRecord, AuditResult } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

async function getAudit(id: string): Promise<AuditRecord | null> {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/audit?id=${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    return { title: 'Audit Not Found — AI Spend Audit' };
  }

  const savings = audit.monthly_savings ?? 0;
  const title =
    savings > 0
      ? `AI Audit: ${formatCurrency(savings)}/month savings found — AI Spend Audit`
      : 'AI Spend Audit Report — Efficiently Optimized';

  const description = `See the AI tool audit report. ${savings > 0 ? `Found ${formatCurrency(savings)}/month (${formatCurrency(savings * 12)}/year) in potential savings.` : 'Stack is well-optimized.'}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'AI Spend Audit',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PublicAuditPage({ params }: Props) {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) notFound();

  // Reconstruct a partial AuditResult for components
  const result: AuditResult = {
    id: audit.id,
    input: {
      tools: audit.tools ?? [],
      teamSize: audit.team_size ?? 0,
      primaryUseCase: audit.use_case as any ?? 'mixed',
    },
    recommendations: audit.recommendations ?? [],
    currentMonthlySpend: audit.current_monthly ?? 0,
    optimizedMonthlySpend: audit.optimized_monthly ?? 0,
    monthlySavings: audit.monthly_savings ?? 0,
    annualSavings: audit.annual_savings ?? 0,
    savingsPercentage:
      audit.current_monthly && audit.monthly_savings
        ? Math.round((audit.monthly_savings / audit.current_monthly) * 100)
        : 0,
    isEfficient: (audit.monthly_savings ?? 0) < 10,
    generatedAt: audit.created_at,
  };

  return (
    <main className="mesh-bg min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
              AI Spend Audit
            </span>
          </Link>
          <Link href="/audit" className="btn-primary text-sm px-4 py-2">
            Run Your Own Audit
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Public badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white/[0.03] border border-white/8 px-3 py-1.5 rounded-full">
            📊 Shared Audit Report · {new Date(audit.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Savings Hero */}
        <section className="mb-8">
          <SavingsHero result={result} />
        </section>

        {/* AI Summary */}
        {audit.summary && (
          <section className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Bot size={16} className="text-indigo-400" />
              <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Audit Summary
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{audit.summary}</p>
          </section>
        )}

        {/* Recommendations */}
        {result.recommendations.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Recommendations ({result.recommendations.length})
            </h2>
            <div className="flex flex-col gap-3">
              {result.recommendations.map((rec, i) => (
                <RecommendationCard key={`${rec.toolId}-${i}`} rec={rec} rank={i + 1} />
              ))}
            </div>
          </section>
        )}

        {/* Spend summary */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
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

        {/* CTA */}
        <div
          className="rounded-3xl p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(124,58,237,0.1) 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
        >
          <h3 className="text-xl font-bold text-white mb-2">Audit your own AI stack</h3>
          <p className="text-slate-400 text-sm mb-6">
            See where your team is overspending. Takes 60 seconds, completely free.
          </p>
          <Link href="/audit" className="btn-primary px-8 py-3.5">
            Start Free Audit
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
