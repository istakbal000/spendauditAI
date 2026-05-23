import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

export function getShareUrl(auditId: string): string {
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_APP_URL && typeof window === 'undefined') {
    console.warn('WARNING: NEXT_PUBLIC_APP_URL is not set during SSR in production. Share URLs will default to localhost:3000.');
  }
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'http://localhost:3000');
  return `${base}/audit/${auditId}`;
}

export function getSavingsColor(monthlySavings: number): string {
  if (monthlySavings >= 500) return 'text-emerald-400';
  if (monthlySavings >= 100) return 'text-emerald-300';
  if (monthlySavings > 0) return 'text-yellow-400';
  return 'text-slate-400';
}

export function getConfidenceLabel(confidence: string): string {
  switch (confidence) {
    case 'high': return 'High confidence';
    case 'medium': return 'Medium confidence';
    case 'low': return 'Estimate';
    default: return '';
  }
}

export function getConfidenceColor(confidence: string): string {
  switch (confidence) {
    case 'high': return 'text-emerald-400 bg-emerald-400/10';
    case 'medium': return 'text-yellow-400 bg-yellow-400/10';
    case 'low': return 'text-slate-400 bg-slate-400/10';
    default: return 'text-slate-400 bg-slate-400/10';
  }
}
