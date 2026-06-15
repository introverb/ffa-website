import type { Metadata } from 'next';
import Image from 'next/image';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import { HoneypotField } from '@/components/HoneypotField';
import { TrackSubmission } from '@/components/TrackSubmission';
import { JsonLd } from '@/components/JsonLd';
import { OursContributors } from '@/components/OursContributors';

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

export default function OursPage({
  searchParams,
}: {
  searchParams: { sent?: string };
}) {
  const sent = searchParams?.sent;
  return (
    <>
      {/* Schema.org Event payload — invisible, parsed by search
          engines for rich event-card results. See EVENT_SCHEMA above. */}
      <JsonLd data={EVENT_SCHEMA} />
      {/* Fire a per-form GoatCounter submission event when a visitor
          lands on the page in a post-submit state. Renders null, so
          no layout impact. */}
      {sent === 'guestlist' && (
        <TrackSubmission eventName="submit:ours-guestlist" />
      )}
      {sent === 'artwork' && (
        <TrackSubmission eventName="submit:ours-artwork" />
      )}
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

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {/* Guestlist → applications now run through Luma; the card
                links out to the RSVP page instead of the old in-page
                form. The /api/ours guestlist handler is left intact in
                case we revert. */}
            <EngagementCard
              title="Apply to attend"
              blurb="The room is intimate and the list is limited, but we&rsquo;re still welcoming guests. Apply on Luma and we&rsquo;ll be in touch."
              bgImage="/images/initiative-exhibitions.jpg"
              cta={{
                label: 'Apply on Luma',
                href: LUMA_RSVP_URL,
                event: 'ours:attend-luma',
              }}
            />

            <EngagementCard
              title="Submit artwork for exhibition"
              blurb="We are still accepting works for our exhibition! Mediums open. Send a portfolio and a short pitch and we&rsquo;ll review."
              sent={sent === 'artwork'}
              sentMessage="Thanks, we&rsquo;ve got your submission and will reach back as we curate."
              bgImage="/images/initiative-possibilia.jpg"
            >
              <input type="hidden" name="type" value="artwork" />
              <Field id="a-name" name="name" label="Your name" required />
              <Field id="a-email" name="email" type="email" label="Email" required />
              <Field
                id="a-portfolio"
                name="portfolio"
                type="url"
                label="Portfolio link"
                required
              />
              <TextareaField
                id="a-pitch"
                name="pitch"
                label="Pitch: what would you bring?"
                required
              />
              {/* Submit + "Read brief" pair. Same mt-auto self-start
                  positioning that the lone Submit had (pushed to the
                  bottom of the flex column, left-aligned), now as a
                  flex row so the brief link sits inline next to the
                  primary submit. Brief opens in a new tab so the
                  submitter doesn't lose their form state. */}
              <div className="mt-auto flex flex-wrap items-center gap-3 self-start">
                <button type="submit" className="btn-solid">
                  Submit
                </button>
                <a
                  href="/ours/artist-brief"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-goatcounter-click="ours:read-artist-brief"
                  className="btn"
                >
                  Read brief
                </a>
              </div>
            </EngagementCard>

            {/* Editorial image filling the third grid slot — same panel
                size and aspect as the form cards on its left. No frosted
                glass over the image itself, just a frosted-pill CTA
                anchored to the bottom for visitors who want to engage
                outside the two structured forms (speaking, funding,
                other contributions).

                aspect-[4/5] on mobile gives the panel explicit
                dimensions so the absolutely-positioned `<Image fill>`
                has something to fill — without this, the panel
                collapses to zero height on mobile (no content sizing
                it) and the tile disappears from the grid. md:aspect-auto
                returns to the desktop behavior where the row's grid
                cell sizes the tile to match the form cards. */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:aspect-auto">
              <Image
                src="/images/discovery.jpg"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              {/* Frosted CTA centered on the discovery image, linking
                  to the sponsorship brief. Opens in a new tab so the
                  visitor doesn't lose their place on the OURS page. */}
              <a
                href="/ours/sponsor-brief"
                target="_blank"
                rel="noopener noreferrer"
                data-goatcounter-click="ours:sponsor-event"
                className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center justify-center whitespace-nowrap rounded-full border border-white/40 bg-white/15 px-7 py-3 text-sm uppercase tracking-[0.12em] text-white backdrop-blur-md transition hover:bg-white/30"
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

// Engagement submission card. Background is one of the initiative
// images, heavily frosted (blur-2xl) with a paper-tinted veil so
// dark text stays readable. Each card uses a different image so
// the trio carries visual variety. Form layout is flex-col + flex-1
// so the submit button anchors to the same margin from the bottom
// of each card regardless of how many fields the form has.
//
// Two body modes:
//   - cta: renders a single link button (e.g. the guestlist card now
//     sends visitors to the external Luma RSVP page instead of an
//     in-page form). When cta is set, sent/sentMessage/children are
//     ignored.
//   - form (default): wraps `children` in the /api/ours POST form,
//     with the post-submit `sent` confirmation state.
function EngagementCard({
  title,
  blurb,
  sent = false,
  sentMessage,
  bgImage,
  cta,
  children,
}: {
  title: string;
  blurb: string;
  sent?: boolean;
  sentMessage?: string;
  bgImage: string;
  cta?: { label: string; href: string; event?: string };
  children?: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border-[3px] border-ink/20 p-8 text-ink md:p-10">
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

      <h3 className="text-h5 leading-tight md:text-h4">{title}</h3>
      <p
        className="mt-3 text-body leading-relaxed text-ink/80"
        dangerouslySetInnerHTML={{ __html: blurb }}
      />
      <div className="mt-6 flex flex-1 flex-col">
        {cta ? (
          // External CTA mode — single link button pinned to the
          // bottom (mt-auto), matching where the form's Submit sits.
          <a
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer"
            data-goatcounter-click={cta.event}
            className="btn-solid mt-auto self-start"
          >
            {cta.label}
          </a>
        ) : sent ? (
          <div className="rounded-xl border border-sage/40 bg-sage-light/40 p-6">
            <p className="eyebrow text-sage">Received</p>
            <p
              className="mt-3 text-body leading-snug text-ink"
              dangerouslySetInnerHTML={{ __html: sentMessage ?? '' }}
            />
          </div>
        ) : (
          <form action="/api/ours" method="POST" className="flex flex-1 flex-col gap-4">
            <HoneypotField />
            {children}
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  id,
  name,
  label,
  type = 'text',
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-eyebrow text-ink/70">
        {label}
        {required && <span className="ml-1 text-sage">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded border border-ink/15 bg-paper px-3 py-2 text-body text-ink"
      />
    </div>
  );
}

function TextareaField({
  id,
  name,
  label,
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-eyebrow text-ink/70">
        {label}
        {required && <span className="ml-1 text-sage">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={4}
        className="mt-2 w-full resize-none rounded border border-ink/15 bg-paper px-3 py-2 text-body text-ink"
      />
    </div>
  );
}
