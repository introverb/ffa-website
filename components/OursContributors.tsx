'use client';

import { useState } from 'react';
import Link from 'next/link';
import { slug } from '@/lib/analytics';

// Contributors selector for the OURS page. Three group tabs; picking
// one slides up a color-coded rounded panel beneath, keyed to the
// palette's three accent hues:
//   Artists                   -> flare   (orange)
//   Speakers                  -> sage    (green)
//   Installation Contributors -> horizon (blue)
// Panels are color-OUTLINED (3px border, matching the site's bordered
// card pattern) rather than color-filled; content sits in ink on the
// white panel ground, with the group color carried by the border, the
// selected tab's fill, hover accents, and the installation CTA. The
// installation panel keeps its "share your vision" contribute CTA even
// with a confirmed roster shown, since it's open to more visionaries.
// Color classes are written as complete literals (Tailwind JIT can't
// see interpolated fragments).

// Confirmed roster, in two groups within the same Artists tab: Gallery
// (physical works) and Ledgerworks (on-chain works). Each lineup is a
// flex-wrap so additions are one-line edits. Names with an href link
// out (per-artist GoatCounter event); a name without one renders as
// plain text until its link is added.
const GALLERY_ARTISTS: { name: string; href?: string }[] = [
  { name: 'RERO', href: 'https://rero-studio.squarespace.com/' },
  { name: 'Anyanwu', href: 'https://weareanyanwu.com/' },
  { name: 'Giorgia Lupi', href: 'https://studio.giorgialupi.com/' },
  { name: 'Dylan Weiler', href: 'https://www.dylanevansweiler.com/' },
  { name: 'Seungjun Na', href: 'https://www.instagram.com/na_tist' },
  { name: 'Denis Pakowacz', href: 'https://www.behance.net/pakowacz' },
  { name: 'Sue Ellen Zhang', href: 'https://bio.site/sueellen' },
  { name: 'Ellynne Dec', href: 'https://ellynne.studio/' },
  { name: 'Sev Gedra', href: 'https://sevgedramakes.com/' },
  { name: 'Olli Payne', href: 'https://olli.vision' },
];

const LEDGERWORKS_ARTISTS: { name: string; href?: string }[] = [
  { name: 'Mauricio Pommella', href: 'https://mpommella.com/' },
  { name: 'Nahuel Aquiles', href: 'https://genpi.org' },
  { name: 'Yura Miron', href: 'https://yuramiron.art/' },
  { name: 'AnjolaDave', href: 'https://linktr.ee/anjoladave' },
  { name: 'Recycle Group', href: 'https://recyclegroup.fr/' },
];

// Installation contributors — the confirmed roster, now revealed
// (SHOW_INSTALLATION = true). Names with an href render as links
// (same treatment as the artists), the rest as plain text; the
// Contribute CTA still sits below. Set SHOW_INSTALLATION = false to
// hold the group as "to be announced" again.
const SHOW_INSTALLATION = true;

const INSTALLATION_CONTRIBUTORS: {
  name: string;
  role?: string;
  href?: string;
}[] = [
  { name: 'Ada Palmer', role: 'Host', href: 'https://www.adapalmer.com/' },
  { name: 'Audrey Tang', role: 'Cyber Ambassador, Taiwan', href: 'https://cyberambassador.tw/' },
  {
    name: 'Eli Dourado',
    role: 'Economist, progress & abundance',
    href: 'https://www.elidourado.com/about',
  },
  {
    name: 'Neil Harbisson',
    role: 'Cyborg artist, Cyborg Foundation',
    href: 'https://www.cyborgarts.com/neil-harbisson',
  },
  {
    name: 'Shannon Wong',
    role: 'Aviator, GIRLFLIESWORLD',
    href: 'https://www.girlfliesworld.com/',
  },
  {
    name: 'Michael Balangue',
    role: 'Biodesigner & artist',
    href: 'https://anitosoul.earth/',
  },
  {
    name: 'Michael Edward Johnson',
    role: 'Independent researcher',
    href: 'https://opentheory.net/',
  },
  {
    name: 'Bright Simons',
    role: 'Technologist, mPedigree, Ghana',
    href: 'https://brightsimons.com/',
  },
  {
    name: 'João Pedro de Magalhães',
    role: 'Biologist of ageing, U. Birmingham',
    href: 'https://jp.senescence.info/',
  },
];

