// Spam / bot protection for the form-driven endpoints (contact,
// Possibilia submissions, OURS engagement, storefront inquiries).
//
// Four layers, all run server-side before any Resend email is sent:
//
//   1. Honeypot — `<HoneypotField />` renders an invisible input named
//      HONEYPOT_FIELD on every form. Humans never see or focus it;
//      autofill-pattern bots fill it eagerly. Any value → drop.
//
//      The field name/id/label are deliberately generic, not
//      "company"/"website"/"name"/etc. — a prior version named it
//      `company_website` with a "Company website" label, and that
//      matched browser/password-manager autofill heuristics closely
//      enough that a real buyer's saved profile data silently filled
//      it, dropping a genuine submission with no error shown.
//
//   2. Proof-of-browser token — `<HoneypotField />` also renders a
//      hidden input named FORM_TOKEN_FIELD that only JavaScript fills
//      (an inline script at parse time, plus a client effect for
//      client-rendered forms). A submission without a valid token is
//      something that never ran the page: a script POSTing scraped
//      HTML. The token carries its issue time, so a submit under
//      MIN_FILL_MS after the page rendered is dropped too — no human
//      types a message that fast. The token is a checksum, not a
//      secret; its job is to require a browser, not to be unforgeable.
//
//   3. Content filter — pattern-match the combined form body against
//      the templates that actually hit the inbox: the crypto "transfer
//      of funds" family, and the multilingual "I wanted to know your
//      price" probe (random-suffix names like "Robertvaw", a spam
//      sentence pasted into the Role field). Any match → drop.
//
//   4. Rate limit — per IP, per endpoint, via the same Upstash Redis
//      the storefront uses (skipped when Redis isn't configured, i.e.
//      local dev). More than RATE_LIMIT submissions in RATE_WINDOW_S →
//      drop. Catches the runs of near-identical messages a single bot
//      sends in a burst.
//
// "Drop" means: return the same success-shaped response the real
// submission would return, so the bot thinks it landed and doesn't
// retry with a different pattern. The submission is just never
// emailed. Each drop is logged with its reason so the filter can be
// tuned from the Railway logs.

import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { FORM_TOKEN_FIELD, makeFormToken } from './form-token';

export { FORM_TOKEN_FIELD, makeFormToken, TOKEN_SCRIPT } from './form-token';

export const HONEYPOT_FIELD = 'hp_field';

// ---------------------------------------------------------------------------
// 1. honeypot
// ---------------------------------------------------------------------------
export function isHoneypotFilled(formData: FormData): boolean {
  const value = formData.get(HONEYPOT_FIELD);
  return typeof value === 'string' && value.trim().length > 0;
}

// ---------------------------------------------------------------------------
// 2. proof-of-browser token
// ---------------------------------------------------------------------------
const MIN_FILL_MS = 2500; // faster than this isn't a person
const MAX_AGE_MS = 48 * 60 * 60 * 1000; // a tab left open for two days is fine

// Token format + the inline filler live in lib/form-token.ts (client-safe).

export function tokenFailure(formData: FormData): string | null {
  const raw = formData.get(FORM_TOKEN_FIELD);
  if (typeof raw !== 'string' || !raw) return 'no-token';
  const [tsStr, sig] = raw.split('.');
  const ts = Number(tsStr);
  if (!Number.isFinite(ts) || !sig) return 'bad-token';
  if (makeFormToken(ts) !== raw) return 'bad-token';
  const age = Date.now() - ts;
  if (age < MIN_FILL_MS) return 'too-fast';
  if (age > MAX_AGE_MS) return 'stale-token';
  return null;
}

