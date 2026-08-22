'use client';

import { useState } from 'react';
import { OURS } from './tokens';
import { ProgramBook } from './ProgramBook';
import { Lightbox } from './Lightbox';
import { ARTWORKS } from '@/lib/storefront';
import { BuyModal } from '@/components/storefront/BuyModal';

// Photographs from the evening, running as two staggered columns down
// the right side of the section. Sourced from
// FFA/OURS/Photography/OURS Webpage, compressed to ~900px webp.
// Order is deliberate — sequenced so similar subjects (the Sev figure,
// the Materia wall, the two talk shots, the two RERO frames) never
// land next to each other in a column. Even indices fill the left
// column, odd the right.
const EVENING_PHOTOS: { file: string; alt: string }[] = [
  { file: 'event1', alt: 'A speaker addressing the room mid-talk, guests gathered behind.' },
  { file: 'ap8_1747', alt: 'Guest studying Denis Pakowacz’s framed Magnetobiology series.' },
  { file: 'ap8_2016', alt: 'Two guests beside Sev Gedra’s amber-crowned figure O Quam Cito.' },
  { file: 'ap8_4050', alt: 'Crowd reading the Ledgerworks wall’s circuit-diagram hang.' },
  { file: 'ap8_1939', alt: 'Giorgia Lupi beside her framed work 02 Blue.' },
  { file: 'ap8_2451', alt: 'Guest leaning in to read the placard beside Materia Alchemical.' },
  { file: 'ap8_4038', alt: 'Guests in conversation beside Paradise of Rumors.' },
  { file: 'event2', alt: 'A talk in progress before RERO’s A NEW CITY WILL BE BUILT…, guests listening along the wall.' },
  { file: 'ap8_2818', alt: 'Guest with the printed program between paintings, next to O Quam Cito.' },
  { file: 'ap8_2086', alt: 'Guest on the wall of works, with the Little Martian vitrine at right.' },
  { file: 'ap8_2865', alt: 'Guests gathered before Materia Alchemical’s lattice of sample tiles.' },
  { file: 'ap8_4131', alt: 'RERO’s A NEW CITY WILL BE BUILT… with a guest passing by.' },
  { file: 'ap8_2986', alt: 'Guest photographing Sev Gedra’s linen-wrapped figure.' },
  { file: 'ap8_4125', alt: 'Guest pointing out a detail mid-conversation at the gallery wall.' },
  { file: 'event3', alt: 'A speaker beside the wall of triangular beadwork hangings.' },
  { file: 'event4', alt: 'A guest holding the Little Martian ceramic beside its glass vitrine.' },
  { file: 'event5', alt: 'Guests gathered around the Visions of the Future screening.' },
  { file: 'event6', alt: 'Two guests before the Ledgerworks wall, its works linked by the circuit diagram.' },
];

// "About the Event" contents, as three numbered blocks in the left
// column (the evening's photographs run down the right):
//
//   01 · The Event     — what the night actually was
//   02 · The Roster    — the printed program, interactive
//   03 · The Manifesto — the frosted acrylic from the entrance wall
//
// Manifesto text is the FINAL acrylic version from
// FFA/OURS/Materials/Program/OURS_Placard_Copy_v2.md. The sign PDF itself
// is outlined to vector paths, so it carries no recoverable text.
const MANIFESTO = [
  'The stories we tell shape the world we build. For too long, our stories have been stories of decline. Doom. Dystopia. Disaster. We’ve heard them so often we’ve started to believe them.',
  'Enough.',
  'We are capable of much better stories. Not fairy tales, but visions seen with clear eyes and brought into reality by capable hands: what people can build, what futures are worth fighting for, and the fact that we still get to choose which one we live in.',
  'Tonight is that shift made tangible: optimistic, realistic visions, that we’re acting on right now. The future isn’t something we wait for. It’s something we imagine, plan, and create. It’s OURS.',
];