// Confirmed speakers — unlike the name-only lists above, each carries
// a title/affiliation line, so they get their own card layout (see the
// render below) rather than reusing ArtistList's inline-wrapped names.
const SPEAKERS: { name: string; title: string; href?: string }[] = [
  {
    name: 'Tamara Winter',
    title: 'Commissioning editor, Stripe Press',
    href: 'https://x.com/tamarawinter',
  },
  {
    name: 'Erika Alden DeBenedictis',
    title: 'Physicist & biological engineer, CEO of Pioneer Labs',
    href: 'https://www.erikadebenedictis.com/',
  },
  {
    name: 'Geoff Anders',
    title: 'Philosopher, founder of Leverage',
    href: 'https://www.geoffanders.com/',
  },
];

type GroupKey = 'artists' | 'speakers' | 'installation';

const TABS: {
  key: GroupKey;
  label: string;
  // Full literal class strings per state — selected fill matches the
  // panel color so tab and panel read as one connected surface.
  selected: string;
  panel: string;
}[] = [
  {
    key: 'artists',
    label: 'Artists',
    selected: 'border-flare bg-flare text-white',
    panel: 'border-flare',
  },
  {
    key: 'speakers',
    label: 'Speakers',
    selected: 'border-sage bg-sage text-white',
    panel: 'border-sage',
  },
  {
    key: 'installation',
    label: 'Visions of the Future',
    selected: 'border-horizon bg-horizon text-white',
    panel: 'border-horizon',
  },
];

