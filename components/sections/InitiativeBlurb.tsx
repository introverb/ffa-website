'use client';

import { useState } from 'react';

// Mobile-only collapse/expand wrapper for the Initiative card body.
// The card's full blurb is long; on small screens it forces the reader
// to scroll past three monolithic paragraphs before the next card.
// Below md, we show only the first line and reveal the rest behind a
// "Read more" toggle. At md+ the wrapper renders the blurb straight
// through (with the optional `md:mt-8` rhythm gap when there's a
// note CTA above) so the desktop layout is untouched.
export function InitiativeBlurb({ blurb, hasNote }: { blurb: string; hasNote: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile: clamped to 1 line when collapsed, full text when
          expanded. line-clamp-1 lives directly on the <p> so the box
          model behaves correctly (line-clamp uses -webkit-box display
          which interferes with block descendants when applied to a
          wrapper). */}
      <div className="md:hidden">
        <p className={open ? '' : 'line-clamp-1'}>{blurb}</p>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-3 inline-flex items-center gap-1 text-sm uppercase tracking-[0.08em] text-sage transition-colors hover:text-ink"
        >
          {open ? 'Read less' : 'Read more'}
          <svg
            viewBox="0 0 12 12"
            width="10"
            height="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            <path d="M3 4.5l3 3 3-3" />
          </svg>
        </button>
      </div>

      {/* Desktop (md+): show the full blurb as-is, no toggle. mt-8
          preserves the rhythm gap below the optional note CTA. */}
      <p className={`hidden md:block ${hasNote ? 'md:mt-8' : ''}`}>{blurb}</p>
    </>
  );
}
