import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { isHoneypotFilled } from '@/lib/spam';

// Waitlist signups for a "Reserved" storefront piece — physical works,
// Stripe-checkout NFTs, and the ETH-only piece can all show a Reserved
// state (see ArtworkCard.tsx / LedgerworksSection.tsx), and any of
// them can offer this instead of a dead-end pill. Just records
// interest by email so Olli can follow up in order if the reservation
// falls through; no automatic "you're up next" flow — this is a
// small, personal sale process, not a queueing system.
//
// Deliberately skips lib/spam.ts's hasScamContent() check, same
// reasoning as storefront-eth-sale — a wallet field can appear here
// too (NFT pieces), which is exactly what that filter flags. Honeypot
// only.
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

    if (isHoneypotFilled(formData)) {
      return NextResponse.json({ ok: true });
    }

    const artworkId = field(formData, 'artworkId');
    const pieceTitle = field(formData, 'pieceTitle');
    const name = field(formData, 'name');
    const email = field(formData, 'email');
    const wallet = field(formData, 'wallet');

    if (!artworkId || !name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.POSSIBILIA_FROM_EMAIL || 'FFA OURS <onboarding@resend.dev>',
      to: process.env.POSSIBILIA_TO_EMAIL || 'olli@futureaesthetics.foundation',
      replyTo: email,
      subject: `Waitlist — ${pieceTitle || artworkId}`,
      text: `Waitlist signup (piece currently reserved)

Piece: ${pieceTitle || artworkId} (${artworkId})

Name: ${name}
Email: ${email}
${wallet ? `Wallet: ${wallet}` : ''}`,
      html: `<h2 style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;">Waitlist signup (piece currently reserved)</h2>
<table cellpadding="6" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;border-collapse:collapse;">
  <tr><td><strong>Piece:</strong></td><td>${escapeHtml(pieceTitle || artworkId)} (${escapeHtml(artworkId)})</td></tr>
  <tr><td><strong>Name:</strong></td><td>${escapeHtml(name)}</td></tr>
  <tr><td><strong>Email:</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
  ${wallet ? `<tr><td><strong>Wallet:</strong></td><td style="font-family:monospace;">${escapeHtml(wallet)}</td></tr>` : ''}
</table>`,
    });

    if (error) {
      console.error('Storefront waitlist: Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Storefront waitlist error:', err);
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
