'use client';

import { useState } from 'react';
import { HoneypotField } from '@/components/HoneypotField';
import { trackEvent } from '@/lib/analytics';

// Always-visible inquiry box at the top of the Collect page — not tied
// to any one piece, just a place to ask a question before buying.
// Explicitly not a reservation mechanism: submitting this doesn't hold
// a piece, it just lands in Olli's inbox for him to check after the
// show (see app/api/storefront-inquiry/route.ts).
export function InquireBox() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/storefront-inquiry', { method: 'POST', body: data });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error || 'Something went wrong. Email olli@futureaesthetics.foundation directly.');
        setSubmitting(false);
        return;
      }
      setSent(true);
      setSubmitting(false);
      trackEvent('storefront:inquiry-submit');
    } catch {
      setError('Network error. Email olli@futureaesthetics.foundation directly.');
      setSubmitting(false);
    }
  }

  return (
    <div className="mb-16 rounded-2xl border border-rule bg-paper p-6 md:p-8">
      <p className="text-sm uppercase tracking-[0.08em] text-sage">Inquire</p>
      <h3 className="mt-3 text-h5 leading-tight text-ink">Have a question about a piece?</h3>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        We&rsquo;ll check these after the show — submitting a question doesn&rsquo;t reserve a piece.
      </p>

      {sent ? (
        <div className="mt-5 rounded-xl border border-sage/40 bg-sage-light/30 p-5">
          <p className="eyebrow text-sage">Received</p>
          <p className="mt-2 text-body leading-snug text-ink">
            Thanks — we&rsquo;ll follow up after the show.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4 md:max-w-xl">
          <HoneypotField />
          <div>
            <label htmlFor="inquire-email" className="block text-eyebrow text-ink/70">
              Your email <span className="ml-1 text-sage">*</span>
            </label>
            <input
              id="inquire-email"
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded border border-ink/15 bg-paper px-3 py-2 text-body text-ink"
            />
          </div>
          <div>
            <label htmlFor="inquire-question" className="block text-eyebrow text-ink/70">
              Your question <span className="ml-1 text-sage">*</span>
            </label>
            <textarea
              id="inquire-question"
              name="question"
              required
              rows={3}
              className="mt-2 w-full rounded border border-ink/15 bg-paper px-3 py-2 text-body text-ink"
            />
          </div>
          {error && (
            <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="btn-solid self-start disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Send question'}
          </button>
        </form>
      )}
    </div>
  );
}
