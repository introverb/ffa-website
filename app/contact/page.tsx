import Image from 'next/image';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach the Foundation for Future Aesthetics — pitches, partnerships, and press.',
};

export default function ContactPage() {
  return (
    <Panel variant="white" full>
      <div className="grid md:grid-cols-[1fr_480px]">
        <div className="p-8 md:p-12">
          <p className="text-sm underline decoration-from-font underline-offset-4 text-muted">
            Contact
          </p>
          <h1 className="mt-8 max-w-4xl text-h1 leading-[1.05] md:text-h1-lg">
            Get in touch.
          </h1>
          <p className="mt-10 max-w-prose text-body-lg leading-relaxed text-ink/80">
            Tell us a little about what you&rsquo;re working on. We read every message and reply
            within two weeks, usually faster.
          </p>

          <form
            action="https://formspree.io/f/your-form-id"
            method="POST"
            className="mt-10 rounded-2xl bg-cream p-8 md:p-10"
          >
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
                className="mt-3 w-full border border-rule bg-paper px-3 py-3 text-body"
              >
                <option>Pitch</option>
                <option>Research</option>
                <option>Partnership</option>
                <option>Press</option>
                <option>Something else</option>
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
                className="mt-3 w-full border border-rule bg-paper px-3 py-3 text-body"
              />
            </div>
            <button type="submit" className="btn-solid mt-8">
              Send message
            </button>
            <p className="mt-5 text-sm text-muted">
              Form posts to Formspree by default — replace the action URL with your endpoint.
            </p>
          </form>
        </div>

        <div className="relative aspect-[3/2] md:aspect-auto">
          <Image
            src="/images/contact.jpg"
            alt="Contact"
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover"
          />
        </div>
      </div>
    </Panel>
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
