'use client';

import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-12 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(124,58,237,0.15) 100%)',
              border: '1px solid rgba(99,102,241,0.25)',
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 70%)',
              }}
            />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mb-6">
                <Zap size={11} /> Free · No account needed
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to stop overpaying?
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Join hundreds of startups who found savings they didn&apos;t know existed.
                Your audit takes 60 seconds.
              </p>
              <Link href="/audit" className="btn-primary px-10 py-4 text-base">
                Start Free Audit
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">AI Spend Audit</span>
          </div>

          <nav className="flex gap-6 text-xs text-slate-500">
            <Link href="/audit" className="hover:text-slate-300 transition-colors">
              Start Audit
            </Link>
            <a href="#features" className="hover:text-slate-300 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-slate-300 transition-colors">
              How it Works
            </a>
            <a href="#faq" className="hover:text-slate-300 transition-colors">
              FAQ
            </a>
          </nav>

          <p className="text-xs text-slate-600">
            © {year} AI Spend Audit. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
