'use client';

import { useState } from 'react';
import { FormDialog } from './FormDialog';

// "Sponsor the exhibition" CTA + modal — inline pop-up form for
// prospective OURS sponsors. Sits on the Partnerships page next to
// the "Event details" button on the OURS sponsor card. Submits to
// /api/ours?modal=1 with type=sponsorship; route returns JSON so the
// modal can flip in-place to a thanks state.
export function OursSponsorshipDialog() {
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
    data.set('type', 'sponsorship');
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
    } catch {
      setError('Network error. Try again or email us directly.');
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          reset();
          setOpen(true);
        }}
        className="btn-solid"
      >
        Sponsor the exhibition
      </button>

      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Sponsor the OURS exhibition."
      >
        {sent ? (
          <div className="rounded-xl border border-sage/40 bg-sage-light/30 p-6">
            <p className="eyebrow text-sage">Received</p>
            <p className="mt-3 text-body leading-snug text-ink">
              Thanks &mdash; we&rsquo;ve got your note and will follow up with a
              sponsorship brief.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-body leading-relaxed text-ink/75">
              We&rsquo;re opening sponsorship for the inaugural run of OURS.
              Tell us a little about your organization and what you&rsquo;re
              considering, and we&rsquo;ll send a brief.
            </p>
            <Field id="spo-name" name="name" label="Your name" required />
            <Field id="spo-email" name="email" type="email" label="Email" required />
            <Field
              id="spo-org"
              name="organization"
              label="Organization"
              required
            />
            <Field
              id="spo-level"
              name="level"
              label="Level you’re considering (optional)"
            />
            <TextareaField
              id="spo-pitch"
              name="pitch"
              label="What are you hoping to sponsor, and why?"
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
              {submitting ? 'Sending…' : 'Request brief'}
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
