import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

// Door check-in kiosk (/ours/checkin). Adds the guest as a Resend
// contact tagged into the OURS Attendees segment — a real, exportable
// list rather than a stream of one-off notification emails, since this
// runs live at the door and could see a steady run of submissions.
// Same segment-based approach as /api/subscribe; see that route's
// comment for why `segments` (not `audienceId`) is the correct field.
//
// No spam/honeypot check — see the comment on OursCheckInKiosk for why.
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
