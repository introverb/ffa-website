import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ARTWORKS, displayPrice, isSoldOut } from '@/lib/storefront';
import { isStoreConfigured, reserveArtwork } from '@/lib/storefront-store';

// Creates a Stripe Checkout Session for one artwork and redirects to
// it. Plain <form method="POST"> target (see ArtworkCard's Buy button)
// — same pattern as the site's other form endpoints, works without
// client JS.
export const runtime = 'nodejs';

// Stripe requires a Checkout Session's `expires_at` to be at least 30
// minutes out. The reservation lock below uses the same window, so a
// 1-of-1 can't be "unreserved" while its Stripe session is still
// technically payable.
const RESERVATION_TTL_SECONDS = 30 * 60;

// Railway's internal proxy means req.url / req.nextUrl.origin resolve
// to the container's internal address (e.g. localhost:8080), not the
// public domain — confirmed live when a test purchase's Stripe
// redirect landed on localhost. Use the known production URL instead
// (same constant as app/layout.tsx, robots.ts, sitemap.ts); fall back
// to the request's own origin in local dev, where there's no proxy in
// the way and this always resolves correctly anyway.
const SITE_URL =
  process.env.NODE_ENV === 'production' ? 'https://futureaesthetics.foundation' : null;

export async function POST(req: NextRequest) {
  const origin = SITE_URL ?? req.nextUrl.origin;
  const back = () => NextResponse.redirect(new URL('/ours/collect', origin), 303);

  const formData = await req.formData();
  const artworkId = String(formData.get('artworkId') ?? '');
  const artwork = ARTWORKS.find((a) => a.id === artworkId);
  if (!artwork) return back();

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Storefront checkout: STRIPE_SECRET_KEY not configured');
    return back();
  }
  if (!isStoreConfigured()) {
    console.error('Storefront checkout: live-state store not configured (Upstash env vars missing)');
    return back();
  }

  const price = displayPrice(artwork);
  // Shouldn't happen — the Buy button only renders with a real,
  // non-estimate price — but never trust the client.
  if (price == null || artwork.priceIsEstimate) return back();
  if (isSoldOut(artwork) || artwork.status !== 'available') return back();

  // 1-of-1s get a short reservation lock so two buyers can't both
  // start checkout on the same piece at once. Editions (Lupi's 5
  // prints) skip this — the units-sold counter on completion is
  // enough at this scale, and the brief's own emphasis is on
  // preventing double-sales of 1-of-1s specifically. A staffed
  // checkout desk on the night is still the recommended backstop.
  if (artwork.editionSize == null) {
    const reserved = await reserveArtwork(artwork.id, RESERVATION_TTL_SECONDS);
    if (!reserved) return back(); // already reserved or just sold
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${artwork.title} — ${artwork.artistName}`,
            metadata: { artworkId: artwork.id },
            // Stripe Tax needs a tax code per product. General
            // tangible goods for physical art. NFT tax treatment
            // varies by state and is genuinely unsettled in a lot of
            // jurisdictions — worth a quick check with FFA's
            // accountant or Stripe support before go-live rather than
            // trusting this default blindly.
            tax_code: artwork.isNFT ? 'txcd_10103000' : 'txcd_99999999',
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      },
    ],
    automatic_tax: { enabled: true },
    metadata: {
      artworkId: artwork.id,
      artistName: artwork.artistName,
      isNFT: String(!!artwork.isNFT),
    },
    ...(artwork.isNFT
      ? {
          custom_fields: [
            {
              key: 'wallet_address',
              label: { type: 'custom' as const, custom: 'Wallet address (for NFT transfer)' },
              type: 'text' as const,
              optional: false,
            },
          ],
          custom_text: {
            submit: {
              message: "You'll receive written confirmation of this address before transfer.",
            },
          },
        }
      : {}),
    success_url: `${origin}/ours/collect/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/ours/collect`,
    expires_at: Math.floor(Date.now() / 1000) + RESERVATION_TTL_SECONDS,
  });

  if (!session.url) return back();
  return NextResponse.redirect(session.url, 303);
}
