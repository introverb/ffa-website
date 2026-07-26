'use client';

import { useState } from 'react';
import { HoneypotField } from './HoneypotField';
import { trackEvent } from '@/lib/analytics';

// Footer "subscribe to our mailing list" form — email only, posts to
// /api/subscribe which adds the contact to the FFA Mailing List
// segment in Resend. Styled for the dark footer panel (white/70
// border, white text), unlike the site's other forms which all sit on
// light panels.
export function SubscribeForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/subscribe', { method: 'POST', body: data });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error || 'Something went wrong.');
        setSubmitting(false);
        return;
      }
      setSent(true);
      setSubmitting(false);
      trackEvent('subscribe:footer-mailing-list');
    } catch {
      setError('Network error.');
      setSubmitting(false);
    }
  }

  if (sent) {
    return <p className="text-sm text-white/70">Thanks — you&rsquo;re on the list.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <HoneypotField />
      <p className="text-xs uppercase tracking-[0.12em] text-white/50">Mailing list</p>
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full min-w-0 rounded border border-white/25 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40"
        />
        <button
          type="submit"
          disabled={submitting}
          className="shrink-0 rounded border border-white/40 px-4 py-2 text-sm uppercase tracking-[0.08em] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? '…' : 'Subscribe'}
        </button>
      </div>
      {error && <p className="text-xs text-red-300">{error}</p>}
    </form>
  );
}
