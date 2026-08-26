import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Creates a subscription Checkout Session for the Gallery Membership
// page (/q/join, public/membership.html). Called via fetch() from that
// static page's startCheckout(), which POSTs { tier, priceId } as JSON
// and expects { url } back — see Membership Join Page/HANDOFF.md.
//
// The client's priceId is never trusted directly: `tier` is validated
// against this server-side map (sourced from env vars) and that price
// is what's actually used, same "never trust the client" pattern as
// /api/storefront-checkout.
export const runtime = 'nodejs';

const PRICES: Record<string, string | undefined> = {
  mycelium: process.env.PRICE_MYCELIUM,
  deuterium: process.env.PRICE_DEUTERIUM,
  regolith: process.env.PRICE_REGOLITH,
};

// Railway's internal proxy means req.url / req.nextUrl.origin resolve
// to the container's internal address, not the public domain — same
// issue and same fix as /api/storefront-checkout.
const SITE_URL =
  process.env.NODE_ENV === 'production' ? 'https://futureaesthetics.foundation' : null;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('create-checkout-session: STRIPE_SECRET_KEY not configured');
      return NextResponse.json({ error: 'checkout_not_configured' }, { status: 500 });
    }

    const body = await req.json().catch(() => null);
    const tier = String(body?.tier ?? '');
    const priceId = PRICES[tier];
    if (!priceId) {
      return NextResponse.json({ error: 'unknown_tier' }, { status: 400 });
    }

    const origin = SITE_URL ?? req.nextUrl.origin;
    // The Support page's per-tier buttons start checkout directly; a
    // cancel there should land back on the Support panel, not on
    // /q/join. Whitelisted value, never a raw client URL.
    const fromSupport = body?.from === 'support';
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      metadata: { tier },
      // Also seeded onto the resulting Subscription object (not just
      // this Session) — customer.subscription.* webhook events only
      // give us the Subscription, so it needs its own copy of `tier`
      // to know which membership level it is.
      subscription_data: { metadata: { tier } },
      success_url: `${origin}/q/join/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: fromSupport ? `${origin}/support#events` : `${origin}/q/join?canceled=1`,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'checkout_failed' }, { status: 500 });
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('create-checkout-session error:', err);
    return NextResponse.json({ error: 'checkout_failed' }, { status: 500 });
  }
}
