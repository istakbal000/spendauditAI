'use client';

import { Search, TrendingDown, Share2, Zap, Shield, BarChart3 } from 'lucide-react';

const FEATURES = [
  {
    icon: Search,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
    title: 'Instant Stack Analysis',
    description:
      'Input your AI tools and plans. Our engine instantly maps your spending across 8 major platforms — Cursor, ChatGPT, Claude, Copilot, and more.',
  },
  {
    icon: TrendingDown,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    title: 'Detect Overspending',
    description:
      'We surface real inefficiencies: team plans for solo devs, overlapping tools, redundant subscriptions, and plans you\'ve outgrown (or under-grown).',
  },
  {
    icon: BarChart3,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    title: 'Actionable Recommendations',
    description:
      'Each finding comes with a specific action, dollar savings, and confidence score. Downgrade, consolidate, or switch — you decide what to act on.',
  },
  {
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    title: 'AI-Powered Summary',
    description:
      'Get a personalized 2-minute summary of your biggest savings opportunities, written by Gemini AI and tailored to your team\'s use case.',
  },
  {
    icon: Share2,
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
    title: 'Share with Your Team',
    description:
      'Every audit generates a unique shareable link. Send it to your CFO, engineering lead, or team — no login required to view results.',
  },
  {
    icon: Shield,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    title: 'Privacy First',
    description:
      'We never ask for API keys or account credentials. Public audit URLs redact all personal information. Your data stays yours.',
  },
];

export default function FeatureCards() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything you need to{' '}
            <span className="gradient-text">right-size your AI spend</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Built for engineering teams and startup founders who want clarity
            on their AI tooling costs — without spreadsheets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="glass-card rounded-2xl p-6 group hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex p-3 rounded-xl ${f.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon size={22} className={f.color} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
