'use client';

import { useCallback, useRef } from 'react';
import { OURS } from './tokens';
import { ARTWORKS, isSoldOut } from '@/lib/storefront';
import { BuyModal } from '@/components/storefront/BuyModal';

// Systems of Power — Anyanwu's pyramid: the blueprint, the game, and
// the invitation to keep playing. "The Documents" treatment: the
// technical plate full width with a magnifier loupe (it rewards close
// reading), the printed rules card beside a transcribed how-to-play,
// the online version linked, and the sculpture itself collectable
// through the standard storefront modal. The floating pyramid beside
// the intro is the sculpture cut from its photography.

const LOUPE_SIZE = 260;
const LOUPE_ZOOM = 2.4;

export function SystemsSection() {
  const loupeRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);

  const hideLoupe = useCallback(() => {
    if (loupeRef.current) loupeRef.current.style.display = 'none';
  }, []);
  const onZoomMove = useCallback((e: React.MouseEvent) => {
    const loupe = loupeRef.current;
    const plate = plateRef.current;
    if (!loupe || !plate) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const p = plate.getBoundingClientRect();
    const rx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const ry = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    loupe.style.display = 'block';
    loupe.style.left = `${e.clientX - p.left - LOUPE_SIZE / 2}px`;
    loupe.style.top = `${e.clientY - p.top - LOUPE_SIZE / 2}px`;
    loupe.style.backgroundSize = `${r.width * LOUPE_ZOOM}px ${r.height * LOUPE_ZOOM}px`;
    loupe.style.backgroundPosition = `${-(rx * r.width * LOUPE_ZOOM - LOUPE_SIZE / 2)}px ${-(
      ry * r.height * LOUPE_ZOOM -
      LOUPE_SIZE / 2
    )}px`;
  }, []);

  const pyramid = ARTWORKS.find((a) => a.id === 'anyanwu-pyramid');
  const pyramidBuyable = pyramid && !isSoldOut(pyramid) && pyramid.status === 'available';

  return (
    <div className="mt-8">
      {/* ---------------- intro + the floating pyramid ---------------- */}
      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:items-center">
        <div className="max-w-[68ch] space-y-5 text-body-lg leading-relaxed text-ink/85">
          <p>
            Anyanwu&rsquo;s Systems of Power turned the mechanics of hierarchy into
            an object and a playable game. The blueprints and rules are here; so is
            the invitation to play.
          </p>
          <p>
            The game is cooperative: six players, each the Caretaker of one system
            of society, and nobody wins alone. If any system collapses, the entire
            table fails together.
          </p>
        </div>
        <div className="ours-sop-float hidden items-center justify-center md:flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ours/sop-pyramid.webp"
            alt="Anyanwu's Pyramid — a hand-painted stepped sculpture with terraced levels, figures, and trees on a circular base."
            className="h-auto w-full max-w-[380px]"
            draggable={false}
          />
        </div>
      </div>

      {/* ---------------- the blueprint ---------------- */}
      <div className="mt-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: OURS.orange }}>
          The Blueprint
        </p>
        <hr className="mt-1.5 h-[2px] w-12 border-0" style={{ background: OURS.orange }} />
        <div ref={plateRef} className="relative mt-5 overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ours/sop-blueprint.webp"
            alt="Reimagining the Pyramid — Anyanwu's technical blueprint: elevations, cross-sections, and a program key for the monument to knowledge."
            className="block h-auto w-full"
            style={{ cursor: 'zoom-in' }}
            onMouseMove={onZoomMove}
            onMouseLeave={hideLoupe}
            draggable={false}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{ boxShadow: `inset 0 0 0 1px ${OURS.orange}` }}
          />
          {/* magnifier loupe — the plate rewards close reading */}
          <div
            ref={loupeRef}
            aria-hidden
            className="pointer-events-none absolute z-10"
            style={{
              display: 'none',
              width: LOUPE_SIZE,
              height: LOUPE_SIZE,
              border: `1px solid ${OURS.hair}`,
              background: `#0a1f4d url(/images/ours/sop-blueprint.webp) no-repeat`,
            }}
          />
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: OURS.gray }}>
          Reimagining the Pyramid — a contemporary monument to knowledge · hover to magnify
        </p>
      </div>

      {/* ---------------- the game ---------------- */}
      <div className="mt-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: OURS.orange }}>
          The Game
        </p>
        <hr className="mt-1.5 h-[2px] w-12 border-0" style={{ background: OURS.orange }} />
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div className="overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/ours/sop-rules.webp"
              alt="The printed Systems of Power rules card: objective, the six systems, flow of play, integrity scale, and the scan-to-play code."
              className="block h-auto w-full"
              draggable={false}
            />
          </div>
          <div className="space-y-5 text-body leading-relaxed text-ink/85">
            <div>
              <p className="font-heading text-[15px] uppercase" style={{ color: OURS.ink }}>
                How to play
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  Six players, each the Caretaker of one system of society —
                  Housing, Health, Education, Environment, Infrastructure, Economy —
                  with its integrity tracked from 0 to 100%.
                </li>
                <li>
                  Twelve rounds. On your turn, draw a card and play it immediately:
                  Grow strengthens your own system, Support helps another player,
                  Crisis lowers integrity and creates setbacks.
                </li>
                <li>
                  Negotiate before acting — discuss who is most vulnerable and
                  where help is needed most. Under 30% a system is in crisis; at 0%
                  it collapses, and the game ends immediately for everyone.
                </li>
                <li>
                  Survive all twelve rounds and the group is scored by the total
                  integrity left on the table. Balance, negotiation, and collective
                  survival.
                </li>
              </ul>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 pt-1">
              <a
                href="https://weareanyanwu.com/SystemsOfPower"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] uppercase tracking-[0.16em] transition-opacity hover:opacity-70"
                style={{ color: OURS.orange }}
              >
                Play it online →
              </a>
              {pyramid && pyramidBuyable && (
                <BuyModal
                  artwork={pyramid}
                  returnSection="systems"
                  triggerLabel="Collect the Pyramid →"
                />
              )}
              {pyramid && !pyramidBuyable && (
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.14em]"
                  style={{ color: OURS.gray }}
                >
                  <span style={{ color: OURS.orange }}>●</span> Pyramid sold
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ours-sop-bob {
          from {
            transform: translateY(-7px) rotate(-1deg);
          }
          to {
            transform: translateY(7px) rotate(1deg);
          }
        }
        .ours-sop-float img {
          animation: ours-sop-bob 6.5s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .ours-sop-float img {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