function Block({
  index,
  title,
  note,
  children,
}: {
  index: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="w-full">
      {/* Same mono/orange treatment the expanded panel's own header uses,
          so every heading on the page belongs to one system. */}
      <div className="flex items-baseline gap-4">
        {/* globals.css puts every heading in the display face, so an <h3>
            would not match the mono titles beside it. Family and weight are
            pinned here to keep all the titles on this page identical. */}
        <h3
          className="font-mono text-[11px] uppercase tracking-[0.14em]"
          style={{ color: OURS.orange, fontFamily: 'ui-monospace, Menlo, Consolas, monospace', fontWeight: 400 }}
        >
          {index} &middot; {title}
        </h3>
        {note && (
          <span
            className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: OURS.gray }}
          >
            {note}
          </span>
        )}
      </div>
      <hr className="mt-4 h-px border-0" style={{ background: OURS.orange }} />
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function AboutSection() {
  // Tapping any evening photo opens it full-screen (pinch to zoom,
  // swipe through the set) — on phones the grid is a swipe strip of
  // thumbnails, so the lightbox is where you actually look at them.
  const [lb, setLb] = useState<number | null>(null);
  const lbItems = EVENING_PHOTOS.map((p) => ({ src: `/images/ours/evening/${p.file}.webp`, alt: p.alt }));
  return (
    // Two columns from lg up: the numbered blocks (and their divider
    // rules) stay left; the right side carries the evening's photographs
    // instead of letting the rules run the full panel width. Below lg
    // the photos simply follow the content.
    <div className="mt-8 lg:grid lg:grid-cols-[1.55fr_1fr] lg:items-start lg:gap-14">
      <div className="space-y-16">
      <Block index="01" title="The Event">
        <div className="max-w-[68ch] space-y-5 text-body-lg leading-relaxed text-ink/85">
          <p>
            On the evening of August 9th, 2026, artists, scientists, thinkers and
            builders came together on the Lower East Side to enjoy and discuss
            positive visions of our future: what it could look like, who is already
            building it, and what it asks of the rest of us.
          </p>
          <p>
            Two talks set the room alight.{' '}
            <strong className="font-heading">Erika Alden DeBenedictis</strong> on
            terraforming Mars, and{' '}
            <strong className="font-heading">Geoff Anders</strong> on building a
            philosophy for a better tomorrow. Between them the walls carried the rest
            of the argument: a gallery of original work, a wall of art made natively
            onchain, an installation of futures described by the people building them,
            and a pyramid you could play.
          </p>
        </div>
      </Block>

      <Block index="02" title="The Catalog">
        {/* Order a printed copy — the $7 catalog entry rides the same
            storefront checkout as the works (lib/storefront.ts). */}
        {(() => {
          const program = ARTWORKS.find((a) => a.id === 'ours-printed-program');
          return program ? (
            <div className="mb-2">
              <BuyModal
                artwork={program}
                returnSection="about"
                triggerLabel="Order a copy — $10 →"
                triggerClassName="ours-buy inline-block border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors"
                triggerStyle={{ borderColor: OURS.orange, color: OURS.orange }}
              />
            </div>
          ) : null;
        })()}
        <ProgramBook />
      </Block>

      <Block index="03" title="The Manifesto">
        <div className="max-w-[68ch] space-y-5">
          {MANIFESTO.map((para) =>
            para === 'Enough.' ? (
              // Body size, just capitalised and in orange — the emphasis is
              // the colour and the isolation, not scale.
              <p
                key={para}
                className="text-body-lg uppercase leading-relaxed tracking-[0.06em]"
                style={{ color: OURS.orange }}
              >
                {para}
              </p>
            ) : (
              <p key={para.slice(0, 24)} className="text-body-lg leading-relaxed text-ink/85">
                {para}
              </p>
            )
          )}
        </div>
      </Block>
      </div>

      {/* The evening: two staggered photo columns from md up; a
          horizontal swipe strip on phones (18 photos in two 140px
          columns was a wall of thumbnails). Every photo opens the
          lightbox. */}
      <aside aria-label="Photographs from the evening" className="mt-16 lg:mt-0">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] md:hidden" style={{ color: OURS.gray }}>
          The evening · swipe, tap to open
        </p>
        <div
          className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 md:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {EVENING_PHOTOS.map((p, i) => (
            <button
              key={p.file}
              type="button"
              onClick={() => setLb(i)}
              className="w-[82%] shrink-0 snap-center overflow-hidden rounded-lg"
              aria-label={p.alt}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/ours/evening/${p.file}.webp`} alt={p.alt} loading="lazy" className="block h-auto w-full" />
            </button>
          ))}
        </div>
        <div className="hidden gap-3 md:flex">
          {[0, 1].map((col) => (
            <div key={col} className={`flex-1 space-y-3 ${col === 1 ? 'pt-12' : ''}`}>
              {EVENING_PHOTOS.map((p, i) => ({ p, i }))
                .filter(({ i }) => i % 2 === col)
                .map(({ p, i }) => (
                  <button
                    key={p.file}
                    type="button"
                    onClick={() => setLb(i)}
                    className="block w-full cursor-zoom-in transition-opacity hover:opacity-90"
                    aria-label={p.alt}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/images/ours/evening/${p.file}.webp`} alt={p.alt} loading="lazy" className="block h-auto w-full" />
                  </button>
                ))}
            </div>
          ))}
        </div>
      </aside>

      {lb != null && (
        <Lightbox items={lbItems} index={lb} onIndexChange={setLb} onClose={() => setLb(null)} />
      )}
    </div>
  );
}
