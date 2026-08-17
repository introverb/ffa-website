// Lightweight spam / bot protection for the form-driven endpoints
// (contact, Possibilia submissions, OURS engagement).
//
// Two layers, both run server-side before any Resend email is sent:
//
//   1. Honeypot — `<HoneypotField />` renders an invisible input named
//      HONEYPOT_FIELD on every form. Humans never see or focus it;
//      autofill-pattern bots fill it eagerly. If this field has any
//      value on submission, drop silently.
//
//      The field name/id/label are deliberately generic, not
//      "company"/"website"/"name"/etc. — a prior version named it
//      `company_website` with a "Company website" label, and that
//      matched browser/password-manager autofill heuristics closely
//      enough that a real buyer's saved profile data silently filled
//      it, dropping a genuine submission with no error shown (caught
//      via a live storefront ETH-sale test that "succeeded" with no
//      reservation and no email).
//
//   2. Content filter — pattern-match the combined form body against a
//      known crypto-scam template that's been hammering the inbox
//      (fake "transfer of funds" / USDC payment framings, links to
//      graph.org, URL hash signatures like `?hs=<hex>`). If any
//      pattern matches, drop silently.
//
// "Drop silently" means: return the same success-shaped response the
// real submission would return, so the bot thinks it succeeded and
// doesn't retry with a different pattern. The submission is just
// never emailed.
//
// This is intentionally a thin layer of defense — for stronger
// protection (Cloudflare Turnstile) see the queue.

export const HONEYPOT_FIELD = 'hp_field';

// Returns true if the honeypot field has any non-empty value.
export function isHoneypotFilled(formData: FormData): boolean {
  const value = formData.get(HONEYPOT_FIELD);
  return typeof value === 'string' && value.trim().length > 0;
}

// Patterns matched against the combined string content of every
// user-submitted form field. Each one is calibrated against the
// crypto-scam template currently flooding the FFA submission inbox;
// add new entries here as new templates emerge.
const SCAM_PATTERNS: RegExp[] = [
  // Known scam-relay domains observed in inbound submissions
  /\bgraph\.org\b/i,
  // Tracking-query URLs the scam template embeds (long hex `hs` token)
  /https?:\/\/\S*[?&]hs=[a-f0-9]{16,}/i,
  // Stablecoin/crypto symbol + financial-event keyword in close range
  /\b(USDC|USDT|BTC|ETH)\b[\s\S]{0,40}\b(transfer|balance|payment|receive|claim|top.?up)\b/i,
  // Inverse order — financial-event keyword + crypto symbol
  /\b(transfer|balance|payment|receive|claim|top.?up)\b[\s\S]{0,40}\b(USDC|USDT|BTC|ETH)\b/i,
  // Common scam framings
  /\b(transfer|payment)\s+of\s+funds\b/i,
  /\bto\s+your\s+(name|wallet|account|address)\b/i,
];

// Returns true if any user-submitted text field matches a scam
// pattern. Skips the honeypot field (checked separately) and any
// File entries (binary content, not relevant).
export function hasScamContent(formData: FormData): boolean {
  const parts: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key === HONEYPOT_FIELD) continue;
    if (typeof value !== 'string') continue;
    parts.push(value);
  }
  const combined = parts.join('\n');
  return SCAM_PATTERNS.some((pattern) => pattern.test(combined));
}

// Convenience: a submission is "spam" if either layer flags it.
export function isSpam(formData: FormData): boolean {
  return isHoneypotFilled(formData) || hasScamContent(formData);
}
