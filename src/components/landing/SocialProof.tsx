'use client';

import { Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      "We were paying for ChatGPT Team for 3 people. This audit caught it instantly and we switched to Plus — $75/month saved, zero functionality lost.",
    name: 'Sarah K.',
    role: 'CTO, Early-stage SaaS',
    initials: 'SK',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    quote:
      "Our team had Cursor Business AND GitHub Copilot AND Windsurf. The consolidation recommendation alone saved us $200/month. Wild we didn't notice.",
    name: 'Marcus T.',
    role: 'Engineering Lead, Series A startup',
    initials: 'MT',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    quote:
      "Took 90 seconds. Found $400/month in savings. Shared the report with our CFO in one click. This should exist for every SaaS category.",
    name: 'Priya M.',
    role: 'Head of Product, B2B tool',
    initials: 'PM',
    color: 'from-violet-500 to-pink-600',
  },
];

const TOOL_LOGOS = [
  { name: 'Cursor', label: '⌶' },
  { name: 'ChatGPT', label: '🤖' },
  { name: 'Claude', label: '✦' },
  { name: 'Copilot', label: '◈' },
  { name: 'Gemini', label: '✧' },
  { name: 'Windsurf', label: '🏄' },
];

export default function SocialProof() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Tool compatibility strip */}
        <div className="text-center mb-20">
          <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold mb-8">
            Analyzes your spend across
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {TOOL_LOGOS.map((tool) => (
              <div
                key={tool.name}
                className="glass-card rounded-xl px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:border-indigo-500/30 transition-all duration-200 cursor-default"
              >
                {tool.name}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Startups love their{' '}
            <span className="gradient-text">savings</span>
          </h2>
          <p className="text-slate-400">Real results from real teams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="glass-card rounded-2xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300"
            >
              <Quote size={20} className="text-indigo-400 opacity-60" />
              <p className="text-slate-300 text-sm leading-relaxed flex-1 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-bold text-white`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
