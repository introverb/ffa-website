import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import { CommunityFund } from '@/components/CommunityFund';
import { EthGiveButton } from '@/components/EthGiveButton';
import { DafGrantDialog } from '@/components/DafGrantDialog';
import { ScrollDepthMarker } from '@/components/ScrollDepthMarker';
import { FFA_ETH_ADDRESS } from '@/lib/eth';

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
    name: 'Patron',
    slug: 'private-patron',
    amount: 'From $1,000',
    blurb:
      'For individuals backing the foundation itself — recognized in Possibilia, with a standing invitation to OURS and FFA events.',
    href: '/patrons/private',
  },
  {
    name: 'Sponsor',
    slug: 'corporate-patron',
    amount: 'From $5,000',
    blurb:
      'For companies building toward a future worth wanting — named credit, a presence at OURS, and a commissioned Possibilia story.',
    href: '/patrons/corporate',
  },
];

// Funders who back the foundation, surfaced in the Benefactors panel
// between Patronage and Give. Each entry renders as logo + program
// caption; the wrapping anchor sends visitors to the funder's site
// (in a new tab) and fires a per-funder GoatCounter event so we can
// see which credit gets clicked.
const BENEFACTORS = [
  {
    name: "O'Shaughnessy Ventures",
    slug: 'oshaughnessy-ventures',
    program: 'Fellowship Grant',
    logo: '/images/funders/oshaughnessy-ventures.svg',
    href: 'https://www.osv.llc',
    // Per-logo size tuning: a shared max-height alone makes the wide
    // Mercatus wordmark (5.6:1) sprawl to ~280px beside OSV's compact
    // 3.2:1 mark at ~180px. Height-capping OSV and width-capping
    // Mercatus brings their optical weight level.
    logoClass: 'max-h-12 md:max-h-14',
  },
  {
    name: 'The Mercatus Center',
    slug: 'mercatus-center',
    program: 'Emergent Ventures Grant',
    // Filename carries the program, not just the org — and doubles as
    // a cache-bust: the original mercatus-center.svg shipped briefly
    // as an unparseable Illustrator export, and browsers that cached
    // that dead file would keep showing a blank at the old URL.
    logo: '/images/funders/mercatus-emergent-ventures.svg',
    href: 'https://www.mercatus.org/emergent-ventures',
    logoClass: 'max-w-[180px] md:max-w-[205px]',
  },
  {
    name: 'Leverage Research',
    slug: 'leverage-research',
    program: 'Fiscal Sponsor 2023-2024',
    // Vector lockup from their live site header (leverage.institute,
    // where leverageresearch.org now redirects) — already black on
    // transparent, so no inversion of the dark-background raster
    // assets was needed. Same wide-wordmark geometry as Mercatus
    // (~5.4:1), so it takes the same width cap.
    logo: '/images/funders/leverage-research.svg',
    href: 'https://www.leverage.institute',
    logoClass: 'max-w-[180px] md:max-w-[205px]',
  },
];

