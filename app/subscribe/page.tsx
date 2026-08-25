import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { SubscribeForm } from '@/components/SubscribeForm';

// One-job page for mailing-list blasts (the OURS Luma list, printed
// QRs, link-in-bio): a single email field, nothing else asked. The
// blast audience already knows who we are — the page just has to not
// get in the way. Tracked separately from the footer and /support
// forms so each placement's conversions stay legible.
export const metadata: Metadata = {
  title: 'Subscribe',
  description:
    'Join the Foundation for Future Aesthetics mailing list — public events, openings, and updates.',
  alternates: { canonical: '/subscribe' },
};

export default function SubscribePage() {
  return (
    <Panel variant="white" className="md:p-16">
      <div className="mx-auto max-w-xl py-10 text-center md:py-20">
        <p className="text-sm uppercase tracking-[0.08em] text-flare">Mailing list</p>
        <h1 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">Stay close.</h1>
        <p className="mt-6 text-body-lg leading-relaxed text-ink/80">
          Public events, openings, and updates from the Foundation for Future
          Aesthetics.
        </p>
        <div className="mx-auto mt-10 max-w-md text-left">
          <SubscribeForm
            variant="light"
            label="Your email"
            eventName="subscribe:subscribe-page"
          />
        </div>
      </div>
    </Panel>
  );
}
