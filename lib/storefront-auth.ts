// Password gate for /ours/collect. A single shared passphrase (not a
// real login) — good enough to keep casual visitors out before launch;
// Stripe handles actual payment security independently.
//
// STOREFRONT_PASSWORD doubles as the takedown switch: unset it in
// Railway after the event and every request fails closed (see
// app/ours/collect/enter/page.tsx), no redeploy needed.
//
// The cookie stores a hash of the password, never the password itself,
// so the passphrase never sits in the browser's cookie jar or dev
// tools. Uses Web Crypto (`crypto.subtle`) rather than Node's `crypto`
// module so the same code runs in both the Edge middleware and the
// Node API route without a runtime-specific import.

export const STOREFRONT_GATE_COOKIE = 'ffa_ours_collect';

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function expectedGateToken(): Promise<string | null> {
  const password = process.env.STOREFRONT_PASSWORD;
  if (!password) return null;
  return sha256Hex(password);
}

export async function verifyStorefrontPassword(candidate: string): Promise<string | null> {
  const password = process.env.STOREFRONT_PASSWORD;
  if (!password || candidate !== password) return null;
  return sha256Hex(password);
}
