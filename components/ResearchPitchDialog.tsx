'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const MAX_WORDS = 250;

// Inline trigger + native <dialog> popup, portaled to body so the trigger
// can sit inside a <p> on the resources page. Submits to /api/research-pitch.
export function ResearchPitchDialog({ triggerLabel }: { triggerLabel: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pitchWords, setPitchWords] = useState(0);

  useEffect(() => setMounted(true), []);

  function open() {
    setSent(false);
    setError(null);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function resetState() {
    setSent(false);
    setError(null);
    setPitchWords(0);
    formRef.current?.reset();
  }

  function handlePitchChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setPitchWords(e.target.value.trim().split(/\s+/).filter(Boolean).length);
  }

  // Click on backdrop (the dialog itself, not its inner card) closes.
  function handleDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) close();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/research-pitch', {
        method: 'POST',
        body: new FormData(e.currentTarget),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Failed to send');
      setSent(true);
      e.currentTarget.reset();
      setPitchWords(0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const overWord = pitchWords > MAX_WORDS;

  const dialog = (
    <dialog
      ref={dialogRef}
      onClick={handleDialogClick}
      onClose={resetState}
      className="rounded-lg border-0 bg-transparent p-0 backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <div className="max-h-[85vh] w-[calc(100vw-2rem)] max-w-lg overflow-y-auto rounded-lg bg-paper p-8 md:p-10">
        {sent ? (
          <div>
            <p className="eyebrow text-sage">Pitch received</p>
            <h3 className="mt-3 text-h5 leading-snug text-ink md:text-h4">
              Thanks, we got it and will reach back soon.
            </h3>
            <button type="button" onClick={close} className="btn-solid mt-8">
              Close
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Research</p>
                <h3 className="mt-2 text-h4 leading-tight">Pitch a case study</h3>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="-mr-2 -mt-2 text-3xl leading-none text-muted hover:text-ink"
              >
                &times;
              </button>
            </div>

            <DialogField id="name" name="name" label="Name" required />
            <DialogField id="email" name="email" type="email" label="Email" required />
            <DialogField id="subject" name="subject" label="Subject" required />

            <div>
              <label htmlFor="pitch" className="block text-eyebrow text-ink/80">
                Pitch your case study
                <span className="ml-1 text-sage">*</span>
              </label>
              <textarea
                id="pitch"
                name="pitch"
                required
                rows={6}
                onChange={handlePitchChange}
                className="mt-2 w-full rounded border border-rule bg-paper px-3 py-2 text-body"
              />
              <p
                className={`mt-1 text-eyebrow normal-case tracking-normal ${
                  overWord ? 'text-red-600' : 'text-muted'
                }`}
              >
                {pitchWords} / {MAX_WORDS} words{overWord && ' - please trim'}
              </p>
            </div>

            {error && (
              <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={submitting || overWord}
                className="btn-solid disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Sending…' : 'Send pitch'}
              </button>
              <button
                type="button"
                onClick={close}
                className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="underline decoration-from-font underline-offset-4 text-ink hover:text-sage"
      >
        {triggerLabel}
      </button>
      {mounted && createPortal(dialog, document.body)}
    </>
  );
}

function DialogField({
  id,
  name,
  label,
  type = 'text',
  required,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-eyebrow text-ink/80">
        {label}
        {required && <span className="ml-1 text-sage">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded border border-rule bg-paper px-3 py-2 text-body"
      />
    </div>
  );
}
