import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import { JsonLd } from '@/components/JsonLd';
import { OursContributors } from '@/components/OursContributors';

export const metadata: Metadata = {
  title: 'OURS',
  description:
    'OURS is an exhibition and salon evening for visions of the future, presented by the Foundation for Future Aesthetics in LES, NY, August 9, 2026.',
  alternates: { canonical: '/ours' },
  openGraph: {
    images: [{ url: '/images/initiative-exhibitions.jpg', alt: 'OURS' }],
  },
  twitter: { images: ['/images/initiative-exhibitions.jpg'] },
};

// Schema.org Event payload — generates a structured event card in
// search results (date, location, organizer).
const EVENT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'OURS',
  description:
    'OURS is an exhibition and salon evening for visions of the future, presented by the Foundation for Future Aesthetics in LES, NY, August 9, 2026.',
  startDate: '2026-08-09',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Space LES',
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
    url: 'https://futureaesthetics.foundation',
  },
  image: 'https://futureaesthetics.foundation/images/initiative-exhibitions.jpg',
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
    body: 'Venue: Space LES\nLES, NY\nAugust 9, 2026',
  },
];

export default function OursPage() {
  return (
    <>
      {/* Schema.org Event payload — invisible, parsed by search
          engines for rich event-card results. See EVENT_SCHEMA above. */}
      <JsonLd data={EVENT_SCHEMA} />
      <PageHeader
        eyebrow="OURS · LES, NY · Aug 9, 2026"
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
        {/* The invitation — the hook ("the future isn't fixed"). Used
            to be followed by "Engage doors" (Apply to attend / Submit
            artwork); removed once invites went out and both the guest
            list and artist roster closed. The "Attend OURS" button
            below is a distinct, later addition — a direct RSVP link
            (via /ours/attend -> Luma), not the old jury/apply flow. */}
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.08em] text-sage">The invitation</p>
            <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
              The future isn&rsquo;t fixed.
            </h2>
            <a
              href="/ours/attend"
              target="_blank"
              rel="noopener noreferrer"
              data-goatcounter-click="ours:attend"
              className="btn-solid mt-8 inline-flex bg-flare px-10 py-4 text-base"
            >
              Attend OURS
            </a>
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
            component): Artists / Speakers / Installation Contributors
            tabs, each revealing a color-coded panel. Now closes the
            page (after Format), so the confirmed lineup is the last
            thing a visitor sees. */}
        <OursContributors />
      </Panel>
    </>
  );
}
