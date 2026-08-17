import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { isHoneypotFilled } from '@/lib/spam';

// Footer "subscribe to our mailing list" form. Adds the email as a
// Resend contact, tagged into the FFA Mailing List segment — Resend's
// current API assigns list membership via `segments` (an array of
// segment IDs), not a separate "audience" field, despite Resend's own
// UI still calling the top-level container an "Audience".
//
// Deliberately skips lib/spam.ts's hasScamContent() check — a plain
// email-only submission has nothing for that filter to match against
// anyway. Honeypot only.
//
// Required env vars:
//   RESEND_API_KEY (already configured for the site's other email)
//   RESEND_MAILING_LIST_SEGMENT_ID

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 });
    }
    if (!process.env.RESEND_MAILING_LIST_SEGMENT_ID) {
      return NextResponse.json(
        { error: 'RESEND_MAILING_LIST_SEGMENT_ID not configured' },
        { status: 500 },
      );
    }

    const formData = await req.formData();

    if (isHoneypotFilled(formData)) {
      return NextResponse.json({ ok: true });
    }

    const email = String(formData.get('email') ?? '').trim();
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.contacts.create({
      email,
      unsubscribed: false,
      segments: [{ id: process.env.RESEND_MAILING_LIST_SEGMENT_ID }],
    });

    if (error) {
      console.error('Subscribe: Resend error:', error);
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
