import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'About',
  description:
    'The Foundation for Future Aesthetics is a 501(c)(3) nonprofit funding optimistic, realistic visions of the future, expressed through the arts and sciences.',
  alternates: { canonical: '/about' },
  openGraph: {
    images: [{ url: '/images/mission.jpg', alt: 'About FFA' }],
  },
  twitter: { images: ['/images/mission.jpg'] },
};

// The three roles FFA funds, lifted from the philosophy that already
// runs through the Give panel on /support. Each carries a piece of "a
// future worth having"; the point of the section is that they pull
// together rather than apart.
const ROLES = [
  { label: 'Artists', body: 'imagine a future worth having.' },
  { label: 'Scientists', body: 'discover how it&rsquo;s possible.' },
  { label: 'Technologists', body: 'build the pieces that make it real.' },
];

// The foundation's initiatives, summarized. Each links to its own page
// (Industrial Garden has no page yet, so it routes through contact).
const INITIATIVES = [
  {
    name: 'Possibilia',
    href: '/possibilia',
    body: 'The foundation&rsquo;s literary magazine. Original short fiction set in believable, better tomorrows, paired with companion essays by working scientists and artwork commissioned for each piece.',
  },
  {
    name: 'OURS',
    href: '/ours',
    body: 'A one-night exhibition and salon in New York. Speculative artwork on the walls, and the people building it into reality at the lectern. Debuts August 2026.',
  },
  {
    name: 'Industrial Garden',
    href: '/contact?topic=Industrial Garden sponsorship',
    body: 'A proposed maker space in New York City, pairing local craftspeople with hard-tech founders under a self-sustaining model. Moving from proposal toward reality.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="We fund futures worth wanting."
        image="/images/mission.jpg"
        body={
          <p>
            The Foundation for Future Aesthetics is a 501(c)(3) nonprofit. We
            curate, promote, and support optimistic, realistic visions of the
            future, expressed through the arts and sciences.
          </p>
        }
      />

      <Panel variant="white" className="md:p-16">
        {/* Why we exist */}
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Why we exist</p>
            <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
              Most pictures of the future are bleak. We fund the other kind.
            </h2>
          </div>
          <div className="text-body-lg leading-relaxed text-ink/85">
            <p>
              The futures handed to us keep getting narrower. They&rsquo;re shaped
              behind closed doors, trained into our imaginations, and told back to
              us as the only way things could be. We think that&rsquo;s a failure
              of nerve, not a fact about the world.
            </p>
            <p className="mt-5">
              The future is also being made elsewhere. In studios, labs, and
              workshops, by people who refuse what&rsquo;s handed to them and build
              what comes next instead. The Foundation for Future Aesthetics exists
              to find those people and fund their work.
            </p>
          </div>
        </div>

        {/* The three roles */}
        <div className="mt-20 border-t-[3px] border-rule pt-16">
          <p className="text-sm uppercase tracking-[0.08em] text-sage">How it fits together</p>
          <h2 className="mt-6 max-w-3xl text-h2 leading-[1.05] md:text-h2-lg">
            Three kinds of people, pulling the same direction.
          </h2>
          <p className="mt-6 max-w-prose text-body-lg leading-relaxed text-ink/80">
            A future worth having takes three kinds of work, and right now they
            pull apart: art drifts toward dystopia, technology toward power,
            science toward whatever&rsquo;s fundable. We back the version where
            they pull together, aligned toward human flourishing.
          </p>
          <ul className="mt-12 grid gap-12 text-body leading-relaxed md:grid-cols-3">
            {ROLES.map((r) => (
              <li key={r.label}>
                <p className="text-sm uppercase tracking-[0.08em] text-sage">{r.label}</p>
                <p
                  className="mt-4 text-h6 leading-snug text-ink/90"
                  dangerouslySetInnerHTML={{ __html: r.body }}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* What we build */}
        <div className="mt-20 border-t-[3px] border-rule pt-16">
          <p className="text-sm uppercase tracking-[0.08em] text-sage">What we build</p>
          <h2 className="mt-6 max-w-3xl text-h2 leading-[1.05] md:text-h2-lg">
            Cultural infrastructure for the future.
          </h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-3">
            {INITIATIVES.map((i) => (
              <li key={i.name}>
                <Link href={i.href} className="group block">
                  <h3 className="text-h4 leading-tight group-hover:text-sage">{i.name}</h3>
                  <p
                    className="mt-3 text-body leading-relaxed text-muted"
                    dangerouslySetInnerHTML={{ __html: i.body }}
                  />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-prose text-body leading-relaxed text-ink/70">
            Next: granting programs for the artists, scientists, and technologists
            building futures of their own.
          </p>
        </div>
      </Panel>

      {/* The foundation + CTA */}
      <Panel variant="dark" className="md:p-16">
        <p className="text-sm uppercase tracking-[0.08em] text-sage-light">The foundation</p>
        <h2 className="mt-6 max-w-3xl text-h2 leading-[1.05] md:text-h2-lg">
          Build the future with us.
        </h2>
        <p className="mt-6 max-w-prose text-body-lg leading-relaxed text-white/85">
          We&rsquo;re a 501(c)(3) nonprofit, founded in 2023 and based in New York
          City. Every program is funded by people who believe what comes next is
          worth shaping. Come help.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/support" className="btn-solid">
            Support the foundation
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-white/40 px-7 py-3 text-sm uppercase tracking-[0.12em] text-white transition hover:bg-white/10"
          >
            Get in touch
          </Link>
        </div>
      </Panel>
    </>
  );
}
