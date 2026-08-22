'use client';

import { OURS } from './tokens';
import { ARTWORKS, isSoldOut } from '@/lib/storefront';
import { BuyModal } from '@/components/storefront/BuyModal';

// Systems of Power — Anyanwu's pyramid: the blueprint, the game, and
// the invitation to keep playing. "The Documents" treatment: the
// technical plate full width, the printed rules card beside a
// transcribed how-to-play, the online version linked, and the
// sculpture itself collectable through the standard storefront modal.
// The floating pyramid beside the intro is the sculpture cut from its
// photography, graded to the finish it wore on the night.

export function SystemsSection() {
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
        <div className="relative mt-5 overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ours/sop-blueprint.webp"
            alt="Reimagining the Pyramid — Anyanwu's technical blueprint: elevations, cross-sections, and a program key for the monument to knowledge."
            className="block h-auto w-full"
            draggable={false}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{ boxShadow: `inset 0 0 0 1px ${OURS.orange}` }}
          />
        </div>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] md:text-[10px]" style={{ color: OURS.gray }}>
          Reimagining the Pyramid — a contemporary monument to knowledge
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
