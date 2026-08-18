'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { OURS } from './tokens';
import { WORKS, type Work, type WorkPanel } from './gallery-works';
import { ARTWORKS, isSoldOut, unitsRemaining } from '@/lib/storefront';
import { BuyModal } from '@/components/storefront/BuyModal';

// Gallery — "Constellation". The 11 works sit as a hand-composed scatter
// field inside the white panel: no grid, no rows, each work occupying
// space proportional to its presence. Hover brings a work forward and
// recedes the rest; click promotes it to centre stage at full scale and
// unfolds its placard and text panels beneath. Positions live in
// gallery-works.ts alongside the copy.
//
// Every state is expressed as translate3d + scale from a 0,0 origin, so
// hover, promotion, and return all ride the same transform transition
// (a free FLIP — no layout is ever animated). Idle drift and scroll
// parallax live on their own inner layers so they compose with, rather
// than fight, the state transform. Under prefers-reduced-motion the
// scatter is replaced wholesale by a static two-column grid.

const N = WORKS.length;
const wrap = (i: number) => ((i % N) + N) % N;

// Width of a work at scale 1, as % of field width, normalised by
// sqrt(aspect) so wide and tall pieces read with similar visual area.
const BASE_W = 24;
const FIELD_HEIGHT = '175vh';
// On promotion the field collapses to just the staged work — no dead
// space above it. STAGE_TOP reserves a row for the back-to-gallery link.
const STAGE_TOP = 56;
const STAGE_BOTTOM = 24;

// Hover loupe over the promoted work, for the pieces with fine detail.
const LOUPE_SIZE = 240;
const LOUPE_ZOOM = 2.2;

// Pixel-dust mask for works flagged dustBottom. The mask PNG is
// generated offline against the actual image at its native resolution:
// from ~86% down, the garment dissolves as a stochastically dithered
// gradient — 3px grain (~1px on screen) whose density ramps smoothly to
// nothing, plus sparse larger motes — sampled from the image so dust
// only forms where fabric actually is. Both hands are protected — the
// far hand by a solid region, the near hand by a polygon hugging its
// silhouette — so only the torso fades. The current file is tuned to
// Sev's figure; regenerate it if the image is recut or another work
// adopts the flag.
const DUST_MASK = 'url(/images/ours/sev-dust-mask.png)';

const DUST_STYLE: React.CSSProperties = {
  WebkitMaskImage: DUST_MASK,
  maskImage: DUST_MASK,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
};

const HOVER_EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)';
const PROMOTE_EASE = 'cubic-bezier(0.32, 0.72, 0.28, 1)';

// scale 0.45–1.0 → 0..1, for opacity falloff and parallax speed
const depth = (scale: number) => Math.min(1, Math.max(0, (scale - 0.45) / 0.55));

function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

type Geometry = {
  restW: number;
  restH: number;
  featW: number;
  featH: number;
  x: number;
  y: number;
  scale: number;
  z: number;
};

function geometry(work: Work, tablet: boolean, cw: number, ch: number, vh: number): Geometry {
  const p = tablet ? work.posTablet : work.pos;
  const restW = ((p.scale * BASE_W * Math.sqrt(work.aspect)) / 100) * cw;
  const restH = restW / work.aspect;
  // Promoted size: as large as possible while the whole work stays in
  // the viewport once the page has scrolled to the stage — viewport
  // height minus the scroll offset (24), the back-link row (STAGE_TOP)
  // and bottom breathing room (24). Width-capped to the left column;
  // the placard and text panels occupy the right 38%.
  const featMaxH = Math.max(320, vh - 104);
  const featW = Math.min(cw * 0.58, featMaxH * work.aspect);
  const featH = featW / work.aspect;
  return { restW, restH, featW, featH, x: p.x, y: p.y, scale: p.scale, z: p.z };
}

