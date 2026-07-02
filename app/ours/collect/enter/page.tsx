import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';

export const metadata: Metadata = {
  title: 'Private',
  robots: { index: false, follow: false },
};

export default function OursCollectEnterPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  const next =
    searchParams?.next && searchParams.next.startsWith('/ours/collect')
      ? searchParams.next
      : '/ours/collect';
  // No STOREFRONT_PASSWORD configured doubles as the takedown state —
  // see lib/storefront-auth.ts. Nothing to enter; nothing to see.
  const enabled = !!process.env.STOREFRONT_PASSWORD;

  return (
    <Panel variant="white" className="mx-auto max-w-lg md:p-16">
      <p className="text-sm uppercase tracking-[0.08em] text-sage">OURS</p>
      {enabled ? (
        <>
          <h1 className="mt-6 text-h3 leading-tight md:text-h2">This page is private.</h1>
          <p className="mt-5 text-body leading-relaxed text-ink/80">
            Enter the password to view and collect artwork from OURS.
          </p>
          {searchParams?.error && (
            <p className="mt-4 text-sm text-flare">That password didn&rsquo;t match. Try again.</p>
          )}
          <form
            method="POST"
            action="/api/storefront-auth"
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <input type="hidden" name="next" value={next} />
            <input
              type="password"
              name="password"
              required
              autoFocus
              placeholder="Password"
              className="flex-1 rounded-md border border-ink/20 bg-paper px-4 py-3 text-body text-ink placeholder:text-muted focus:border-sage focus:outline-none"
            />
            <button type="submit" className="btn-solid">
              Enter
            </button>
          </form>
        </>
      ) : (
        <>
          <h1 className="mt-6 text-h3 leading-tight md:text-h2">This page isn&rsquo;t available.</h1>
          <p className="mt-5 text-body leading-relaxed text-ink/80">
            Check back soon, or reach out via the contact page.
          </p>
        </>
      )}
    </Panel>
  );
}
