import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';

// Placeholder — /q/web3 (a QR printed in the OURS program) lands
// here, so this route must exist and never 404. Real Web3 Wall
// on-chain collect-index content replaces this shell; the /q/web3
// redirect in next.config.mjs can also be repointed without
// touching print.
export const metadata: Metadata = {
  title: 'Web3 Wall · OURS',
  description:
    'The Web3 Wall at OURS — collect on-chain works from the Foundation for Future Aesthetics exhibition and salon evening in New York City, August 2026.',
  alternates: { canonical: '/ours/web3' },
  openGraph: {
    images: [{ url: '/images/initiative-exhibitions.jpg', alt: 'OURS' }],
  },
  twitter: { images: ['/images/initiative-exhibitions.jpg'] },
};

export default function OursWeb3Page() {
  return (
    <PageHeader
      eyebrow="OURS · Web3 Wall"
      title={<>Collect the Web3 Wall on-chain.</>}
      image="/images/initiative-exhibitions.jpg"
      body={<p>Details coming soon &mdash; check back shortly.</p>}
    />
  );
}
