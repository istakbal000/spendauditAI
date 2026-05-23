import type { Metadata } from 'next';
import SpendForm from '@/components/form/SpendForm';
import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Audit Your AI Stack — AI Spend Audit',
  description:
    'Input your AI tools and get instant savings recommendations. Free, no login required.',
};

export default function AuditPage() {
  return (
    <main className="mesh-bg min-h-screen px-4 py-12">
      {/* Back link */}
      <div className="max-w-3xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>

      <SpendForm />
    </main>
  );
}
