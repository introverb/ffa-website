import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Partnerships',
  description:
    'Partner with the Foundation for Future Aesthetics through Possibilia editorial features, exhibition sponsorship, and our Industrial Garden initiative.',
};

export default function PartnershipsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Partnerships"
        title="Build the future with us."
        image="/images/initiatives-hero.jpg"
        body={
          <p>
            The foundation partners with research labs, frontier-tech companies, and
            forward-looking organizations to bring their work into the optimistic-future
            canon, through Possibilia, the OURS exhibition program, and the
            Industrial Garden initiative.
          </p>
        }
      />

      <Panel id="editorial" variant="white" className="md:p-20">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Possibilia editorial</p>
            <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
              Doing something worth writing about?
            </h2>
          </div>
          <div className="flex flex-col text-body-lg leading-relaxed text-ink/85">
            <p>
              Possibilia commissions short fiction set in believable, recognizably better
              tomorrows, futures grounded in the research and technology actually
              being built today. If your lab, company, or organization is working on
              something that fits, partner with us to have it featured.
            </p>
            <p className="mt-5">
              <strong>The package:</strong> a Possibilia story inspired by your work,
              original artwork commissioned to accompany it, and a companion essay you (or
              someone on your team) write or edit, explaining the real research,
              technology, or initiative behind the fiction.
            </p>
            <p className="mt-5">
              <strong>Built for</strong> research labs, metascience and science
              organizations, and frontier-tech companies whose work belongs in the canon
              that the next generation of writers and scientists will read.
            </p>
            <div className="mt-auto pt-10">
              <Link
                href="/contact?topic=Possibilia editorial partnership"
                className="btn-solid"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </Panel>

      <Panel variant="white" className="md:p-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl bg-cream p-10 md:p-12">
            <p className="text-sm uppercase tracking-[0.08em] text-sage">
              Sponsorship, in development
            </p>
            <h2 className="mt-6 text-h3 leading-tight md:text-h3-lg">
              Sponsor the OURS exhibition.
            </h2>
            <p className="mt-6 text-body leading-relaxed text-ink/80">
              The OURS exhibition pairs speculative artwork with the science and engineering
              that could bring it into being, a curated, traveling show. We&rsquo;re
              opening sponsorship for the inaugural run.
            </p>
            {/* TODO (round 2): swap "Sponsor the exhibition" for an
                inline pop-up form so prospective sponsors can submit
                interest without leaving the page. Same pattern as the
                OURS "Other ways to take part" CTA. */}
            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <Link href="/ours" className="btn">
                Event details
              </Link>
              <Link
                href="/contact?topic=OURS exhibition sponsorship"
                className="btn-solid"
              >
                Sponsor the exhibition
              </Link>
            </div>
          </div>

          <div className="flex flex-col rounded-2xl bg-cream p-10 md:p-12">
            <p className="text-sm uppercase tracking-[0.08em] text-sage">
              Sponsorship, in development
            </p>
            <h2 className="mt-6 text-h3 leading-tight md:text-h3-lg">
              Sponsor the Industrial Garden.
            </h2>
            <p className="mt-6 text-body leading-relaxed text-ink/80">
              Industrial Garden is the foundation&rsquo;s proposed maker space in New York
              City, a community workspace and a self-sustaining model for small
              creators and hard-tech founders. Sponsorship opens as we move from proposal to
              exhibit.
            </p>
            <div className="mt-auto pt-8">
              <Link
                href="/contact?topic=Industrial Garden sponsorship"
                className="btn"
              >
                Request a brief
              </Link>
            </div>
          </div>
        </div>
      </Panel>

      <Panel variant="dark" className="md:p-16">
        <h2 className="text-h2 leading-[1.05] md:text-h2-lg">Not sure where you fit?</h2>
        <p className="mt-6 max-w-prose text-body-lg leading-relaxed text-white/85">
          Tell us about your project and what you&rsquo;re trying to get out into the world.
          We&rsquo;ll come back with the partnership shape that fits, or the honest
          answer that we&rsquo;re not the right home for it.
        </p>
        <Link
          href="/contact?topic=Partnership"
          className="btn-solid mt-10 inline-block"
        >
          Send a note
        </Link>
      </Panel>
    </>
  );
}
