'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { OURS, SECTIONS, type Section, type SectionId } from './tokens';
import { LedgerworksSection } from './LedgerworksSection';
import { GallerySection } from './GallerySection';
import { AboutSection } from './AboutSection';
import { ARTWORKS, type Artwork } from '@/lib/storefront';

// ---------------------------------------------------------------------------
// The louver wall — the OURS page's primary navigation.
//
// Six full-bleed slats stand side by side like a gallery wall. At rest
// each slat shows its image crisp across the top half, with the bottom
// half behind real frosted glass (backdrop-blur) carrying the section
// label — so the label is legible without a scrim flattening the image.
//
// Clicking a slat expands it and compresses the other five to ribs. The
// expanded section's contents open *below* the wall rather than inside
// the slat, so the wall stays intact while you read. One section open at
// a time; clicking the open slat closes it.
//
// Below md the wall doesn't work — six slats can't share a phone's
// width — so it degrades to a stack of horizontal image bars using the
// same accordion behaviour and the same frosted label treatment.
// ---------------------------------------------------------------------------

// Sections with real contents built; these suppress the placeholder blurb.
const BUILT_OUT = new Set<SectionId>(['about', 'gallery', 'ledgerworks']);

// Sections not yet built out ship grayed out and inert — desaturated
// slat, muted label, no expand — until their contents land.
const UNFINISHED = new Set<SectionId>(['visions', 'systems', 'thanks']);

// The expanded panel can title itself differently from its slat: the
// About panel opens on the manifesto, so its header names that.
const PANEL_TITLE: Partial<Record<SectionId, string>> = { about: 'Manifesto' };

const WALL_HEIGHT = 560;
const RIB_WIDTH = 76;

