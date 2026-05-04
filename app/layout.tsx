import type { Metadata } from 'next';
import { Saira } from 'next/font/google';
import './globals.css';
import { PageFrame } from '@/components/PageFrame';
import { Footer } from '@/components/Footer';
import { MenuDrawer } from '@/components/MenuDrawer';

// Display face — used for headings and bolded text. Saira is a temporary
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
    template: '%s — Foundation for Future Aesthetics',
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
        <MenuDrawer />
        <PageFrame>
          {children}
          <Footer />
        </PageFrame>
      </body>
    </html>
  );
}
