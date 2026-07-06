import type { Metadata } from 'next';
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
        <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((artwork) => (
            <li key={artwork.id}>
              <ArtworkCard artwork={artwork} />
            </li>
          ))}
        </ul>

        <p className="mt-16 border-t border-rule pt-8 text-sm text-muted">
          Prices include a 20% charitable, tax-deductible premium supporting FFA, a 501(c)(3)
          nonprofit. Sales tax is calculated at checkout.
        </p>

        {/* Web3 Wall — the /q/web3 QR in the printed OURS program lands
            here (#web3). Shell section for now; the on-chain collect
            links replace the coming-soon line when they're ready.
            scroll-mt keeps the heading clear of the viewport top when
            the anchor jumps. */}
        <div id="web3" className="mt-20 scroll-mt-24 border-t-[3px] border-rule pt-16">
          <p className="text-sm uppercase tracking-[0.08em] text-sage">Web3 Wall</p>
          <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">Collect on-chain.</h2>
          <p className="mt-6 max-w-2xl text-body leading-relaxed text-ink/80">
            A dedicated wall of on-chain works from the exhibition&rsquo;s Web3 artists,
            collectible during and after the evening. Details coming soon &mdash; check
            back shortly.
          </p>
        </div>
      </Panel>
    </>
  );
}
