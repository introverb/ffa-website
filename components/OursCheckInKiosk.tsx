'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Door check-in kiosk for guests who didn't register on Luma — meant to
// stay open in one browser tab on a physically-controlled iPad all
// night, handed off between guests by the doors volunteer. No nav, no
// footer (see the chromeless-route lists in PageFrame/ConditionalFooter),
// so there's nothing on screen for a guest to tap into but this form.
//
// Deliberately skips HoneypotField: this form is never linked publicly
// (noindex, no nav entry), and lib/spam.ts's own history is a case
// where a honeypot's autofill-shaped input silently ate a real
// submission — a risk this repeatedly-reused shared device would only
// amplify. The honeypot's bot-deterrence isn't worth that trade here.
export function OursCheckInKiosk() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/ours-checkin', { method: 'POST', body: data });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error || 'Something went wrong — try again.');
        setSubmitting(false);
        return;
      }
      setSent(true);
      setSubmitting(false);
    } catch {
      setError('Network error — try again.');
      setSubmitting(false);
    }
  }

  function next() {
    formRef.current?.reset();
    setSent(false);
    setError(null);
  }

  // Auto-advance a few seconds after a successful check-in so the
  // volunteer doesn't have to tap "Next guest" between every single
  // entry — the button's still there for when the line's moving fast.
  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(next, 4000);
    return () => clearTimeout(t);
  }, [sent]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-12">
      <Image
        src="/images/logo.png"
        alt=""
        width={28}
        height={24}
        className="h-7 w-auto opacity-70 brightness-0 invert"
      />
      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/50">OURS · Aug 9, 2026</p>

      <div className="mt-8 w-full max-w-md rounded-3xl bg-paper p-8 text-ink shadow-2xl md:p-10">
        {sent ? (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-light text-3xl text-sage">
              ✓
            </div>
            <h1 className="mt-6 text-h3 leading-tight">You&rsquo;re in.</h1>
            <p className="mt-3 text-body text-muted">Welcome to OURS &mdash; enjoy the show.</p>
            <button type="button" onClick={next} className="btn-solid mt-8 w-full py-5 text-base">
              Next guest &rarr;
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit}>
            <h1 className="text-h3 leading-tight">Welcome to OURS.</h1>
            <p className="mt-2 text-body text-muted">Didn&rsquo;t register on Luma? Check in here.</p>

            <div className="mt-8 flex flex-col gap-4">
              <div>
                <label htmlFor="checkin-name" className="eyebrow">
                  Name
                </label>
                <input
                  id="checkin-name"
                  name="name"
                  type="text"
                  required
                  autoFocus
                  autoComplete="off"
                  placeholder="Your name"
                  className="mt-2 w-full rounded-lg border border-rule bg-white px-4 py-4 text-lg text-ink placeholder:text-muted/50 focus:border-sage focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="checkin-email" className="eyebrow">
                  Email
                </label>
                <input
                  id="checkin-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-lg border border-rule bg-white px-4 py-4 text-lg text-ink placeholder:text-muted/50 focus:border-sage focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-solid mt-8 w-full py-5 text-base disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Checking in…' : 'Check in'}
            </button>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <p className="mt-6 text-xs text-muted">
              By checking in, you&rsquo;ll join FFA&rsquo;s mailing list for updates on future
              events.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
