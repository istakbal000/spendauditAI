'use client';

import Link from 'next/link';
import { ArrowRight, Zap, TrendingDown, Shield } from 'lucide-react';

const STAT_ITEMS = [
  { value: '$2,400', label: 'avg. annual savings found' },
  { value: '60s', label: 'to complete your audit' },
  { value: '8', label: 'AI tools analyzed' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden mesh-bg">
      {/* Background orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Badge */}
      <div className="animate-fade-in-up mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 tracking-wide uppercase">
          <Zap size={12} className="text-indigo-400" />
          Free AI Spend Audit · No account required
        </span>
      </div>

      {/* Headline */}
      <h1 className="animate-fade-in-up animate-delay-100 text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight max-w-4xl">
        Stop Overpaying
        <br />
        <span className="gradient-text">for AI Tools</span>
      </h1>

      {/* Subheadline */}
      <p className="animate-fade-in-up animate-delay-200 mt-6 text-center text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
        Your startup is burning cash on overlapping AI subscriptions.
        Audit your stack in{' '}
        <span className="text-indigo-300 font-semibold">60 seconds</span>{' '}
        and find exactly where you&apos;re wasting money — no signup required.
      </p>

      {/* CTA */}
      <div className="animate-fade-in-up animate-delay-300 mt-10 flex flex-col sm:flex-row gap-3 items-center">
        <Link href="/audit" className="btn-primary text-base px-8 py-4">
          Audit My AI Stack
          <ArrowRight size={18} />
        </Link>
        <a
          href="#how-it-works"
          className="btn-secondary text-base px-8 py-4"
        >
          See how it works
        </a>
      </div>

      {/* Stats bar */}
      <div className="animate-fade-in-up animate-delay-400 mt-16 w-full max-w-2xl">
        <div className="glass-card rounded-2xl p-6 grid grid-cols-3 gap-4 divide-x divide-white/5">
          {STAT_ITEMS.map((s) => (
            <div key={s.label} className="text-center px-4">
              <div className="text-2xl sm:text-3xl font-bold gradient-text-emerald">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust strip */}
      <div className="animate-fade-in-up animate-delay-500 mt-8 flex items-center gap-6 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <Shield size={12} className="text-emerald-500" /> No login required
        </span>
        <span className="flex items-center gap-1.5">
          <TrendingDown size={12} className="text-emerald-500" /> Instant results
        </span>
        <span className="flex items-center gap-1.5">
          <Zap size={12} className="text-emerald-500" /> 100% free
        </span>
      </div>
    </section>
  );
}
