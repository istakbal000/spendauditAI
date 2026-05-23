'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    q: 'Is this really free?',
    a: 'Yes, completely. The audit is free, results are free, and sharing your report is free. We capture leads from users who want a consultation — that\'s our business model.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No account, no password, no credit card. You see your full audit results before we ever ask for your email. We believe in value-first.',
  },
  {
    q: 'How accurate are the recommendations?',
    a: 'Our audit engine uses publicly available pricing data and deterministic rules — not AI guesswork. Each recommendation includes a confidence score and a clear one-line reason. High-confidence recommendations are based on hard pricing facts.',
  },
  {
    q: 'Which AI tools do you support?',
    a: 'Currently: Cursor, GitHub Copilot, Claude (Anthropic), ChatGPT (OpenAI), OpenAI API, Anthropic API, Gemini (Google), and Windsurf. More tools are being added regularly.',
  },
  {
    q: 'How is my data handled?',
    a: 'Your audit data is stored with a UUID and marked public so you can share it. We never ask for API keys, payment details, or access to your accounts. Public audit links redact any personal information.',
  },
  {
    q: 'What is the AI summary feature?',
    a: 'After your audit runs, Gemini AI writes a personalized 80–120 word summary of your findings. This is purely a narrative layer — all the actual calculations are deterministic and transparent.',
  },
  {
    q: 'Can I share my audit report?',
    a: 'Every audit generates a unique URL (e.g., /audit/abc-123). Share it with your team, your CFO, or your board. Personal information is hidden from the public view.',
  },
  {
    q: 'What if I\'m already spending efficiently?',
    a: 'Great! We\'ll tell you that clearly. Not every stack has waste — if you\'re right-sized, we\'ll confirm it and explain why.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={open}
      >
        <span className="font-medium text-white pr-4">{q}</span>
        <ChevronDown
          size={18}
          className={cn('text-slate-400 flex-shrink-0 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          open ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <p className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently asked questions
          </h2>
          <p className="text-slate-400">
            Everything you need to know before running your audit.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
