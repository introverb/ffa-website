import Link from 'next/link';
import { InitiativesHeader } from './InitiativesHeader';
import { Panel } from '@/components/PageFrame';
import { Placeholder } from '@/components/Placeholder';
import { INITIATIVES } from '@/lib/content';

// Initiatives band — the astronaut header (in-flow, scrolls naturally) plus
// three sticky-stacking cards beneath it. The header used to be sticky too,
// but with the SiteNav pinned at the top it left a thin sliver of the
// astronaut image peeking between the nav and the topmost card. Letting the
// header scroll out of view once it's done its job keeps the deck stack
// clean.
//
// The deck:
//   - Card 0 is sticky `top: 8.5rem`. That clears the SiteNav (~76px) with
//     comfortable breathing room.
//   - Cards 1 and 2 pin at `top: 10rem` and `top: 11.5rem`, each peeking
//     1.5rem (24px) above the next.
//   - bg-paper on each sticky wrapper hides the corner peek between
//     adjacent rounded cards.
//   - Top-edge drop shadow makes each layer cast softly upward.
//   - 30vh spacer at the bottom so the last card has room to scroll into
//     view before the next section.
export function Initiatives() {
  return (
    <div className="relative">
      <InitiativesHeader />

      {INITIATIVES.map((i, idx) => (
        <div
          key={i.n}
          className="sticky bg-paper"
          style={{ top: `${8.5 + idx * 1.5}rem` }}
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
                  {i.note &&
                    (i.noteHref ? (
                      <Link href={i.noteHref} className="btn-solid">
                        {i.note}
                      </Link>
                    ) : (
                      <strong>{i.note}</strong>
                    ))}
                  <p className={i.note ? 'mt-8' : ''}>{i.blurb}</p>
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
