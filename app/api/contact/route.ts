import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { isSpam } from '@/lib/spam';

// Contact form endpoint. Reuses the Possibilia env vars; the subject prefix
// "Contact form" differentiates these from submissions and research pitches
// in your inbox.
//
// Required env vars (same as /api/possibilia-submission):
//   RESEND_API_KEY
//   POSSIBILIA_FROM_EMAIL
//   POSSIBILIA_TO_EMAIL

export const runtime = 'nodejs';

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

    // Drop spam silently — return the same success-shaped response a
    // real submission gets, so the bot thinks it landed. See lib/spam.ts.
    if (isSpam(formData)) {
      return new NextResponse(null, {
        status: 303,
        headers: { Location: '/contact?sent=1' },
      });
    }

    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const role = String(formData.get('role') ?? '').trim();
    const topic = String(formData.get('topic') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();

    if (!name || !email || !topic || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const text = `New contact message

Name: ${name}
Email: ${email}
Role: ${role || '(not provided)'}
Topic: ${topic}

Message:
${message}`;

    const html = `<h2 style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;">New contact message</h2>
<table cellpadding="6" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;border-collapse:collapse;">
  <tr><td><strong>Name:</strong></td><td>${escapeHtml(name)}</td></tr>
  <tr><td><strong>Email:</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
  <tr><td><strong>Role:</strong></td><td>${role ? escapeHtml(role) : '<em>(not provided)</em>'}</td></tr>
  <tr><td><strong>Topic:</strong></td><td>${escapeHtml(topic)}</td></tr>
</table>
<h3 style="font-family:Helvetica,Arial,sans-serif;">Message</h3>
<p style="font-family:Helvetica,Arial,sans-serif;white-space:pre-wrap;">${escapeHtml(message)}</p>`;

    const { error } = await resend.emails.send({
      from:
        process.env.POSSIBILIA_FROM_EMAIL ||
        'FFA Contact <onboarding@resend.dev>',
      to: process.env.POSSIBILIA_TO_EMAIL || 'ollipayne182@gmail.com',
      replyTo: email,
      subject: `Contact form - ${topic} from ${name}`,
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

    // Relative Location avoids the proxy-host issue on Railway, where req.url
    // resolves to the internal container URL rather than the public domain.
    return new NextResponse(null, {
      status: 303,
      headers: { Location: '/contact?sent=1' },
    });
  } catch (err) {
    console.error('Contact form error:', err);
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
