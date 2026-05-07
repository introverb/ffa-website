import type { Metadata } from 'next';
import Image from 'next/image';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import { OursInvolvementDialog } from '@/components/OursInvolvementDialog';

export const metadata: Metadata = {
  title: 'OURS',
  description:
    'OURS is an exhibition and salon evening for visions of the future, presented by the Foundation for Future Aesthetics in New York City, August 2026.',
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
    body: 'SOMMWHERE\nNew York City\nAugust 2026',
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
              also being made elsewhere (in studios, labs, and workshops) by people
              refusing what&rsquo;s simply handed to them, and instead exercising the
              agency to build what comes next. Those are the people we want to be.
            </p>
            <p className="mt-5">
              OURS is where we gather for an evening to both observe and BE a showcase of
              positive visions of the future (in art, in words, by people acting on
              their own visions), and a room to share ideas, build out a perspective,
              and think about how each of us shapes what comes.
            </p>
          </div>
        </div>

        {/* Format */}
        <div className="mt-20 border-t border-rule pt-16">
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

        {/* Engage */}
        <div id="engage" className="mt-20 border-t border-rule pt-16">
          <p className="text-sm uppercase tracking-[0.08em] text-sage">Engage</p>
          <h2 className="mt-6 max-w-3xl text-h2 leading-[1.05] md:text-h2-lg">
            Take part in crafting tomorrow.
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            <EngagementCard
              title="Sign up for the guestlist"
              blurb="The room is intimate; the list is limited but we&rsquo;re still welcoming more guests."
              sent={sent === 'guestlist'}
              sentMessage="Thanks, you&rsquo;re on the radar. We&rsquo;ll reach back when invitations go out."
              bgImage="/images/initiative-exhibitions.jpg"
            >
              <input type="hidden" name="type" value="guestlist" />
              <Field id="g-name" name="name" label="Your name" required />
              <Field id="g-email" name="email" type="email" label="Email" required />
              <Field id="g-city" name="city" label="City (optional)" />
              <TextareaField
                id="g-why"
                name="why"
                label="What draws you to this?"
                required
              />
              <Submit label="Request an invite" />
            </EngagementCard>

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
              <Submit label="Submit work" />
            </EngagementCard>

            {/* Editorial image filling the third grid slot — same panel
                size and aspect as the form cards on its left. No frosted
                glass over the image itself, just a frosted-pill CTA
                anchored to the bottom for visitors who want to engage
                outside the two structured forms (speaking, funding,
                other contributions). */}
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/images/discovery.jpg"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              {/* Pop-up form for visitors interested in speaking,
                  funding, or otherwise contributing — bypasses the
                  contact-form page so the trigger and submission live
                  in one place. */}
              <OursInvolvementDialog />
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
function EngagementCard({
  title,
  blurb,
  sent,
  sentMessage,
  bgImage,
  children,
}: {
  title: string;
  blurb: string;
  sent: boolean;
  sentMessage: string;
  bgImage: string;
  children: React.ReactNode;
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
        {sent ? (
          <div className="rounded-xl border border-sage/40 bg-sage-light/40 p-6">
            <p className="eyebrow text-sage">Received</p>
            <p
              className="mt-3 text-body leading-snug text-ink"
              dangerouslySetInnerHTML={{ __html: sentMessage }}
            />
          </div>
        ) : (
          <form action="/api/ours" method="POST" className="flex flex-1 flex-col gap-4">
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

function Submit({ label }: { label: string }) {
  return (
    <button type="submit" className="btn-solid mt-auto self-start">
      {label}
    </button>
  );
}
