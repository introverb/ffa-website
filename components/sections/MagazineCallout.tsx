import Link from 'next/link';
import { Panel } from '@/components/PageFrame';

// Possibilia callout — black panel, media slot on the left, text on right.
// Grid uses items-stretch so the media slot fills the full text-column
// height (no centered media floating in white space).
export function MagazineCallout() {
  return (
    <Panel variant="dark" className="md:p-20">
      <div className="grid gap-14 md:grid-cols-2 md:items-stretch">
        <div className="overflow-hidden rounded-md bg-white/10">
          <video
            src="/images/possibilia-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="text-white">
          <p className="text-sm uppercase tracking-[0.12em] text-white/70">
            Possibilia Magazine &mdash; Issue 0
          </p>
          <h2 className="mt-6 text-h2 leading-[1.1] md:text-h2-lg">
            We&rsquo;re building the home of optimistic, realistic, sci-fi.
          </h2>
          <p className="mt-8 max-w-prose text-body leading-relaxed text-white/85">
            Science fiction worth emulating. Original short stories of tomorrow. Nonfiction
            companion essays from working scientists. Artwork commissioned from a variety of
            creators.
          </p>
          <p className="mt-4 max-w-prose text-body leading-relaxed text-white/85">
            We&rsquo;re looking for contributors across every role: writers, artists, field
            experts, partners, donors, and friends of the project.
          </p>
          <Link
            href="/possibilia"
            className="mt-10 inline-block text-sm uppercase tracking-[0.14em] underline decoration-from-font underline-offset-[6px] hover:text-sage-light"
          >
            Learn more →
          </Link>
        </div>
      </div>
    </Panel>
  );
}
