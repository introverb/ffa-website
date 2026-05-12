import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { isSpam } from '@/lib/spam';

// Possibilia submissions endpoint.
// Reads the multipart form, sends an email via Resend with the form details
// and any uploaded files attached, then redirects back with ?sent=1.
//
// Required env vars (set these on your host / .env.local):
//   RESEND_API_KEY          - from https://resend.com (Settings → API Keys)
//   POSSIBILIA_FROM_EMAIL   - sender address; must be on a domain verified in Resend.
//                             For testing without domain verification you can use
//                             "onboarding@resend.dev".
//   POSSIBILIA_TO_EMAIL     - destination inbox (e.g. submissions@futureaesthetics.foundation
//                             or your personal email).

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
    // real submission gets. See lib/spam.ts.
    if (isSpam(formData)) {
      return new NextResponse(null, {
        status: 303,
        headers: { Location: '/possibilia-submissions?sent=1' },
      });
    }

    const type = String(formData.get('type') ?? '');
    const name = String(formData.get('name') ?? '');
    const email = String(formData.get('email') ?? '');
    const description = String(formData.get('description') ?? '');
    const link1 = String(formData.get('link1') ?? '');
    const link2 = String(formData.get('link2') ?? '');
    const link3 = String(formData.get('link3') ?? '');

    if (!type || !name || !email || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const fileEntries = formData.getAll('files');
    const files = fileEntries
      .filter((f): f is File => f instanceof File && f.size > 0)
      .slice(0, 5);

    const attachments = await Promise.all(
      files.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
      })),
    );

    const links = [link1, link2, link3].filter(Boolean);
    const linksText =
      links.length > 0 ? links.map((l) => `- ${l}`).join('\n') : '(none provided)';
    const linksHtml =
      links.length > 0
        ? `<ul>${links
            .map(
              (l) => `<li><a href="${escapeHtml(l)}">${escapeHtml(l)}</a></li>`,
            )
            .join('')}</ul>`
        : '<p>(none provided)</p>';

    const text = `New Possibilia submission

Type: ${type}
Name: ${name}
Email: ${email}

Description:
${description}

Links:
${linksText}

${attachments.length > 0 ? `${attachments.length} file(s) attached.` : 'No files attached.'}`;

    const html = `<h2 style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;">New Possibilia submission</h2>
<table cellpadding="6" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;border-collapse:collapse;">
  <tr><td><strong>Type:</strong></td><td>${escapeHtml(type)}</td></tr>
  <tr><td><strong>Name:</strong></td><td>${escapeHtml(name)}</td></tr>
  <tr><td><strong>Email:</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
</table>
<h3 style="font-family:Helvetica,Arial,sans-serif;">Description</h3>
<p style="font-family:Helvetica,Arial,sans-serif;white-space:pre-wrap;">${escapeHtml(description)}</p>
<h3 style="font-family:Helvetica,Arial,sans-serif;">Links</h3>
${linksHtml}
<p style="font-family:Helvetica,Arial,sans-serif;color:#666;font-style:italic;">${attachments.length > 0 ? `${attachments.length} file(s) attached.` : 'No files attached.'}</p>`;

    const { error } = await resend.emails.send({
      from:
        process.env.POSSIBILIA_FROM_EMAIL ||
        'Possibilia Submissions <onboarding@resend.dev>',
      to: process.env.POSSIBILIA_TO_EMAIL || 'ollipayne182@gmail.com',
      replyTo: email,
      subject: `Possibilia submission - ${type} from ${name}`,
      text,
      html,
      attachments,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 },
      );
    }

    // Redirect back to the form with a success flag.
    // Relative Location avoids the proxy-host issue on Railway, where req.url
    // resolves to the internal container URL (localhost:8080) rather than the
    // public domain.
    return new NextResponse(null, {
      status: 303,
      headers: { Location: '/possibilia-submissions?sent=1' },
    });
  } catch (err) {
    console.error('Submission error:', err);
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
