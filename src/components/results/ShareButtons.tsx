'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Twitter } from 'lucide-react';
import { cn, getShareUrl } from '@/lib/utils';

interface ShareButtonsProps {
  auditId?: string;
  monthlySavings: number;
}

export default function ShareButtons({ auditId, monthlySavings }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  if (!auditId) return null;

  const shareUrl = getShareUrl(auditId);

  const shareText = monthlySavings > 0
    ? `Just audited our AI stack and found $${monthlySavings.toFixed(0)}/month in savings! Try it free 👇`
    : `Just audited our AI stack — turns out we're already optimized! Check yours free 👇`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My AI Spend Audit', text: shareText, url: shareUrl });
      } catch { /* user dismissed */ }
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
        Share Your Audit
      </h3>
      <div className="flex flex-wrap gap-2">
        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200',
            copied
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/8 hover:border-white/20'
          )}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>

        {/* Twitter */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border bg-white/5 border-white/10 text-slate-300 hover:bg-sky-500/10 hover:border-sky-500/25 hover:text-sky-400 transition-all duration-200"
        >
          <Twitter size={15} />
          Share on X
        </a>

        {/* Native Share (mobile) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border bg-white/5 border-white/10 text-slate-300 hover:bg-indigo-500/10 hover:border-indigo-500/25 hover:text-indigo-400 transition-all duration-200"
          >
            <Share2 size={15} />
            Share
          </button>
        )}
      </div>

      {/* Share URL display */}
      <div className="mt-3 flex items-center gap-2 p-3 bg-black/20 rounded-xl">
        <span className="text-xs text-slate-500 truncate flex-1 font-mono">{shareUrl}</span>
        <button onClick={handleCopy} className="flex-shrink-0 text-xs text-indigo-400 hover:text-indigo-300">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
