import type { Metadata } from 'next';
import Image from 'next/image';
import { Panel } from '@/components/PageFrame';

export const metadata: Metadata = {
  title: 'Thank you',
  robots: { index: false, follow: false },
};

export default function OursCollectSuccessPage() {
  return (
    // full-width panel, matching every other page's panels (the old
    // mx-auto max-w-lg card read narrow/off next to the rest of the
    // site). Background is the astronaut photo (discovery.jpg),
    // heavily blurred with a paper veil for legibility — PageHeader's
    // frosted treatment minus its triangle/parallel-band crisp-reveal
    // accents, which read as too busy for a single "thank you" moment.
    <Panel
      variant="white"
      full
      className="flex min-h-[380px] flex-col justify-center md:min-h-[460px]"
    >
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/images/discovery.jpg"
          alt=""
          fill
          sizes="100vw"
          className="scale-125 object-cover blur-3xl"
          priority
        />
        <div className="absolute inset-0 bg-paper/35" />
      </div>

      <div className="relative p-8 md:p-16">
        <p className="text-sm uppercase tracking-[0.08em] text-sage">OURS</p>
        <h1 className="mt-6 text-h3 leading-tight md:text-h2">Thank you.</h1>
        <p className="mt-5 max-w-lg text-body leading-relaxed text-ink/80">
          We&rsquo;re glad this piece found you. A member of our team will follow up personally
          within the week to arrange delivery.
        </p>
        <p className="mt-4 max-w-lg text-body leading-relaxed text-ink/80">
          A receipt is on its way to your email now. If this piece is an NFT, you&rsquo;ll also
          receive written confirmation of your wallet address before transfer.
        </p>
      </div>
    </Panel>
  );
}