export function GallerySection() {
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const tablet = useMedia('(min-width: 768px) and (max-width: 1023px)');

  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  // True while the return-to-field animation is still travelling, so the
  // reverse move keeps the promotion's duration instead of the hover one.
  const [settling, setSettling] = useState(false);

  const fieldRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Which work should get focus back when the detail view closes.
  const returnFocusTo = useRef<number | null>(null);

  const [box, setBox] = useState({ cw: 0, vh: 800 });
  // Height of the placard/panels column while a work is promoted — the
  // field must be tall enough for whichever is taller, work or text.
  const [detailH, setDetailH] = useState(0);
  // Resting positions are laid out against the field's *resting* height,
  // never its measured one — the field collapses while a work is
  // promoted, and the faded-out works must not reshuffle under it.
  const restCh = box.vh * 1.75;

  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    const measure = () => setBox({ cw: el.clientWidth, vh: window.innerHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [reduced]);

  const select = useCallback((i: number) => {
    returnFocusTo.current = i;
    setSelected(i);
    setHovered(null);
  }, []);

  const close = useCallback(() => {
    setSelected(null);
    setSettling(true);
    window.setTimeout(() => setSettling(false), 560);
    const back = returnFocusTo.current;
    returnFocusTo.current = null;
    if (back != null) buttonRefs.current[back]?.focus({ preventScroll: true });
  }, []);

  const step = useCallback((d: -1 | 1) => {
    setSelected((cur) => {
      if (cur == null) return cur;
      const next = wrap(cur + d);
      returnFocusTo.current = next;
      return next;
    });
  }, []);

  // Esc closes; arrow keys step through the fixed order while open.
  useEffect(() => {
    if (selected == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selected != null, close, step]); // eslint-disable-line react-hooks/exhaustive-deps

  // On promotion: bring the stage into view, then hand focus to the
  // detail region (light trap — the hidden works also drop out of the
  // tab order below, so Tab stays inside the placard and panels).
  useEffect(() => {
    if (selected == null) return;
    if (!reduced && fieldRef.current && box.cw > 0) {
      // The stage sits at the top of the collapsed field.
      const rect = fieldRef.current.getBoundingClientRect();
      window.scrollTo({
        top: Math.max(0, rect.top + window.scrollY - 24),
        behavior: 'smooth',
      });
    } else {
      detailRef.current?.scrollIntoView({ block: 'nearest' });
    }
    const t = window.setTimeout(
      () => detailRef.current?.focus({ preventScroll: true }),
      reduced ? 0 : 200
    );
    return () => window.clearTimeout(t);
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track the detail column's height so the field can size itself to it.
  useEffect(() => {
    if (selected == null) {
      setDetailH(0);
      return;
    }
    const el = detailRef.current;
    if (!el) return;
    const measure = () => setDetailH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [selected]);

  // Scroll parallax: nearer works (larger scale) ride slightly ahead of
  // scroll. Written straight to the parallax layer via refs — no React
  // re-render per scroll frame. Off while a work is promoted.
  useEffect(() => {
    if (reduced) return;
    if (selected != null) {
      parallaxRefs.current.forEach((el) => {
        if (el) el.style.transform = '';
      });
      return;
    }
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = fieldRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const delta = window.innerHeight / 2 - (r.top + r.height / 2);
        WORKS.forEach((w, i) => {
          const p = tablet ? w.posTablet : w.pos;
          const node = parallaxRefs.current[i];
          if (node)
            node.style.transform = `translate3d(0, ${(-delta * 0.09 * depth(p.scale)).toFixed(1)}px, 0)`;
        });
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, selected, tablet]);

  // ---- hover loupe over the promoted work ----
  // Written straight to the loupe element — no React state per mousemove.
  const loupeRef = useRef<HTMLDivElement>(null);
  const hideLoupe = useCallback(() => {
    if (loupeRef.current) loupeRef.current.style.display = 'none';
  }, []);
  useEffect(() => hideLoupe(), [selected, hideLoupe]);
  const onZoomMove = useCallback((e: React.MouseEvent) => {
    const loupe = loupeRef.current;
    const fieldEl = fieldRef.current;
    if (!loupe || !fieldEl) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const f = fieldEl.getBoundingClientRect();
    const rx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const ry = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    loupe.style.display = 'block';
    loupe.style.left = `${e.clientX - f.left - LOUPE_SIZE / 2}px`;
    loupe.style.top = `${e.clientY - f.top - LOUPE_SIZE / 2}px`;
    loupe.style.backgroundSize = `${r.width * LOUPE_ZOOM}px ${r.height * LOUPE_ZOOM}px`;
    loupe.style.backgroundPosition = `${-(rx * r.width * LOUPE_ZOOM - LOUPE_SIZE / 2)}px ${-(
      ry * r.height * LOUPE_ZOOM -
      LOUPE_SIZE / 2
    )}px`;
  }, []);

  const work = selected != null ? WORKS[selected] : null;
  const stage = work && box.cw > 0 ? geometry(work, tablet, box.cw, restCh, box.vh) : null;

  return (
    <div className="mt-8">
      {/* ---------------- ≥768px: the scatter field ---------------- */}
      {!reduced && (
        <div className="hidden md:block">
          <div
            ref={fieldRef}
            className="relative"
            style={{
              // Collapses to the staged spread while one is promoted —
              // work left, placard/panels right — sized to the taller side.
              height: stage
                ? Math.max(stage.featH, detailH) + STAGE_TOP + STAGE_BOTTOM
                : FIELD_HEIGHT,
              transition:
                selected != null || settling ? `height 520ms ${PROMOTE_EASE}` : undefined,
              visibility: box.cw ? 'visible' : 'hidden',
            }}
            onClick={(e) => {
              if (selected != null && e.target === e.currentTarget) close();
            }}
          >
            {box.cw > 0 &&
              WORKS.map((w, i) => {
                const g = geometry(w, tablet, box.cw, restCh, box.vh);
                const isSelected = selected === i;
                const isHovered = hovered === i && selected == null;

                let transform: string;
                if (isSelected) {
                  const s = g.featW / g.restW;
                  // centred between the page's left margin and the placards
                  const tx = (box.cw * 0.62 - g.featW) / 2;
                  transform = `translate3d(${tx}px, ${STAGE_TOP}px, 0) scale(${s})`;
                } else {
                  const s = isHovered ? 1.06 : 1;
                  transform = `translate3d(${g.x * box.cw - (g.restW * s) / 2}px, ${
                    g.y * restCh - (g.restH * s) / 2
                  }px, 0) scale(${s})`;
                }

                const opacity =
                  selected != null
                    ? isSelected
                      ? 1
                      : 0
                    : hovered != null
                      ? isHovered
                        ? 1
                        : 0.35
                      : 0.75 + 0.25 * depth(g.scale);

                const promoteMotion = selected != null || settling;
                const ms = promoteMotion ? 520 : 240;
                return (
                  <button
                    key={w.slug}
                    ref={(el) => {
                      buttonRefs.current[i] = el;
                    }}
                    onClick={() => {
                      if (!isSelected) select(i);
                    }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseMove={isSelected ? onZoomMove : undefined}
                    onMouseLeave={() => {
                      setHovered((h) => (h === i ? null : h));
                      if (isSelected) hideLoupe();
                    }}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered((h) => (h === i ? null : h))}
                    aria-label={`${w.title ?? 'Untitled'}, ${w.artist}`}
                    tabIndex={selected != null && !isSelected ? -1 : 0}
                    aria-hidden={selected != null && !isSelected ? true : undefined}
                    className="ours-work absolute left-0 top-0 block select-none"
                    style={{
                      width: g.restW,
                      zIndex: isSelected ? 30 : isHovered ? 20 : g.z,
                      transform,
                      transformOrigin: '0 0',
                      opacity,
                      cursor: isSelected ? 'zoom-in' : 'default',
                      pointerEvents: selected != null && !isSelected ? 'none' : undefined,
                      willChange: isSelected || isHovered ? 'transform' : undefined,
                      transition: `transform ${ms}ms ${
                        promoteMotion ? PROMOTE_EASE : HOVER_EASE
                      }, opacity ${promoteMotion ? 300 : 240}ms ${HOVER_EASE}`,
                    }}
                  >
                    {/* parallax layer — written to directly on scroll */}
                    <div
                      ref={(el) => {
                        parallaxRefs.current[i] = el;
                      }}
                    >
                      {/* idle drift layer — slow, phase-offset, paused on
                          hover and while anything is promoted */}
                      <div
                        className="ours-drift"
                        style={{
                          animationDuration: `${12 + ((i * 53) % 9)}s`,
                          animationDelay: `${-(i * 2.3)}s`,
                          animationDirection: i % 2 ? 'alternate-reverse' : 'alternate',
                          animationPlayState:
                            isHovered || selected != null ? 'paused' : 'running',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/images/ours/works/${w.slug}.webp`}
                          alt={w.alt}
                          draggable={false}
                          loading={w.eager ? 'eager' : 'lazy'}
                          className="block h-auto w-full"
                          style={w.dustBottom ? DUST_STYLE : undefined}
                        />
                      </div>
                    </div>
                    {/* hover caption, directly beneath the work */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-full block -translate-x-1/2 whitespace-nowrap pt-2 text-center"
                      style={{
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 160ms ease',
                      }}
                    >
                      <span
                        className="block font-mono text-[10px] uppercase tracking-[0.12em]"
                        style={{ color: OURS.ink }}
                      >
                        {w.artist}
                      </span>
                      {w.title && (
                        <span className="block text-[11px] italic" style={{ color: OURS.gray }}>
                          {w.title}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}

            {/* back to gallery, prev / next, and the hover loupe */}
            {stage && work && (
              <>
                <button
                  onClick={close}
                  className="ours-work ours-rise absolute left-0 top-0 z-40 font-mono text-[11px] uppercase tracking-[0.14em]"
                  style={{ color: OURS.orange }}
                >
                  Back to gallery ⟶
                </button>
                {/* placard + text panels, beside the work */}
                <div
                  key={`detail-${work.slug}`}
                  ref={detailRef}
                  tabIndex={-1}
                  className="absolute outline-none"
                  style={{ left: '62%', width: '38%', top: STAGE_TOP }}
                  aria-label={`${work.title ?? 'Untitled'}, ${work.artist} — details`}
                >
                  <div className="ours-rise">
                    <Placard work={work} />
                  </div>
                  <div className="mt-6 space-y-6">
                    {work.panels.map((p, i) => (
                      <div
                        key={p.heading}
                        className="ours-rise"
                        style={{ animationDelay: `${80 + i * 80}ms` }}
                      >
                        <PanelCard panel={p} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* magnifier loupe — follows the cursor over the work,
                    positioned/panned imperatively in onZoomMove */}
                <div
                  ref={loupeRef}
                  aria-hidden
                  className="pointer-events-none absolute z-50"
                  style={{
                    display: 'none',
                    width: LOUPE_SIZE,
                    height: LOUPE_SIZE,
                    border: `1px solid ${OURS.hair}`,
                    background: `#fff url(/images/ours/works/${work.slug}.webp) no-repeat`,
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* -------- ≥768px, prefers-reduced-motion: plain 2-col grid -------- */}
      {reduced && (
        <div className="hidden md:block">
          <div className="grid grid-cols-2 gap-x-10 gap-y-14">
            {WORKS.map((w, i) => (
              <button
                key={w.slug}
                ref={(el) => {
                  buttonRefs.current[i] = el;
                }}
                onClick={() => select(i)}
                aria-label={`${w.title ?? 'Untitled'}, ${w.artist}`}
                className="ours-work block select-none self-end text-left"
                style={{
                  cursor: 'default',
                  opacity: selected == null || selected === i ? 1 : 0.45,
                  transition: 'opacity 240ms ease',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/ours/works/${w.slug}.webp`}
                  alt={w.alt}
                  draggable={false}
                  loading={w.eager ? 'eager' : 'lazy'}
                  className="mx-auto block h-auto max-w-full"
                  style={{ maxHeight: '60vh', width: 'auto', ...(w.dustBottom ? DUST_STYLE : null) }}
                />
                <span className="mt-3 block text-center">
                  <span
                    className="block font-mono text-[10px] uppercase tracking-[0.12em]"
                    style={{ color: OURS.ink }}
                  >
                    {w.artist}
                  </span>
                  {w.title && (
                    <span className="block text-[11px] italic" style={{ color: OURS.gray }}>
                      {w.title}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
          {work && <DetailRegion work={work} detailRef={detailRef} />}
        </div>
      )}

      {/* ---------------- <768px: single column ---------------- */}
      <div className="space-y-16 md:hidden">
        {WORKS.map((w) => (
          <MobileWork key={w.slug} work={w} />
        ))}
      </div>

      {/* ---------------- curatorial statement ---------------- */}
      {/* Transcribed from the printed program's Gallery pages. */}
      <div className="mt-14 border-t pt-10" style={{ borderColor: OURS.hair }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: OURS.orange }}>
          Curatorial Statement
        </p>
        <hr className="mt-1.5 h-[2px] w-12 border-0" style={{ background: OURS.orange }} />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: OURS.gray }}>
          From Olli Payne, Director, FFA
        </p>
        <div className="mt-6 max-w-[75ch] space-y-5 text-body-lg leading-relaxed text-ink/85">
          <p>
            I am a futurist. It&rsquo;s a simple fact. Maybe it&rsquo;s a label, but
            more than that, it&rsquo;s something that I can feel phenomenologically,
            in my bones and my tendons and behind my eyes; the will to see, the
            drive to act, toward the future.
          </p>
          <p>
            When I was young I adored Ray Bradbury&rsquo;s work, and in awe of the
            worlds he built using advanced technology. The characters were
            privileged to live in realities that had solved so many of
            humanity&rsquo;s problems, yet there were always more plaguing them. I
            would sit and write out what further technological innovations could be
            introduced to save them, these vexingly and unavoidably troubled ghosts
            on the pages.
          </p>
          <p>
            Over time, I have come to understand that while there is much value in
            advances in software and hard tech, the bottleneck is actually social
            technology. The quagmires of Bradbury&rsquo;s characters were rooted in
            culture. Burning books didn&rsquo;t result from installing screens into
            walls, it emerged from demand for complacency over thinking, feeling,
            or acting. This kind of social decay, to my horror, can be seen in the
            cautionary science fiction tale but is also taking root in the world
            around us.
          </p>
          <p>
            I believe art to be a sacred cure &ndash; it can inform, inspire,
            ignite, and compel us. It shatters complacency and reminds us of what
            we find beautiful and good and shows us that it is achievable.
            It&rsquo;s the expression and the reception, made tangible materially
            and transferable socially and spiritually. For these reasons, the art
            that&rsquo;s upstream of our culture&rsquo;s idea of the future will
            shape our future.
          </p>
          <p>
            The collection of works presented in this exhibit is the result of my
            search for that cure in the creations of others. It&rsquo;s the
            manifestation of my attempt to gather and show proof that we can make a
            conscious choice about the future we pursue, from vision to
            realization. Thank you for being here to experience that.
          </p>
        </div>
      </div>

      <style jsx global>{`
        .ours-work:focus-visible {
          outline: 2px solid ${OURS.orange};
          outline-offset: 6px;
        }
        .ours-buy:hover {
          background: ${OURS.orange};
          color: #fff !important;
        }
        @keyframes ours-drift {
          from {
            transform: translate3d(-5px, -9px, 0);
          }
          to {
            transform: translate3d(5px, 9px, 0);
          }
        }
        .ours-drift {
          animation-name: ours-drift;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes ours-rise {
          from {
            opacity: 0;
            transform: translate3d(0, 16px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        .ours-rise {
          animation: ours-rise 420ms ${HOVER_EASE} backwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .ours-drift {
            animation: none;
          }
          .ours-rise {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

// Placard + text panels for the reduced-motion grid, stacked beneath it.
function DetailRegion({
  work,
  detailRef,
}: {
  work: Work;
  detailRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      key={`detail-${work.slug}`}
      ref={detailRef}
      tabIndex={-1}
      className="outline-none"
      aria-label={`${work.title ?? 'Untitled'}, ${work.artist} — details`}
    >
      <div className="mt-6 flex justify-center">
        <Placard work={work} />
      </div>
      <div className="mx-auto mt-10 max-w-2xl space-y-6 pb-4">
        {work.panels.map((p) => (
          <PanelCard key={p.heading} panel={p} />
        ))}
      </div>
    </div>
  );
}

// Frosted-acrylic card, the way the placards actually hung: a pane of
// frosted glass on four standoff mounts, type reading as if etched into
// the surface. The manifesto at the door was frosted acrylic too, so
// this is the event's own material language. Deliberately subtle — a
// faint translucency, a soft lift, four small metal studs.
function GlassCard({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(243,241,237,0.72))',
        backdropFilter: 'blur(8px) saturate(0.9)',
        WebkitBackdropFilter: 'blur(8px) saturate(0.9)',
        border: '1px solid rgba(255,255,255,0.9)',
        borderRadius: 3,
        boxShadow:
          `0 12px 26px -16px rgba(40,40,40,0.4), 0 1px 2px rgba(40,40,40,0.07), ` +
          `inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 1px rgba(200,195,186,0.35)`,
        ...style,
      }}
    >
      {(['left', 'right'] as const).map((x) =>
        (['top', 'bottom'] as const).map((y) => (
          <span
            key={`${x}-${y}`}
            aria-hidden
            className="absolute"
            style={{
              [x]: 7,
              [y]: 7,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #fdfdfc, #cfcac1 55%, #a49e92)',
              boxShadow: 'inset 0 0 1px rgba(40,40,40,0.45), 0 1px 1px rgba(40,40,40,0.15)',
            }}
          />
        ))
      )}
      {children}
    </div>
  );
}

// Etched-into-the-glass type: slightly sunk ink with a hairline light
// catch beneath each stroke.
const ETCH: React.CSSProperties = { textShadow: '0 1px 0 rgba(255,255,255,0.85)' };

// The wall label: artist in caps, title italic, medium and edition in
// small mono, price — and the route to actually buying it.
function Placard({ work }: { work: Work }) {
  return (
    <GlassCard className="px-7 py-6" style={{ maxWidth: 380 }}>
      <p
        className="font-heading text-[17px] uppercase leading-tight tracking-[0.02em]"
        style={{ color: 'rgba(40,40,40,0.82)', ...ETCH }}
      >
        {work.artist}
      </p>
      {work.title && (
        <p className="mt-1 text-[14px] italic leading-snug" style={{ color: 'rgba(40,40,40,0.8)', ...ETCH }}>
          {work.title}
        </p>
      )}
      <div className="mt-3 space-y-1">
        {work.medium.map((m) => (
          <p
            key={m}
            className="font-mono text-[9.5px] uppercase tracking-[0.1em]"
            style={{ color: 'rgba(100,100,100,0.9)', ...ETCH }}
          >
            {m}
          </p>
        ))}
      </div>
      {(work.price || work.storeId) && (
        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {work.price && (
            <p className="font-mono text-[12px]" style={{ color: 'rgba(40,40,40,0.85)', ...ETCH }}>
              {work.price}
            </p>
          )}
          <GalleryBuy work={work} />
        </div>
      )}
    </GlassCard>
  );
}

// The placard's route into the storefront, sitting inline beside the
// price: an underlined orange "Buy →" opening the purchase modal, an
// orange dot + Sold for pieces already gone, and the live remaining
// count for editions. Availability here is the catalog's static state
// (lib/storefront.ts) — the checkout route re-validates against live
// inventory on submit.
function GalleryBuy({ work, className = '' }: { work: Work; className?: string }) {
  const artwork = work.storeId ? ARTWORKS.find((a) => a.id === work.storeId) : undefined;
  if (!artwork) return null;
  const sold = isSoldOut(artwork) || artwork.status !== 'available';
  const remaining = unitsRemaining(artwork);
  if (sold) {
    return (
      <span
        className={`${className} font-mono text-[10px] uppercase tracking-[0.14em]`}
        style={{ color: 'rgba(100,100,100,0.9)', ...ETCH }}
      >
        <span style={{ color: OURS.orange }}>●</span> Sold
      </span>
    );
  }
  return (
    <span className={`${className} inline-flex flex-wrap items-baseline gap-x-3 gap-y-1`}>
      <BuyModal
        artwork={artwork}
        returnSection="gallery"
        triggerLabel="Buy →"
        triggerClassName="font-mono text-[11px] uppercase tracking-[0.12em] underline underline-offset-[3px] transition-opacity hover:opacity-70"
        triggerStyle={{ color: OURS.orange }}
      />
      {remaining != null && (
        <span
          className="font-mono text-[9.5px] uppercase tracking-[0.1em]"
          style={{ color: 'rgba(100,100,100,0.9)', ...ETCH }}
        >
          {remaining} of {artwork.fullEditionSize ?? artwork.editionSize} available
        </span>
      )}
    </span>
  );
}

function PanelCard({ panel }: { panel: WorkPanel }) {
  return (
    <GlassCard className="p-6 md:p-7">
      <p
        className="font-mono text-[11px] uppercase tracking-[0.14em]"
        style={{ color: OURS.orange, ...ETCH }}
      >
        {panel.heading}
      </p>
      <hr className="mt-1.5 h-[2px] w-12 border-0" style={{ background: OURS.orange }} />
      <div className="mt-4 space-y-3">
        {panel.paragraphs.map((p, i) => (
          <p
            key={p.slice(0, 32)}
            className="text-[15px] leading-relaxed"
            style={{
              color: 'rgba(40,40,40,0.85)',
              fontStyle:
                panel.quote || (panel.italicFrom !== undefined && i >= panel.italicFrom)
                  ? 'italic'
                  : undefined,
            }}
          >
            {p}
          </p>
        ))}
      </div>
      {panel.link && (
        <a
          href={panel.link.href}
          target={panel.link.href.startsWith('/') ? undefined : '_blank'}
          rel="noopener noreferrer"
          className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.12em]"
          style={{ color: OURS.orange }}
        >
          {panel.link.label} →
        </a>
      )}
    </GlassCard>
  );
}

// <768px: one work per screen, caption beneath, placard panels opening
// inline as an accordion. No drift, no parallax — the scatter does not
// try to survive a phone.
function MobileWork({ work }: { work: Work }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${work.title ?? 'Untitled'}, ${work.artist}`}
        className="ours-work block w-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/images/ours/works/${work.slug}.webp`}
          alt={work.alt}
          draggable={false}
          loading="lazy"
          className="mx-auto block h-auto max-w-full"
          style={{ maxHeight: '62vh', width: 'auto', ...(work.dustBottom ? DUST_STYLE : null) }}
        />
        <span className="mt-4 flex items-start justify-between gap-4 text-left">
          <span>
            <span
              className="block font-heading text-[15px] uppercase leading-tight"
              style={{ color: OURS.ink }}
            >
              {work.artist}
            </span>
            {work.title && (
              <span className="block text-[13px] italic leading-snug" style={{ color: OURS.ink }}>
                {work.title}
              </span>
            )}
            {work.medium.map((m) => (
              <span
                key={m}
                className="mt-1 block font-mono text-[9px] uppercase tracking-[0.08em]"
                style={{ color: OURS.gray }}
              >
                {m}
              </span>
            ))}
            {work.price && (
              <span className="mt-1.5 block font-mono text-[11px]" style={{ color: OURS.ink }}>
                {work.price}
              </span>
            )}
          </span>
          <span
            aria-hidden
            className="font-mono text-lg leading-none transition-transform duration-300"
            style={{ color: OURS.orange, transform: open ? 'rotate(45deg)' : 'none' }}
          >
            +
          </span>
        </span>
      </button>
      {/* Buy control lives outside the accordion toggle — interactive
          content inside the <button> would be invalid and unreachable. */}
      <GalleryBuy work={work} className="mt-3" />
      {open && (
        <div className="mt-5 space-y-4">
          {work.panels.map((p) => (
            <PanelCard key={p.heading} panel={p} />
          ))}
        </div>
      )}
    </div>
  );
}
