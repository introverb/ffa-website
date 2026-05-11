import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import { EthGiveButton } from '@/components/EthGiveButton';
import { OursSponsorshipDialog } from '@/components/OursSponsorshipDialog';

export const metadata: Metadata = {
  title: 'Support',
  description:
    'Support the Foundation for Future Aesthetics, a 501(c)(3) nonprofit. Give, partner, or open a door for us. All gifts and sponsorships are tax-deductible.',
};

// Re-render every 10 minutes so the ETH/USD spot price stays fresh
// without hammering CoinGecko's free-tier rate limit. The actual
// on-chain amount is computed at click time anyway — the displayed
// figure is only a sized suggestion.
export const revalidate = 600;

async function getEthPriceUsd(): Promise<number | null> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      { next: { revalidate: 600 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { ethereum?: { usd?: number } };
    const price = data?.ethereum?.usd;
    return typeof price === 'number' && price > 0 ? price : null;
  } catch {
    return null;
  }
}

const TIERS = [
  {
    name: 'Patron',
    amount: '$500',
    usd: 500,
    blurb:
      "Fund one contributor in an upcoming Possibilia issue — a writer, illustrator, or essayist’s honorarium for their work.",
  },
  {
    name: 'Editorial Sponsor',
    amount: '$2,500',
    usd: 2500,
    blurb:
      'A full editorial package — story, artwork, and companion essay — commissioned around the vision behind your lab, company, or initiative.',
  },
  {
    name: 'Presenting Sponsor',
    amount: '$5,000',
    usd: 5000,
    blurb:
      'Sponsor a single FFA program — an event, exhibition, or special feature — with named recognition.',
  },
];

// FFA's on-chain donation wallet, duplicated here (also defined in
// EthGiveButton.tsx) for the streaming-protocol links below. A small
// duplication trade-off vs. introducing a shared constants file for
// one short hex string.
const FFA_ETH_ADDRESS = '0x54ce4Cf841ef47ed0773B0c197aceFCFc076cec7';

type OtherWay = {
  label: string;
  body: React.ReactNode;
};