// Real vector arrow for outbound links — a Unicode "↗" glyph renders
// as a colorful emoji on several mobile browsers/fonts instead of
// plain text, so this draws it as an inline SVG (stroke: currentColor)
// for crisp, on-brand, colorable rendering everywhere.
function ExternalLinkArrow({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-[0.55em] w-[0.55em] shrink-0 ${className}`}
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

// Shared name-list rendering for both artist groups within the Artists
// tab (Exhibition, Ledgerworks) — same link/plain-text treatment either
// way, so adding an artist to either group is a one-line data edit.
function ArtistList({ artists }: { artists: { name: string; href?: string }[] }) {
  return (
    <ul className="flex max-w-5xl flex-wrap items-baseline gap-x-10 gap-y-4">
      {artists.map((a) => (
        <li key={a.name}>
          {a.href ? (
            <a
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              data-goatcounter-click={`ours:artist-${slug(a.name)}`}
              className="group flex items-baseline gap-1.5 font-heading text-h5 leading-tight text-ink transition-colors hover:text-flare md:text-h4"
            >
              {a.name}
              {/* External-link cue, quiet until hover. */}
              <ExternalLinkArrow className="text-ink/35 transition-colors group-hover:text-flare" />
            </a>
          ) : (
            // No link yet — plain heading text, sits inline with the
            // linked names. Add an href above to make it a link.
            <span className="font-heading text-h5 leading-tight text-ink md:text-h4">
              {a.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function OursContributors() {
  const [active, setActive] = useState<GroupKey>('artists');
  const activeTab = TABS.find((t) => t.key === active)!;

  return (
    <div className="mt-20 border-t-[3px] border-rule pt-16">
      <p className="text-sm uppercase tracking-[0.08em] text-sage">The makers</p>
      <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
        The makers of the evening.
      </h2>

      {/* Group selector — pill buttons; the selected one fills with
          its group color so it visually plugs into the panel below. */}
      <div className="mt-10 flex flex-wrap gap-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            aria-pressed={active === t.key}
            data-goatcounter-click={`ours:contributors-${t.key}`}
            onClick={() => setActive(t.key)}
            className={`rounded-full border px-6 py-3 text-sm uppercase tracking-[0.1em] transition-colors ${
              active === t.key
                ? t.selected
                : 'border-ink/25 text-ink/60 hover:border-ink/50 hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Color-coded panel. key={active} remounts on tab change so the
          entrance animation (slide up + fade, keyframes in globals.css)
          replays for each group. */}
      <div
        key={active}
        className={`mt-5 animate-[contributors-panel-in_.35s_ease] rounded-2xl border-[3px] p-8 md:p-12 ${activeTab.panel}`}
      >
        {active === 'artists' && (
          <>
            {/* Gallery — labeled to match Ledgerworks below, so the
                Artists tab reads as two clearly named groups rather
                than "the main list" plus one labeled exception. */}
            <p className="text-sm uppercase tracking-[0.08em] text-muted">Gallery</p>
            <div className="mt-5">
              <ArtistList artists={GALLERY_ARTISTS} />
            </div>

            {/* Ledgerworks — its own labeled group within the same
                Artists tab, rather than a separate tab, since it's
                still part of the one roster. */}
            <div className="mt-10 border-t border-ink/15 pt-10">
              <p className="text-sm uppercase tracking-[0.08em] text-muted">
                Ledgerworks (on-chain)
              </p>
              <div className="mt-5">
                <ArtistList artists={LEDGERWORKS_ARTISTS} />
              </div>
            </div>
          </>
        )}

        {active === 'speakers' && (
          <>
            {/* Each speaker carries a full title/affiliation line, not
                just a name, so this stacks vertically rather than
                wrapping into a grid or ArtistList's inline names. */}
            <ul className="flex max-w-prose flex-col gap-8">
              {SPEAKERS.map((s) => (
                <li key={s.name}>
                  {s.href ? (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-goatcounter-click={`ours:speaker-${slug(s.name)}`}
                      className="group flex items-baseline gap-1.5 font-heading text-h5 leading-tight text-ink transition-colors hover:text-sage md:text-h4"
                    >
                      {s.name}
                      <ExternalLinkArrow className="text-ink/35 transition-colors group-hover:text-sage" />
                    </a>
                  ) : (
                    <p className="font-heading text-h5 leading-tight text-ink md:text-h4">
                      {s.name}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-muted">{s.title}</p>
                </li>
              ))}
            </ul>
          </>
        )}

        {active === 'installation' && (
          <>
            {/* Lineup when SHOW_INSTALLATION is on; "to be announced"
                placeholder while it's held. Names with an href render
                as links (matching the artists), names without as
                plain heading text; role sits on its own line below,
                same stacked pattern as the Speakers tab — with roles
                now on every entry, a flex-wrap of inline parentheticals
                wrapped unevenly (some rows two names, some one) since
                each item's width varied wildly. A fixed-column grid
                keeps every row aligned regardless of name/role length.
                Flipping SHOW_INSTALLATION reveals the roster with no
                JSX change. */}
            {SHOW_INSTALLATION && INSTALLATION_CONTRIBUTORS.length > 0 ? (
              <ul className="grid max-w-5xl gap-x-10 gap-y-8 sm:grid-cols-2">
                {INSTALLATION_CONTRIBUTORS.map((c) => (
                  <li key={c.name}>
                    {c.href ? (
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-goatcounter-click={`ours:installation-${slug(c.name)}`}
                        className="group flex items-baseline gap-1.5 font-heading text-h5 leading-tight text-ink transition-colors hover:text-horizon md:text-h4"
                      >
                        {c.name}
                        <ExternalLinkArrow className="text-ink/35 transition-colors group-hover:text-horizon" />
                      </a>
                    ) : (
                      <p className="font-heading text-h5 leading-tight text-ink md:text-h4">
                        {c.name}
                      </p>
                    )}
                    {c.role && <p className="mt-2 text-sm text-muted">{c.role}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-heading text-h4 leading-tight text-ink md:text-h3">
                To be announced.
              </p>
            )}

            {/* Contribute invitation — the installation is open to
                more visionaries, so this group carries its own CTA.
                Button takes the group blue so the outlined panel
                still carries a solid hit of its color. */}
            <div className="mt-8 border-t border-ink/15 pt-8">
              <h3 className="font-heading text-h5 leading-tight text-ink">
                Share your vision of a positive future with us.
              </h3>
              <p className="mt-3 max-w-prose text-body leading-relaxed text-ink/80">
                Visionaries welcome to share a 2-5 minute video to be added to
                FFA&rsquo;s flagship installation. Reach out to participate!
              </p>
              <Link
                href="/contact?topic=OURS event involvement"
                data-goatcounter-click="ours:installation-contribute"
                className="mt-6 inline-flex items-center justify-center rounded-md bg-horizon px-7 py-3 text-sm uppercase tracking-[0.12em] text-white transition-colors hover:bg-dark"
              >
                Contribute
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
