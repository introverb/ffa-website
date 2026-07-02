import { NextRequest, NextResponse } from 'next/server';
import { STOREFRONT_GATE_COOKIE, verifyStorefrontPassword } from '@/lib/storefront-auth';

// POST target for the /ours/collect/enter password form. On a match,
// sets the gate cookie (see lib/storefront-auth.ts) and sends the
// visitor on to wherever they were headed; on a mismatch, bounces back
// to the form with an error flag.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const password = String(formData.get('password') ?? '');
  const requestedNext = String(formData.get('next') ?? '/ours/collect');
  // Guard against an open redirect via a crafted `next` value — only
  // ever send visitors somewhere under the gated path.
  const next = requestedNext.startsWith('/ours/collect') ? requestedNext : '/ours/collect';

  const token = await verifyStorefrontPassword(password);
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/ours/collect/enter';
    url.search = '';
    url.searchParams.set('next', next);
    url.searchParams.set('error', '1');
    return NextResponse.redirect(url, 303);
  }

  const res = NextResponse.redirect(new URL(next, req.url), 303);
  res.cookies.set(STOREFRONT_GATE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/ours/collect',
    maxAge: 60 * 60 * 24 * 60, // 60 days - covers the run-up, the event, and a little after
  });
  return res;
}
