import type { Metadata } from 'next';
import Script from 'next/script';
import { Saira } from 'next/font/google';
import './globals.css';
import { PageFrame } from '@/components/PageFrame';
import { Footer } from '@/components/Footer';

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

export const metadata: Metadata = {
  title: {
    default: 'Foundation for Future Aesthetics',
    template: '%s · Foundation for Future Aesthetics',
  },
  description:
    'A nonprofit curating, promoting, and supporting visions of an optimistic and realistic future expressed through the arts.',
  metadataBase: new URL('https://www.futureaesthetics.foundation'),
  openGraph: {
    title: 'Foundation for Future Aesthetics',
    description:
      'A nonprofit curating, promoting, and supporting visions of an optimistic and realistic future expressed through the arts.',
    type: 'website',
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
        <PageFrame>
          {children}
          <Footer />
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
