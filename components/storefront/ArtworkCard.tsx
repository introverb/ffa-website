import Image from 'next/image';
import { type Artwork, displayPrice } from '@/lib/storefront';

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

const STATUS_LABEL: Record<Exclude<ArtworkStatusForBadge, 'available'>, string> = {
  sold: 'Sold',
  reserved: 'Reserved',
};

type ArtworkStatusForBadge = Artwork['status'];

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const unavailable = artwork.status !== 'available';
  return (
    <div className={`relative ${unavailable ? 'opacity-60' : ''}`}>
      <div className="relative">
        <ArtworkImage artwork={artwork} />
        {unavailable && (
          <span className="absolute left-3 top-3 rounded-full bg-dark px-3 py-1 text-xs uppercase tracking-[0.1em] text-white">
            {STATUS_LABEL[artwork.status as Exclude<ArtworkStatusForBadge, 'available'>]}
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
      <p className="mt-1 text-sm text-muted">
        {artwork.medium}
        {artwork.editionSize && ` · Edition of ${artwork.editionSize}`}
      </p>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-h6 text-ink">${displayPrice(artwork).toLocaleString('en-US')}</p>
        {unavailable ? (
          <span className="inline-flex items-center justify-center rounded-md border border-ink/20 px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-muted">
            {STATUS_LABEL[artwork.status as Exclude<ArtworkStatusForBadge, 'available'>]}
          </span>
        ) : (
          // Not yet wired to checkout — the Stripe integration step
          // turns this into a real Buy flow. Kept full-strength (not
          // visually disabled) so the true weight of the CTA can be
          // reviewed now rather than re-reviewed once it's live.
          <button type="button" className="btn-solid">
            Buy
          </button>
        )}
      </div>
    </div>
  );
}
