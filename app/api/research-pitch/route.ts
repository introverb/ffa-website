import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

// Research pitch endpoint - short popup form on /resources for the
// "TBD: Researchers Wanted" entry. Reuses the Possibilia env vars; the
// subject line differentiates pitches from submissions in your inbox.
//
// Required env vars (same as /api/possibilia-submission):
//   RESEND_API_KEY
//   POSSIBILIA_FROM_EMAIL
//   POSSIBILIA_TO_EMAIL

export const runtime = 'nodejs';

const MAX_WORDS = 250;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY not configured' },
        { status: 500 },
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const formData = await req.formData();

    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const subject = String(formData.get('subject') ?? '').trim();
    const pitch = String(formData.get('pitch') ?? '').trim();

    if (!name || !email || !subject || !pitch) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const wordCount = pitch.split(/\s+/).filter(Boolean).length;
    if (wordCount > MAX_WORDS) {
      return NextResponse.json(
        { error: `Pitch exceeds ${MAX_WORDS} words` },
        { status: 400 },
      );
    }

    const text = `New research pitch

Name: ${name}
Email: ${email}
Subject: ${subject}

Pitch:
${pitch}`;

    const html = `<h2 style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;">New research pitch</h2>
<table cellpadding="6" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;border-collapse:collapse;">
  <tr><td><strong>Name:</strong></td><td>${escapeHtml(name)}</td></tr>
  <tr><td><strong>Email:</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
  <tr><td><strong>Subject:</strong></td><td>${escapeHtml(subject)}</td></tr>
</table>
<h3 style="font-family:Helvetica,Arial,sans-serif;">Pitch</h3>
<p style="font-family:Helvetica,Arial,sans-serif;white-space:pre-wrap;">${escapeHtml(pitch)}</p>`;

    const { error } = await resend.emails.send({
      from:
        process.env.POSSIBILIA_FROM_EMAIL ||
        'FFA Research <onboarding@resend.dev>',
      to: process.env.POSSIBILIA_TO_EMAIL || 'ollipayne182@gmail.com',
      replyTo: email,
      subject: `Research pitch - ${subject} (${name})`,
      text,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Research pitch error:', err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
