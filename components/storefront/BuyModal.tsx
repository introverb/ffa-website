'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  type Artwork,
  displayPrice,
  isSoldOut,
  unitsRemaining,
} from '@/lib/storefront';
import { trackEvent } from '@/lib/analytics';

// Purchase modal for a single work — the piece's image beside the
// checkout info, wrapped around the same "boring HTML form" POST to
// /api/storefront-checkout the storefront has always used. The
// reservation lock, Stripe Checkout Session, custom delivery fields,
// and webhook flow are completely untouched; this is presentation only.
//
// Design: the site's panel language (white, rounded-2xl) with a thin
// orange outline carrying the OURS branding through checkout.

const ORANGE = '#E8651A';

export function BuyModal({
  artwork,
  triggerLabel = 'Buy',
  triggerClassName = 'btn-solid',
  triggerStyle,
  returnSection,
  open: controlledOpen,
  onOpenChange,
}: {
  artwork: Artwork;
  triggerLabel?: string;
  triggerClassName?: string;
  triggerStyle?: React.CSSProperties;
  /** Set for purchases started from the OURS page: after payment the
   *  buyer returns to /ours with this section open and a thank-you
   *  modal, instead of the collect success page. */
  returnSection?: 'about' | 'gallery' | 'ledgerworks';
  /** Controlled mode: pass `open` + `onOpenChange` and no trigger is
   *  rendered — the caller owns opening (e.g. the Ledgerworks wall's
   *  collect placards). Omit both for the normal self-triggering mode. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    if (isControlled) onOpenChange?.(false);
    else setInternalOpen(false);
    restoreFocus.current?.focus();
  }, [isControlled, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  const price = displayPrice(artwork);
  // Editions of 100+ are effectively open (the printed program) — a
  // "497 of 500 left" line would read as scarcity theater, so hide it.
  const remaining =
    artwork.editionSize != null && artwork.editionSize >= 100 ? null : unitsRemaining(artwork);
  const buyable =
    !isSoldOut(artwork) &&
    artwork.status === 'available' &&
    price != null &&
    !artwork.priceIsEstimate;

  if (!buyable) return null;

  return (
    <>
      {!isControlled && (
        <button
          type="button"
          onClick={(e) => {
            restoreFocus.current = e.currentTarget;
            setInternalOpen(true);
            trackEvent(`storefront:buy-modal-open:${artwork.id}`);
          }}
          className={triggerClassName}
          style={triggerStyle}
        >
          {triggerLabel}
        </button>
      )}

      {/* Portal to <body>: the gallery placards sit inside a
          backdrop-filtered card, which turns position:fixed into
          position:relative-to-the-card (filters create a containing
          block). Rendering at the body level keeps the overlay a true
          full-viewport modal no matter where the trigger lives. */}
      {open &&
        createPortal(
        <div
          className="fixed inset-0 z-[80] overflow-y-auto"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          {/* backdrop */}
          <div
            aria-hidden
            className="fixed inset-0"
            style={{
              background: 'rgba(40,40,40,0.35)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
            onMouseDown={close}
          />

          <div className="relative flex min-h-full items-center justify-center p-4 md:p-8">
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`Buy ${artwork.title}, by ${artwork.artistName}`}
              tabIndex={-1}
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white outline-none md:grid md:grid-cols-[1.05fr_1fr]"
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                border: `1px solid ${ORANGE}`,
                boxShadow: '0 24px 60px -24px rgba(40,40,40,0.45)',
              }}
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 font-mono text-sm"
                style={{ color: '#282828', boxShadow: `inset 0 0 0 1px ${ORANGE}` }}
              >
                ✕
              </button>

              {/* the piece */}
              <div className="flex items-center justify-center bg-cream p-6 md:p-8" style={{ background: '#F0EEEB' }}>
                {artwork.image && artwork.imageWidth && artwork.imageHeight ? (
                  <Image
                    src={artwork.image}
                    alt={`${artwork.title}, by ${artwork.artistName}`}
                    width={artwork.imageWidth}
                    height={artwork.imageHeight}
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="h-auto w-full rounded-lg object-contain"
                    style={{ maxHeight: '56vh', width: 'auto', maxWidth: '100%' }}
                  />
                ) : (
                  <div className="grid aspect-[4/5] w-full place-items-center rounded-lg bg-ink/10 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                    Image coming soon
                  </div>
                )}
              </div>

              {/* the checkout info */}
              <div className="flex flex-col p-7 md:p-9">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: ORANGE }}>
                  OURS · Collect
                </p>
                <h3 className="mt-3 text-h5 leading-tight text-ink md:text-h4">{artwork.title}</h3>
                <p className="mt-1.5 text-sm uppercase tracking-[0.08em] text-sage">
                  {artwork.artistName}
                </p>
                {artwork.medium && <p className="mt-3 text-sm text-muted">{artwork.medium}</p>}
                {artwork.note && <p className="mt-1.5 text-sm italic text-muted">{artwork.note}</p>}
                {artwork.artistUrl && (
                  <a
                    href={artwork.artistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block font-mono text-[10px] uppercase tracking-[0.12em]"
                    style={{ color: '#E8651A' }}
                  >
                    {artwork.artistName}&rsquo;s site →
                  </a>
                )}

                <p className="mt-5 text-h5 text-ink">${price!.toLocaleString('en-US')}</p>
                {remaining != null && (
                  <p className="mt-0.5 text-xs text-muted">
                    {remaining} of {artwork.fullEditionSize ?? artwork.editionSize} left
                  </p>
                )}

                <hr className="my-5 h-px border-0" style={{ background: 'rgba(200,195,186,0.7)' }} />

                <ul className="space-y-1.5 text-xs leading-relaxed text-muted">
                  {artwork.id === 'ours-printed-program' ? (
                    <li>Mailed to you — shipping included (or pick up in Brooklyn).</li>
                  ) : (
                    <>
                      <li>Pickup in Brooklyn, or delivery — chosen at checkout.</li>
                      {artwork.isNFT && <li>NFT — your wallet address is collected at checkout.</li>}
                    </>
                  )}
                </ul>

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                  {/* Same server-side Checkout Session creator the
                      storefront grid has always posted to. */}
                  <form action="/api/storefront-checkout" method="POST">
                    <input type="hidden" name="artworkId" value={artwork.id} />
                    {returnSection && (
                      <input type="hidden" name="returnSection" value={returnSection} />
                    )}
                    <button type="submit" className="btn-solid">
                      Proceed to checkout →
                    </button>
                  </form>
                  <button
                    type="button"
                    onClick={close}
                    className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
