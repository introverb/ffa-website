'use client';

import { useState } from 'react';
import { HoneypotField } from './HoneypotField';
import { trackEvent } from '@/lib/analytics';

// "Subscribe to our mailing list" form — email only, posts to
// /api/subscribe which adds the contact to the FFA Mailing List
// segment in Resend. The default 'dark' variant is styled for the
// footer panel; 'light' sits on the site's white/cream panels (the
// Support page's events panel). eventName lets each placement track
// its own conversions.
export function SubscribeForm({
  variant = 'dark',
  eventName = 'subscribe:footer-mailing-list',
  label = 'Mailing list',
}: {
  variant?: 'dark' | 'light';
  eventName?: string;
  label?: string;
}) {
  const dark = variant === 'dark';
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
      trackEvent(eventName);
    } catch {
      setError('Network error.');
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <p className={dark ? 'text-sm text-white/70' : 'text-sm text-ink/70'}>
        Thanks — you&rsquo;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <HoneypotField />
      <p
        className={
          dark
            ? 'text-xs uppercase tracking-[0.12em] text-white/50'
            : 'text-xs uppercase tracking-[0.12em] text-muted'
        }
      >
        {label}
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className={
            dark
              ? 'w-full min-w-0 rounded border border-white/25 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40'
              : 'w-full min-w-0 rounded border border-rule bg-paper px-3 py-3 text-sm text-ink placeholder:text-muted'
          }
        />
        <button
          type="submit"
          disabled={submitting}
          className={
            dark
              ? 'shrink-0 rounded border border-white/40 px-4 py-2 text-sm uppercase tracking-[0.08em] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60'
              : 'shrink-0 rounded bg-sage px-5 py-2 text-sm uppercase tracking-[0.08em] text-white transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:opacity-60'
          }
        >
          {submitting ? '…' : 'Subscribe'}
        </button>
      </div>
      {error && <p className={dark ? 'text-xs text-red-300' : 'text-xs text-red-600'}>{error}</p>}
    </form>
  );
}
