import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Panel } from '@/components/PageFrame';
import { ArtworkCard } from '@/components/storefront/ArtworkCard';
import { ARTWORKS } from '@/lib/storefront';

// OURS storefront — unlisted on purpose (see the build brief in
// /storefront). Not linked from SiteNav, the /ours page, or the
// sitemap; reachable only by direct URL. `robots: noindex` keeps it
// out of search results too. Password-gating (middleware) and Stripe
// checkout land in a later step — this pass is the on-brand page shell
// + grid, reviewable before either of those are wired up.
export const metadata: Metadata = {
  title: 'Collect',
  robots: { index: false, follow: false },
};

export default function OursCollectPage() {
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
          {ARTWORKS.map((artwork) => (
            <li key={artwork.id}>
              <ArtworkCard artwork={artwork} />
            </li>
          ))}
        </ul>

        <p className="mt-16 border-t border-rule pt-8 text-sm text-muted">
          Prices include a 20% charitable, tax-deductible premium supporting FFA, a 501(c)(3)
          nonprofit. Sales tax is calculated at checkout.
        </p>
      </Panel>
    </>
  );
}
