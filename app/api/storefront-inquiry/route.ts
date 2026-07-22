import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { isSpam } from '@/lib/spam';

// General "ask a question about a piece" inbox for the storefront —
// not tied to a specific artwork, just a free-text question + a reply
// email. Explicitly does NOT reserve or hold anything; Olli checks
// these after the show, same as every other form on the site (a
// notification email is the durable record, no separate database).
//
// Uses the full isSpam() check (honeypot + scam-content filter) rather
// than honeypot-only — unlike the ETH/wallet flows, there's no
// legitimate reason a piece inquiry would contain crypto-transfer
// language, so the stricter filter is safe here.
//
// Required env vars (same as the other form endpoints):
//   RESEND_API_KEY
//   POSSIBILIA_FROM_EMAIL
//   POSSIBILIA_TO_EMAIL

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 });
    }

    const formData = await req.formData();

    if (isSpam(formData)) {
      return NextResponse.json({ ok: true });
    }

    const email = field(formData, 'email');
    const question = field(formData, 'question');

    if (!email || !question) {
      return NextResponse.json({ error: 'Email and question are required.' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.POSSIBILIA_FROM_EMAIL || 'FFA OURS <onboarding@resend.dev>',
      to: process.env.POSSIBILIA_TO_EMAIL || 'olli@futureaesthetics.foundation',
      replyTo: email,
      subject: 'Collect page — piece inquiry',
      text: `Piece inquiry from the Collect page

Email: ${email}

Question:
${question}`,
      html: `<h2 style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;">Piece inquiry from the Collect page</h2>
<table cellpadding="6" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;border-collapse:collapse;">
  <tr><td><strong>Email:</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
</table>
<p style="font-family:Helvetica,Arial,sans-serif;white-space:pre-wrap;">${escapeHtml(question)}</p>`,
    });

    if (error) {
      console.error('Storefront inquiry: Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Storefront inquiry error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

function field(data: FormData, key: string): string {
  return String(data.get(key) ?? '').trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
