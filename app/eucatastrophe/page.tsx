import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { EucatastropheTool } from '@/components/eucatastrophe/EucatastropheTool';

// The Eucatastrophe page wears its own type — IBM Plex Sans (with Mono
// for small technical labels) for an austere early-search-engine,
// clean-computing feel that's deliberately unlike the rest of the
// site's Saira/Helvetica. Scoped to this page via CSS variables on the
// wrapper below.
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Eucatastrophe',
  description:
    'A free tool for anyone who’s lost the plot on the future. Eucatastrophe builds grounded, evidence-checked visions of a better tomorrow — proof, not platitudes.',
  alternates: { canonical: '/eucatastrophe' },
  openGraph: {
    images: [{ url: '/images/contact.jpg', alt: 'Eucatastrophe' }],
  },
  twitter: { images: ['/images/contact.jpg'] },
};

export default function EucatastrophePage() {
  return (
    <div className={`${plexSans.variable} ${plexMono.variable}`}>
      <EucatastropheTool />
    </div>
  );
}
