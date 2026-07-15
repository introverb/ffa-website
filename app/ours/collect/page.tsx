import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Panel } from '@/components/PageFrame';
import { ArtworkCard } from '@/components/storefront/ArtworkCard';
import {
  LedgerworksSection,
  type LedgerworksPiece,
} from '@/components/storefront/LedgerworksSection';
import { getArtworksForDisplay, displayPrice, isSoldOut, statusLabel } from '@/lib/storefront';

// OURS storefront — unlisted on purpose (see the build brief in
// /storefront). Not linked from SiteNav, the /ours page, or the
// sitemap; reachable only by direct URL. `robots: noindex` keeps it
// out of search results too.
//
// getArtworksForDisplay() merges the static catalog (lib/storefront.ts)
// with live sold/reserved state from Redis (lib/storefront-store.ts),
// which the Stripe webhook updates on each sale — so this render
// always reflects the current inventory without a page rebuild.
export const metadata: Metadata = {
  title: 'Collect',
  robots: { index: false, follow: false },
};

// Reads live Redis state on every request — without this, Next would
// statically render the page once at build time and never check
// Redis again, so sold-out pieces would keep showing as available.
export const dynamic = 'force-dynamic';

// Ledgerworks pieces that collect through an EXTERNAL route rather than
// FFA's own Stripe checkout: Nahuel Aquiles' piece is a personalized,
// variably-priced mint fulfilled entirely on his own platform
// (genpi.org), not a single fixed-price 1-of-1; Recycle Group's is
// gallery-represented, so it sells through Gazelli Art House's own
// listing rather than FFA's checkout — price is settled at $11,000
// (no further negotiation). Every other Ledgerworks piece is a real
// Artwork in lib/storefront.ts (isNFT: true) and sells the same way the
// physical works do — see the comment above the Ledgerworks entries
// there. image/imageWidth/imageHeight follow the same convention as
// lib/storefront.ts's Artwork type — intrinsic sizing, no photo yet =
// gray placeholder (see LedgerworksImage below).
const LEDGERWORKS_WORKS: Array<{
  id: string;
  artist: string;
  title: string;
  note: string;
  description?: string;
  details?: Array<{ label: string; value: string }>;
  href?: string;
  cta?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
}> = [
  {
    id: 'recycle-group-forest-of-expired-links',
    artist: 'Recycle Group',
    title: 'Forest of Expired Links',
    note: 'ERC-721 video, on-chain. Includes the photographic print from the exhibition. Listed at $11,000.',
    href: 'https://gazell.io/collections/recycle-group/products/forest-of-expired-links-1',
    cta: 'Purchase through Gazelli Art House',
  },
  {
    id: 'nahuel-aquiles-dna-fractal-print',
    artist: 'Nahuel Aquiles',
    title: 'DNA-fractal print',
    note: 'Generative fractal from DNA data — create your own biodata print and collect the NFT, $40 / $90. A share of each sale supports FFA.',
    href: 'https://genpi.org',
    cta: 'Collect via genpi.org',
    image: '/images/storefront/nahuel-aquiles-dna-fractal-print.png',
    imageWidth: 1333,
    imageHeight: 2000,
  },
];

