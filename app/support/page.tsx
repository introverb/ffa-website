import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import { EthGiveButton } from '@/components/EthGiveButton';
import { ScrollDepthMarker } from '@/components/ScrollDepthMarker';
import { SubscribeForm } from '@/components/SubscribeForm';

export const metadata: Metadata = {
  title: 'Support',
  description:
    'Support the Foundation for Future Aesthetics, a 501(c)(3) nonprofit. Give, become a member, or partner with us. All gifts and sponsorships are tax-deductible.',
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

// Gallery Membership — the tier copy exactly as printed on the OURS
// membership cards (MEMBERSHIP_Cards_ALL_204_DUPLEX). The card's QR
// resolves to /q/join, which is where the Become-a-member CTA goes.
const MEMBERSHIP_TIERS = [
  {
    name: 'Mycelium',
    price: '$50',
    blurb: 'Complimentary access to future events & openings.',
  },
  {
    name: 'Deuterium',
    price: '$100',
    blurb: '+ Private viewing appointments and curated dinners.',
  },
  {
    name: 'Regolith',
    price: '$250',
    blurb: '+ Exclusive early access and acquisition privileges for curated works.',
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
            become a member, or partner with us.
          </p>
        }
      />

      {/* Future events — leads the page: the mailing list for public
          events and updates, beside Gallery Membership for the private
          side (tier copy verbatim from the printed OURS membership
          card; its QR resolves to /q/join, same as the CTA here). */}
      <Panel id="events" variant="white" full className="overflow-clip">
        <div className="grid md:grid-cols-2 md:divide-x-[3px] md:divide-ink/20">
          <div className="flex flex-col p-8 md:p-14">
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Future events</p>
            <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
              Be there for what&rsquo;s next.
            </h2>
            <p className="mt-6 text-body-lg leading-relaxed text-ink/80">
              Our public events and updates — exhibitions, openings, releases, and
              what the foundation is building next, straight to your inbox.
            </p>
            <div className="mt-auto max-w-md pt-10">
              <SubscribeForm
                variant="light"
                label="Public events & updates"
                eventName="subscribe:support-events"
              />
            </div>
          </div>

          <div className="flex flex-col p-8 md:p-14">
            <p className="text-sm uppercase tracking-[0.08em] text-sage">
              Gallery Membership
            </p>
            <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
              Private events &amp; sneak peeks.
            </h2>
            <ul className="mt-8 divide-y divide-rule border-y border-rule">
              {MEMBERSHIP_TIERS.map((t) => (
                <li key={t.name} className="py-5">
                  <div className="flex items-baseline justify-between gap-6">
                    <p className="font-heading text-h6 uppercase tracking-[0.02em] text-ink">
                      {t.name}
                    </p>
                    <p className="whitespace-nowrap font-mono text-sm text-ink/80">
                      {t.price} <span className="text-muted">/ mo</span>
                    </p>
                  </div>
                  <p className="mt-1.5 text-body leading-relaxed text-ink/80">{t.blurb}</p>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap items-center gap-5 pt-10">
              <Link
                href="/q/join"
                data-goatcounter-click="membership:support-panel"
                className="btn-solid"
              >
                Become a member
              </Link>
              <p className="text-xs uppercase tracking-[0.1em] text-muted">
                Sign-ups open · limited availability
              </p>
            </div>
          </div>
        </div>
      </Panel>

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
            <p className="mt-5 text-sm text-muted">
              We also accept DAF grants, appreciated stock, and workplace
              matching (Benevity, YourCause, Bright Funds) —{' '}
              <Link
                href="/contact?topic=Partnership"
                className="underline decoration-from-font underline-offset-4 text-ink hover:text-sage"
              >
                send a note
              </Link>{' '}
              and we&rsquo;ll route you.
            </p>
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

          {/* Right half — Patronage. The Patron / Sponsor paths sit
              beside Give (they used to hold their own panel further
              down): each card links to its standalone brief, because
              the patron relationship starts with a conversation, not
              a checkout. id="partner" preserved for inbound anchors. */}
          <div id="partner" className="flex flex-col p-8 md:p-14">
            <ScrollDepthMarker eventName="scroll:support:partner-visible" />
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Patronage</p>
            <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
              Fund a more optimistic future.
            </h2>
            <div className="mt-8 space-y-6">
              {PATRONAGE.map((p) => (
                <div key={p.name} className="rounded-2xl bg-cream p-6 md:p-8">
                  <div className="flex items-baseline justify-between gap-6">
                    <p className="text-sm uppercase tracking-[0.08em] text-sage">{p.name}</p>
                    <p className="whitespace-nowrap font-mono text-sm text-ink/80">{p.amount}</p>
                  </div>
                  <p className="mt-3 text-body leading-relaxed text-ink/80">{p.blurb}</p>
                  {/* New tab — the brief is a standalone shareable
                      document, so the visitor's place here is kept. */}
                  <Link
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-goatcounter-click={`patron:${p.slug}-brief`}
                    className="mt-5 inline-block text-sm uppercase tracking-[0.1em] underline decoration-from-font underline-offset-4 text-ink transition-colors hover:text-sage"
                  >
                    View the brief
                  </Link>
                </div>
              ))}
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