// ---------------------------------------------------------------------------
// 3. content filter
// ---------------------------------------------------------------------------
// Patterns matched against the combined string content of every
// user-submitted form field. Calibrated against the templates that have
// actually arrived; add entries as new ones emerge.
const SCAM_PATTERNS: RegExp[] = [
  // --- crypto "transfer of funds" family ---
  /\bgraph\.org\b/i,
  /https?:\/\/\S*[?&]hs=[a-f0-9]{16,}/i,
  /\b(USDC|USDT|BTC|ETH)\b[\s\S]{0,40}\b(transfer|balance|payment|receive|claim|top.?up)\b/i,
  /\b(transfer|balance|payment|receive|claim|top.?up)\b[\s\S]{0,40}\b(USDC|USDT|BTC|ETH)\b/i,
  /\b(transfer|payment)\s+of\s+funds\b/i,
  /\bto\s+your\s+(name|wallet|account|address)\b/i,

  // --- "I wanted to know your price" probe, non-English forms: on an
  //     English-language site these are the bot, full stop ---
  /\b(din|deres)\s+pris\b/i, // Danish / Norwegian
  /\bjeg (ønskede|ville|vil) (gerne )?(at )?(kende|vide)\b/i, // Danish
  /\b(dein|deinen|ihren?)\s+preis\b/i, // German
  /\btu precio\b|\bsu precio\b|\bel precio\b/i, // Spanish
  /\bvotre prix\b|\bton prix\b|\ble prix\b/i, // French
  /\b(il|tuo|vostro)\s+prezzo\b/i, // Italian
  /\b(seu|teu|o)\s+pre[çc]o\b/i, // Portuguese
  /\b(uw|je|jouw)\s+prijs\b/i, // Dutch
  /\b(tw[oó]j[aą]?|wasz[aą]?)\s+cen[aęy]\b/i, // Polish
  /\bваш[аеиу]?\s+цен/i, // Russian
  /\bfiyat(ınızı|ini)?\b/i, // Turkish
  /\bhinta(nne|si)?\b/i, // Finnish
  /\b(ditt|ert)\s+pris\b/i, // Swedish
  /\baloha\b[\s\S]{0,60}\bprices?\b/i,
];

// The same probe in English — a real collector or sponsor can plausibly
// write "I wanted to know the price", so these only count when the
// message is a one-liner (the bot's always is; a person asking about a
// work writes more) or the Role field is also a sentence.
const PRICE_PROBE_EN: RegExp[] = [
  /\b(writing|asking|wanted|want|wish|would like)\s+(about|to know|to ask about)\s+(the|your)\s+prices?\b/i,
  /\b(know|learn)\s+your\s+prices?\b/i,
  /\bprices?\s+(list|please)\b/i,
];
const SHORT_MESSAGE = 90; // chars

// A Role / affiliation answer that reads like a sentence about prices
// is the bot pasting its one line into every box.
const ROLE_SENTENCE = /\b(price|prices|pris|preis|precio|prix|prezzo|preço|prijs|цен)/i;

export function scamReason(formData: FormData): string | null {
  const parts: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key === HONEYPOT_FIELD || key === FORM_TOKEN_FIELD) continue;
    if (typeof value !== 'string') continue;
    parts.push(value);
  }
  const combined = parts.join('\n');
  const hit = SCAM_PATTERNS.findIndex((pattern) => pattern.test(combined));
  if (hit >= 0) return `pattern-${hit}`;

  const role = String(formData.get('role') ?? '');
  const roleIsSentence = role.trim().split(/\s+/).length >= 4 && ROLE_SENTENCE.test(role);
  if (roleIsSentence) return 'role-sentence';

  const message = String(formData.get('message') ?? '');
  if (message.trim().length < SHORT_MESSAGE) {
    const en = PRICE_PROBE_EN.findIndex((pattern) => pattern.test(combined));
    if (en >= 0) return `price-probe-${en}`;
  }
  return null;
}

// Back-compat name, used by nothing new.
export function hasScamContent(formData: FormData): boolean {
  return scamReason(formData) !== null;
}

// ---------------------------------------------------------------------------
// 4. rate limit (Upstash Redis; no-op when unconfigured)
// ---------------------------------------------------------------------------
const RATE_LIMIT = 4; // submissions …
const RATE_WINDOW_S = 60 * 60; // … per IP per endpoint per hour

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

export async function isFlooded(req: NextRequest, scope: string): Promise<boolean> {
  if (!redis) return false;
  try {
    const key = `rl:${scope}:${clientIp(req)}`;
    const n = await redis.incr(key);
    if (n === 1) await redis.expire(key, RATE_WINDOW_S);
    return n > RATE_LIMIT;
  } catch (err) {
    // never let the limiter take a real message down with it
    console.error('[spam] rate limiter error', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// the one call the routes make
// ---------------------------------------------------------------------------
// `scope` names the endpoint for the rate-limit bucket and the log line.
export async function isSpam(
  formData: FormData,
  req?: NextRequest,
  scope = 'form',
): Promise<boolean> {
  let reason: string | null = null;
  if (isHoneypotFilled(formData)) reason = 'honeypot';
  else reason = tokenFailure(formData) ?? scamReason(formData);
  if (!reason && req && (await isFlooded(req, scope))) reason = 'rate-limit';
  if (reason) {
    const name = String(formData.get('name') ?? '').slice(0, 40);
    console.log(`[spam] dropped ${scope} (${reason}) name="${name}"`);
    return true;
  }
  return false;
}
