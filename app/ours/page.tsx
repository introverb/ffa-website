import type { Metadata } from 'next';
import Image from 'next/image';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import { JsonLd } from '@/components/JsonLd';
import { OursContributors } from '@/components/OursContributors';
import { OursArtworkDialog } from '@/components/OursArtworkDialog';

// Public RSVP / application page for OURS, hosted on Luma. The
// attendance CTAs (homepage "Attend OURS" button, the /ours "Apply
// to attend" card) all point here.
const LUMA_RSVP_URL = 'https://luma.com/0hakp1pz';

export const metadata: Metadata = {
  title: 'OURS',
  description:
    'OURS is an exhibition and salon evening for visions of the future, presented by the Foundation for Future Aesthetics in New York City, August 2026.',
  alternates: { canonical: '/ours' },
  openGraph: {
    images: [{ url: '/images/initiative-exhibitions.jpg', alt: 'OURS' }],
  },
  twitter: { images: ['/images/initiative-exhibitions.jpg'] },
};

// Schema.org Event payload — generates a structured event card in
// search results (date, location, organizer). Date is approximate
// (just "August 2026" on the page); using the 1st of the month as
// the schema.org-required ISO date until a specific evening is set.
// Update startDate when the date locks in.
const EVENT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'OURS',
  description:
    'OURS is an exhibition and salon evening for visions of the future, presented by the Foundation for Future Aesthetics in New York City, August 2026.',
  startDate: '2026-08-01',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'New York City',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'New York',
      addressRegion: 'NY',
      addressCountry: 'US',
    },
  },
  organizer: {
    '@type': 'NonprofitOrganization',
    name: 'Foundation for Future Aesthetics',
    url: 'https://www.futureaesthetics.foundation',
  },
  image: 'https://www.futureaesthetics.foundation/images/initiative-exhibitions.jpg',
};

const FORMAT = [
  {
    label: 'Speakers',
    body: 'Scientists, philosophers, thought leaders, and builders giving short provocations: open questions, not finished arguments.',
  },
  {
    label: 'Works of art',
    body: 'Original pieces from a curated roster of artists, available to take home for those who fall in love with one.',
  },
  {
    label: 'Guests',
    body: 'A broad spectrum of fields and disciplines, because the future is shaped by everyone willing to imagine it differently.',
  },
  {
    label: 'Setting',
    body: 'Venue: [TBA]\nNew York City\nAugust 2026',
  },
];