const OTHER_WAYS: OtherWay[] = [
  {
    label: 'Donor-advised funds',
    body: 'We accept grants from DAFs at Fidelity Charitable, Schwab, Vanguard, and other sponsoring organizations. Use our EIN to recommend a grant.',
  },
  {
    label: 'Stock & crypto',
    body: (
      <>
        Gifts of appreciated stock or cryptocurrency are often more
        tax-efficient than cash. On-chain givers can also stream continuous
        gifts via{' '}
        <a
          href="https://app.sablier.com/create"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-from-font underline-offset-4 text-ink hover:text-sage"
        >
          Sablier
        </a>{' '}
        or{' '}
        <a
          href={`https://app.superfluid.finance/send?recipient=${FFA_ETH_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-from-font underline-offset-4 text-ink hover:text-sage"
        >
          Superfluid
        </a>
        . Reach out for transfer instructions.
      </>
    ),
  },
  {
    label: 'Workplace matching',
    body: 'Many employers match employee gifts to 501(c)(3)s, often 1:1 or 2:1. We qualify on the major matching platforms (Benevity, YourCause, Bright Funds), so a few minutes on your company portal can double or triple your contribution.',
  },
];

export default async function SupportPage() {
  const ethPriceUsd = await getEthPriceUsd();
  return (
    <>
      <PageHeader
        eyebrow="Support"
        title={<>Build the future with us.</>}
        image="/images/mission.jpg"
        body={
          <p>
            The Foundation for Future Aesthetics is a 501(c)(3) nonprofit. Give,
            partner with us, or open a door — every path is tax-deductible.
          </p>
        }
      />

      {/* Give + Other Ways — split card. Left half is the conversion
          path (two buttons, any amount). Right half is the supporting
          "btw, here are tax-savvier vehicles" info (DAFs, stock,
          matching). 3px vertical divider on desktop reads as a clear
          separation between the two halves; on mobile the columns stack
          and the divider disappears. Sits first on the page as the
          easiest, most universally accessible path — the partner /
          refer / catch-all sections below taper into bigger or more
          specialized asks. */}
      <Panel id="give" variant="white" full className="overflow-hidden">
        <div className="grid md:grid-cols-2 md:divide-x-[3px] md:divide-ink/20">
          {/* Left half — Give. Primary CTA path. Flex column so the
              buttons sink to the bottom even when the right column is
              taller (3 items + footnote), keeping the two halves
              visually balanced. */}
          <div className="flex flex-col p-8 md:p-14">
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Give</p>
            <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
              Make a gift in any amount.
            </h2>
            <p className="mt-6 text-body-lg leading-relaxed text-ink/80">
              Fast, no-strings, tax-deductible. Pick a path; set your amount
              on the next screen.
            </p>
            <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row">
              <a
                href="https://www.every.org/foundation-for-future-aesthetics/donate"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl bg-sage px-6 py-4 text-sm uppercase tracking-[0.1em] text-white transition-colors hover:bg-dark"
              >
                Give in USD
              </a>
              <EthGiveButton label="Give in ETH" />
            </div>
          </div>

          {/* Right half — Other ways. Definition-list rhythm: bold
              ink label + body. Quieter than sage-eyebrow per-item
              labels so the section's own "Other ways" eyebrow stays
              the dominant marker on this side. */}
          <div className="flex flex-col p-8 md:p-14">
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Other ways</p>
            <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
              Or give another way.
            </h2>
            <ul className="mt-8 space-y-6 text-body leading-relaxed text-ink/80">
              {OTHER_WAYS.map((w) => (
                <li key={w.label}>
                  <p className="font-medium text-ink">{w.label}</p>
                  <p className="mt-1.5">{w.body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-8 text-sm text-muted">
              For any of these, start with a note via{' '}
              <Link
                href="/contact"
                className="underline decoration-from-font underline-offset-4 text-ink hover:text-sage"
              >
                our contact form
              </Link>{' '}
              and we&rsquo;ll route you to the right place.
            </p>
          </div>
        </div>
      </Panel>

      {/* Partner — named sponsorships, in priority of velocity:
          (1) Tier grid is the fast-pay path: click → every.org with
              the tier amount already pre-filled.
          (2) Issue underwriter callout is the slow-conversation path
              for the $20k full-issue commitment.
          (3) In-development sponsorships (OURS, Industrial Garden)
              are named initiatives whose sponsorship offerings are
              still being finalized — they route through dedicated
              dialogs / contact flows. */}
      <Panel id="partner" variant="white" className="md:p-16">
        <p className="text-sm uppercase tracking-[0.08em] text-sage">Partner</p>
        <h2 className="mt-6 max-w-4xl text-h2 leading-[1.05] md:text-h2-lg">
          Fund a more optimistic future.
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {TIERS.map((t) => {
            const isPlus = t.amount.endsWith('+');
            const ethLabel = ethPriceUsd
              ? `Give ${(t.usd / ethPriceUsd).toFixed(2)}${isPlus ? '+' : ''} ETH`
              : 'Give in ETH';
            return (
              <div
                key={t.name}
                className="flex flex-col justify-between rounded-2xl bg-cream p-6 md:p-10"
              >
                <div>
                  <p className="text-sm uppercase tracking-[0.08em] text-sage">{t.name}</p>
                  <p className="mt-5 text-h2 md:text-h2-lg">{t.amount}</p>
                  <p className="mt-5 text-body leading-relaxed text-ink/80">{t.blurb}</p>
                </div>
                <div className="mt-8 flex flex-nowrap gap-2">
                  <a
                    href={`https://www.every.org/foundation-for-future-aesthetics/donate?amount=${t.usd}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-xl bg-sage px-3 py-3 text-xs uppercase tracking-[0.08em] text-white transition-colors hover:bg-dark"
                  >
                    Give {t.amount.replace('+', '')}
                  </a>
                  <EthGiveButton label={ethLabel} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-sm text-muted">All tiers include recognition.</p>

        {/* Issue-underwriter callout — bordered card with no fill
            distinguishes it from the solid cream tier cards above:
            "different kind of offer" (a relationship) rather than a
            fourth tier (a click). Lead with the dollar figure so the
            commitment is explicit. */}
        <div className="mt-12 rounded-2xl border border-ink/15 p-6 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="md:max-w-2xl">
              <p className="text-sm uppercase tracking-[0.08em] text-sage">
                Underwrite an issue
              </p>
              <p className="mt-5 text-h2 leading-[1.05] md:text-h2-lg">
                $20,000 funds a complete issue of Possibilia.
              </p>
              <p className="mt-5 text-body leading-relaxed text-ink/80">
                Story, artwork, companion essays, print, and distribution. If
                you&rsquo;re interested in underwriting a full issue, we&rsquo;d
                love to start a conversation.
              </p>
            </div>
            <Link
              href="/contact?topic=Underwrite a Possibilia issue"
              className="btn-solid shrink-0"
            >
              Start the conversation
            </Link>
          </div>
        </div>

        {/* Named initiatives — OURS and Industrial Garden — folded in
            from the old /partnerships page. Sponsorship offerings are
            still in development for both, so each routes through its
            own conversation flow (OursSponsorshipDialog for OURS,
            contact form for Industrial Garden) rather than a one-click
            donate button. */}
        <div className="mt-16">
          <p className="text-sm uppercase tracking-[0.08em] text-sage">
            Named initiatives
          </p>
          <h3 className="mt-6 text-h3 leading-tight md:text-h3-lg">
            Sponsor a specific program.
          </h3>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="flex flex-col rounded-2xl bg-cream p-10 md:p-12">
              <p className="text-sm uppercase tracking-[0.08em] text-sage">
                Sponsorship, in development
              </p>
              <h4 className="mt-6 text-h3 leading-tight md:text-h3-lg">
                The OURS exhibition.
              </h4>
              <p className="mt-6 text-body leading-relaxed text-ink/80">
                OURS pairs speculative artwork with the science and engineering
                that could bring it into being — a curated, traveling show.
                We&rsquo;re opening sponsorship for the inaugural run.
              </p>
              <div className="mt-auto flex flex-wrap gap-3 pt-8">
                <Link href="/ours" className="btn">
                  Event details
                </Link>
                <OursSponsorshipDialog />
              </div>
            </div>

            <div className="flex flex-col rounded-2xl bg-cream p-10 md:p-12">
              <p className="text-sm uppercase tracking-[0.08em] text-sage">
                Sponsorship, in development
              </p>
              <h4 className="mt-6 text-h3 leading-tight md:text-h3-lg">
                The Industrial Garden.
              </h4>
              <p className="mt-6 text-body leading-relaxed text-ink/80">
                Industrial Garden is the foundation&rsquo;s proposed maker space
                in New York City — a community workspace and a self-sustaining
                model for small creators and hard-tech founders. Sponsorship
                opens as we move from proposal to exhibit.
              </p>
              <div className="mt-auto pt-8">
                <Link
                  href="/contact?topic=Industrial Garden sponsorship"
                  className="btn"
                >
                  Request a brief
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* Refer Us — high-leverage ask for the connector class of
          visitor (board members, advisors, friends-of-FFA who know
          someone). Page now reads: Give → Partner → Refer →
          catch-all, so Refer sits late after the money paths have
          had their say. */}
      <Panel id="refer" variant="white" className="md:p-16">
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Refer us</p>
            <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
              Open a door for us.
            </h2>
          </div>
          <div className="flex flex-col text-body-lg leading-relaxed text-ink/85">
            <p>
              If you sit on a foundation board, advise a grant program, or have ties to a
              donor, fund, or competition that supports the arts, science writing, or
              future-oriented media, we&rsquo;d love an introduction. We&rsquo;re a
              501(c)(3) actively building the grant pipeline for Possibilia, the OURS
              exhibition, and the Industrial Garden initiative.
            </p>
            <p className="mt-5">
              We can prepare a tailored brief for your contact within a week. Send a name,
              an email, and a sentence about why you think it&rsquo;s a fit.
            </p>
            <div className="mt-auto pt-10">
              <Link
                href="/contact?topic=Refer a donor or foundation"
                className="btn-solid"
              >
                Make an introduction
              </Link>
            </div>
          </div>
        </div>
      </Panel>

      {/* Catch-all soft off-ramp — folded in from the old /partnerships
          page. Gentle invitation for visitors whose shape didn't fit
          into Partner / Refer / Give. Dark variant breaks the run of
          white panels and signals "different register of conversation." */}
      <Panel variant="dark" className="md:p-16">
        <h2 className="text-h2 leading-[1.05] md:text-h2-lg">Not sure where you fit?</h2>
        <p className="mt-6 max-w-prose text-body-lg leading-relaxed text-white/85">
          Tell us about your project and what you&rsquo;re trying to get out into the
          world. We&rsquo;ll come back with the shape that fits, or the honest answer
          that we&rsquo;re not the right home for it.
        </p>
        <Link
          href="/contact?topic=Partnership"
          className="btn-solid mt-10 inline-block"
        >
          Send a note
        </Link>
      </Panel>
    </>
  );
}
