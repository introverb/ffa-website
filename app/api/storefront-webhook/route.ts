import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { ARTWORKS } from '@/lib/storefront';
import { incrementUnitsSold, markSold, releaseReservation } from '@/lib/storefront-store';

// Stripe webhook — the one place a sale actually becomes durable.
// `checkout.session.completed` marks the artwork sold (or increments
// its edition count) so the live page reflects it; `checkout.session.
// expired` releases an abandoned 1-of-1's reservation. Register this
// URL (https://<domain>/api/storefront-webhook) in the Stripe
// Dashboard once deployed, subscribed to both event types, and set the
// signing secret it gives you as STRIPE_WEBHOOK_SECRET.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  const rawBody = await req.text();

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET || !signature) {
    console.error('Storefront webhook: Stripe env vars not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Storefront webhook: signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const artworkId = session.metadata?.artworkId;
    const artwork = artworkId ? ARTWORKS.find((a) => a.id === artworkId) : undefined;

    if (artwork) {
      if (artwork.editionSize != null) {
        await incrementUnitsSold(artwork.id);
      } else {
        await markSold(artwork.id);
      }
      // There's no separate sales database — a notification email is
      // the durable record for now, same pattern as every other form
      // on the site (see app/api/ours/route.ts).
      await notifySale(session, artwork).catch((err) =>
        console.error('Storefront webhook: sale notification failed:', err),
      );
    } else {
      console.error('Storefront webhook: completed session with unknown artworkId', artworkId);
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;
    const artworkId = session.metadata?.artworkId;
    if (artworkId) await releaseReservation(artworkId);
  }

  return NextResponse.json({ received: true });
}

async function notifySale(session: Stripe.Checkout.Session, artwork: (typeof ARTWORKS)[number]) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);

  const wallet = session.custom_fields?.find((f) => f.key === 'wallet_address')?.text?.value;
  const amount = session.amount_total != null ? (session.amount_total / 100).toFixed(2) : '?';
  const tax =
    session.total_details?.amount_tax != null
      ? (session.total_details.amount_tax / 100).toFixed(2)
      : '0.00';

  await resend.emails.send({
    from: process.env.POSSIBILIA_FROM_EMAIL || 'FFA OURS <onboarding@resend.dev>',
    to: process.env.POSSIBILIA_TO_EMAIL || 'olli@futureaesthetics.foundation',
    subject: `OURS sale — ${artwork.title} (${artwork.artistName})`,
    text: `Sold: ${artwork.title} by ${artwork.artistName}
Amount: $${amount} (tax: $${tax})
Buyer email: ${session.customer_details?.email ?? '(unknown)'}
${wallet ? `Wallet address: ${wallet}` : ''}
Stripe session: ${session.id}`,
  });
}
