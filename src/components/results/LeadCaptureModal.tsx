'use client';

import { useState } from 'react';
import { X, Loader2, Check, Mail, Building2, Briefcase, Users } from 'lucide-react';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import type { AuditResult } from '@/types';

const LeadSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  company: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.string().optional(),
});

interface LeadCaptureModalProps {
  result: AuditResult;
  summary: string;
  onSuccess: (auditId: string) => void;
  onClose: () => void;
}

const ROLES = ['Founder / CEO', 'CTO / VP Engineering', 'Engineering Manager', 'Developer', 'Finance / CFO', 'Other'];
const TEAM_SIZES = ['1–5', '6–15', '16–50', '51–200', '200+'];

export default function LeadCaptureModal({ result, summary, onSuccess, onClose }: LeadCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [honeypot, setHoneypot] = useState(''); // spam trap
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const validation = LeadSchema.safeParse({ email, company, role, teamSize });
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          result,
          summary,
          lead: { email, company, role, teamSize, website_url: honeypot },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.id) throw new Error(data.error || 'Failed to save');

      setDone(true);
      setTimeout(() => onSuccess(data.id), 1500);
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass-card rounded-3xl p-7 border border-indigo-500/20 shadow-2xl shadow-black/40">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {done ? (
          /* Success state */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Report saved!</h3>
            <p className="text-slate-400 text-sm">
              Check your email for your audit summary. Redirecting to your shareable link…
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-1.5">
                Get your full report
              </h3>
              <p className="text-slate-400 text-sm">
                Enter your email to save your results and get a shareable link. We&apos;ll also send you a summary.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot - hidden from real users */}
              <input
                type="text"
                name="website_url"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                aria-hidden
                autoComplete="off"
                style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
              />

              {/* Email */}
              <div>
                <label htmlFor="lead-email" className="block text-xs font-medium text-slate-400 mb-1.5">
                  Work Email *
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-3.5 text-slate-500" />
                  <input
                    id="lead-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className={cn(
                      'w-full bg-white/5 border text-white text-sm rounded-xl px-4 py-3 pl-9 focus:outline-none focus:ring-1 focus:ring-indigo-500/25 placeholder:text-slate-600',
                      errors.email ? 'border-red-500/50' : 'border-white/10 focus:border-indigo-500/50'
                    )}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              {/* Company */}
              <div>
                <label htmlFor="lead-company" className="block text-xs font-medium text-slate-400 mb-1.5">
                  Company
                </label>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3 top-3.5 text-slate-500" />
                  <input
                    id="lead-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Inc."
                    className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 pl-9 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label htmlFor="lead-role" className="block text-xs font-medium text-slate-400 mb-1.5">
                  Your Role
                </label>
                <div className="relative">
                  <Briefcase size={14} className="absolute left-3 top-3.5 text-slate-500 pointer-events-none" />
                  <select
                    id="lead-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 pl-9 pr-8 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 cursor-pointer"
                  >
                    <option value="" className="bg-slate-900">Select role…</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r} className="bg-slate-900">{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Team Size */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  <Users size={11} className="inline mr-1" />
                  Team Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {TEAM_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setTeamSize(size)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                        teamSize === size
                          ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                          : 'bg-white/[0.03] border-white/8 text-slate-400 hover:border-white/15'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {errors.submit && (
                <p className="text-xs text-red-400 p-3 bg-red-500/10 rounded-xl">{errors.submit}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'w-full btn-primary py-3.5',
                  loading && 'opacity-70 cursor-not-allowed'
                )}
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Saving…</>
                ) : (
                  'Save & Get Shareable Link'
                )}
              </button>

              <p className="text-center text-xs text-slate-600">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
