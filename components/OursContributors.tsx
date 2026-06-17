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
// selected tab's fill, hover accents, and the installation CTA.
// Speakers and installation contributors are both TBA for now; the
// installation panel still carries the "share your vision" contribute
// CTA. Color classes are written as complete literals (Tailwind JIT
// can't see interpolated fragments).

// Confirmed exhibition artists. The lineup is a flex-wrap so additions
// are one-line edits. Names with an href link out (per-artist
// GoatCounter event); a name without one renders as plain text until
// its link is added (e.g. Dylan Weiss, link pending).
const ARTISTS: { name: string; href?: string }[] = [
  { name: 'RERO', href: 'https://rero-studio.squarespace.com/' },
  { name: 'Giorgia Lupi', href: 'https://studio.giorgialupi.com/' },
  { name: 'Ellynne Dec', href: 'https://ellynne.studio/' },
  { name: 'Mauricio Pommella', href: 'https://mpommella.com/' },
  { name: 'Anyanwu', href: 'https://weareanyanwu.com/' },
  { name: 'Den Pakowacz', href: 'https://www.behance.net/pakowacz' },
  { name: 'Casey Rehm', href: 'https://mcr-studio.com/' },
  { name: 'Seungjun Na', href: 'https://www.instagram.com/na_tist' },
  { name: 'Dylan Weiss' },
  { name: 'Olli Payne', href: 'https://olli.vision' },
];

// Installation contributors — the confirmed roster is held here as
// real data (names, optional role, optional link), but kept hidden
// behind SHOW_INSTALLATION so the panel shows "to be announced" plus
// the standing Contribute CTA. Flip SHOW_INSTALLATION to true to
// reveal the lineup; names with an href render as links (same
// treatment as the artists), the rest as plain text.
const SHOW_INSTALLATION = false;

const INSTALLATION_CONTRIBUTORS: {
  name: string;
  role?: string;
  href?: string;
}[] = [
  { name: 'Ada Palmer', role: 'Host' },
  { name: 'Anders Sandberg' },
  { name: 'Audrey Tang', href: 'https://cyberambassador.tw/' },
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
    label: 'Installation Contributors',
    selected: 'border-horizon bg-horizon text-white',
    panel: 'border-horizon',
  },
];

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
            <ul className="flex max-w-5xl flex-wrap items-baseline gap-x-10 gap-y-4">
              {ARTISTS.map((a) => (
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
                      <span
                        aria-hidden
                        className="text-[0.55em] text-ink/35 transition-colors group-hover:text-flare"
                      >
                        &#8599;
                      </span>
                    </a>
                  ) : (
                    // No link yet — plain heading text, sits inline with
                    // the linked names. Add an href above to make it a link.
                    <span className="font-heading text-h5 leading-tight text-ink md:text-h4">
                      {a.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-muted">More artists to be announced.</p>
          </>
        )}

        {active === 'speakers' && (
          <>
            <p className="font-heading text-h4 leading-tight text-ink md:text-h3">
              To be announced.
            </p>
            <p className="mt-4 max-w-prose text-body-lg leading-relaxed text-ink/80">
              Speakers are being confirmed now.{' '}
              <Link
                href="/contact?topic=OURS event involvement"
                data-goatcounter-click="ours:speakers-reach-out"
                className="underline decoration-from-font underline-offset-4 text-ink hover:text-sage"
              >
                Think you belong at the lectern? Reach out.
              </Link>
            </p>
          </>
        )}

        {active === 'installation' && (
          <>
            {/* Lineup when SHOW_INSTALLATION is on; "to be announced"
                placeholder while it's held. Names with an href render
                as links (matching the artists), names without as
                plain heading text; optional role is a quiet
                parenthetical. Flipping SHOW_INSTALLATION reveals the
                roster with no JSX change. */}
            {SHOW_INSTALLATION && INSTALLATION_CONTRIBUTORS.length > 0 ? (
              <ul className="flex max-w-5xl flex-wrap items-baseline gap-x-10 gap-y-4">
                {INSTALLATION_CONTRIBUTORS.map((c) => (
                  <li
                    key={c.name}
                    className="flex items-baseline gap-2 font-heading text-h5 leading-tight text-ink md:text-h4"
                  >
                    {c.href ? (
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-goatcounter-click={`ours:installation-${slug(c.name)}`}
                        className="group flex items-baseline gap-1.5 transition-colors hover:text-horizon"
                      >
                        {c.name}
                        <span
                          aria-hidden
                          className="text-[0.55em] text-ink/35 transition-colors group-hover:text-horizon"
                        >
                          &#8599;
                        </span>
                      </a>
                    ) : (
                      c.name
                    )}
                    {c.role && (
                      <span className="text-[0.55em] text-ink/50">({c.role})</span>
                    )}
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
