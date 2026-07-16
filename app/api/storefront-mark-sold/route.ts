import { NextRequest, NextResponse } from 'next/server';
import { ARTWORKS } from '@/lib/storefront';
import { isStoreConfigured, markSold } from '@/lib/storefront-store';

// One-click "mark sold" link sent in the ETH sale notification email
// (storefront-eth-sale/route.ts) — there's no Stripe webhook for that
// flow, since payment happens wallet-to-wallet off-platform, so this is
// the only thing that flips an ETH sale to "Sold" on the site. Gated by
// a shared secret (STOREFRONT_ADMIN_TOKEN) rather than a login, since
// it's a single-admin site and the token only ever appears in an email
// sent to Olli's own inbox.
export const runtime = 'nodejs';

function page(body: string) {
  return new NextResponse(
    `<!doctype html><html><body style="font-family:Helvetica,Arial,sans-serif;padding:60px 24px;text-align:center;font-size:18px;">${body}</body></html>`,
    { headers: { 'content-type': 'text/html' } },
  );
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') ?? '';
  const token = req.nextUrl.searchParams.get('token') ?? '';

  if (!process.env.STOREFRONT_ADMIN_TOKEN || token !== process.env.STOREFRONT_ADMIN_TOKEN) {
    return page('<p>Invalid or expired link.</p>');
  }

  const artwork = ARTWORKS.find((a) => a.id === id);
  if (!artwork) {
    return page('<p>Unknown piece.</p>');
  }

  if (!isStoreConfigured()) {
    return page('<p>Live-state store not configured — nothing was changed.</p>');
  }

  await markSold(artwork.id);
  return page(`<p>&#10003; Marked <strong>${artwork.title}</strong> as sold.</p>`);
}
