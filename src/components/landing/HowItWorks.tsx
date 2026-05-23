'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Add Your AI Tools',
    description:
      'Select the AI tools your team uses — Cursor, ChatGPT, Claude, Copilot, and more. Enter your current plan, number of seats, and monthly spend.',
    callout: '~60 seconds to complete',
  },
  {
    num: '02',
    title: 'Get Your Audit Report',
    description:
      'Our rule-based engine analyzes your stack for overspending, redundancies, and plan mismatches. No AI black-box — every recommendation has a clear reason.',
    callout: 'Instant, transparent results',
  },
  {
    num: '03',
    title: 'Implement & Save',
    description:
      'Review your personalized recommendations ranked by savings amount. Share the report with your team, or book a free consultation for high-savings opportunities.',
    callout: 'Average $2,400 saved/year',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 relative overflow-hidden">
      {/* Subtle divider gradient */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 40% at 50% 50%, rgba(99,102,241,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Audit your stack in{' '}
            <span className="gradient-text">3 simple steps</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            No spreadsheets, no consultants, no signup. Just answers.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-10 left-0 right-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(99,102,241,0.3) 20%, rgba(99,102,241,0.3) 80%, transparent)',
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center lg:items-start text-center lg:text-left">
                {/* Arrow between steps */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute top-8 -right-4 z-10 items-center justify-center">
                    <ArrowRight size={16} className="text-indigo-500/50" />
                  </div>
                )}

                {/* Step number */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <span className="text-2xl font-black gradient-text">{step.num}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="glass-card rounded-2xl p-6 w-full flex-1">
                  <h3 className="text-white font-bold text-lg mb-3">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full">
                    ✓ {step.callout}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link href="/audit" className="btn-primary px-10 py-4 text-base">
            Start Your Free Audit
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
