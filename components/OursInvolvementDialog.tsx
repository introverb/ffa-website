'use client';

import { useState } from 'react';
import { FormDialog } from './FormDialog';
import { HoneypotField } from './HoneypotField';

// "Other ways to take part" CTA + modal — inline pop-up form for
// visitors interested in speaking, funding, or otherwise contributing
// to OURS who don't fit the two structured slots (guestlist, artwork).
// Lives over the discovery image at the right of the OURS engagement
// section. Submits to /api/ours?modal=1 with type=involvement; the
// route returns JSON instead of redirecting so the modal can flip
// to a thanks state in place.
export function OursInvolvementDialog() {
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
    data.set('type', 'involvement');
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
        className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center justify-center whitespace-nowrap rounded-full border border-white/40 bg-white/15 px-7 py-3 text-sm uppercase tracking-[0.12em] text-white backdrop-blur-md transition hover:bg-white/30"
      >
        Other ways to take part
      </button>

      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Other ways to take part."
      >
        {sent ? (
          <div className="rounded-xl border border-sage/40 bg-sage-light/30 p-6">
            <p className="eyebrow text-sage">Received</p>
            <p className="mt-3 text-body leading-snug text-ink">
              Thanks &mdash; we&rsquo;ve got your note and will reach back about
              how to fold you in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <HoneypotField />
            <p className="text-body leading-relaxed text-ink/75">
              The guestlist and the exhibition aren&rsquo;t the only ways in. If
              you&rsquo;re interested in speaking, sponsoring, or contributing
              some other way, tell us a bit and we&rsquo;ll be in touch.
            </p>
            <Field id="inv-name" name="name" label="Your name" required />
            <Field id="inv-email" name="email" type="email" label="Email" required />
            <TextareaField
              id="inv-how"
              name="how"
              label="How would you like to be involved?"
              required
            />
            <TextareaField
              id="inv-anything"
              name="anything_else"
              label="Anything else (optional)"
              rows={3}
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
              {submitting ? 'Sending…' : 'Send'}
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
