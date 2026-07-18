import Image from 'next/image';
import { type Artwork, displayPrice, isSoldOut, statusLabel } from '@/lib/storefront';
import { WaitlistDialog } from './WaitlistDialog';

// Image slot for the storefront grid — sized to the photo's own aspect
// ratio (intrinsic width/height, no crop) rather than a uniform box, so
// a tall portrait and a wide landscape both show the full work. Swaps
// in automatically once `artwork.image` + its real dimensions are set;
// nothing else about the card has to change when real photography
// arrives. Without a photo yet, falls back to a neutral gray placeholder
// (deliberately plain, not the site's warm editorial Placeholder
// gradient) at a default ratio, since there's no real image to size to.
function ArtworkImage({ artwork }: { artwork: Artwork }) {
  if (artwork.image && artwork.imageWidth && artwork.imageHeight) {
    return (
      <Image
        src={artwork.image}
        alt={`${artwork.title}, by ${artwork.artistName}`}
        width={artwork.imageWidth}
        height={artwork.imageHeight}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="h-auto w-full rounded-xl"
      />
    );
  }
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-white/10">
      <div className="absolute inset-0 grid place-items-center font-sans text-xs uppercase tracking-[0.14em] text-white/50">
        Image coming soon
      </div>
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

      <h3 className="mt-5 text-h6 leading-tight text-white md:text-h5">{artwork.title}</h3>
      <p className="mt-1.5 text-sm uppercase tracking-[0.08em] text-sage">{artwork.artistName}</p>
      {artwork.medium && <p className="mt-1 text-sm text-white/60">{artwork.medium}</p>}
      {artwork.note && <p className="mt-2 text-sm italic text-white/60">{artwork.note}</p>}

      <div className="mt-4 flex flex-col items-start gap-3">
        {/* Sold pieces keep their price on the page — red-dot gallery
            convention; the number is part of the record. Only a piece
            with no price yet AND nothing sold shows "Price TBD". */}
        {price != null ? (
          <div>
            <p className="text-h6 text-white">
              {artwork.priceIsEstimate && '~'}${price.toLocaleString('en-US')}
            </p>
            {artwork.priceIsEstimate && (
              <p className="mt-0.5 text-xs text-white/60">Estimate, not final</p>
            )}
          </div>
        ) : soldOut ? (
          <span />
        ) : (
          <p className="text-h6 text-white/60">Price TBD</p>
        )}

        {label === 'Reserved' ? (
          <WaitlistDialog artworkId={artwork.id} pieceTitle={artwork.title} />
        ) : label ? (
          <span className="inline-flex items-center justify-center rounded-md border border-white/20 px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-white/60">
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
