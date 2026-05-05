import Link from 'next/link';
import { InitiativesHeader } from './InitiativesHeader';
import { Panel } from '@/components/PageFrame';
import { Placeholder } from '@/components/Placeholder';
import { INITIATIVES } from '@/lib/content';

// Initiatives band — the header (astronaut image) plus three sticky-stacking
// cards. The whole band is one tall container so that every element shares
// the same sticky context: the header pins at the top, then each card pins
// just below it, sliding up over whatever's behind. Progressive `top` values
// make the stack look like a fanned-out deck rather than dead-stacked cards.
//
// All structural CSS — no JS, no animation library:
//   - Header is sticky `top: 0`. As you scroll into the band the header
//     pins to the very top.
//   - Card 0 is sticky `top: 2rem`. When its natural position scrolls past
//     2rem from viewport-top, it pins. The header stays at `top: 0`, so
//     32px of the header still peeks above the card.
//   - Cards 1 and 2 pin at `top: 3.5rem` and `top: 5rem`, each peeking
//     1.5rem (24px) above the next.
//   - Top-edge drop shadow on the cards makes each layer cast a soft shadow
//     upward onto whatever it's covering.
//   - 30vh spacer at the bottom so the last card has room to scroll into
//     view before the next section starts.
export function Initiatives() {
  return (
    <div className="relative">
      <div className="sticky top-0">
        <InitiativesHeader />
      </div>

      {INITIATIVES.map((i, idx) => (
        <div
          key={i.n}
          // bg-paper fills the wrapper behind the panel so the rounded-corner
          // cutouts on each card show paper-white instead of the taupe page bg —
          // hides the dark peek where adjacent cards' corners meet.
          className="sticky bg-paper"
          style={{ top: `${2 + idx * 1.5}rem` }}
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
