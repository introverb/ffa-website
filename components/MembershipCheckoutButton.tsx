'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

// Per-tier checkout button for the Support page's Gallery Membership
// panel — starts the Stripe subscription Checkout directly (same
// /api/create-checkout-session the /q/join page calls) instead of
// routing through /q/join first. If the session can't be created for
// any reason, fall back to /q/join so the visitor still has a path.
export function MembershipCheckoutButton({ tier, label }: { tier: string; label: string }) {
  const [busy, setBusy] = useState(false);

  async function start() {
    setBusy(true);
    trackEvent(`membership:checkout:${tier}`);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, from: 'support' }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.url) {
        window.location.assign(json.url);
        return;
      }
    } catch {
      // fall through to the membership page
    }
    window.location.href = '/q/join';
  }

  return (
    <button
      type="button"
      onClick={start}
      disabled={busy}
      className="rounded-md bg-sage px-4 py-2.5 text-xs uppercase tracking-[0.1em] text-white transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:opacity-60"
    >
      {busy ? 'Opening checkout…' : label}
    </button>
  );
}