export function LouverWall() {
  const [open, setOpen] = useState<SectionId | null>(null);
  // Post-checkout thank-you: Stripe's success_url sends buyers back to
  // /ours?thanks=<artworkId>&sec=<section> (see the storefront-checkout
  // route). On mount, open the section they left, show the thank-you
  // modal, and strip the query so a refresh doesn't replay it. Read via
  // window.location rather than useSearchParams so the page stays
  // static (no Suspense boundary needed for a one-shot read).
  const [thanks, setThanks] = useState<Artwork | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sec = params.get('sec') as SectionId | null;
    const thanksId = params.get('thanks');
    if (sec && SECTIONS.some((s) => s.id === sec) && !UNFINISHED.has(sec)) setOpen(sec);
    if (thanksId) {
      const art = ARTWORKS.find((a) => a.id === thanksId);
      if (art) setThanks(art);
    }
    if (sec || thanksId) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const toggle = (id: SectionId) => {
    if (UNFINISHED.has(id)) return;
    setOpen((cur) => (cur === id ? null : id));
  };
  const openSection = SECTIONS.find((s) => s.id === open) ?? null;

  return (
    <div>
      {thanks && <ThanksModal artwork={thanks} onClose={() => setThanks(null)} />}

      {/* ---------------- Desktop: the wall ---------------- */}
      <div className="hidden gap-[3px] md:flex" style={{ height: WALL_HEIGHT }}>
        {SECTIONS.map((s) => (
          <Slat key={s.id} section={s} isOpen={open === s.id} anyOpen={open !== null} onClick={() => toggle(s.id)} />
        ))}
      </div>

      {/* Expanded contents, desktop. Rendered under the wall so the
          wall never has to host a full section inside a slat. */}
      {openSection && (
        <div className="hidden md:block">
          <ExpandedSection section={openSection} />
        </div>
      )}

      {/* ---------------- Mobile: stacked bars ---------------- */}
      <div className="space-y-3 md:hidden">
        {SECTIONS.map((s) => {
          const isOpen = open === s.id;
          const unfinished = UNFINISHED.has(s.id);
          return (
            <div key={s.id} className="overflow-hidden rounded-xl" style={{ background: OURS.ink }}>
              <button
                onClick={() => toggle(s.id)}
                aria-expanded={isOpen}
                aria-disabled={unfinished || undefined}
                className="relative flex h-32 w-full items-end overflow-hidden text-left"
                style={{ cursor: unfinished ? 'default' : undefined }}
              >
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                  style={
                    unfinished
                      ? { filter: 'grayscale(1) brightness(0.92)', opacity: 0.55 }
                      : undefined
                  }
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
                  style={{
                    backdropFilter: 'blur(12px) saturate(0.8)',
                    WebkitBackdropFilter: 'blur(12px) saturate(0.8)',
                    background: 'linear-gradient(to top, rgba(40,40,40,0.62), rgba(40,40,40,0.3))',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%)',
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 22%)',
                  }}
                />
                <span className="relative flex w-full items-end justify-between gap-3 p-4">
                  <span>
                    <span
                      className="block font-mono text-[10px] tracking-[0.14em]"
                      style={{ color: unfinished ? 'rgba(240,238,235,0.5)' : OURS.orange }}
                    >
                      {s.index}
                    </span>
                    <span
                      className="mt-1 block font-heading text-h6 uppercase leading-none text-paper"
                      style={unfinished ? { color: 'rgba(240,238,235,0.55)' } : undefined}
                    >
                      {s.title}
                    </span>
                  </span>
                  {unfinished ? (
                    <span
                      className="font-mono text-[9px] uppercase tracking-[0.14em]"
                      style={{ color: 'rgba(240,238,235,0.45)' }}
                    >
                      Soon
                    </span>
                  ) : (
                    <span
                      className="font-mono text-lg leading-none transition-transform duration-300"
                      style={{ color: OURS.orange, transform: isOpen ? 'rotate(45deg)' : 'none' }}
                    >
                      +
                    </span>
                  )}
                </span>
              </button>
              {isOpen && (
                <div className="bg-paper p-5">
                  <p className="text-body leading-relaxed text-ink/85">{s.blurb}</p>
                  <SectionContents section={s} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Post-purchase thank-you, in the buy modal's own visual language
// (white card, rounded-2xl, thin orange outline) so returning from
// Stripe reads as the modal they left transformed, not a new page.
// ✕ or backdrop dismisses back onto the section beneath.
function ThanksModal({ artwork, onClose }: { artwork: Artwork; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  const isProgram = artwork.id === 'ours-printed-program';
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        aria-hidden
        className="fixed inset-0"
        style={{
          background: 'rgba(40,40,40,0.35)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
        onMouseDown={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Order confirmed"
        className="relative w-full max-w-md rounded-2xl bg-white p-8 md:p-10"
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          border: `1px solid ${OURS.orange}`,
          boxShadow: '0 24px 60px -24px rgba(40,40,40,0.45)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white font-mono text-sm"
          style={{ color: OURS.ink, boxShadow: `inset 0 0 0 1px ${OURS.orange}` }}
        >
          ✕
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: OURS.orange }}>
          OURS · Collect
        </p>
        <h3 className="mt-3 text-h4 leading-tight text-ink">Thank you!</h3>
        <p className="mt-4 text-body leading-relaxed text-ink/85">
          Your order of <em>{artwork.title}</em> is confirmed — a receipt is on its way to
          your email
          {isProgram
            ? ', and your copy will be in the mail shortly.'
            : ', and we’ll reach out about delivery.'}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-7 font-mono text-[11px] uppercase tracking-[0.16em] transition-opacity hover:opacity-70"
          style={{ color: OURS.orange }}
        >
          Back to the page →
        </button>
      </div>
    </div>
  );
}

function Slat({
  section,
  isOpen,
  anyOpen,
  onClick,
}: {
  section: Section;
  isOpen: boolean;
  anyOpen: boolean;
  onClick: () => void;
}) {
  // Collapsed to a rib because a different slat is open.
  const isRib = anyOpen && !isOpen;
  const unfinished = UNFINISHED.has(section.id);
  return (
    <button
      onClick={onClick}
      aria-expanded={isOpen}
      aria-disabled={unfinished || undefined}
      className="group relative overflow-hidden rounded-lg text-left transition-[flex] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        // Open slat takes the room; when something else is open this one
        // collapses to a rib. With nothing open all six share evenly.
        flex: isOpen ? '1 1 0%' : anyOpen ? `0 0 ${RIB_WIDTH}px` : '1 1 0%',
        background: OURS.ink,
        cursor: unfinished ? 'default' : undefined,
      }}
    >
      <Image
        src={section.image}
        alt=""
        fill
        sizes="(max-width: 1024px) 50vw, 900px"
        className={`object-cover transition-transform duration-700 ${
          unfinished ? '' : 'group-hover:scale-[1.04]'
        }`}
        style={{
          filter: unfinished ? 'grayscale(1) brightness(0.92)' : undefined,
          opacity: unfinished ? 0.55 : undefined,
          // A rib is 76px wide against a ~230px resting slat, so the same
          // object-position lands somewhere quite different. Sections that
          // need it declare a separate rib framing.
          objectPosition:
            (isRib && section.imagePositionRib) || section.imagePosition || undefined,
          transition: 'object-position 600ms cubic-bezier(0.22,1,0.36,1), transform 700ms',
        }}
      />

      {/* Frosted glass over the lower half. Dropped entirely on the open
          slat so its image reads clean edge to edge. The mask feathers
          the top edge so glass meets crisp image as a soft seam. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 transition-opacity duration-500"
        style={{
          opacity: isOpen ? 0 : 1,
          backdropFilter: 'blur(14px) saturate(0.75)',
          WebkitBackdropFilter: 'blur(14px) saturate(0.75)',
          background: 'linear-gradient(to top, rgba(40,40,40,0.62), rgba(40,40,40,0.34))',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%)',
        }}
      />

      {/* Label. Vertical while the slat is a rib or resting; horizontal
          once open, sitting in its own soft gradient. */}
      <span
        className={`absolute inset-x-0 bottom-0 flex flex-col items-center justify-end gap-3 p-4 ${
          isOpen ? '' : 'h-1/2'
        }`}
        style={
          isOpen
            ? { background: 'linear-gradient(to top, rgba(40,40,40,0.9), rgba(40,40,40,0))' }
            : undefined
        }
      >
        <span
          className="font-mono text-[10px] tracking-[0.14em]"
          style={{ color: unfinished ? 'rgba(240,238,235,0.5)' : OURS.orange }}
        >
          {section.index}
        </span>
        <span
          className="font-heading uppercase leading-none text-paper"
          style={{
            writingMode: isOpen ? 'horizontal-tb' : 'vertical-rl',
            transform: isOpen ? 'none' : 'rotate(180deg)',
            fontSize: isOpen ? 28 : 18,
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            textShadow: '0 1px 12px rgba(0,0,0,0.4)',
            color: unfinished ? 'rgba(240,238,235,0.55)' : undefined,
          }}
        >
          {section.title}
        </span>
        {unfinished && !isRib && (
          <span
            className="font-mono text-[9px] uppercase tracking-[0.14em]"
            style={{ color: 'rgba(240,238,235,0.45)' }}
          >
            Soon
          </span>
        )}
      </span>

      {/* Orange hairline marks the open slat, matching the header's
          stroke and the program's orange rules. */}
      {isOpen && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg"
          style={{ boxShadow: `inset 0 0 0 1px ${OURS.orange}` }}
        />
      )}
    </button>
  );
}

function ExpandedSection({ section }: { section: Section }) {
  return (
    <div className="pt-10">
      <div className="flex items-start justify-between gap-8 border-t pt-8" style={{ borderColor: OURS.hair }}>
        <div>
          {/* Sections that supply their own numbered blocks don't need a
              panel header on top of them. */}
          {!BUILT_OUT.has(section.id) && (
            <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: OURS.orange }}>
              {section.index} · {PANEL_TITLE[section.id] ?? section.title}
            </p>
          )}
          {/* Sections that have been built out tell their own story; the
              teaser blurb is scaffolding for the ones that haven't. */}
          {!BUILT_OUT.has(section.id) && (
            <p className="mt-4 max-w-prose text-body-lg leading-relaxed text-ink/85">
              {section.blurb}
            </p>
          )}
        </div>
      </div>
      <SectionContents section={section} />
    </div>
  );
}

// Per-section interactive contents. Each of these gets built out in
// turn — the 3D program, the gallery focus view, the Ledgerworks wall,
// the Visions installation, the Systems of Power pyramid and game, and
// the thanks/next panel. Placeholder until then.
function SectionContents({ section }: { section: Section }) {
  // Ledgerworks is the first section with real contents: the wall
  // photograph with The Pope actually playing in the display.
  if (section.id === 'about') {
    return <AboutSection />;
  }
  if (section.id === 'gallery') {
    return <GallerySection />;
  }
  if (section.id === 'ledgerworks') {
    return <LedgerworksSection />;
  }
  return (
    <div
      className="mt-8 flex h-[320px] items-center justify-center rounded-xl border border-dashed"
      style={{ borderColor: OURS.hair, background: OURS.cream }}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: OURS.gray }}>
        {section.title} — contents to come
      </p>
    </div>
  );
}
