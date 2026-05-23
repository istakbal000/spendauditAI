import { type NextRequest, NextResponse } from 'next/server';
import { generateAuditSummary } from '@/lib/gemini';
import { createServiceClient } from '@/lib/supabase';
import type { AuditResult } from '@/types';

// Fallback in-memory rate limit for local development (if service key is missing)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requests per window
const WINDOW_SECONDS = 60; // 1 minute

function checkRateLimitLocal(ip: string): boolean {
  const now = Date.now();

  // Clean up expired entries to prevent memory leaks in long-running processes
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Fallback to local memory limiter if key is not configured or placeholder
  if (
    !serviceKey ||
    serviceKey === 'placeholder-service-role-key' ||
    serviceKey.startsWith('your-service-role')
  ) {
    console.warn('[RateLimit] SUPABASE_SERVICE_ROLE_KEY not configured. Using local rate limiter.');
    return checkRateLimitLocal(ip);
  }

  try {
    const db = createServiceClient();
    const { data: allowed, error } = await db.rpc('check_rate_limit', {
      client_ip: ip,
      max_requests: RATE_LIMIT,
      window_seconds: WINDOW_SECONDS,
    });

    if (error) {
      console.error('[RateLimit] Supabase RPC error:', error);
      return checkRateLimitLocal(ip);
    }

    return !!allowed;
  } catch (err) {
    console.error('[RateLimit] Exception:', err);
    return checkRateLimitLocal(ip);
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting
  let ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip');

  if (!ip) {
    // Use a shared bucket for unknown IPs with stricter limiting
    // This may cause false positives but prevents rate limit bypass
    ip = 'unknown';
  }

  if (!(await checkRateLimit(ip))) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  let result: AuditResult;
  try {
    const body = await request.json();
    result = body as AuditResult;

    if (!result?.input?.tools || !Array.isArray(result.input.tools)) {
      return NextResponse.json({ error: 'Invalid audit data' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { summary, isFallback } = await generateAuditSummary(result);

  return NextResponse.json({ summary, isFallback }, { status: 200 });
}
