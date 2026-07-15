'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Fragment } from 'react';
import { FormDialog } from '@/components/FormDialog';
import { EthPieceCheckout } from './EthPieceCheckout';
import { WaitlistDialog } from './WaitlistDialog';

// Normalized shape for anything shown in the Ledgerworks section —
// covers FFA/Stripe-checkout pieces, ETH-only pieces (real Artwork
// entries either way), and externally-fulfilled ones (Recycle Group,
// Nahuel Aquiles) so the grid + modal only have to handle one type.
// Built by the server component in app/ours/collect/page.tsx from
// lib/storefront.ts Artworks and the page's own LEDGERWORKS_WORKS list.
export type LedgerworksPiece = {
  id: string;
  title: string;
  artistName: string;
  medium?: string;
  note?: string;
  description?: string;
  details?: Array<{ label: string; value: string }>;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
} & (
  | {
      kind: 'checkout';
      artworkId: string;
      price: number | null;
      priceIsEstimate?: boolean;
      label: 'Sold out' | 'Sold' | 'Reserved' | null;
      showBuy: boolean;
    }
  | {
      kind: 'eth';
      artworkId: string;
      ethAmount: string;
      label: 'Sold out' | 'Sold' | 'Reserved' | null;
    }
  | {
      kind: 'external';
      href: string;
      cta: string;
    }
);

// Same image-slot treatment as ArtworkCard's — intrinsic sizing for a
// real photo, neutral gray placeholder when one isn't in yet.
function PieceImage({
  piece,
  sizes,
}: {
  piece: LedgerworksPiece;
  sizes: string;
}) {
  if (piece.image && piece.imageWidth && piece.imageHeight) {
    return (
      <Image
        src={piece.image}
        alt={`${piece.title}, by ${piece.artistName}`}
        width={piece.imageWidth}
        height={piece.imageHeight}
        sizes={sizes}
        className="h-auto w-full rounded-xl"
      />
    );
  }
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ink/10">
      <div className="absolute inset-0 grid place-items-center font-sans text-xs uppercase tracking-[0.14em] text-muted">
        Image coming soon
      </div>
    </div>
  );
}

function CardPriceOrStatus({ piece }: { piece: LedgerworksPiece }) {
  if (piece.kind === 'external') return null;
  if (piece.label) {
    return <p className="text-h6 text-muted">{piece.label}</p>;
  }
  if (piece.kind === 'eth') {
    return <p className="text-h6 text-ink">{piece.ethAmount} ETH</p>;
  }
  if (piece.price != null) {
    return (
      <p className="text-h6 text-ink">
        {piece.priceIsEstimate && '~'}${piece.price.toLocaleString('en-US')}
      </p>
    );
  }
  return <p className="text-h6 text-muted">Price TBD</p>;
}

// Handles the two simple single-element CTAs (external link, Stripe
// checkout form) plus their shared sold/reserved pill. ETH pieces are
// structurally different — price line + address/QR/form, or price +
// sold pill — so LedgerworksModal renders those inline instead.
function ModalCta({ piece }: { piece: LedgerworksPiece }) {
  if (piece.kind === 'eth') return null;
  if (piece.kind === 'external') {
    return (
      <a
        href={piece.href}
        target="_blank"
        rel="noopener noreferrer"
        data-goatcounter-click={`ledgerworks:buy-external:${piece.id}`}
        className="btn-solid"
      >
        {piece.cta}
      </a>
    );
  }
  if (piece.label === 'Reserved') {
    return <WaitlistDialog artworkId={piece.artworkId} pieceTitle={piece.title} collectWallet />;
  }
  if (piece.label) {
    return (
      <span className="inline-flex items-center justify-center rounded-md border border-ink/20 px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-muted">
        {piece.label}
      </span>
    );
  }
  if (piece.showBuy) {
    return (
      <form action="/api/storefront-checkout" method="POST">
        <input type="hidden" name="artworkId" value={piece.artworkId} />
        <button type="submit" className="btn-solid">
          Buy
        </button>
      </form>
    );
  }
  return <p className="text-h6 text-muted">Price TBD</p>;
}