export default function OursPage() {
  return (
    <>
      {/* Schema.org Event payload — invisible, parsed by search
          engines for rich event-card results. See EVENT_SCHEMA above. */}
      <JsonLd data={EVENT_SCHEMA} />
      <PageHeader
        eyebrow="OURS · NYC · August 2026"
        title="An exhibition and salon for visions of the future."
        image="/images/initiative-exhibitions.jpg"
        body={
          <p>
            An evening for the artists, scientists, and builders who believe what
            comes next is ours to architect.
          </p>
        }
      />

      <Panel variant="white" className="md:p-16">
        {/* Why now */}
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Why now</p>
            <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
              The future isn&rsquo;t fixed.
            </h2>
          </div>
          <div className="text-body-lg leading-relaxed text-ink/85">
            <p>
              The futures handed to us are increasingly narrow, shaped behind closed
              doors by tech companies and policy rooms, trained into our imaginations,
              and told back to us as the only way things could be. But the future is
              also being made elsewhere. It&rsquo;s being formed in studios, labs,
              workshops, in meetings over coffee and over video call alike, by people
              refusing what&rsquo;s simply handed to them, and instead exercising the
              agency to build what comes next. Those are the people we want to be.
            </p>
            <p className="mt-5">
              OURS is where we gather for an evening to both observe and{' '}
              <strong>BE</strong> a showcase of positive visions of the future
              &mdash; in art, in words, by people acting on their own visions
              &mdash; and a room to share ideas, build out a perspective, and
              think about how each of us shapes what comes.
            </p>
          </div>
        </div>

        {/* Format */}
        <div className="mt-20 border-t-[3px] border-rule pt-16">
          <p className="text-sm uppercase tracking-[0.08em] text-sage">The format</p>
          <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
            An intimate discussion of what&rsquo;s to come.
          </h2>
          <ul className="mt-12 grid gap-12 text-body leading-relaxed text-ink/80 md:grid-cols-2 lg:grid-cols-4">
            {FORMAT.map((f) => (
              <li key={f.label}>
                <p className="text-sm uppercase tracking-[0.08em] text-sage">{f.label}</p>
                <p className="mt-4 whitespace-pre-line">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Contributors — interactive group selector (client
            component): Artists / Speakers / Installation
            Contributors tabs, each revealing a color-coded panel.
            Sits between Format and Engage so a visitor sees who's
            confirmed before the page asks them to take part. */}
        <OursContributors />

        {/* Engage */}
        <div id="engage" className="mt-20 border-t-[3px] border-rule pt-16">
          <p className="text-sm uppercase tracking-[0.08em] text-sage">Engage</p>
          <h2 className="mt-6 max-w-3xl text-h2 leading-[1.05] md:text-h2-lg">
            Take part in crafting tomorrow.
          </h2>

          {/* Three compact "doors" — one-line cards, uniform height,
              each a single CTA. Attendance and sponsorship link out
              (Luma RSVP, sponsor brief); artwork opens a modal so the
              form lives off-card and the row stays short. items-stretch
              keeps the trio equal-height; each door's CTA is pinned to
              the bottom (mt-auto) so the buttons line up across the row. */}
          <div className="mt-14 grid gap-6 md:grid-cols-3 md:items-stretch">
            <EngageDoor
              title="Apply to attend"
              blurb="The room is intimate and the list is limited, but we&rsquo;re still welcoming guests."
              bgImage="/images/initiative-exhibitions.jpg"
            >
              <a
                href={LUMA_RSVP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-goatcounter-click="ours:attend-luma"
                className="btn-solid"
              >
                Apply on Luma
              </a>
            </EngageDoor>

            <EngageDoor
              title="Submit artwork"
              blurb="Still accepting works for the exhibition. Mediums open. Send a portfolio and a short pitch."
              bgImage="/images/initiative-possibilia.jpg"
            >
              <OursArtworkDialog />
            </EngageDoor>

            {/* Sponsor door keeps the sharp discovery artwork with a
                frosted-glass CTA (rather than the frosted-blur text-
                card treatment of the other two). The button matches
                the other doors' shape (rounded-md) and position
                (bottom-left, at the same p-6/p-7 inset their CTAs
                sit), just kept frosted so it reads on the image.
                Compact fixed height on mobile; md:h-full lets the grid
                stretch it to match the two text doors on desktop. */}
            <div className="relative h-52 overflow-hidden rounded-2xl md:h-full">
              <Image
                src="/images/discovery.jpg"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              {/* Top scrim so the white title reads over the bright sky
                  in the discovery image. */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-ink/65 to-transparent"
              />
              {/* Title overlaid top-left, matching the other doors'
                  title position (same p-6/p-7 inset), white on the
                  scrim. */}
              <h3 className="absolute left-6 right-6 top-6 text-h5 leading-tight text-white md:left-7 md:right-7 md:top-7">
                Become a Patron or Partner
              </h3>
              <a
                href="/ours/sponsor-brief"
                target="_blank"
                rel="noopener noreferrer"
                data-goatcounter-click="ours:sponsor-event"
                className="absolute bottom-6 left-6 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-white/40 bg-white/15 px-7 py-3 text-sm uppercase tracking-[0.12em] text-white backdrop-blur-md transition hover:bg-white/30 md:bottom-7 md:left-7"
              >
                Sponsor the event
              </a>
            </div>
          </div>
        </div>
      </Panel>
    </>
  );
}

// Compact engagement "door" — a short, uniform CTA card for the Engage
// row. Background is one of the initiative images, heavily frosted
// (blur-2xl) under a paper veil so dark text stays readable; each door
// uses a different image for variety. flex-col + h-full + the CTA's
// mt-auto keep all three doors equal-height with their buttons aligned.
// The CTA itself (external link or modal trigger) is passed as
// children, so a door doesn't care whether it links out or opens a
// dialog.
function EngageDoor({
  title,
  blurb,
  bgImage,
  children,
}: {
  title: string;
  blurb: string;
  bgImage: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border-[3px] border-ink/20 p-6 text-ink md:p-7">
      {/* Frosted background — image scaled past edges so the heavy
          blur doesn't leave soft borders, then a paper veil for
          contrast. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src={bgImage}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="scale-125 object-cover blur-2xl"
        />
        <div className="absolute inset-0 bg-paper/65" />
      </div>

      <h3 className="text-h5 leading-tight">{title}</h3>
      <p
        className="mt-2 text-sm leading-relaxed text-ink/75"
        dangerouslySetInnerHTML={{ __html: blurb }}
      />
      {/* CTA pinned to the bottom so buttons line up across the row. */}
      <div className="mt-auto pt-6">{children}</div>
    </div>
  );
}
