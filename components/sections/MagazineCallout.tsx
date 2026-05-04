import Link from 'next/link';
import { Panel } from '@/components/PageFrame';
import { Placeholder } from '@/components/Placeholder';

// Possibilia callout — black panel, magazine photograph on the left, text on right.
export function MagazineCallout() {
  return (
    <Panel variant="dark" className="md:p-20">
      <div className="grid gap-14 md:grid-cols-2 md:items-center">
        <div>
          {/* Drop /public/images/possibilia-spread.jpg to replace the placeholder */}
          <Placeholder
            src="/images/possibilia-spread.jpg"
            alt="Possibilia Magazine, Issue 0"
            ratio="4/3"
            className="bg-white/10"
          />
        </div>
        <div className="text-white">
          <Link
            href="/possibilia"
            className="text-sm underline decoration-from-font underline-offset-4 text-white/85 hover:text-sage-light"
          >
            Possibilia Magazine — Issue 0
          </Link>
          <h2 className="mt-6 text-h2 leading-[1.1] md:text-h2-lg">
            Help us build a home for optimistic, realistic science fiction.
          </h2>
          <p className="mt-8 max-w-prose text-body leading-relaxed text-white/85">
            We&rsquo;re assembling Issue 0 of Possibilia — fiction, criticism, and original artwork
            imagining a future worth building. We&rsquo;re looking for contributors across every
            role: writers, artists, donors, field experts, and friends of the project.
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
