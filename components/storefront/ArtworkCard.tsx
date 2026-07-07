import Image from 'next/image';
import { type Artwork, displayPrice, isSoldOut, statusLabel } from '@/lib/storefront';

// Neutral gray image slot for the storefront grid — deliberately plain
// (not the site's warm editorial Placeholder gradient) so it reads as
// "photo pending" rather than a styled illustration. Swaps to the real
// photo automatically the moment `artwork.image` is set; nothing else
// about the card has to change when real photography arrives.
function ArtworkImage({ artwork }: { artwork: Artwork }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ink/10">
      {artwork.image ? (
        <Image
          src={artwork.image}
          alt={`${artwork.title}, by ${artwork.artistName}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center font-sans text-xs uppercase tracking-[0.14em] text-muted">
          Image coming soon
        </div>
      )}
    </div>
  );
}

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const label = statusLabel(artwork);
  const soldOut = isSoldOut(artwork);
  const price = displayPrice(artwork);
  // A price flagged as an estimate isn't final yet, so it isn't
  // purchasable — same reasoning as "Price TBD" holding the button.
  const showBuy = !soldOut && artwork.status !== 'reserved' && price != null && !artwork.priceIsEstimate;

  return (
    <div className={`relative ${soldOut || artwork.status === 'reserved' ? 'opacity-60' : ''}`}>
      <div className="relative">
        <ArtworkImage artwork={artwork} />
        {label && (
          <span className="absolute left-3 top-3 rounded-full bg-dark px-3 py-1 text-xs uppercase tracking-[0.1em] text-white">
            {label}
          </span>
        )}
        {artwork.isNFT && (
          <span className="absolute right-3 top-3 rounded-full border border-ink/20 bg-paper/90 px-4 py-1.5 text-sm font-medium uppercase tracking-[0.1em] text-ink">
            NFT
          </span>
        )}
      </div>

      <h3 className="mt-5 text-h6 leading-tight text-ink md:text-h5">{artwork.title}</h3>
      <p className="mt-1.5 text-sm uppercase tracking-[0.08em] text-sage">{artwork.artistName}</p>
      {artwork.medium && <p className="mt-1 text-sm text-muted">{artwork.medium}</p>}
      {artwork.note && <p className="mt-2 text-sm italic text-muted">{artwork.note}</p>}

      <div className="mt-4 flex items-center justify-between gap-4">
        {/* Sold pieces keep their price on the page — red-dot gallery
            convention; the number is part of the record. Only a piece
            with no price yet AND nothing sold shows "Price TBD". */}
        {price != null ? (
          <div>
            <p className="text-h6 text-ink">
              {artwork.priceIsEstimate && '~'}${price.toLocaleString('en-US')}
            </p>
            {artwork.priceIsEstimate && (
              <p className="mt-0.5 text-xs text-muted">Estimate, not final</p>
            )}
          </div>
        ) : soldOut ? (
          <span />
        ) : (
          <p className="text-h6 text-muted">Price TBD</p>
        )}

        {label ? (
          <span className="inline-flex items-center justify-center rounded-md border border-ink/20 px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-muted">
            {label}
          </span>
        ) : showBuy ? (
          // Plain form POST to a server-side Checkout Session creator,
          // same "boring HTML form" pattern as the rest of the site's
          // endpoints — works without any client JS.
          <form action="/api/storefront-checkout" method="POST">
            <input type="hidden" name="artworkId" value={artwork.id} />
            <button type="submit" className="btn-solid">
              Buy
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
