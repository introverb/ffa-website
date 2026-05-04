import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach the Foundation for Future Aesthetics — pitches, partnerships, and press.',
};

const REASONS = [
  { label: 'Pitch a story or artwork', body: 'Editors review pitches for fiction, essays, illustration, and photography for Possibilia.' },
  { label: 'Research collaboration', body: 'Working on something adjacent to our research areas? We’d like to hear about it.' },
  { label: 'Partnerships & press', body: 'Sponsorships, programs, and inquiries from journalists.' },
];

export default function ContactPage() {
  return (
    <>
      <Panel variant="white" className="md:p-20">
        <p className="text-sm underline decoration-from-font underline-offset-4 text-muted">Contact</p>
        <h1 className="mt-8 max-w-4xl text-h1 leading-[1.05] md:text-h1-lg">Get in touch.</h1>
        <p className="mt-10 max-w-prose text-body-lg leading-relaxed text-ink/80">
          Tell us a little about what you&rsquo;re working on. We read every message and reply
          within two weeks, usually faster.
        </p>
      </Panel>

      <Panel variant="white" className="md:p-16">
        <div className="grid gap-16 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-h4">Why are you writing?</h2>
            <ul className="mt-8 space-y-6">
              {REASONS.map((r) => (
                <li key={r.label} className="border-t border-rule pt-5">
                  <p className="text-sm uppercase tracking-[0.08em] text-sage">{r.label}</p>
                  <p className="mt-3 text-body leading-relaxed text-ink/80">{r.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <form
            action="https://formspree.io/f/your-form-id"
            method="POST"
            className="bg-cream rounded-2xl p-10 md:p-12"
          >
            <Field id="name" label="Your name" required />
            <Field id="email" label="Email" type="email" required />
            <Field id="role" label="Role / affiliation (optional)" />
            <div className="mt-6">
              <label htmlFor="topic" className="block text-sm uppercase tracking-[0.08em] text-ink/80">
                What&rsquo;s this about?
              </label>
              <select id="topic" name="topic" className="mt-3 w-full border border-rule bg-paper px-3 py-3 text-body">
                <option>Pitch</option>
                <option>Research</option>
                <option>Partnership</option>
                <option>Press</option>
                <option>Something else</option>
              </select>
            </div>
            <div className="mt-6">
              <label htmlFor="message" className="block text-sm uppercase tracking-[0.08em] text-ink/80">Your message</label>
              <textarea id="message" name="message" rows={6} required className="mt-3 w-full border border-rule bg-paper px-3 py-3 text-body" />
            </div>
            <button type="submit" className="mt-8 btn-solid">Send message</button>
            <p className="mt-5 text-sm text-muted">
              Form posts to Formspree by default — replace the action URL with your endpoint.
            </p>
          </form>
        </div>
      </Panel>
    </>
  );
}

function Field({ id, label, type = 'text', required = false }: { id: string; label: string; type?: string; required?: boolean }) {
  return (
    <div className="mt-6 first:mt-0">
      <label htmlFor={id} className="block text-sm uppercase tracking-[0.08em] text-ink/80">
        {label}
        {required && <span className="ml-1 text-sage">*</span>}
      </label>
      <input id={id} name={id} type={type} required={required} className="mt-3 w-full border border-rule bg-paper px-3 py-3 text-body" />
    </div>
  );
}
