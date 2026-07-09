import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';

export const metadata: Metadata = {
  title: 'Thank you',
  robots: { index: false, follow: false },
};

export default function OursCollectSuccessPage() {
  return (
    <Panel variant="white" className="mx-auto max-w-lg md:p-16">
      <p className="text-sm uppercase tracking-[0.08em] text-sage">OURS</p>
      <h1 className="mt-6 text-h3 leading-tight md:text-h2">Thank you.</h1>
      <p className="mt-5 text-body leading-relaxed text-ink/80">
        We&rsquo;re glad this piece found you. A member of our team will follow up personally
        within the week to arrange delivery.
      </p>
      <p className="mt-4 text-body leading-relaxed text-ink/80">
        A receipt is on its way to your email now. If this piece is an NFT, you&rsquo;ll also
        receive written confirmation of your wallet address before transfer.
      </p>
    </Panel>
  );
}