export default async function OursCollectPage() {
  const artworks = await getArtworksForDisplay();
  // Ledgerworks pieces sold through FFA's own checkout are real
  // Artwork entries (isNFT: true) — split them out so they render in
  // the Ledgerworks section below rather than the main exhibition grid.
  const physicalArtworks = artworks.filter((a) => !a.isNFT);
  const nftArtworks = artworks.filter((a) => a.isNFT);

  // One normalized list for the Ledgerworks grid + detail modal — FFA/
  // Stripe pieces, the ETH-only piece (currently just The Pope), and
  // externally-fulfilled ones (Recycle Group, Nahuel Aquiles) all
  // render the same card, but branch on `kind` for price/status vs.
  // an outbound link vs. the ETH address/QR/form inside the modal.
  const ledgerworksPieces: LedgerworksPiece[] = [
    ...nftArtworks.map(
      (a): LedgerworksPiece =>
        a.ethPrice != null
          ? {
              id: a.id,
              title: a.title,
              artistName: a.artistName,
              medium: a.medium,
              note: a.note,
              description: a.description,
              details: a.details,
              image: a.image,
              imageWidth: a.imageWidth,
              imageHeight: a.imageHeight,
              kind: 'eth',
              artworkId: a.id,
              ethAmount: a.ethPrice,
              label: statusLabel(a),
            }
          : {
              id: a.id,
              title: a.title,
              artistName: a.artistName,
              medium: a.medium,
              note: a.note,
              description: a.description,
              details: a.details,
              image: a.image,
              imageWidth: a.imageWidth,
              imageHeight: a.imageHeight,
              kind: 'checkout',
              artworkId: a.id,
              price: displayPrice(a),
              priceIsEstimate: a.priceIsEstimate,
              label: statusLabel(a),
              showBuy:
                !isSoldOut(a) &&
                a.status !== 'reserved' &&
                displayPrice(a) != null &&
                !a.priceIsEstimate,
            },
    ),
    ...LEDGERWORKS_WORKS.map(
      (w): LedgerworksPiece => ({
        id: w.id,
        title: w.title,
        artistName: w.artist,
        note: w.note,
        description: w.description,
        details: w.details,
        image: w.image,
        imageWidth: w.imageWidth,
        imageHeight: w.imageHeight,
        kind: 'external',
        href: w.href ?? '#',
        cta: w.cta ?? 'View listing',
      }),
    ),
  ];

  return (
    <>
      <PageHeader
        eyebrow="OURS · Aug 9, 2026"
        title={<>Collect the work.</>}
        image="/images/initiative-exhibitions.jpg"
        body={
          <p>
            A curated set of works from the OURS exhibition, available to collect online.
            Every sale supports the artist and the foundation directly.
          </p>
        }
      />

      <Panel variant="white" className="md:p-16">
        {/* Masonry via CSS multi-column rather than a row-aligned grid —
            cards are sized to each work's own image, so a tall portrait
            and a wide landscape shouldn't be forced onto a shared row
            height. break-inside-avoid keeps a card from splitting across
            a column break; column-gap (gap-x) spaces the columns, and
            each item's own bottom margin spaces them vertically since
            column layout has no row-gap equivalent. */}
        <ul className="columns-1 gap-x-8 sm:columns-2 lg:columns-3">
          {physicalArtworks.map((artwork) => (
            <li key={artwork.id} className="mb-14 break-inside-avoid">
              <ArtworkCard artwork={artwork} />
            </li>
          ))}
        </ul>

        <p className="mt-16 border-t border-rule pt-8 text-sm text-muted">
          Prices include a 20% charitable, tax-deductible premium supporting FFA, a 501(c)(3)
          nonprofit. Sales tax is calculated at checkout.
        </p>

        {/* Ledgerworks (née "Web3 Wall") — the /q/web3 QR in the
            printed OURS program still points here (physical QR, source
            path unchanged) but now lands on #ledgerworks. Every piece
            opens a detail modal (description, size, paper, frame,
            etc.) rather than acting straight from the card — the
            modal is also the QR-deep-link destination for individual
            pieces on the exhibition wall (?piece=<id>, see
            LedgerworksSection). Most pieces sell through the same
            FFA/Stripe checkout as the exhibition above (real Artwork
            entries, isNFT: true — see lib/storefront.ts); FFA
            transfers the NFT after purchase. Recycle Group and
            Nahuel Aquiles are fulfilled externally — their modal's
            buy button links out instead. scroll-mt keeps the heading
            clear of the viewport top when the anchor jumps —
            important since QR scans land here directly, skipping the
            grid above. */}
        <div id="ledgerworks" className="mt-20 scroll-mt-24 border-t-[3px] border-rule pt-16">
          <p className="text-sm uppercase tracking-[0.08em] text-sage">Ledgerworks</p>
          <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">Collect on-chain.</h2>
          <p className="mt-6 max-w-2xl text-body leading-relaxed text-ink/80">
            On-chain works from the exhibition&rsquo;s Ledgerworks artists. Buy through the
            page and FFA transfers the piece to your wallet after the sale.
          </p>
          <Suspense fallback={null}>
            <LedgerworksSection pieces={ledgerworksPieces} />
          </Suspense>

          {/* Same disclosure as the exhibition grid, repeated here —
              visitors from the /q/web3 QR code land on this anchor
              directly and may never scroll past the grid above. */}
          <p className="mt-4 border-t border-rule pt-8 text-sm text-muted">
            Prices include a 20% charitable, tax-deductible premium supporting FFA, a 501(c)(3)
            nonprofit. Sales tax is calculated at checkout.
          </p>
        </div>
      </Panel>
    </>
  );
}
