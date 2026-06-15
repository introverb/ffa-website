'use client';

import { useState } from 'react';
import { FormDialog } from './FormDialog';
import { HoneypotField } from './HoneypotField';
import { trackEvent } from '@/lib/analytics';

// "Submit artwork" CTA + modal for the OURS engagement section. The
// trigger is a plain btn-solid the parent card places; clicking it
// opens the FormDialog with the artwork submission form (name, email,
// portfolio, pitch). Submits to /api/ours?modal=1 with type=artwork —
// the route returns JSON instead of redirecting so the modal flips to
// a thanks state in place. Mirrors OursInvolvementDialog. Replaces the
// old in-page artwork form so the engagement cards can stay compact.
export function OursArtworkDialog() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setSubmitting(false);
    setSent(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    data.set('type', 'artwork');
    try {
      const res = await fetch('/api/ours?modal=1', {
        method: 'POST',
        body: data,
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error || 'Submission failed. Try again or email us directly.');
        setSubmitting(false);
        return;
      }
      setSent(true);
      setSubmitting(false);
      trackEvent('submit:ours-artwork');
    } catch {
      setError('Network error. Try again or email us directly.');
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        data-goatcounter-click="ours:open-artwork-modal"
        onClick={() => {
          reset();
          setOpen(true);
        }}
        className="btn-solid"
      >
        Submit artwork
      </button>

      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Submit artwork for the exhibition."
      >
        {sent ? (
          <div className="rounded-xl border border-sage/40 bg-sage-light/30 p-6">
            <p className="eyebrow text-sage">Received</p>
            <p className="mt-3 text-body leading-snug text-ink">
              Thanks, we&rsquo;ve got your submission and will reach back as we
              curate.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <HoneypotField />
            <p className="text-body leading-relaxed text-ink/75">
              We&rsquo;re still accepting works. Mediums open. Send a portfolio
              and a short pitch and we&rsquo;ll review.{' '}
              <a
                href="/ours/artist-brief"
                target="_blank"
                rel="noopener noreferrer"
                data-goatcounter-click="ours:read-artist-brief"
                className="underline decoration-from-font underline-offset-4 text-ink hover:text-sage"
              >
                Read the brief.
              </a>
            </p>
            <Field id="a-name" name="name" label="Your name" required />
            <Field id="a-email" name="email" type="email" label="Email" required />
            <Field
              id="a-portfolio"
              name="portfolio"
              type="url"
              label="Portfolio link"
              required
            />
            <TextareaField
              id="a-pitch"
              name="pitch"
              label="Pitch: what would you bring?"
              required
            />
            {error && (
              <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="btn-solid mt-4 self-start disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Submit'}
            </button>
          </form>
        )}
      </FormDialog>
    </>
  );
}

function Field({
  id,
  name,
  label,
  type = 'text',
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-eyebrow text-ink/70">
        {label}
        {required && <span className="ml-1 text-sage">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded border border-ink/15 bg-paper px-3 py-2 text-body text-ink"
      />
    </div>
  );
}

function TextareaField({
  id,
  name,
  label,
  rows = 4,
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-eyebrow text-ink/70">
        {label}
        {required && <span className="ml-1 text-sage">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={rows}
        className="mt-2 w-full resize-none rounded border border-ink/15 bg-paper px-3 py-2 text-body text-ink"
      />
    </div>
  );
}