function LedgerworksModal({
  piece,
  onClose,
}: {
  piece: LedgerworksPiece;
  onClose: () => void;
}) {
  return (
    <FormDialog open onClose={onClose} title={piece.title}>
      <p className="text-sm uppercase tracking-[0.08em] text-sage">{piece.artistName}</p>
      <div className="mt-4 w-40">
        <PieceImage piece={piece} sizes="160px" />
      </div>
      {piece.medium && <p className="mt-5 text-sm text-muted">{piece.medium}</p>}
      <p className="mt-3 text-body leading-relaxed text-ink/80">
        {piece.description || piece.note}
      </p>
      {piece.details && piece.details.length > 0 && (
        <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
          {piece.details.map((d) => (
            <Fragment key={d.label}>
              <dt className="text-muted">{d.label}</dt>
              <dd className="text-ink">{d.value}</dd>
            </Fragment>
          ))}
        </dl>
      )}
      <div className="mt-6 flex flex-col items-start gap-3 border-t border-rule pt-6">
        {piece.kind === 'checkout' && piece.price != null && (
          <p className="text-h6 text-ink">
            {piece.priceIsEstimate && '~'}${piece.price.toLocaleString('en-US')}
          </p>
        )}
        {piece.kind === 'eth' && (
          <p className="text-h6 text-ink">{piece.ethAmount} ETH</p>
        )}
        {piece.kind === 'eth' && piece.label === 'Reserved' && (
          <WaitlistDialog artworkId={piece.artworkId} pieceTitle={piece.title} collectWallet />
        )}
        {piece.kind === 'eth' && piece.label && piece.label !== 'Reserved' && (
          <span className="inline-flex items-center justify-center rounded-md border border-ink/20 px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-muted">
            {piece.label}
          </span>
        )}
        {piece.kind === 'eth' && !piece.label && (
          <EthPieceCheckout artworkId={piece.artworkId} pieceTitle={piece.title} ethAmount={piece.ethAmount} />
        )}
        <ModalCta piece={piece} />
      </div>
    </FormDialog>
  );
}

// Renders the Ledgerworks grid + owns which piece's detail modal is
// open. Open state is mirrored into a `?piece=<id>` query param via
// router.replace (no extra history entries — closing/opening doesn't
// spam the back button) so a QR code on the exhibition wall can link
// straight to a specific piece's open modal, e.g.
// /ours/collect?piece=recycle-group-forest-of-expired-links.
export function LedgerworksSection({ pieces }: { pieces: LedgerworksPiece[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const openId = searchParams.get('piece');
  const openPiece = pieces.find((p) => p.id === openId) ?? null;

  function open(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('piece', id);
    router.replace(`${pathname}?${params.toString()}#ledgerworks`, { scroll: false });
  }

  function close() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('piece');
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ''}#ledgerworks`, { scroll: false });
  }

  return (
    <>
      <ul className="mt-12 columns-1 gap-x-8 text-body leading-relaxed text-ink/80 sm:columns-2 lg:columns-3">
        {pieces.map((piece) => (
          <li key={piece.id} className="mb-14 break-inside-avoid">
            <button
              type="button"
              onClick={() => open(piece.id)}
              data-goatcounter-click={`ledgerworks:open-piece:${piece.id}`}
              className="block w-full text-left"
            >
              <div className="relative">
                <PieceImage
                  piece={piece}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {piece.kind !== 'external' && piece.label && (
                  <span className="absolute left-3 top-3 rounded-full bg-dark px-3 py-1 text-xs uppercase tracking-[0.1em] text-white">
                    {piece.label}
                  </span>
                )}
                {piece.kind !== 'external' && (
                  <span className="absolute right-3 top-3 rounded-full border border-ink/20 bg-paper/90 px-4 py-1.5 text-sm font-medium uppercase tracking-[0.1em] text-ink">
                    NFT
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-h6 leading-tight text-ink md:text-h5">{piece.title}</h3>
              <p className="mt-1.5 text-sm uppercase tracking-[0.08em] text-sage">
                {piece.artistName}
              </p>
              {piece.medium && <p className="mt-1 text-sm text-muted">{piece.medium}</p>}
              {piece.note && <p className="mt-2 text-sm italic text-muted">{piece.note}</p>}
              <div className="mt-4 flex items-center justify-between gap-3">
                <CardPriceOrStatus piece={piece} />
                <span className="inline-flex items-center justify-center rounded-md border border-ink/20 px-5 py-2 text-xs uppercase tracking-[0.1em] text-ink">
                  {piece.kind === 'external' ? 'View piece' : 'Buy piece'}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {openPiece && <LedgerworksModal piece={openPiece} onClose={close} />}
    </>
  );
}
