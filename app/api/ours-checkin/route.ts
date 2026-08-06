import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { isHoneypotFilled } from '@/lib/spam';

// Door check-in (/ours/checkin), reached via a QR scan on the guest's
// own phone. Adds the guest as a Resend contact tagged into the OURS
// Attendees segment — a real, exportable list rather than a stream of
// one-off notification emails, since this runs live at the door and
// could see a steady run of submissions. Same segment-based approach
// as /api/subscribe; see that route's comment for why `segments` (not
// `audienceId`) is the correct field.
//
// Honeypot only, same as /api/subscribe — skips hasScamContent()
// since a plain name+email submission has nothing for that filter to
// match against.
//
// Required env vars:
//   RESEND_API_KEY (already configured for the site's other email)
//   RESEND_OURS_ATTENDEES_SEGMENT_ID

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 });
    }
    if (!process.env.RESEND_OURS_ATTENDEES_SEGMENT_ID) {
      return NextResponse.json(
        { error: 'RESEND_OURS_ATTENDEES_SEGMENT_ID not configured' },
        { status: 500 },
      );
    }

    const formData = await req.formData();

    if (isHoneypotFilled(formData)) {
      return NextResponse.json({ ok: true });
    }

    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.contacts.create({
      email,
      firstName: name,
      unsubscribed: false,
      segments: [{ id: process.env.RESEND_OURS_ATTENDEES_SEGMENT_ID }],
    });

    if (error) {
      console.error('OURS check-in: Resend error:', error);
      return NextResponse.json({ error: 'Failed to check in' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('OURS check-in error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