// Individual benefactors — right-hand group of the Benefactors row,
// beside the org logos. Each renders as a person-as-lockup: small
// square portrait as the "mark," stacked first/last name in the
// heading face as the "wordmark" (mirroring Mercatus's two-line
// lockup), caption below — same visual grammar as the org entries.
// Sources are 600×600 squares supplied by each benefactor (photo as
// JPEG, pixel art as PNG to keep its hard edges). Links go to each
// patron's X profile, the same new-tab + per-entry analytics
// treatment as the org entries.
const INDIVIDUAL_BENEFACTORS = [
  {
    name: 'Geoff Anders',
    slug: 'geoff-anders',
    image: '/images/benefactors/geoff-anders.jpg',
    caption: 'Founding Patron',
    href: 'https://x.com/geoffanders',
  },
  {
    name: 'Jonathan Blow',
    slug: 'jonathan-blow',
    image: '/images/benefactors/jonathan-blow.png',
    caption: 'Founding Patron',
    href: 'https://x.com/Jonathan_Blow',
  },
];

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
            partner with us, or open a door.
          </p>
        }
      />

      {/* Benefactors — quiet credit roll for the foundations, grant
          programs, and founding patrons backing FFA. Leads the page,
          above Give, as the credibility signal: a visitor meets the
          real backers before the page asks them to become one.
          Treatment is restrained: lockups normalized to a shared
          optical band, captions in the sage eyebrow style. Each entry
          links out in a new tab so the visitor's place on /support
          is preserved. */}
      <Panel variant="white" className="md:p-16">
        <p className="text-sm uppercase tracking-[0.08em] text-sage">With gratitude</p>
        <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
          Thanks to our partners, sponsors, and benefactors.
        </h2>

        {/* One row, two groups: grant programs left, individual
            benefactors right, split by the site's 3px hairline (the
            same stroke as the Give | Other Ways divider below) —
            vertical at md+, absent on mobile where the groups stack.
            All entries share a fixed-height media box so the wide
            logos and the person lockups sit on one centerline and
            the caption row aligns across the full panel; the divider
            makes the org/person shape difference read as two
            deliberate groups rather than inconsistency. */}
        {/* 3fr/2fr split: three org columns + two person columns land
            at five roughly equal widths across the row. Both groups
            stack one-per-row on mobile (wide lockups in two phone
            columns would crowd or orphan). */}
        <div className="mt-14 grid gap-14 md:grid-cols-[3fr_2fr] md:gap-0 md:divide-x-[3px] md:divide-ink/20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 md:pr-14">
            {BENEFACTORS.map((b) => (
              <a
                key={b.slug}
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                data-goatcounter-click={`benefactor:${b.slug}`}
                className="group flex flex-col items-center text-center"
              >
                {/* Each logo carries its own size cap (logoClass) —
                    see the BENEFACTORS comment for the optical-weight
                    rationale. max-w-full stays as the column-width
                    backstop on narrow screens. */}
                <div className="flex h-20 items-center justify-center md:h-24">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.logo}
                    alt={b.name}
                    className={`w-auto max-w-full object-contain ${b.logoClass}`}
                  />
                </div>
                {/* Captions at text-xs + nowrap so the five-up columns
                    keep every caption on a single shared baseline; the
                    longest (Fiscal Sponsor 2023-2024) center-overflows
                    a few px into its gaps rather than wrapping to a
                    ragged second line. */}
                <p className="mt-5 whitespace-nowrap text-xs uppercase tracking-[0.08em] text-sage transition-colors group-hover:text-ink">
                  {b.program}
                </p>
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8 md:pl-14">
            {INDIVIDUAL_BENEFACTORS.map((b) => (
              <a
                key={b.slug}
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                data-goatcounter-click={`benefactor:${b.slug}`}
                className="group flex flex-col items-center text-center"
              >
                {/* Person-as-lockup, sized to the org-logo optical
                    band: square portrait as the mark, stacked
                    first/last name in the heading face as the
                    wordmark (the split is deterministic, mirroring
                    Mercatus's two-line lockup). Same fixed-height
                    media box keeps the row's shared centerline. */}
                <div className="flex h-20 items-center justify-center gap-3.5 md:h-24">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.image}
                    alt={b.name}
                    className="h-12 w-12 rounded-lg object-cover md:h-14 md:w-14"
                  />
                  <span className="font-heading text-h6 leading-[1.15] text-ink text-left">
                    {b.name.split(' ').map((part) => (
                      <span key={part} className="block">
                        {part}
                      </span>
                    ))}
                  </span>
                </div>
                <p className="mt-5 whitespace-nowrap text-xs uppercase tracking-[0.08em] text-sage transition-colors group-hover:text-ink">
                  {b.caption}
                </p>
              </a>
            ))}
          </div>
        </div>
      </Panel>

      {/* Give | Other Ways — leads right after Benefactors now (swapped
          with Community Fund, which moved to after Patronage): the
          direct conversion path comes first, before the deeper patron
          ask. 3px vertical divider between the two columns on desktop
          matches the stroke of the rest of the site's decorative
          hairlines. Refer Us used to live below this row in the same
          panel; it's now its own standalone panel near the bottom of
          the page (see id="refer" further down). */}
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
      </Panel>

      {/* Patronage — the two patron paths (Private / Corporate). Each
          card links to its standalone brief in /public; the patron
          relationship starts with a conversation, not a checkout, so
          the card CTAs route to the brief rather than every.org.
          Below the cards, the issue-underwriter callout (slow-
          conversation $20k commitment) lives in this panel too — it's
          another shape of partner support beyond patronage proper.
          id="partner" retained so any inbound anchor links from
          elsewhere on the site still land here. */}
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
                    when they close the brief. */}
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
      </Panel>

      {/* Community Fund — FFA's match fund on Artizen, surfaced live.
          Now sits after Patronage (swapped with the Give panel, which
          leads right after Benefactors instead). Artizen blocks
          iframing, so this is a native panel that reads the live
          numbers from their public API (see CommunityFund.tsx). */}
      <CommunityFund />

      {/* Refer Us — pulled out into its own standalone panel (used to
          be a third section folded into the Give panel below the
          Give | Other Ways row). Sits last before the catch-all soft
          off-ramp. id="refer" retained so any anchor links to #refer
          from elsewhere on the site still land here. */}
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
                data-goatcounter-click="refer:make-introduction"
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
