import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { isHoneypotFilled } from '@/lib/spam';
import { isStoreConfigured, reserveArtwork } from '@/lib/storefront-store';

// ETH-only Ledgerworks sale inquiry (currently just The Pope). There's
// no Stripe/webhook here — a buyer sends ETH directly to FFA's wallet
// (shown in the modal) and this route just records where they want
// the NFT sent, by email, so Olli can verify the payment on-chain and
// transfer it manually. Nothing here marks a piece sold; that's a
// manual edit to lib/storefront.ts once the sale is confirmed.
//
// A submission puts the same Redis reservation lock on the piece that
// Stripe 1-of-1 checkouts use (see storefront-checkout/route.ts) —
// this is the real fix for double-selling: the moment someone submits
// this form, nobody else can submit it too (the piece's card/modal
// flips to "Reserved" + a waitlist option). The 24h TTL is long on
// purpose — Olli resolves this manually (verify on-chain, then
// transfer), possibly the next day, not in real time during the show.
//
// The notification email below includes a one-click "mark sold" link
// (storefront-mark-sold/route.ts) — that's the only thing that ever
// flips this to "Sold" on the site, since there's no webhook watching
// the chain for the transfer landing.
//
// Deliberately skips lib/spam.ts's hasScamContent() check — that
// filter flags "ETH" + "transfer"/"wallet" language, which is exactly
// what a legitimate submission here looks like. Honeypot only.
//
// Required env vars (same as the other form endpoints):
//   RESEND_API_KEY
//   POSSIBILIA_FROM_EMAIL
//   POSSIBILIA_TO_EMAIL
//   STOREFRONT_ADMIN_TOKEN (omit the mark-sold link if unset)

export const runtime = 'nodejs';

const RESERVATION_TTL_SECONDS = 24 * 60 * 60;

// Same reasoning as storefront-checkout/route.ts: Railway's internal
// proxy means req.url resolves to the container's internal address, not
// the public domain, so the mark-sold link needs a known-good origin.
const SITE_URL =
  process.env.NODE_ENV === 'production' ? 'https://futureaesthetics.foundation' : null;

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

    // Only enforce the lock when Redis is actually configured — a
    // misconfigured store returns false from reserveArtwork() same as
    // "already reserved," which would wrongly block every submission.
    if (isStoreConfigured()) {
      const reserved = await reserveArtwork(artworkId, RESERVATION_TTL_SECONDS);
      if (!reserved) {
        return NextResponse.json(
          { error: 'reserved', message: 'This piece was just reserved by someone else.' },
          { status: 409 },
        );
      }
    } else {
      console.error('Storefront ETH sale: live-state store not configured (Upstash env vars missing) — skipping reservation lock');
    }

    const markSoldUrl = process.env.STOREFRONT_ADMIN_TOKEN
      ? `${SITE_URL ?? req.nextUrl.origin}/api/storefront-mark-sold?id=${encodeURIComponent(artworkId)}&token=${encodeURIComponent(process.env.STOREFRONT_ADMIN_TOKEN)}`
      : null;

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
${buyerWallet}
${markSoldUrl ? `\nOnce you've confirmed the payment on-chain, mark it sold:\n${markSoldUrl}` : ''}`,
      html: `<h2 style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;">ETH sale inquiry</h2>
<table cellpadding="6" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;border-collapse:collapse;">
  <tr><td><strong>Piece:</strong></td><td>${escapeHtml(pieceTitle || artworkId)} (${escapeHtml(artworkId)})</td></tr>
  <tr><td><strong>Amount:</strong></td><td>${escapeHtml(ethAmount)} ETH</td></tr>
  <tr><td><strong>Buyer email:</strong></td><td><a href="mailto:${escapeHtml(buyerEmail)}">${escapeHtml(buyerEmail)}</a></td></tr>
  <tr><td><strong>Buyer wallet:</strong></td><td style="font-family:monospace;">${escapeHtml(buyerWallet)}</td></tr>
</table>
<p style="font-family:Helvetica,Arial,sans-serif;">Verify the payment landed on-chain before transferring the NFT.</p>
${markSoldUrl ? `<p style="font-family:Helvetica,Arial,sans-serif;"><a href="${markSoldUrl}" style="display:inline-block;background:#111;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Mark sold</a></p>` : ''}`,
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
