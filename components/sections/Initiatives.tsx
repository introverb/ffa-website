import Link from 'next/link';
import { InitiativesHeader } from './InitiativesHeader';
import { InitiativeBlurb } from './InitiativeBlurb';
import { Panel } from '@/components/PageFrame';
import { Placeholder } from '@/components/Placeholder';
import { INITIATIVES } from '@/lib/content';

// Initiatives band - the astronaut header plus three sticky-stacking cards.
// Header pins just below the SiteNav so the deck reads as one continuous
// stack: header sits behind, cards slide up and over it as you scroll.
//
// Offsets are shifted down by 5rem from the original deck so they pin
// below the SiteNav pill (which sits at top-6/8). Relative spacing in the
// stack is preserved (2rem header peek, 1.5rem per card).
//
//   - Header pins at top-[5rem] (just under the SiteNav).
//   - Card 0 pins at top-[7rem]; the header peeks 2rem above it.
//   - Cards 1 and 2 pin at top-[8.5rem] and top-[10rem]; each peeks
//     1.5rem above the next.
//   - bg-paper on each sticky wrapper hides the corner peek between
//     adjacent rounded cards.
//   - Top-edge drop shadow makes each layer cast softly upward.
//   - 30vh spacer at the bottom so the last card has room to scroll into
//     view before the next section.
export function Initiatives() {
  return (
    <div className="relative">
      <div className="sticky top-[5rem]">
        <InitiativesHeader />
      </div>

      {INITIATIVES.map((i, idx) => (
        <div
          key={i.n}
          // No wrapper background - cards are just sticky containers, the
          // panel inside provides its own rounded shape and bg. This means
          // a small taupe peek can show in corner triangles between
          // adjacent rounded cards, which the user prefers over the
          // rectangular wrapper look.
          className="sticky"
          style={{ top: `${7 + idx * 1.5}rem` }}
        >
          <Panel
            variant="white"
            className="md:p-16 shadow-[0_-18px_36px_-12px_rgba(0,0,0,0.22)]"
          >
            <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-center">
              <div>
                <p className="text-sm tracking-wide text-muted">{i.n}</p>
                <h3 className="mt-6 text-h3 leading-[1.1] md:text-h3-lg">{i.title}</h3>
                <p className="mt-3 text-h6 text-muted">{i.status}</p>
                <div className="mt-10 max-w-prose text-body leading-relaxed text-ink/90">
                  {/* Initiative CTAs: shown on desktop, hidden on mobile.
                      Mobile readers reach these via the SiteNav or the
                      homepage outro; the card on mobile collapses to
                      first-line + Read more so piling CTAs on top of
                      the collapsed text would crowd the layout.
                      Primary CTA is btn-solid (sage). Optional
                      tertiary CTA renders next to it in a frosted-
                      pill aesthetic — translucent ink fill, soft
                      border, backdrop blur — at the same shape +
                      padding as btn-solid so the two read as a pair. */}
                  {(i.note || i.tertiaryNote) && (
                    <div className="hidden md:flex md:flex-wrap md:items-center md:gap-2">
                      {/* Compact button sizing (px-4 py-2.5, text-xs) so up
                          to three CTAs fit on a single row inside the
                          initiative card's text column. Same styles as
                          btn-solid / the frosted secondary, just tighter
                          padding + smaller text. */}
                      {i.note &&
                        (i.noteHref ? (
                          i.noteHref.startsWith('http') ? (
                            // External (e.g. the Luma RSVP page) — open
                            // in a new tab so the homepage stays put.
                            <a
                              href={i.noteHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-goatcounter-click="home:attend-ours-luma"
                              className="inline-flex items-center justify-center rounded-md bg-sage px-4 py-2.5 text-xs uppercase tracking-[0.1em] text-white transition hover:bg-dark"
                            >
                              {i.note}
                            </a>
                          ) : (
                            <Link
                              href={i.noteHref}
                              className="inline-flex items-center justify-center rounded-md bg-sage px-4 py-2.5 text-xs uppercase tracking-[0.1em] text-white transition hover:bg-dark"
                            >
                              {i.note}
                            </Link>
                          )
                        ) : (
                          <strong>{i.note}</strong>
                        ))}
                      {i.tertiaryNote && i.tertiaryNoteHref && (
                        <a
                          href={i.tertiaryNoteHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-md border border-ink/25 bg-ink/5 px-4 py-2.5 text-xs uppercase tracking-[0.1em] text-ink backdrop-blur-sm transition hover:bg-ink/10"
                        >
                          {i.tertiaryNote}
                        </a>
                      )}
                    </div>
                  )}
                  {/* InitiativeBlurb collapses the body to a single line
                      on mobile with a Read more toggle; renders straight
                      through at md+. */}
                  <InitiativeBlurb
                    blurb={i.blurb}
                    hasNote={Boolean(i.note || i.tertiaryNote)}
                  />
                </div>
              </div>
              <div>
                <Placeholder src={i.image} alt={i.title} ratio="square" />
              </div>
            </div>
          </Panel>
        </div>
      ))}

      <div aria-hidden className="h-[30vh]" />
    </div>
  );
}
