import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';

// Afterparty shell — /q/after (a QR printed in the OURS program) lands
// here, so this route must exist and never 404. Fill in the real
// details (venue, time, RSVP) when the afterparty plan is set; drop
// the robots noindex at the same time.
export const metadata: Metadata = {
  title: 'Afterparty · OURS',
  description:
    'The OURS afterparty — the night continues after the exhibition and salon evening in New York City, August 9, 2026.',
  alternates: { canonical: '/ours/after' },
  robots: { index: false, follow: false },
  openGraph: {
    images: [{ url: '/images/initiative-exhibitions.jpg', alt: 'OURS' }],
  },
  twitter: { images: ['/images/initiative-exhibitions.jpg'] },
};

export default function OursAfterPage() {
  return (
    <PageHeader
      eyebrow="OURS · Aug 9, 2026 · Afterparty"
      title={<>The night continues.</>}
      image="/images/initiative-exhibitions.jpg"
      body={<p>Details coming soon &mdash; check back shortly.</p>}
    />
  );
}
