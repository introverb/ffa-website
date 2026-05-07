import type { ReactNode } from 'react';

// Centralized artist directory. When a credit string includes one of
// these names anywhere in the website (page-header bylines, listings
// cards, in-body credits), `renderWithArtistLinks` automatically wraps
// just the name in a subtle hyperlink to the artist's site/profile.
//
// Add a new artist by dropping their full display name + URL here —
// nothing else has to change for the link to appear everywhere they're
// already credited.
export const ARTIST_LINKS: Record<string, string> = {
  'Andres Osorio': 'https://www.instagram.com/lizatar?igsh=MXRtbGF3NGVzeXRkcA==',
  'Olli Payne': 'https://olli.vision/',
  'Colby Green': 'https://www.instagram.com/cjsirenart?igsh=MW9hMHo0OHNmZWllcg==',
  'Michael Simmons': 'https://x.com/sidewinder_art',
};

// Sort longer names first so e.g. "Olli Payne" matches before any
// substring of it could match.
const ARTIST_NAMES = Object.keys(ARTIST_LINKS).sort(
  (a, b) => b.length - a.length,
);

// Subtle by design: 1px dotted underline at font weight (close to
// invisible from across the room, clearly clickable up close), color
// inherited from surrounding text. On hover the underline goes solid
// and the text shifts to sage so there's a clear feedback cue.
const ARTIST_LINK_CLASS =
  'underline decoration-dotted decoration-from-font underline-offset-[3px] transition-colors hover:decoration-solid hover:text-sage';

// Walks a credit string and returns a ReactNode tree where any
// occurrences of known artist names are wrapped in subtle <a> tags.
// Strings with no recognized names pass through unchanged.
export function renderWithArtistLinks(text: string | null | undefined): ReactNode {
  if (!text) return text;

  const out: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    let earliestIdx = -1;
    let matchedName = '';
    for (const name of ARTIST_NAMES) {
      const idx = remaining.indexOf(name);
      if (idx !== -1 && (earliestIdx === -1 || idx < earliestIdx)) {
        earliestIdx = idx;
        matchedName = name;
      }
    }

    if (earliestIdx === -1) {
      out.push(remaining);
      break;
    }

    if (earliestIdx > 0) {
      out.push(remaining.slice(0, earliestIdx));
    }
    out.push(
      <a
        key={key++}
        href={ARTIST_LINKS[matchedName]}
        target="_blank"
        rel="noopener noreferrer"
        className={ARTIST_LINK_CLASS}
      >
        {matchedName}
      </a>,
    );
    remaining = remaining.slice(earliestIdx + matchedName.length);
  }

  return <>{out}</>;
}
