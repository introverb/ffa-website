import { NextRequest, NextResponse } from 'next/server';
import { ARTWORKS } from '@/lib/storefront';
import { isStoreConfigured, releaseReservation } from '@/lib/storefront-store';

// One-click "relist" link sent alongside "mark sold" in the ETH sale
// notification email — for when the buyer can't be confirmed (payment
// never landed on-chain, wallet mismatch, etc.). Releases the
// reservation so the piece goes back to "Available" instead of sitting
// locked for the rest of the 24h TTL. Same token-gated pattern as
// storefront-mark-sold/route.ts.
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

  await releaseReservation(artwork.id);
  return page(`<p>&#10003; Released the hold on <strong>${artwork.title}</strong> — it&rsquo;s available again.</p>`);
}
