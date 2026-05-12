import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { isSpam } from '@/lib/spam';

// OURS engagement endpoint. Single route that handles inbound interest
// from the OURS event page, discriminated by a `type` form field:
//   - guestlist     (full-page form on /ours)
//   - artwork       (full-page form on /ours)
//   - involvement   (modal pop-up on /ours discovery image — speaking,
//                    funding, other contributions)
//   - sponsorship   (modal pop-up on /support#partner OURS sponsor card)
//   - speaker       (legacy form, no longer in the UI; route preserved
//                    in case the form returns)
//
// Reuses the Possibilia env vars; the subject line differentiates each
// flow in the inbox.
//
// `?modal=1` query param tells the handler to return a JSON response on
// success/failure instead of a 303 redirect — the modal-mode forms
// submit via fetch() and want to flip to a thanks state in place
// rather than navigate away.
//
// Required env vars (same as the other form endpoints):
//   RESEND_API_KEY
//   POSSIBILIA_FROM_EMAIL
//   POSSIBILIA_TO_EMAIL

export const runtime = 'nodejs';

type EngagementType =
  | 'guestlist'
  | 'artwork'
  | 'speaker'
  | 'involvement'
  | 'sponsorship';

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
    const type = String(formData.get('type') ?? '') as EngagementType;
    const isModal = req.nextUrl.searchParams.get('modal') === '1';

    if (
      !['guestlist', 'artwork', 'speaker', 'involvement', 'sponsorship'].includes(
        type,
      )
    ) {
      return NextResponse.json({ error: 'Invalid engagement type' }, { status: 400 });
    }

    // Drop spam silently — return the same success-shaped response a
    // real submission gets so the bot thinks it landed. Modal flows
    // get the JSON ack; native form posts get the redirect. See
    // lib/spam.ts.
    if (isSpam(formData)) {
      if (isModal) {
        return NextResponse.json({ ok: true });
      }
      return new NextResponse(null, {
        status: 303,
        headers: { Location: `/ours?sent=${type}#engage` },
      });
    }

    const composed = compose(type, formData);
    if ('error' in composed) {
      return NextResponse.json({ error: composed.error }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from:
        process.env.POSSIBILIA_FROM_EMAIL ||
        'FFA OURS <onboarding@resend.dev>',
      to: process.env.POSSIBILIA_TO_EMAIL || 'ollipayne182@gmail.com',
      replyTo: composed.replyTo,
      subject: composed.subject,
      text: composed.text,
      html: composed.html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 },
      );
    }

    // Modal-mode submissions (fetch from a pop-up form) get a JSON
    // ack so the dialog can flip to its thanks state in place. Native
    // form submissions (guestlist + artwork on /ours) get the redirect
    // they expect. Relative Location avoids the Railway proxy-host issue.
    if (isModal) {
      return NextResponse.json({ ok: true });
    }
    return new NextResponse(null, {
      status: 303,
      headers: { Location: `/ours?sent=${type}#engage` },
    });
  } catch (err) {
    console.error('OURS engagement error:', err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

type Composed = {
  subject: string;
  text: string;
  html: string;
  replyTo: string;
};

function compose(
  type: EngagementType,
  data: FormData,
): Composed | { error: string } {
  if (type === 'guestlist') {
    const name = field(data, 'name');
    const email = field(data, 'email');
    const city = field(data, 'city');
    const why = field(data, 'why');
    if (!name || !email || !why) {
      return { error: 'Name, email, and what draws you are required.' };
    }
    return {
      subject: `OURS guestlist - ${name}`,
      replyTo: email,
      text: `OURS guestlist signup

Name: ${name}
Email: ${email}
City: ${city || '(not provided)'}

Why interested:
${why}`,
      html: `<h2 style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;">OURS guestlist signup</h2>
<table cellpadding="6" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;border-collapse:collapse;">
  <tr><td><strong>Name:</strong></td><td>${escapeHtml(name)}</td></tr>
  <tr><td><strong>Email:</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
  <tr><td><strong>City:</strong></td><td>${city ? escapeHtml(city) : '<em>(not provided)</em>'}</td></tr>
</table>
<h3 style="font-family:Helvetica,Arial,sans-serif;">Why interested</h3>
<p style="font-family:Helvetica,Arial,sans-serif;white-space:pre-wrap;">${escapeHtml(why)}</p>`,
    };
  }

  if (type === 'artwork') {
    const name = field(data, 'name');
    const email = field(data, 'email');
    const portfolio = field(data, 'portfolio');
    const pitch = field(data, 'pitch');
    if (!name || !email || !portfolio || !pitch) {
      return { error: 'Name, email, portfolio link, and pitch are required.' };
    }
    return {
      subject: `OURS artwork submission - ${name}`,
      replyTo: email,
      text: `OURS artwork submission

Name: ${name}
Email: ${email}
Portfolio: ${portfolio}

Pitch:
${pitch}`,
      html: `<h2 style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;">OURS artwork submission</h2>
<table cellpadding="6" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;border-collapse:collapse;">
  <tr><td><strong>Name:</strong></td><td>${escapeHtml(name)}</td></tr>
  <tr><td><strong>Email:</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
  <tr><td><strong>Portfolio:</strong></td><td><a href="${escapeHtml(portfolio)}">${escapeHtml(portfolio)}</a></td></tr>
</table>
<h3 style="font-family:Helvetica,Arial,sans-serif;">Pitch</h3>
<p style="font-family:Helvetica,Arial,sans-serif;white-space:pre-wrap;">${escapeHtml(pitch)}</p>`,
    };
  }

  if (type === 'involvement') {
    const name = field(data, 'name');
    const email = field(data, 'email');
    const how = field(data, 'how');
    const anythingElse = field(data, 'anything_else');
    if (!name || !email || !how) {
      return { error: 'Name, email, and how you’d like to be involved are required.' };
    }
    return {
      subject: `OURS involvement - ${name}`,
      replyTo: email,
      text: `OURS involvement inquiry

Name: ${name}
Email: ${email}

How they'd like to be involved:
${how}

Anything else:
${anythingElse || '(none)'}`,
      html: `<h2 style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;">OURS involvement inquiry</h2>
<table cellpadding="6" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;border-collapse:collapse;">
  <tr><td><strong>Name:</strong></td><td>${escapeHtml(name)}</td></tr>
  <tr><td><strong>Email:</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
</table>
<h3 style="font-family:Helvetica,Arial,sans-serif;">How they&rsquo;d like to be involved</h3>
<p style="font-family:Helvetica,Arial,sans-serif;white-space:pre-wrap;">${escapeHtml(how)}</p>
${anythingElse ? `<h3 style="font-family:Helvetica,Arial,sans-serif;">Anything else</h3><p style="font-family:Helvetica,Arial,sans-serif;white-space:pre-wrap;">${escapeHtml(anythingElse)}</p>` : ''}`,
    };
  }

  if (type === 'sponsorship') {
    const name = field(data, 'name');
    const email = field(data, 'email');
    const organization = field(data, 'organization');
    const level = field(data, 'level');
    const pitch = field(data, 'pitch');
    if (!name || !email || !organization || !pitch) {
      return { error: 'Name, email, organization, and pitch are required.' };
    }
    return {
      subject: `OURS sponsorship interest - ${organization} (${name})`,
      replyTo: email,
      text: `OURS sponsorship inquiry

Name: ${name}
Email: ${email}
Organization: ${organization}
Level: ${level || '(not provided)'}

Pitch:
${pitch}`,
      html: `<h2 style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;">OURS sponsorship inquiry</h2>
<table cellpadding="6" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;border-collapse:collapse;">
  <tr><td><strong>Name:</strong></td><td>${escapeHtml(name)}</td></tr>
  <tr><td><strong>Email:</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
  <tr><td><strong>Organization:</strong></td><td>${escapeHtml(organization)}</td></tr>
  <tr><td><strong>Level:</strong></td><td>${level ? escapeHtml(level) : '<em>(not provided)</em>'}</td></tr>
</table>
<h3 style="font-family:Helvetica,Arial,sans-serif;">Pitch</h3>
<p style="font-family:Helvetica,Arial,sans-serif;white-space:pre-wrap;">${escapeHtml(pitch)}</p>`,
    };
  }

  // speaker recommendation
  const yourName = field(data, 'your_name');
  const yourEmail = field(data, 'your_email');
  const speakerName = field(data, 'speaker_name');
  const speakerContact = field(data, 'speaker_contact');
  const why = field(data, 'why');
  if (!yourName || !yourEmail || !speakerName || !why) {
    return { error: 'Your name, your email, the speaker, and why are required.' };
  }
  return {
    subject: `OURS speaker rec - ${speakerName} (via ${yourName})`,
    replyTo: yourEmail,
    text: `OURS speaker recommendation

From: ${yourName} <${yourEmail}>
Recommending: ${speakerName}
How to reach them: ${speakerContact || '(not provided)'}

Why this person:
${why}`,
    html: `<h2 style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;">OURS speaker recommendation</h2>
<table cellpadding="6" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;border-collapse:collapse;">
  <tr><td><strong>From:</strong></td><td>${escapeHtml(yourName)} &lt;<a href="mailto:${escapeHtml(yourEmail)}">${escapeHtml(yourEmail)}</a>&gt;</td></tr>
  <tr><td><strong>Recommending:</strong></td><td>${escapeHtml(speakerName)}</td></tr>
  <tr><td><strong>Contact:</strong></td><td>${speakerContact ? escapeHtml(speakerContact) : '<em>(not provided)</em>'}</td></tr>
</table>
<h3 style="font-family:Helvetica,Arial,sans-serif;">Why this person</h3>
<p style="font-family:Helvetica,Arial,sans-serif;white-space:pre-wrap;">${escapeHtml(why)}</p>`,
  };
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
