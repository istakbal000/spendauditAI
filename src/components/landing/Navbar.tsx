'use client';

import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between glass-card rounded-2xl px-5 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm hidden sm:block">AI Spend Audit</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        {/* CTA */}
        <Link
          href="/audit"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-sm font-semibold rounded-lg hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all duration-200"
        >
          Start Audit
          <ArrowRight size={14} />
        </Link>
      </div>
    </header>
  );
}
