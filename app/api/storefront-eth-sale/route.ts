import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { isHoneypotFilled } from '@/lib/spam';

// ETH-only Ledgerworks sale inquiry (currently just The Pope). There's
// no Stripe/webhook here — a buyer sends ETH directly to FFA's wallet
// (shown in the modal) and this route just records where they want
// the NFT sent, by email, so Olli can verify the payment on-chain and
// transfer it manually. Nothing here marks a piece sold; that's a
// manual edit to lib/storefront.ts once the sale is confirmed.
//
// Deliberately skips lib/spam.ts's hasScamContent() check — that
// filter flags "ETH" + "transfer"/"wallet" language, which is exactly
// what a legitimate submission here looks like. Honeypot only.
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
    const ethAmount = field(formData, 'ethAmount');
    const buyerWallet = field(formData, 'buyerWallet');
    const buyerEmail = field(formData, 'buyerEmail');

    if (!artworkId || !buyerWallet || !buyerEmail) {
      return NextResponse.json(
        { error: 'Wallet address and email are required.' },
        { status: 400 },
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.POSSIBILIA_FROM_EMAIL || 'FFA OURS <onboarding@resend.dev>',
      to: process.env.POSSIBILIA_TO_EMAIL || 'olli@futureaesthetics.foundation',
      replyTo: buyerEmail,
      subject: `ETH sale — ${pieceTitle || artworkId} (${ethAmount} ETH)`,
      text: `ETH sale inquiry

Piece: ${pieceTitle || artworkId} (${artworkId})
Amount: ${ethAmount} ETH

Buyer email: ${buyerEmail}
Buyer wallet (send the NFT here, after verifying payment on-chain):
${buyerWallet}`,
      html: `<h2 style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;">ETH sale inquiry</h2>
<table cellpadding="6" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;border-collapse:collapse;">
  <tr><td><strong>Piece:</strong></td><td>${escapeHtml(pieceTitle || artworkId)} (${escapeHtml(artworkId)})</td></tr>
  <tr><td><strong>Amount:</strong></td><td>${escapeHtml(ethAmount)} ETH</td></tr>
  <tr><td><strong>Buyer email:</strong></td><td><a href="mailto:${escapeHtml(buyerEmail)}">${escapeHtml(buyerEmail)}</a></td></tr>
  <tr><td><strong>Buyer wallet:</strong></td><td style="font-family:monospace;">${escapeHtml(buyerWallet)}</td></tr>
</table>
<p style="font-family:Helvetica,Arial,sans-serif;">Verify the payment landed on-chain before transferring the NFT.</p>`,
    });

    if (error) {
      console.error('Storefront ETH sale: Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Storefront ETH sale error:', err);
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
