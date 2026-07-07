import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { Panel } from '@/components/PageFrame';
import { ArtworkCard } from '@/components/storefront/ArtworkCard';
import { getArtworksForDisplay } from '@/lib/storefront';

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

// Confirmed Ledgerworks roster (née "Web3 Wall"), from the FFA_Master
// Web3 Wall tab. These works collect on-chain or via an external route
// (not Stripe), so they carry a link where one is public and "coming
// soon" otherwise. image/imageWidth/imageHeight follow the same
// convention as lib/storefront.ts's Artwork type — intrinsic sizing, no
// photo yet = gray placeholder (see LedgerworksImage below).
const LEDGERWORKS_WORKS: Array<{
  artist: string;
  title: string;
  note: string;
  href?: string;
  cta?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
}> = [
  {
    artist: 'Mauricio Pommella',
    title: 'The Pope',
    note: 'Digital 1/1, on-chain — 20% of a sale is donated to FFA.',
  },
  {
    artist: 'Nahuel Aquiles',
    title: 'DNA-fractal print',
    note: 'Generative fractal from DNA data — create your own biodata print and collect the NFT, $40 / $90. A share of each sale supports FFA.',
    href: 'https://genpi.org',
    cta: 'Collect via genpi.org',
    image: '/images/storefront/nahuel-aquiles-dna-fractal-print.png',
    imageWidth: 1333,
    imageHeight: 2000,
  },
  {
    artist: 'Yura Miron',
    title: 'Solara Plaza',
    note: 'Digital work, on-chain.',
  },
  {
    artist: 'AnjolaDave',
    title: 'An Ending, A Beginning',
    note: 'Digital work, on-chain, with a physical print in the exhibition.',
    image: '/images/storefront/anjoladave-an-ending-a-beginning.png',
    imageWidth: 814,
    imageHeight: 1020,
  },
  {
    artist: 'Recycle Group',
    title: 'Forest of Expired Links',
    note: 'ERC-721 video — 3D modeled generated graphics; installation photograph shown at OURS. Represented by Gazelli Art House.',
    href: 'https://gazell.io',
    cta: 'View at gazell.io',
  },
];

// Same image-slot treatment as ArtworkCard's — intrinsic sizing for a
// real photo, neutral gray placeholder when one isn't in yet. Kept
// local to this file since LEDGERWORKS_WORKS isn't an Artwork object.
function LedgerworksImage({
  title,
  artist,
  image,
  imageWidth,
  imageHeight,
}: {
  title: string;
  artist: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
}) {
  if (image && imageWidth && imageHeight) {
    return (
      <Image
        src={image}
        alt={`${title}, by ${artist}`}
        width={imageWidth}
        height={imageHeight}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

export default async function OursCollectPage() {
  const artworks = await getArtworksForDisplay();
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
          {artworks.map((artwork) => (
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
            path unchanged) but now lands on #ledgerworks. Roster from
            the FFA_Master Web3 Wall tab (confirmed works only;
            prospects stay off the page). Plain list rather than
            ArtworkCards since nothing here checks out through Stripe.
            scroll-mt keeps the heading clear of the viewport top when
            the anchor jumps. */}
        <div id="ledgerworks" className="mt-20 scroll-mt-24 border-t-[3px] border-rule pt-16">
          <p className="text-sm uppercase tracking-[0.08em] text-sage">Ledgerworks</p>
          <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">Collect on-chain.</h2>
          <p className="mt-6 max-w-2xl text-body leading-relaxed text-ink/80">
            A dedicated wall of on-chain works from the exhibition&rsquo;s Ledgerworks artists,
            collectible during and after the evening.
          </p>
          <ul className="mt-12 columns-1 gap-x-8 text-body leading-relaxed text-ink/80 sm:columns-2 lg:columns-3">
            {LEDGERWORKS_WORKS.map((work) => (
              <li key={work.title} className="mb-14 break-inside-avoid">
                <LedgerworksImage
                  title={work.title}
                  artist={work.artist}
                  image={work.image}
                  imageWidth={work.imageWidth}
                  imageHeight={work.imageHeight}
                />
                <p className="mt-5 text-sm uppercase tracking-[0.08em] text-sage">{work.artist}</p>
                <h3 className="mt-3 text-h6 leading-tight text-ink md:text-h5">{work.title}</h3>
                <p className="mt-2 text-sm text-muted">{work.note}</p>
                {work.href ? (
                  <a
                    href={work.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center rounded-md border border-ink/20 px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-ink transition hover:bg-ink/5"
                  >
                    {work.cta}
                  </a>
                ) : (
                  <p className="mt-4 text-sm uppercase tracking-[0.1em] text-muted">
                    Collect link coming soon
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </>
  );
}
