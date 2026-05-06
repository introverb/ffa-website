import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'OURS',
  description:
    'OURS is an exhibition and salon evening for visions of the future, presented by the Foundation for Future Aesthetics in New York City, August 2026.',
};

const FORMAT = [
  { label: '3–5 speakers', body: '15–30 minute provocations — open questions, not finished arguments.' },
  { label: '5–10 works of art', body: 'Original pieces from a curated roster of artists across mediums and aesthetics.' },
  { label: '40–60 guests', body: 'Drinks, mingling, and unhurried conversation in the spaces between.' },
  { label: 'New York City', body: 'August 2026 · SOMMWHERE, NYC.' },
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
            An evening for the artists, scientists, writers, and builders who believe what
            comes next is ours to draw.
          </p>
        }
      />

      <Panel variant="white" className="md:p-16">
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Why now</p>
            <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
              The future isn&rsquo;t fixed.
            </h2>
          </div>
          <div className="text-body-lg leading-relaxed text-ink/85">
            <p>
              The futures handed to us are increasingly narrow — shaped behind closed doors,
              trained into our imaginations, and quietly told back to us as the only way
              things could be.
            </p>
            <p className="mt-5">
              OURS is a refusal of that, and an invitation. An evening where the people
              doing the work of imagining otherwise gather in one room: artists making the
              images, scientists doing the research, writers shaping the narratives, builders
              putting structure to the rest. The conviction is simple — the future is ours to
              draw, and the people best positioned to draw it should be drawing it together.
            </p>
          </div>
        </div>
      </Panel>

      <Panel variant="dark" className="md:p-16">
        <p className="eyebrow text-white/70">The format</p>
        <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
          An intimate evening, end to end.
        </h2>
        <ul className="mt-12 grid gap-12 text-body leading-relaxed text-white/80 md:grid-cols-2 lg:grid-cols-4">
          {FORMAT.map((f) => (
            <li key={f.label}>
              <p className="text-sm uppercase tracking-[0.08em] text-sage-light">{f.label}</p>
              <p className="mt-4">{f.body}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel id="engage" variant="white" className="md:p-16">
        <p className="text-sm uppercase tracking-[0.08em] text-sage">Engage</p>
        <h2 className="mt-6 max-w-3xl text-h2 leading-[1.05] md:text-h2-lg">
          Three ways into the room.
        </h2>
        <p className="mt-6 max-w-prose text-body-lg leading-relaxed text-ink/80">
          The guestlist, the exhibition, and the speaker lineup are still being curated.
          Tell us where you fit and we&rsquo;ll be in touch.
        </p>

        <div className="mt-14 space-y-14">
          <EngagementSection
            title="Sign up for the guestlist"
            blurb="The room is intimate; the list is closed but accepting requests. Tell us a bit about yourself and we&rsquo;ll get back when invitations go out."
            sent={sent === 'guestlist'}
            sentMessage="Thanks — you&rsquo;re on the radar. We&rsquo;ll reach back when invitations go out."
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
          </EngagementSection>

          <EngagementSection
            title="Submit artwork for exhibition"
            blurb="Five open slots in the exhibition. Mediums open. Send a portfolio and a short pitch and we&rsquo;ll review."
            sent={sent === 'artwork'}
            sentMessage="Thanks — we&rsquo;ve got your submission and will reach back as we curate."
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
              label="Pitch — what would you bring?"
              required
            />
            <Submit label="Submit work" />
          </EngagementSection>

          <EngagementSection
            title="Recommend a speaker"
            blurb="We&rsquo;re still building the lineup. If someone you know belongs in this room offering a 15–30 minute provocation, we&rsquo;d love to hear about them."
            sent={sent === 'speaker'}
            sentMessage="Thanks — we&rsquo;ll consider your recommendation and follow up if we want to know more."
          >
            <input type="hidden" name="type" value="speaker" />
            <Field id="s-yourname" name="your_name" label="Your name" required />
            <Field
              id="s-youremail"
              name="your_email"
              type="email"
              label="Your email"
              required
            />
            <Field
              id="s-speakername"
              name="speaker_name"
              label="Who are you recommending?"
              required
            />
            <Field
              id="s-speakercontact"
              name="speaker_contact"
              label="How to reach them (optional)"
            />
            <TextareaField
              id="s-why"
              name="why"
              label="Why this person?"
              required
            />
            <Submit label="Send recommendation" />
          </EngagementSection>
        </div>
      </Panel>

    </>
  );
}

// Section subheader + blurb in white-panel context, then the form lives
// in a black-box submission card beneath. Form labels are white on dark;
// inputs stay white-bg with dark text for legibility.
function EngagementSection({
  title,
  blurb,
  sent,
  sentMessage,
  children,
}: {
  title: string;
  blurb: string;
  sent: boolean;
  sentMessage: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-h4 leading-tight">{title}</h3>
      <p
        className="mt-3 max-w-prose text-body leading-relaxed text-muted"
        dangerouslySetInnerHTML={{ __html: blurb }}
      />
      <div className="mt-6 rounded-2xl bg-dark p-8 text-white md:p-10">
        {sent ? (
          <div>
            <p className="eyebrow text-sage-light">Received</p>
            <p
              className="mt-3 text-body leading-snug text-white"
              dangerouslySetInnerHTML={{ __html: sentMessage }}
            />
          </div>
        ) : (
          <form action="/api/ours" method="POST" className="flex flex-col gap-4">
            {children}
          </form>
        )}
      </div>
    </section>
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
      <label htmlFor={id} className="block text-eyebrow text-white/80">
        {label}
        {required && <span className="ml-1 text-sage-light">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded border border-white/20 bg-paper px-3 py-2 text-body text-ink"
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
      <label htmlFor={id} className="block text-eyebrow text-white/80">
        {label}
        {required && <span className="ml-1 text-sage-light">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={4}
        className="mt-2 w-full rounded border border-white/20 bg-paper px-3 py-2 text-body text-ink"
      />
    </div>
  );
}

function Submit({ label }: { label: string }) {
  return (
    <button type="submit" className="btn-solid mt-2 self-start">
      {label}
    </button>
  );
}
