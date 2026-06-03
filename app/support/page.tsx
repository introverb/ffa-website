import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import { EthGiveButton } from '@/components/EthGiveButton';
import { OursSponsorshipDialog } from '@/components/OursSponsorshipDialog';
import { DafGrantDialog } from '@/components/DafGrantDialog';
import { ScrollDepthMarker } from '@/components/ScrollDepthMarker';

export const metadata: Metadata = {
  title: 'Support',
  description:
    'Support the Foundation for Future Aesthetics, a 501(c)(3) nonprofit. Give, partner, or open a door for us. All gifts and sponsorships are tax-deductible.',
  alternates: { canonical: '/support' },
  openGraph: {
    images: [{ url: '/images/mission.jpg', alt: 'Support FFA' }],
  },
  twitter: { images: ['/images/mission.jpg'] },
};

// Patronage paths — the two ways an individual or company can become
// a patron of the foundation itself (not a project sponsor). Each card
// links to its standalone brief in /public (rewritten at /patrons/...)
// rather than a one-click donate, because the patron relationship
// starts with a conversation, not a checkout.
const PATRONAGE = [
  {
    name: 'Private Patron',
    slug: 'private-patron',
    amount: 'From $1,000',
    blurb:
      'For individuals backing the foundation at the start. The founding circle closes August 9, the night of OURS.',
    href: '/patrons/private',
  },
  {
    name: 'Corporate Patron',
    slug: 'corporate-patron',
    amount: 'From $5,000',
    blurb:
      'For companies building toward a future worth wanting. Founding position is named, permanent, and only open once.',
    href: '/patrons/corporate',
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
    body: (
      <>
        We accept grants from DAFs at Fidelity Charitable, Schwab, Vanguard,
        and other sponsoring organizations.{' '}
        <DafGrantDialog>Open our grant info</DafGrantDialog> to recommend a
        grant.
      </>
    ),
  },
  {
    label: 'Stock & crypto',
    body: (
      <>
        Appreciated stock and cryptocurrency are often more tax-efficient
        than cash. Send stock via{' '}
        <a
          href="https://www.every.org/foundation-for-future-aesthetics/donate?paymentMethod=stocks"
          target="_blank"
          rel="noopener noreferrer"
          data-goatcounter-click="outbound:every-org-stocks"
          className="underline decoration-from-font underline-offset-4 text-ink hover:text-sage"
        >
          every.org
        </a>
        , or set up a continuous on-chain stream via{' '}
        <a
          href="https://app.sablier.com/create"
          target="_blank"
          rel="noopener noreferrer"
          data-goatcounter-click="outbound:sablier-otherways"
          className="underline decoration-from-font underline-offset-4 text-ink hover:text-sage"
        >
          Sablier
        </a>{' '}
        or{' '}
        <a
          href={`https://app.superfluid.finance/send?recipient=${FFA_ETH_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          data-goatcounter-click="outbound:superfluid-otherways"
          className="underline decoration-from-font underline-offset-4 text-ink hover:text-sage"
        >
          Superfluid
        </a>
        .
      </>
    ),
  },
  {
    label: 'Workplace matching',
    body: 'Many employers match employee gifts to 501(c)(3)s, often 1:1 or 2:1. We qualify on the major matching platforms (Benevity, YourCause, Bright Funds), so a few minutes on your company portal can double or triple your contribution.',
  },
];

export default function SupportPage() {
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

      {/* Patronage — the two patron paths (Private / Corporate). Each
          card links to its standalone brief in /public; the patron
          relationship starts with a conversation, not a checkout, so
          the card CTAs route to the brief rather than every.org.
          Below the cards, the issue-underwriter callout (slow-
          conversation $20k commitment) and the named-initiative
          sponsorships (OURS, Industrial Garden) continue to live in
          this panel — they are the other shapes of partner support
          beyond patronage proper. id="partner" retained so any
          inbound anchor links from elsewhere on the site still land
          here.
          Leads the page (above the Give / Refer / Other-ways donor-
          action panel) because patronage is the foundation-defining
          relationship offer — the rest of the page is funded by it,
          so the patron paths get first read. */}
      <Panel id="partner" variant="white" className="md:p-16">
        <ScrollDepthMarker eventName="scroll:support:partner-visible" />
        <p className="text-sm uppercase tracking-[0.08em] text-sage">Patronage</p>
        <h2 className="mt-6 max-w-4xl text-h2 leading-[1.05] md:text-h2-lg">
          Fund a more optimistic future.
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {PATRONAGE.map((p) => (
            <div
              key={p.name}
              className="flex flex-col justify-between rounded-2xl bg-cream p-6 md:p-10"
            >
              <div>
                <p className="text-sm uppercase tracking-[0.08em] text-sage">{p.name}</p>
                <p className="mt-5 text-h2 md:text-h2-lg">{p.amount}</p>
                <p className="mt-5 text-body leading-relaxed text-ink/80">{p.blurb}</p>
              </div>
              <div className="mt-8">
                {/* Opens in a new tab — the brief is a standalone
                    shareable document (its own typography, full
                    print styles, no SiteNav around it), so popping
                    a new tab keeps the visitor's place on /support
                    when they close the brief. Same pattern as the
                    OURS sponsorship-brief link further down. */}
                <Link
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-goatcounter-click={`patron:${p.slug}-brief`}
                  className="btn-solid"
                >
                  View the brief
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Issue-underwriter callout — bordered card with no fill
            distinguishes it from the solid cream tier cards above:
            "different kind of offer" (a relationship) rather than a
            fourth tier (a click). Lead with the dollar figure so the
            commitment is explicit. */}
        <div className="mt-12 rounded-2xl border-[3px] border-ink/20 p-6 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="md:max-w-2xl">
              <p className="text-sm uppercase tracking-[0.08em] text-sage">
                Fund your vision
              </p>
              <p className="mt-5 text-h2 leading-[1.05] md:text-h2-lg">
                Underwrite a complete issue of Possibilia Magazine.
              </p>
              <p className="mt-5 text-body leading-relaxed text-ink/80">
                Pick the futures you want to see come to life. Choose the
                concepts for ten short stories, the scientific fields and
                technological innovations to explore, and the direction of the
                artwork commissioned around them. If you&rsquo;d like to
                underwrite a full issue, we&rsquo;d love to start a conversation.
              </p>
            </div>
            <Link
              href="/contact?topic=Underwrite a Possibilia issue"
              data-goatcounter-click="partner:issue-underwriter"
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
              <div className="mt-auto pt-8">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/ours"
                    data-goatcounter-click="partner:ours-details"
                    className="btn"
                  >
                    Event details
                  </Link>
                  <OursSponsorshipDialog />
                </div>
                {/* Secondary link to the full sponsorship brief — a
                    self-contained marketing document with tiers,
                    artists, and contact info. Lives at /ours/sponsor-brief
                    (static HTML in /public surfaced via next.config
                    rewrite). Opens in a new tab so the visitor doesn't
                    lose their place on /support. */}
                <a
                  href="/ours/sponsor-brief"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-goatcounter-click="partner:ours-brief"
                  className="mt-4 inline-block text-sm underline decoration-from-font underline-offset-4 text-ink/70 hover:text-sage"
                >
                  View the sponsorship brief &rarr;
                </a>
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
                  data-goatcounter-click="partner:industrial-garden"
                  className="btn"
                >
                  Request a brief
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* Donor-action panel — three sections in one card. Top row is
          the Give | Other Ways vertical split (conversion path on the
          left, tax-savvier vehicles on the right). Below the row, a
          full-width Refer Us section for connectors who can introduce
          us to a donor or fund. All three are the actions a sympathetic
          visitor can take from this page; consolidating them keeps the
          donor-paths in one panel. Sits between the Patronage lead
          panel above and the "Not sure where you fit?" catch-all
          below — donor-paths in the middle so the relationship-shaped
          patron offer leads, the broad give/refer mechanics follow,
          and the soft off-ramp closes.
          3px dividers — vertical between Give / Other Ways on desktop,
          horizontal under the row before Refer — match the stroke of
          the rest of the site's decorative hairlines. */}
      <Panel id="give" variant="white" full className="overflow-hidden">
        <div className="grid md:grid-cols-2 md:divide-x-[3px] md:divide-ink/20">
          {/* Left half — Give. Primary CTA path. Flex column so the
              buttons sink to the bottom even when the right column is
              taller (3 items + footnote), keeping the two halves
              visually balanced. */}
          <div className="flex flex-col p-8 md:p-14">
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Give</p>
            <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
              Every gift welcome.
            </h2>
            {/* Body shifted from sales-pitch ("fast, no-strings,
                tax-deductible") to FFA's three-role philosophy +
                stewardship close.
                First paragraph: artists imagine, scientists discover,
                technologists build — three distinct roles, each
                carrying a piece of "a future worth having." Names the
                current misalignment (art toward dystopia, tech toward
                power, science toward whatever's fundable), then
                positions FFA as the corrective: funding the version
                where all three pull together, aligned toward human
                flourishing.
                Second paragraph: today's flagship initiatives named
                concretely + the granting-program ambition for all
                three groups + personal-note close instead of
                transactional thanks. */}
            <div className="mt-6 space-y-4 text-body-lg leading-relaxed text-ink/80">
              <p>
                Artists imagine a future worth having. Scientists
                discover how it&rsquo;s possible. Technologists build
                the pieces. Right now those three pull in different
                directions — art toward dystopia, tech toward power,
                science toward whatever&rsquo;s fundable. FFA funds the
                version where they pull together, aligned toward human
                flourishing.
              </p>
              <p>
                <strong>Today:</strong> Possibilia stories, OURS
                exhibitions, the Industrial Garden initiative.{' '}
                <strong>Next:</strong> granting programs for the
                artists, scientists, and technologists building futures
                of their own. Every gift, no matter the size, moves the
                work forward — and we&rsquo;ll write back personally.
              </p>
            </div>
            <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row">
              <a
                href="https://www.every.org/foundation-for-future-aesthetics/donate"
                target="_blank"
                rel="noopener noreferrer"
                data-goatcounter-click="give:usd-general"
                className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl bg-sage px-6 py-4 text-sm uppercase tracking-[0.1em] text-white transition-colors hover:bg-dark"
              >
                Give in USD
              </a>
              <EthGiveButton
                label="Give in ETH"
                eventName="give:eth-general"
              />
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

        {/* Horizontal divider matching the 3px vertical divider above;
            on mobile (columns stacked), it sits between Other Ways and
            Refer Us, keeping the rhythm continuous. */}
        <div className="h-[3px] bg-ink/20" />

        {/* Refer Us — folded in from its own standalone panel. Lives
            as a horizontal third section under the Give | Other Ways
            split. Full-width because the body copy + CTA wants the
            horizontal breathing room rather than fighting for a narrow
            column. id="refer" preserved so any anchor links to #refer
            from elsewhere on the site still land here. */}
        <div id="refer" className="p-8 md:p-14">
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
                  data-goatcounter-click="refer:make-introduction"
                  className="btn-solid"
                >
                  Make an introduction
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* Catch-all soft off-ramp — folded in from the old /partnerships
          page. Gentle invitation for visitors whose shape didn't fit
          into Patronage / Give / Refer. Dark variant breaks the run of
          white panels and signals "different register of conversation." */}
      <Panel variant="dark" className="md:p-16">
        <ScrollDepthMarker eventName="scroll:support:catch-all-visible" />
        <h2 className="text-h2 leading-[1.05] md:text-h2-lg">Not sure where you fit?</h2>
        <p className="mt-6 max-w-prose text-body-lg leading-relaxed text-white/85">
          Tell us about your project and what you&rsquo;re trying to get out into the
          world. We&rsquo;ll come back with the shape that fits, or the honest answer
          that we&rsquo;re not the right home for it.
        </p>
        <Link
          href="/contact?topic=Partnership"
          data-goatcounter-click="catch-all:send-note"
          className="btn-solid mt-10 inline-block"
        >
          Send a note
        </Link>
      </Panel>
    </>
  );
}
