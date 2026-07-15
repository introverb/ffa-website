'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { HoneypotField } from '@/components/HoneypotField';
import { trackEvent } from '@/lib/analytics';
import { FFA_ETH_ADDRESS, eip681Uri } from '@/lib/eth';

// Standard "two overlapping squares" copy icon (Lucide-style), same
// mark as EthGiveButton's — inherits stroke from currentColor.
function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ETH-only Ledgerworks checkout — no Stripe, no USD. There's no way
// for the site to actually process an incoming crypto payment (no
// server-side capture like Stripe gives us), so this mirrors
// EthGiveButton's "show the address, trust the buyer to send it"
// pattern: FFA wallet + QR pre-filled to the exact ETH amount, then a
// short form to collect where the NFT should go. Submitting emails
// Olli the details (POST /api/storefront-eth-sale) so he can verify
// the payment landed on-chain and transfer the NFT — there's no
// webhook for ETH like there is for Stripe, so nothing here can
// auto-confirm payment or auto-mark the piece sold.
export function EthPieceCheckout({
  artworkId,
  pieceTitle,
  ethAmount,
}: {
  artworkId: string;
  pieceTitle: string;
  ethAmount: string;
}) {
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(FFA_ETH_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Address is already on screen for manual copy — silent fallback.
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    data.set('artworkId', artworkId);
    data.set('pieceTitle', pieceTitle);
    data.set('ethAmount', ethAmount);
    try {
      const res = await fetch('/api/storefront-eth-sale', { method: 'POST', body: data });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error || 'Something went wrong. Email olli@futureaesthetics.foundation directly.');
        setSubmitting(false);
        return;
      }
      setSent(true);
      setSubmitting(false);
      trackEvent(`storefront:eth-sale-submit:${artworkId}`);
    } catch {
      setError('Network error. Email olli@futureaesthetics.foundation directly.');
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <div className="rounded-xl border-[3px] border-ink/20 bg-cream p-4">
        <p className="text-eyebrow text-muted">FFA wallet address</p>
        <div className="mt-2 flex items-start gap-3">
          <p className="flex-1 break-all font-mono text-sm text-ink">{FFA_ETH_ADDRESS}</p>
          <button
            type="button"
            onClick={copyAddress}
            aria-label={copied ? 'Address copied' : 'Copy address'}
            title={copied ? 'Copied' : 'Copy'}
            className="shrink-0 rounded-md p-1.5 text-ink/60 transition-colors hover:bg-ink/10 hover:text-ink"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="rounded-lg bg-white p-3">
          <QRCodeSVG value={eip681Uri(FFA_ETH_ADDRESS, ethAmount)} size={140} level="M" />
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink/75">
        Send exactly <strong className="text-ink">{ethAmount} ETH</strong> to the address above, then tell us
        where to send the piece.
      </p>

      {sent ? (
        <div className="mt-4 rounded-xl border border-sage/40 bg-sage-light/30 p-6">
          <p className="eyebrow text-sage">Received</p>
          <p className="mt-3 text-body leading-snug text-ink">
            Thanks — once we&rsquo;ve confirmed the payment on-chain, we&rsquo;ll transfer the piece to the
            wallet you gave us.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <HoneypotField />
          <div>
            <label htmlFor={`eth-wallet-${artworkId}`} className="block text-eyebrow text-ink/70">
              Your wallet address <span className="ml-1 text-sage">*</span>
            </label>
            <input
              id={`eth-wallet-${artworkId}`}
              name="buyerWallet"
              type="text"
              required
              placeholder="0x..."
              className="mt-2 w-full rounded border border-ink/15 bg-paper px-3 py-2 font-mono text-sm text-ink"
            />
          </div>
          <div>
            <label htmlFor={`eth-email-${artworkId}`} className="block text-eyebrow text-ink/70">
              Your email <span className="ml-1 text-sage">*</span>
            </label>
            <input
              id={`eth-email-${artworkId}`}
              name="buyerEmail"
              type="email"
              required
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
            {submitting ? 'Sending…' : "I've sent it — notify FFA"}
          </button>
        </form>
      )}
    </div>
  );
}
