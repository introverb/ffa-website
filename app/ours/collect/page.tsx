import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';

// Placeholder — /q/collect (a QR printed in the OURS program) lands
// here, so this route must exist and never 404. Real collect-index
// content replaces this shell before/at the event; the /q/collect
// redirect in next.config.mjs can also be repointed at a live sales
// page without touching print.
export const metadata: Metadata = {
  title: 'Collect · OURS',
  description:
    'Collect original works from OURS, the Foundation for Future Aesthetics exhibition and salon evening in New York City, August 2026.',
  alternates: { canonical: '/ours/collect' },
  openGraph: {
    images: [{ url: '/images/initiative-exhibitions.jpg', alt: 'OURS' }],
  },
  twitter: { images: ['/images/initiative-exhibitions.jpg'] },
};

export default function OursCollectPage() {
  return (
    <PageHeader
      eyebrow="OURS · Collect"
      title={<>Collect the works of OURS.</>}
      image="/images/initiative-exhibitions.jpg"
      body={<p>Details coming soon &mdash; check back shortly.</p>}
    />
  );
}
