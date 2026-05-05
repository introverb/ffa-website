'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { InitiativesHeader } from './InitiativesHeader';
import { Panel } from '@/components/PageFrame';
import { Placeholder } from '@/components/Placeholder';
import { INITIATIVES } from '@/lib/content';

// Sticky offsets (rem) for each card. Header pins at top-[5rem]; cards stack
// 2rem below the header (card 0 at 7rem) with 1.5rem peeks between cards.
const TOP_OFFSETS_REM = [7, 8.5, 10];

// Initiatives band — astronaut header plus three sticky-stacking cards.
//
// Behaviour: cards stack on scroll-down via CSS sticky as before. On
// scroll-up, the deck stays stacked instead of decomposing — this is the
// "ratchet" the user asked for. We do this by promoting each pinned card
// from position:sticky to position:fixed once it's pinned, and only
// releasing them when the whole section exits the viewport. Placeholder
// wrappers maintain document height so the page doesn't jump on
// promotion/demotion.
export function Initiatives() {
  const containerRef = useRef<HTMLDivElement>(null);
  const placeholderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardHeights, setCardHeights] = useState<number[]>(() =>
    INITIATIVES.map(() => 0),
  );
  // pinnedCount is the number of cards currently locked as fixed. Ratchets
  // up while scrolling within the section, drops to 0 when the section
  // exits the viewport (above or below).
  const [pinnedCount, setPinnedCount] = useState(0);
  // Container's left edge + width, used to size fixed-positioned cards so
  // they line up with the panel column. Updated on scroll and resize.
  const [bounds, setBounds] = useState({ left: 0, width: 0 });

  // Track each card's natural height so the placeholder wrapper can hold
  // that space when the card promotes to fixed.
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    function measure() {
      const heights = cardRefs.current.map((ref) => ref?.offsetHeight ?? 0);
      setCardHeights((prev) => {
        if (prev.every((h, i) => h === heights[i])) return prev;
        return heights;
      });
    }
    measure();
    const observers = cardRefs.current
      .filter((r): r is HTMLDivElement => Boolean(r))
      .map((ref) => {
        const obs = new ResizeObserver(measure);
        obs.observe(ref);
        return obs;
      });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Scroll handler: update bounds, ratchet pinnedCount on scroll-down,
  // release when the section exits the viewport.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let lastScrollY = window.scrollY;

    function update() {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();

      // Keep horizontal bounds in sync for fixed cards.
      setBounds((prev) => {
        if (
          Math.abs(prev.left - rect.left) < 0.5 &&
          Math.abs(prev.width - rect.width) < 0.5
        ) {
          return prev;
        }
        return { left: rect.left, width: rect.width };
      });

      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      lastScrollY = currentScrollY;

      // Section above viewport top (rect.top > 0) or fully below it
      // (rect.bottom < 0) → release all locks.
      if (rect.top > 0 || rect.bottom < 0) {
        setPinnedCount(0);
        return;
      }

      // While scrolling up within the section, hold the current lock state.
      if (!scrollingDown) return;

      // Scrolling down: count how many cards have pinned and ratchet up.
      let count = 0;
      for (let i = 0; i < placeholderRefs.current.length; i++) {
        const ph = placeholderRefs.current[i];
        if (!ph) break;
        const phRect = ph.getBoundingClientRect();
        const offsetPx = TOP_OFFSETS_REM[i] * 16;
        if (phRect.top <= offsetPx + 1) count = i + 1;
      }
      setPinnedCount((prev) => Math.max(prev, count));
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="sticky top-[5rem]">
        <InitiativesHeader />
      </div>

      {INITIATIVES.map((i, idx) => {
        const isLocked = idx < pinnedCount;
        const offsetRem = TOP_OFFSETS_REM[idx];
        return (
          <div
            key={i.n}
            ref={(el) => {
              placeholderRefs.current[idx] = el;
            }}
            className="bg-paper"
            // When locked, hold the card's natural height so the document
            // doesn't collapse around the now-fixed child.
            style={isLocked ? { height: cardHeights[idx] } : undefined}
          >
            <div
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className={isLocked ? '' : 'sticky bg-paper'}
              style={
                isLocked
                  ? {
                      position: 'fixed',
                      top: `${offsetRem}rem`,
                      left: bounds.left,
                      width: bounds.width,
                      zIndex: 20 + idx,
                    }
                  : { top: `${offsetRem}rem` }
              }
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
          </div>
        );
      })}

      <div aria-hidden className="h-[30vh]" />
    </div>
  );
}
