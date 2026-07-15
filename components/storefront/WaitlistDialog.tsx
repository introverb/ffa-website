'use client';

import { useState } from 'react';
import { FormDialog } from '@/components/FormDialog';
import { HoneypotField } from '@/components/HoneypotField';
import { trackEvent } from '@/lib/analytics';

// "Join the waitlist" trigger + modal for any storefront piece
// currently showing "Reserved" — physical works, Stripe-checkout
// NFTs, and the ETH-only piece all reach this the same way (see
// ArtworkCard.tsx / LedgerworksSection.tsx / EthPieceCheckout.tsx).
// Submitting emails Olli the lead (POST /api/storefront-waitlist);
// there's no automatic notify-next-in-line — he follows up by hand if
// the reservation falls through, same as everything else on this
// storefront.
export function WaitlistDialog({
  artworkId,
  pieceTitle,
  collectWallet = false,
  triggerLabel = 'Join the waitlist',
  triggerClassName = 'inline-flex items-center justify-center rounded-md border border-ink/20 px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-ink transition hover:bg-ink/5',
}: {
  artworkId: string;
  pieceTitle: string;
  /** NFT pieces can optionally collect a wallet up front. */
  collectWallet?: boolean;
  triggerLabel?: string;
  triggerClassName?: string;
}) {
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
    data.set('artworkId', artworkId);
    data.set('pieceTitle', pieceTitle);
    try {
      const res = await fetch('/api/storefront-waitlist', { method: 'POST', body: data });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error || 'Something went wrong. Email olli@futureaesthetics.foundation directly.');
        setSubmitting(false);
        return;
      }
      setSent(true);
      setSubmitting(false);
      trackEvent(`storefront:waitlist-join:${artworkId}`);
    } catch {
      setError('Network error. Email olli@futureaesthetics.foundation directly.');
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
        data-goatcounter-click={`storefront:waitlist-open:${artworkId}`}
        className={triggerClassName}
      >
        {triggerLabel}
      </button>

      <FormDialog open={open} onClose={() => setOpen(false)} title={`Join the waitlist — ${pieceTitle}`}>
        {sent ? (
          <div className="rounded-xl border border-sage/40 bg-sage-light/30 p-6">
            <p className="eyebrow text-sage">Added</p>
            <p className="mt-3 text-body leading-snug text-ink">
              You&rsquo;re on the list — if this piece opens back up, we&rsquo;ll reach out to you first.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <HoneypotField />
            <p className="text-body leading-relaxed text-ink/75">
              This piece is currently reserved for another buyer. Leave your info and we&rsquo;ll reach out
              if it becomes available again.
            </p>
            <Field id={`wl-name-${artworkId}`} name="name" label="Your name" required />
            <Field id={`wl-email-${artworkId}`} name="email" type="email" label="Email" required />
            {collectWallet && (
              <Field
                id={`wl-wallet-${artworkId}`}
                name="wallet"
                label="Wallet address (optional)"
              />
            )}
            {error && (
              <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="btn-solid mt-2 self-start disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Join the waitlist'}
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
