import { NextRequest, NextResponse } from 'next/server';
import { STOREFRONT_GATE_COOKIE, expectedGateToken } from '@/lib/storefront-auth';

// Gates the OURS storefront (/ours/collect and any subpaths, e.g. the
// future Stripe success/cancel pages) behind a shared password until
// the event. See lib/storefront-auth.ts for how the gate token works
// and app/ours/collect/enter/page.tsx for the entry form.
export const config = {
  matcher: ['/ours/collect/:path*'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The entry form itself (and nothing else) must stay reachable
  // without a valid cookie, or nobody could ever get in.
  if (pathname === '/ours/collect/enter') {
    return NextResponse.next();
  }

  const expected = await expectedGateToken();
  const cookie = req.cookies.get(STOREFRONT_GATE_COOKIE)?.value;

  if (expected && cookie === expected) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = '/ours/collect/enter';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}
