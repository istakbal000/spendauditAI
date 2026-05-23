import { type NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { sendAuditConfirmationEmail } from '@/lib/resend';
import { z } from 'zod';
import type { AuditRecord } from '@/types';

const SaveAuditSchema = z.object({
  result: z.object({
    input: z.object({
      tools: z.array(z.any()),
      teamSize: z.number(),
      primaryUseCase: z.string(),
    }),
    recommendations: z.array(z.any()),
    currentMonthlySpend: z.number(),
    optimizedMonthlySpend: z.number(),
    monthlySavings: z.number(),
    annualSavings: z.number(),
    savingsPercentage: z.number(),
    isEfficient: z.boolean(),
    generatedAt: z.string(),
  }),
  summary: z.string().optional(),
  lead: z
    .object({
      email: z.string().email(),
      company: z.string().optional(),
      role: z.string().optional(),
      teamSize: z.string().optional(),
      website_url: z.string().optional(), // honeypot
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  let body: z.infer<typeof SaveAuditSchema>;
  try {
    const raw = await request.json();
    body = SaveAuditSchema.parse(raw);
  } catch (err: any) {
    console.error('Zod Validation Error:', err?.errors || err);
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }

  // Honeypot check
  if (body.lead?.website_url) {
    // Silent success to confuse bots
    return NextResponse.json({ id: 'bot-detected', success: true });
  }

  try {
    const db = createServiceClient();
    const { result, summary, lead } = body;

    // Save audit
    const { data: auditData, error: auditError } = await db
      .from('audits')
      .insert({
        tools: result.input.tools,
        team_size: result.input.teamSize,
        use_case: result.input.primaryUseCase,
        current_monthly: result.currentMonthlySpend,
        optimized_monthly: result.optimizedMonthlySpend,
        monthly_savings: result.monthlySavings,
        annual_savings: result.annualSavings,
        recommendations: result.recommendations,
        summary: summary ?? null,
        is_public: true,
      })
      .select('id')
      .single();

    if (auditError) throw auditError;
    const auditId = auditData.id as string;

    // Save lead if provided
    if (lead?.email) {
      const { error: leadError } = await db.from('leads').insert({
        audit_id: auditId,
        email: lead.email,
        company: lead.company ?? null,
        role: lead.role ?? null,
        team_size: lead.teamSize ?? null,
      });
      if (leadError) console.error('[DB] Lead insert failed:', leadError);

      // Send confirmation email (awaited to prevent serverless cancellation)
      await sendAuditConfirmationEmail({
        to: lead.email,
        auditId,
        result: result as any,
        company: lead.company,
      }).catch((e) => console.error('[Email] Failed:', e));
    }

    return NextResponse.json({ id: auditId, success: true });
  } catch (error) {
    console.error('[Audit Save] Error:', error);
    return NextResponse.json({ error: 'Failed to save audit' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  try {
    const db = createServiceClient();
    const { data, error } = await db
      .from('audits')
      .select('*')
      .eq('id', id)
      .eq('is_public', true)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    // Redact personal info from tools (keep aggregate data only)
    const safeData: Partial<AuditRecord> = {
      id: data.id,
      created_at: data.created_at,
      team_size: data.team_size,
      use_case: data.use_case,
      current_monthly: data.current_monthly,
      optimized_monthly: data.optimized_monthly,
      monthly_savings: data.monthly_savings,
      annual_savings: data.annual_savings,
      recommendations: data.recommendations,
      summary: data.summary,
      is_public: data.is_public,
    };

    return NextResponse.json(safeData);
  } catch (error) {
    console.error('[Audit Fetch] Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
