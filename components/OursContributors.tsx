'use client';

import { useState } from 'react';
import Link from 'next/link';
import { slug } from '@/lib/analytics';

// Contributors selector for the OURS page. Three group tabs; picking
// one slides up a color-coded rounded panel beneath:
//   Artists                  -> orange  (#e8651a, the brief palette)
//   Speakers                 -> green   (site sage)
//   Installation Contributors -> blue   (#7a9aac, the brief palette)
// Panels are color-OUTLINED (3px border, matching the site's bordered
// card pattern) rather than color-filled; content sits in ink on the
// white panel ground, with the group color carried by the border, the
// selected tab's fill, hover accents, and the installation CTA.
// Speakers are TBA for now; the installation panel carries the
// "share your vision" contribute CTA. Color classes are written as
// complete literals (Tailwind JIT can't see interpolated fragments).

// Confirmed exhibition artists. Two or three more are expected; the
// lineup is a flex-wrap so additions are one-line edits. Each name
// links out with a per-artist GoatCounter event.
const ARTISTS = [
  { name: 'RERO', href: 'https://rero-studio.squarespace.com/' },
  { name: 'Ellynne Dec', href: 'https://ellynne.studio/' },
  { name: 'Mauricio Pommella', href: 'https://mpommella.com/' },
  { name: 'Anyanwu', href: 'https://weareanyanwu.com/' },
  { name: 'Den Pakowacz', href: 'https://www.behance.net/pakowacz' },
  { name: 'Casey Rehm', href: 'https://mcr-studio.com/' },
  { name: 'Seungjun Na', href: 'https://www.instagram.com/na_tist' },
];

// Installation contributors — names only for now (no sites supplied);
// links can be added the same way as ARTISTS when wanted.
const INSTALLATION_CONTRIBUTORS = [{ name: 'Ada Palmer' }, { name: 'Anders Sandberg' }];

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
    selected: 'border-[#e8651a] bg-[#e8651a] text-white',
    panel: 'border-[#e8651a]',
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
    selected: 'border-[#7a9aac] bg-[#7a9aac] text-white',
    panel: 'border-[#7a9aac]',
  },
];

export function OursContributors() {
  const [active, setActive] = useState<GroupKey>('artists');
  const activeTab = TABS.find((t) => t.key === active)!;

  return (
    <div className="mt-20 border-t-[3px] border-rule pt-16">
      <p className="text-sm uppercase tracking-[0.08em] text-sage">Contributors</p>
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
                  <a
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-goatcounter-click={`ours:artist-${slug(a.name)}`}
                    className="group flex items-baseline gap-1.5 font-heading text-h5 leading-tight text-ink transition-colors hover:text-[#e8651a] md:text-h4"
                  >
                    {a.name}
                    {/* External-link cue, quiet until hover. */}
                    <span
                      aria-hidden
                      className="text-[0.55em] text-ink/35 transition-colors group-hover:text-[#e8651a]"
                    >
                      &#8599;
                    </span>
                  </a>
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
            <ul className="flex max-w-5xl flex-wrap items-baseline gap-x-10 gap-y-4">
              {INSTALLATION_CONTRIBUTORS.map((c) => (
                <li
                  key={c.name}
                  className="font-heading text-h5 leading-tight text-ink md:text-h4"
                >
                  {c.name}
                </li>
              ))}
            </ul>

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
                className="mt-6 inline-flex items-center justify-center rounded-md bg-[#7a9aac] px-7 py-3 text-sm uppercase tracking-[0.12em] text-white transition-colors hover:bg-dark"
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
