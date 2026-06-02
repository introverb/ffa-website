import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import { HoneypotField } from '@/components/HoneypotField';
import { TrackSubmission } from '@/components/TrackSubmission';
import { slug } from '@/lib/analytics';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach the Foundation for Future Aesthetics: pitches, partnerships, and press.',
  alternates: { canonical: '/contact' },
  openGraph: {
    images: [{ url: '/images/contact.jpg', alt: 'Contact FFA' }],
  },
  twitter: { images: ['/images/contact.jpg'] },
};

// Each CTA across the site that lands here passes a `?topic=...` query
// param matching one of the dropdown options below. The form's defaultValue
// pre-selects that topic, so when the user submits, the Resend subject line
// (`Contact form - ${topic} from ${name}`) carries the originating CTA's
// context — e.g., "Contact form - Industrial Garden sponsorship from Olli".
const TOPICS = [
  'Partnership',
  'Private Patron',
  'Corporate Patron',
  'Possibilia editorial partnership',
  'Industrial Garden sponsorship',
  'OURS exhibition sponsorship',
  'OURS event involvement',
  'Refer a donor or foundation',
  'Pitch',
  'Open position inquiry',
  'Press',
  'Research',
  'Donor-advised fund grant',
  'Underwrite a Possibilia issue',
  'Stock or crypto donation',
  'Workplace matching',
  'Something else',
] as const;

export default function ContactPage({
  searchParams,
}: {
  searchParams: { sent?: string; topic?: string };
}) {
  const sent = searchParams?.sent === '1';
  const requestedTopic = searchParams?.topic ?? '';
  const initialTopic = (TOPICS as readonly string[]).includes(requestedTopic)
    ? requestedTopic
    : 'Partnership';
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch."
        image="/images/contact.jpg"
        flipImage
        body={
          <p>
            Tell us a little about what you&rsquo;re working on. We read every message and
            reply within two weeks, usually faster.
          </p>
        }
      />

      <Panel variant="white" full>
        <div className="grid md:grid-cols-[1fr_480px]">
          {/* order-2 on mobile pulls the image up to the top of the
              stack so visitors see the photo before the form, matching
              the rhythm of every other page on the site. md:order-1
              restores the desktop layout where the form sits in the
              left (1fr) column. */}
          <div className="order-2 p-8 md:order-1 md:p-12">
            <p className="mb-5 text-sm text-muted">
              Submitting work for Possibilia?{' '}
              <Link
                href="/possibilia-submissions"
                className="underline decoration-from-font underline-offset-4 text-ink hover:text-sage"
              >
                Use the submissions form &rarr;
              </Link>
            </p>
            {sent ? (
              <div className="rounded-2xl border border-sage/40 bg-sage-light/30 p-8 md:p-10">
                {/* Fire a GoatCounter event recording the submission +
                    its topic. The API route passes ?topic=... through
                    on redirect so we can fire a per-topic event here
                    (submit:contact:underwrite-a-possibilia-issue etc.)
                    rather than just an aggregate count. */}
                <TrackSubmission
                  eventName={
                    requestedTopic
                      ? `submit:contact:${slug(requestedTopic)}`
                      : 'submit:contact'
                  }
                />
                <p className="eyebrow text-sage">Message received</p>
                <p className="mt-3 text-h6 leading-snug text-ink">
                  Thanks, we got your note and will reply within two weeks, usually
                  faster.
                </p>
              </div>
            ) : (
              <form
                action="/api/contact"
                method="POST"
                className="rounded-2xl bg-cream p-8 md:p-10"
              >
                <HoneypotField />
                <Field id="name" label="Your name" required />
                <Field id="email" label="Email" type="email" required />
                <Field id="role" label="Role / affiliation (optional)" />
                <div className="mt-6">
                  <label
                    htmlFor="topic"
                    className="block text-sm uppercase tracking-[0.08em] text-ink/80"
                  >
                    What&rsquo;s this about?
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    required
                    defaultValue={initialTopic}
                    className="mt-3 w-full border border-rule bg-paper px-3 py-3 text-body"
                  >
                    {TOPICS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-6">
                  <label
                    htmlFor="message"
                    className="block text-sm uppercase tracking-[0.08em] text-ink/80"
                  >
                    Your message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="mt-3 w-full resize-none border border-rule bg-paper px-3 py-3 text-body"
                  />
                </div>
                <button type="submit" className="btn-solid mt-8">
                  Send message
                </button>
              </form>
            )}
          </div>

          {/* Image: order-1 on mobile so it sits on top of the stack;
              md:order-2 returns it to the right column on desktop. */}
          <div className="relative order-1 aspect-[3/2] md:order-2 md:aspect-auto">
            <Image
              src="/images/contact.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
            />
          </div>
        </div>
      </Panel>
    </>
  );
}

function Field({
  id,
  label,
  type = 'text',
  required = false,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="mt-6 first:mt-0">
      <label htmlFor={id} className="block text-sm uppercase tracking-[0.08em] text-ink/80">
        {label}
        {required && <span className="ml-1 text-sage">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="mt-3 w-full border border-rule bg-paper px-3 py-3 text-body"
      />
    </div>
  );
}
