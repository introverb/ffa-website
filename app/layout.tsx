import type { Metadata } from 'next';
import Script from 'next/script';
import { Saira } from 'next/font/google';
import './globals.css';
import { PageFrame } from '@/components/PageFrame';
import { Footer } from '@/components/Footer';
import { ConditionalFooter } from '@/components/ConditionalFooter';
import { JsonLd } from '@/components/JsonLd';

// Display face - used for headings and bolded text. Saira is a temporary
// stand-in for Eurostile Next Pro Semibold; both are geometric sans with a
// 600 (semibold) weight. To swap to the licensed Eurostile Next Pro file:
//
//   1. Drop the woff2/woff into /public/fonts/eurostile-next-pro-semibold.woff2
//   2. Replace this Saira import with:
//        import localFont from 'next/font/local'
//        const display = localFont({
//          src: '../public/fonts/eurostile-next-pro-semibold.woff2',
//          variable: '--font-display',
//          weight: '600',
//          display: 'swap',
//        })
//   3. Update className below to `${display.variable}`
//
// The Tailwind `font-display` family already points at `var(--font-display)`
// with Helvetica fallback, so no other changes are needed.
const display = Saira({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

// Single source of truth for the site-level title + description so
// the layout metadata, openGraph, and twitter card all stay in sync.
const SITE_NAME = 'Foundation for Future Aesthetics';
const SITE_DESCRIPTION =
  'A nonprofit curating, promoting, and supporting visions of an optimistic and realistic future expressed through the arts.';
const SITE_URL = 'https://futureaesthetics.foundation';
// Default Open Graph + Twitter card image. /images/hero.jpg is the
// homepage atmospheric image and reads well at OG dimensions
// (~1200×630 after platform crop). Pages can override by setting
// their own openGraph.images in their per-page metadata export.
const DEFAULT_OG_IMAGE = '/images/hero.jpg';
// Twitter handle for site + creator attribution on Twitter card.
// Currently the @possibiliamag account doubles as FFA's social home;
// swap to a dedicated FFA handle here when one exists.
const TWITTER_HANDLE = '@possibiliamag';

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

// Schema.org NonprofitOrganization payload — drives the Google
// Knowledge Graph result that appears beside searches for
// "Foundation for Future Aesthetics." Includes the legal record
// (name, alternate name, EIN, mailing address) plus mission +
// social handles. Lives in layout so it ships on every page; Google
// will pick the strongest source (homepage) for the canonical
// Knowledge Graph entry.
const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'NonprofitOrganization',
  name: SITE_NAME,
  alternateName: 'FFA',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  description: SITE_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '200 Prospect Park W',
    addressLocality: 'Brooklyn',
    addressRegion: 'NY',
    postalCode: '11215',
    addressCountry: 'US',
  },
  taxID: '93-2025231',
  nonprofitStatus: 'Nonprofit501c3',
  sameAs: ['https://twitter.com/possibiliamag'],
};

// Schema.org WebSite payload — separate from the Organization
// schema, declares the site itself + lets search engines display
// the result with the right name in the SERP header.
const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  publisher: {
    '@type': 'NonprofitOrganization',
    name: SITE_NAME,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={display.variable}>
      <body>
        {/* Site-wide Schema.org payloads — render as inline <script>
            tags in the served HTML. Invisible to humans; consumed by
            search engines. See ORGANIZATION_SCHEMA + WEBSITE_SCHEMA
            above. */}
        <JsonLd data={ORGANIZATION_SCHEMA} />
        <JsonLd data={WEBSITE_SCHEMA} />
        <PageFrame>
          {children}
          <ConditionalFooter footer={<Footer />} />
        </PageFrame>
        {/* GoatCounter analytics — privacy-first, free for nonprofits.
            Dashboard at https://ffa.goatcounter.com. The script auto-
            tracks pageviews, and listens for clicks on any element
            with a `data-goatcounter-click="..."` attribute to fire a
            custom event with that name. Loaded afterInteractive so it
            never blocks first paint. Event delegation means modal-
            internal buttons get tracked too. */}
        <Script
          data-goatcounter="https://ffa.goatcounter.com/count"
          src="//gc.zgo.at/count.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
