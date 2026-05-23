import { Resend } from 'resend';
import type { AuditResult } from '@/types';

import { getBaseUrl } from './utils';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'audit@aispendaudit.com';

export async function sendAuditConfirmationEmail({
  to,
  auditId,
  result,
  company,
}: {
  to: string;
  auditId: string;
  result: AuditResult;
  company?: string;
}) {
  const shareUrl = `${getBaseUrl()}/audit/${auditId}`;
  const isHighSavings = result.monthlySavings > 500;

  const recsList = result.recommendations
    .slice(0, 4)
    .map(
      (r) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${r.toolName}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${r.currentPlanName} → ${r.suggestedPlanName}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#059669;font-weight:600;">-$${r.savingsAmount.toFixed(0)}/mo</td>
        </tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:12px;padding:32px;text-align:center;margin-bottom:32px;">
      <h1 style="color:white;margin:0 0 8px;font-size:24px;font-weight:700;">Your AI Spend Audit</h1>
      <p style="color:rgba(255,255,255,0.8);margin:0;font-size:15px;">
        ${company ? `For ${company}` : 'Your personalized audit results'}
      </p>
    </div>

    <!-- Savings Hero -->
    <div style="background:white;border-radius:12px;padding:28px;margin-bottom:24px;text-align:center;border:1px solid #e5e7eb;">
      ${result.isEfficient
        ? `<p style="font-size:18px;color:#374151;margin:0;">✅ You're already spending efficiently!</p>
           <p style="color:#6b7280;margin:8px 0 0;">Your AI stack is well-optimized.</p>`
        : `<p style="color:#6b7280;margin:0 0 8px;font-size:14px;">POTENTIAL MONTHLY SAVINGS</p>
           <p style="font-size:48px;font-weight:800;color:#059669;margin:0;">$${result.monthlySavings.toFixed(0)}</p>
           <p style="color:#6b7280;margin:8px 0 0;">$${result.annualSavings.toFixed(0)} saved annually · ${result.savingsPercentage}% reduction</p>`
      }
    </div>

    ${recsList ? `
    <!-- Recommendations -->
    <div style="background:white;border-radius:12px;padding:28px;margin-bottom:24px;border:1px solid #e5e7eb;">
      <h2 style="margin:0 0 16px;font-size:18px;color:#111827;">Top Recommendations</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;">Tool</th>
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;">Action</th>
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;">Savings</th>
          </tr>
        </thead>
        <tbody>${recsList}</tbody>
      </table>
    </div>
    ` : ''}

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:24px;">
      <a href="${shareUrl}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">View Full Audit Report →</a>
    </div>

    ${isHighSavings ? `
    <!-- High savings CTA -->
    <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
      <p style="margin:0 0 8px;font-weight:600;color:#92400e;">You're leaving $${result.annualSavings.toFixed(0)}/year on the table</p>
      <p style="margin:0 0 12px;color:#78350f;font-size:14px;">Book a free 30-minute AI spend consultation to implement these savings.</p>
      <a href="#" style="display:inline-block;background:#f59e0b;color:white;text-decoration:none;padding:10px 24px;border-radius:6px;font-weight:600;font-size:14px;">Book Free Consultation</a>
    </div>
    ` : ''}

    <!-- Footer -->
    <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">
      AI Spend Audit · Helping startups optimize their AI investments<br>
      <a href="${shareUrl}" style="color:#6b7280;">View your shareable audit →</a>
    </p>
  </div>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: result.isEfficient
        ? '✅ Your AI Spend Audit — You\'re Optimized!'
        : `💰 Your AI Spend Audit — Save $${result.monthlySavings.toFixed(0)}/month`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('[Resend] Email send failed:', error);
    return { success: false, error };
  }
}
