'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { OURS } from './tokens';

// The printed program as an object you can pick up and then read.
//
// Closed: a perfect-bound A6 booklet stood on its corner. The book is
// rotated in Z so its bottom-left / top-right diagonal is vertical on
// screen, and then spun about that vertical line. Because the diagonal's
// midpoint is the centre of the book, the spin origin is simply the centre.
//
// A6 is 105 x 148 mm at 3/8 in (9.5 mm) thick, so the proportions come from
// the real object; stock is taken from photographs of the printed copy —
// a stiff white matte cover with a scored hinge just in from the spine over
// a warmer cream text block.
//
// Open: the page behind blurs, the book grows to fill the screen, and you
// turn a leaf at a time with the remaining block visible on both sides.
// Pages come out of OURS_Program_Interactive.html at open time rather than
// being reimplemented; it is ~3MB with imagery embedded, so nothing loads
// until you click.

const A6_W = 105, A6_H = 148, SPINE_MM = 9.525;
const W = 290;
const H = Math.round(W * (A6_H / A6_W));      // 409
const D = Math.round(W * (SPINE_MM / A6_W));  // 26
// Angle that puts the bottom-left / top-right diagonal upright.
const TILT = -(Math.atan(W / H) * 180) / Math.PI;   // ≈ -35.3deg

const PAGE_W = 300, PAGE_H = 426;
const TURN_MS = 700;

const COVER = `
  linear-gradient(198deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 42%),
  radial-gradient(circle at 74% 78%, rgba(120,116,108,0.10), transparent 55%),
  repeating-linear-gradient(93deg, rgba(140,136,128,0.030) 0 2px, transparent 2px 6px),
  repeating-linear-gradient(3deg, rgba(140,136,128,0.022) 0 3px, transparent 3px 8px),
  linear-gradient(#fbfaf8, #eceae5)
`;
const LEAF_PAPER = '#f2ece7';

type Page = { html: string };
type Turn = { dir: 'fwd' | 'back'; run: boolean } | null;
type TocEntry = { page: number; label: string };

// Body text is set at a single size across the whole program; this is the
// range the fitter searches, largest first.
// The document's own contents, already shifted by the two pages the reader
// drops (cover + donate). Held statically so the on-page list can be shown
// and clicked before the 3MB document has been fetched.
const PROGRAM_TOC: TocEntry[] = [
  { page: 0, label: 'Welcome' },
  { page: 1, label: 'Contents' },
  { page: 2, label: 'Plan Your Night' },
  { page: 4, label: 'Provocateurs' },
  { page: 9, label: 'Gallery' },
  { page: 25, label: 'Ledgerworks' },
  { page: 35, label: 'Ugly and Unwarranted' },
  { page: 41, label: 'Thanks & Support' },
  { page: 43, label: 'Your Notes' },
];

const FIT_SIZES = [9, 8.75, 8.5, 8.25, 8, 7.75, 7.5, 7.25, 7, 6.75, 6.5, 6.25, 6];

export function ProgramBook() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [pages, setPages] = useState<Page[] | null>(null);
  const [css, setCss] = useState('');
  const [leaf, setLeaf] = useState(0);
  const [turn, setTurn] = useState<Turn>(null);
  const [scale, setScale] = useState(1);
  const [toc, setToc] = useState<TocEntry[]>(PROGRAM_TOC);
  const [fitPx, setFitPx] = useState<number | null>(null);
  const busy = useRef(false);

  const total = pages?.length ?? 0;
  const maxLeaf = Math.max(0, Math.ceil(total / 2) - 1);

  // ---- size the spread to the viewport ----
  useEffect(() => {
    if (!open) return;
    const fit = () => {
      const availW = window.innerWidth * 0.9;
      const availH = window.innerHeight * 0.82;
      setScale(Math.min(availW / (PAGE_W * 2), availH / PAGE_H));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [open]);

  // ---- page turn: mount at 0deg, then animate on the NEXT frame ----
  const start = useCallback((dir: 'fwd' | 'back') => {
    if (busy.current || !pages) return;
    if (dir === 'fwd' && leaf >= maxLeaf) return;
    if (dir === 'back' && leaf <= 0) return;
    busy.current = true;
    setTurn({ dir, run: false });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTurn({ dir, run: true });
        // Commit only once the swing has actually finished. Starting this
        // timer alongside the state change ran it two frames early, so the
        // leaf was swapped out mid-flight — that was the jump.
        window.setTimeout(() => {
          setLeaf((l) => (dir === 'fwd' ? l + 1 : l - 1));
          setTurn(null);
          busy.current = false;
        }, TURN_MS + 40);
      });
    });
  }, [pages, leaf, maxLeaf]);

  const next = useCallback(() => start('fwd'), [start]);
  const prev = useCallback(() => start('back'), [start]);

  // Jump straight into the book at a given page — used by the contents
  // list that sits beside the closed book.
  const openAt = useCallback((page: number) => {
    setLeaf(Math.ceil(page / 2));
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setShown(false);
    window.setTimeout(() => setOpen(false), 320);
  }, []);

  useEffect(() => {
    if (!open || pages) return;
    let cancelled = false;
    (async () => {
      const res = await fetch('/ours-program.html');
      const text = await res.text();
      if (cancelled) return;
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const raw = Array.from(doc.querySelectorAll('style')).map((s) => s.textContent || '').join('\n');
      const safe = raw
        .replace(/@media\s+print[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '')
        .split('}')
        .filter((rule) => !/^\s*(html|body)\b/.test(rule.split('{')[0] || ''))
        .join('}');
      setCss(safe);
      // Page 0 is the cover (the closed book already shows it) and page 1
      // is a donate page that has no business opening the booklet, so the
      // reader starts at Welcome: blank verso, Welcome recto.
      // Every QR block carries its destination in the label beside it, so
      // the printed code becomes a link on screen rather than something you
      // have to point a phone at.
      doc.querySelectorAll('.qrow').forEach((row) => {
        const svg = row.querySelector('svg');
        if (!svg) return;
        const label = row.textContent || '';
        const domain = label.match(/[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[^\s,]*)?/i);
        let href = domain ? `https://${domain[0]}` : '';
        if (!href && /possibilia|pre-?order/i.test(label)) href = 'https://www.futureaesthetics.foundation/possibilia';
        if (!href) return;
        const a = doc.createElement('a');
        a.setAttribute('href', href);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        a.className = 'ours-qr-link';
        svg.replaceWith(a);
        a.appendChild(svg);
        const chip = doc.createElement('span');
        chip.className = 'ours-qr-chip';
        chip.textContent = 'click here';
        a.appendChild(chip);
      });

      const DROPPED = 2;
      const all = Array.from(doc.querySelectorAll('.sheet')).map((s) => ({ html: s.innerHTML }));
      setPages(all.slice(DROPPED));
      // The document ships its own contents list as a <select>; reuse it,
      // shifted to match the pages we dropped.
      setToc(
        Array.from(doc.querySelectorAll('#toc option'))
          .map((o) => ({
            page: Number((o as HTMLOptionElement).value) - DROPPED,
            label: o.textContent || '',
          }))
          .filter((t) => t.page >= 0)
      );
    })();
    return () => { cancelled = true; };
  }, [open, pages]);

  // ---- one body-text size for the whole program ----
  // Several pages overset at the sizes baked into the source. Rather than
  // guess, render every page offscreen and step the body size down until
  // nothing overflows its text area, then use that one size everywhere.
  // An author rule with !important beats the inline font-size the document
  // sets per page, which is what makes a single size possible at all.
  useEffect(() => {
    if (!pages || !css || fitPx !== null) return;
    const host = document.createElement('div');
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText = 'position:fixed;left:-99999px;top:0;visibility:hidden;pointer-events:none;';
    const style = document.createElement('style');
    const wrap = document.createElement('div');
    host.append(style, wrap);
    document.body.appendChild(host);
    wrap.innerHTML = pages
      .map((pg) => `<div style="width:${PAGE_W}px;height:${PAGE_H}px;position:relative">${pg.html}</div>`)
      .join('');

    const overset = (el: Element) => el.scrollHeight > el.clientHeight + 1;
    let candidates = Array.from(wrap.querySelectorAll('.pad'));
    let chosen = FIT_SIZES[FIT_SIZES.length - 1];
    for (const size of FIT_SIZES) {
      style.textContent = `${css}
.vis{font-size:${size}px !important;line-height:1.45 !important;}`;
      // Only pages that overflowed at a larger size can still overflow here.
      candidates = candidates.filter(overset);
      if (candidates.length === 0) { chosen = size; break; }
    }
    document.body.removeChild(host);
    setFitPx(chosen);
  }, [pages, css, fitPx]);

  // grow-in, one frame after mount
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, next, prev]);

  const face: React.CSSProperties = { position: 'absolute', left: '50%', top: '50%', backfaceVisibility: 'hidden' };

  return (
    <>
      {/* ---------------- closed ---------------- */}
      {/* Contents rail sits left; the spinning book centres itself in
          the remaining width rather than hugging the rail. */}
      <div className="flex items-center gap-10" style={{ padding: '96px 0 104px' }}>
        {/* Contents, on the page. Clicking opens the book already at that
            section rather than making you page there. */}
        <nav aria-label="Program contents" className="hidden shrink-0 md:block">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: OURS.orange }}>
            Contents
          </p>
          <hr className="mt-3 h-px w-40 border-0" style={{ background: OURS.orange }} />
          <ul className="mt-4 space-y-2.5">
            {PROGRAM_TOC.map((t) => (
              <li key={t.page}>
                <button
                  onClick={() => openAt(t.page)}
                  className="block text-left font-mono text-[12px] uppercase tracking-[0.08em] transition-opacity"
                  style={{ color: OURS.ink, opacity: 0.6 }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = OURS.orange; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.color = OURS.ink; }}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Every level of this chain keeps preserve-3d. A plain 2-D
            transform anywhere in it flattens the cuboid, which is what made
            the book sit flat before. */}
        <div className="flex flex-1 justify-center">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open the OURS program"
          className="ours-book cursor-pointer border-0 bg-transparent p-0"
          style={{ perspective: 2400, perspectiveOrigin: '50% 50%', width: H, height: H, display: 'block' }}
        >
          <div
            className="ours-book-spin"
            style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
          >
            {/* tilt: diagonal upright, inside the spinning frame */}
            <div
              style={{
                position: 'absolute', left: '50%', top: '50%',
                width: W, height: H, marginLeft: -W / 2, marginTop: -H / 2,
                transformStyle: 'preserve-3d',
                transform: `rotateZ(${TILT}deg)`,
              }}
            >
              <div style={{ width: W, height: H, position: 'relative', transformStyle: 'preserve-3d' }}>
                <div
                  style={{
                    ...face, width: W, height: H,
                    transform: `translate(-50%,-50%) translateZ(${D / 2}px)`,
                    background: COVER,
                    boxShadow: 'inset 0 0 40px rgba(120,116,108,0.10), 0 26px 50px -18px rgba(0,0,0,0.5)',
                  }}
                >
                  <CoverArt />
                  <Hinge />
                </div>
                <div
                  style={{
                    ...face, width: W, height: H,
                    transform: `translate(-50%,-50%) rotateY(180deg) translateZ(${D / 2}px)`,
                    background: COVER,
                    boxShadow: 'inset 0 0 40px rgba(120,116,108,0.12)',
                  }}
                >
                  {/* Square crop of the hero collage, centred, as printed. */}
                  <div
                    style={{
                      position: 'absolute', left: '50%', top: '46%',
                      width: W * 0.46, height: W * 0.46, transform: 'translate(-50%,-50%)',
                    }}
                  >
                    <Image src="/images/ours/back-cover.jpg" alt="" fill sizes="140px" className="object-cover" />
                  </div>
                  <Hinge mirrored />
                </div>
                <div
                  style={{
                    ...face, width: D, height: H,
                    transform: `translate(-50%,-50%) rotateY(-90deg) translateZ(${W / 2}px)`,
                    background: OURS.ink, overflow: 'hidden',
                  }}
                >
                  <Image src="/images/ours/program-spine.png" alt="" fill sizes="30px" className="object-cover" />
                </div>
                <div
                  style={{
                    ...face, width: D, height: H,
                    transform: `translate(-50%,-50%) rotateY(90deg) translateZ(${W / 2}px)`,
                    background: 'repeating-linear-gradient(to right,#f6f1ec 0 1.5px,#ddd5cc 1.5px 3px)',
                  }}
                />
                <div
                  style={{
                    ...face, width: W, height: D,
                    transform: `translate(-50%,-50%) rotateX(90deg) translateZ(${H / 2}px)`,
                    background: 'repeating-linear-gradient(to bottom,#f6f1ec 0 1.5px,#ddd5cc 1.5px 3px)',
                  }}
                />
                <div
                  style={{
                    ...face, width: W, height: D,
                    transform: `translate(-50%,-50%) rotateX(-90deg) translateZ(${H / 2}px)`,
                    background: 'repeating-linear-gradient(to bottom,#f6f1ec 0 1.5px,#ddd5cc 1.5px 3px)',
                  }}
                />
              </div>
            </div>
          </div>
        </button>
        </div>
      </div>

      {/* ---------------- open ---------------- */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{
            background: shown ? 'rgba(246,244,241,0.34)' : 'rgba(246,244,241,0)',
            backdropFilter: `blur(${shown ? 7 : 0}px)`,
            WebkitBackdropFilter: `blur(${shown ? 7 : 0}px)`,
            transition: 'backdrop-filter 420ms ease, -webkit-backdrop-filter 420ms ease, background 420ms ease',
          }}
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute right-5 top-5 z-10 rounded-full bg-white/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: OURS.ink, boxShadow: `inset 0 0 0 1px ${OURS.orange}` }}
          >
            Close ✕
          </button>

          {/* Shifted right of centre so the contents rail has room, with
              the arrows sitting immediately beside the book rather than out
              at the window edges. */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center"
            style={{ gap: 14, marginLeft: 168 }}
          >
            <Arrow dir="prev" onClick={prev} disabled={leaf <= 0} />
            <div
              style={{
                width: PAGE_W * 2 * scale,
                height: PAGE_H * scale,
                position: 'relative',
                opacity: shown ? 1 : 0,
                transition: 'opacity 320ms ease',
              }}
            >
              <div
                style={{
                  position: 'absolute', left: '50%', top: '50%',
                  width: PAGE_W * 2, height: PAGE_H,
                  transform: `translate(-50%,-50%) scale(${shown ? scale : scale * 0.28})`,
                  transformOrigin: 'center center',
                  transition: 'transform 560ms cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                <Spread pages={pages} css={css} leaf={leaf} turn={turn} total={total} fitPx={fitPx} />
              </div>
            </div>
            <Arrow dir="next" onClick={next} disabled={!pages || leaf >= maxLeaf} />
          </div>

          {toc.length > 0 && (
            <nav
              onClick={(e) => e.stopPropagation()}
              className="absolute left-8 top-1/2 hidden md:flex md:flex-col md:justify-center"
              aria-label="Contents"
              style={{
                transform: 'translateY(-50%)',
                height: '66vh',                 // two thirds of the margin
                opacity: shown ? 1 : 0,
                transition: 'opacity 420ms ease 160ms',
              }}
            >
              <p className="font-mono text-[12px] uppercase tracking-[0.16em]" style={{ color: OURS.orange }}>
                Contents
              </p>
              <hr className="mt-3 h-px w-36 border-0" style={{ background: OURS.orange }} />
              <ul className="mt-5 flex flex-1 flex-col justify-between py-1">
                {toc.map((t, i) => {
                  const targetLeaf = Math.ceil(t.page / 2);
                  const nextStart = toc[i + 1] ? Math.ceil(toc[i + 1].page / 2) : Infinity;
                  const active = leaf >= targetLeaf && leaf < nextStart;
                  return (
                    <li key={t.page}>
                      <button
                        onClick={() => { if (!busy.current) setLeaf(Math.min(targetLeaf, maxLeaf)); }}
                        className="block text-left font-mono text-[13px] uppercase tracking-[0.08em] transition-opacity"
                        style={{
                          color: active ? OURS.orange : OURS.ink,
                          opacity: active ? 1 : 0.5,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = active ? '1' : '0.5'; }}
                      >
                        {t.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          {pages && (
            <p
              className="absolute bottom-6 font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ color: 'rgba(40,40,40,0.55)' }}
            >
              {Math.min(leaf * 2 + 1, total)}–{Math.min(leaf * 2 + 2, total)} / {total}
            </p>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes ours-book-spin {
          from { transform: rotateX(4deg) rotateY(0deg); }
          to   { transform: rotateX(4deg) rotateY(360deg); }
        }
        .ours-book-spin { animation: ours-book-spin 11s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ours-book-spin { animation: none; transform: rotateX(4deg) rotateY(-28deg); }
        }
      `}</style>
    </>
  );
}

function Hinge({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute', top: 0, bottom: 0,
        [mirrored ? 'right' : 'left']: 9,
        width: 3,
        background:
          'linear-gradient(to right, rgba(120,114,104,0.26), rgba(120,114,104,0.05) 55%, rgba(255,255,255,0.55))',
      }}
    />
  );
}

function Spread({
  pages, css, leaf, turn, total, fitPx,
}: {
  pages: Page[] | null; css: string; leaf: number; turn: Turn; total: number; fitPx: number | null;
}) {
  if (!pages) {
    return (
      <div className="flex items-center justify-center rounded"
        style={{ width: PAGE_W * 2, height: PAGE_H, background: 'rgba(255,255,255,0.6)' }}>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: OURS.gray }}>
          Opening the program…
        </span>
      </div>
    );
  }

  const at = (i: number) => (i >= 0 && i < pages.length ? pages[i].html : '');
  const versoIdx = leaf * 2 - 1;
  const rectoIdx = leaf * 2;

  const leftLeaves = leaf;
  const rightLeaves = Math.max(0, Math.ceil(total / 2) - leaf);
  const thick = (n: number) => Math.max(2, Math.min(18, n * 0.75));

  const Leaf = ({ html }: { html: string }) => (
    <div style={{ width: PAGE_W, height: PAGE_H, background: LEAF_PAPER }}
      dangerouslySetInnerHTML={{ __html: html }} />
  );

  const Block = ({ side, n }: { side: 'left' | 'right'; n: number }) => (
    <span
      aria-hidden
      style={{
        position: 'absolute', top: -3, bottom: -3,
        [side]: -thick(n), width: thick(n),
        borderRadius: side === 'left' ? '3px 0 0 3px' : '0 3px 3px 0',
        background: 'repeating-linear-gradient(to right,#f6f1ec 0 1.5px,#ded6cd 1.5px 3px)',
        boxShadow: '0 10px 22px -8px rgba(0,0,0,0.45)',
      }}
    />
  );

  // The leaf swings only once `run` flips true, one frame after mount —
  // mounting straight at the end angle gives no transition at all, which is
  // why turns previously snapped.
  const angle = turn ? (turn.run ? (turn.dir === 'fwd' ? -180 : 180) : 0) : 0;

  return (
    <>
      <style>
        {css}
        {fitPx !== null
          ? `
.vis{font-size:${fitPx}px !important;line-height:1.45 !important;}`
          : ''}
        {`
        .ours-qr-link{position:relative;display:inline-block;flex:0 0 54px;line-height:0;}
        .ours-qr-link svg{display:block;}
        .ours-qr-chip{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
          background:#fff;color:#e8651a;font-family:'DM Mono',monospace;font-size:6.2px;
          letter-spacing:.04em;text-transform:uppercase;padding:2px 3px;white-space:nowrap;
          box-shadow:0 0 0 1.5px #fff;border-radius:1px;line-height:1.1;}
        .ours-qr-link:hover .ours-qr-chip{background:#e8651a;color:#fff;box-shadow:0 0 0 1.5px #fff;}
        `}
      </style>
      <div style={{ position: 'relative', width: PAGE_W * 2, height: PAGE_H, perspective: 2600 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: PAGE_W, height: PAGE_H, overflow: 'hidden', background: LEAF_PAPER }}>
          <Leaf html={at(versoIdx)} />
          <Block side="left" n={leftLeaves} />
        </div>
        <div style={{ position: 'absolute', left: PAGE_W, top: 0, width: PAGE_W, height: PAGE_H, overflow: 'hidden', background: LEAF_PAPER }}>
          <Leaf html={at(rectoIdx + (turn?.dir === 'fwd' ? 2 : 0))} />
          <Block side="right" n={rightLeaves} />
        </div>

        {turn && (
          <div
            style={{
              position: 'absolute', top: 0,
              left: turn.dir === 'fwd' ? PAGE_W : 0,
              width: PAGE_W, height: PAGE_H,
              transformStyle: 'preserve-3d',
              transformOrigin: turn.dir === 'fwd' ? 'left center' : 'right center',
              transform: `rotateY(${angle}deg)`,
              transition: `transform ${TURN_MS}ms cubic-bezier(0.38,0,0.28,1)`,
              zIndex: 5,
              boxShadow: '0 16px 34px -10px rgba(0,0,0,0.45)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', overflow: 'hidden', background: LEAF_PAPER }}>
              <Leaf html={at(turn.dir === 'fwd' ? rectoIdx : versoIdx)} />
            </div>
            <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', overflow: 'hidden', background: LEAF_PAPER }}>
              <Leaf html={at(turn.dir === 'fwd' ? rectoIdx + 1 : versoIdx - 1)} />
            </div>
          </div>
        )}

        <div
          aria-hidden
          style={{
            position: 'absolute', top: 0, bottom: 0, left: PAGE_W - 20, width: 40, pointerEvents: 'none', zIndex: 6,
            background:
              'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(60,50,40,0.20) 44%, rgba(60,50,40,0.24) 50%, rgba(60,50,40,0.20) 56%, rgba(0,0,0,0) 100%)',
          }}
        />
      </div>
    </>
  );
}

function Arrow({ dir, onClick, disabled }: { dir: 'prev' | 'next'; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous page' : 'Next page'}
      className="shrink-0 border-0 bg-transparent p-1 transition-opacity duration-200"
      style={{ opacity: disabled ? 0.12 : 0.38, color: OURS.ink, cursor: disabled ? 'default' : 'pointer' }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.opacity = '0.9'; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = disabled ? '0.12' : '0.38'; }}
    >
      <svg width="22" height="34" viewBox="0 0 12 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d={dir === 'prev' ? 'M9 2L3 12l6 10' : 'M3 2l6 10-6 10'} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function CoverArt() {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ padding: '20px 20px 22px' }}>
      <p className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: '0.04em', color: OURS.gray }}>
        Foundation for Future Aesthetics Presents
      </p>
      <div style={{ height: 1.5, background: OURS.orange, marginTop: 6 }} />
      <div className="relative" style={{ height: 112, margin: '10px 0', background: '#d9d6d1' }}>
        <Image src="/images/ours/header.jpg" alt="" fill sizes="300px" className="object-cover" style={{ objectPosition: '50% 42%' }} />
      </div>
      <Image src="/images/ours/wordmark-plain.png" alt="OURS" width={427} height={133} className="h-auto" style={{ width: 146 }} />
      <div style={{ width: 62, height: 4, background: OURS.orange, marginTop: 3 }} />
      <p style={{ fontFamily: 'var(--font-display), Saira, sans-serif', fontSize: 9.5, lineHeight: 1.4, marginTop: 8, maxWidth: 225 }}>
        A one-night exhibition &amp; salon on acting to bring about our positive visions of the future.
      </p>
      <div style={{ flex: 1 }} />
      <div style={{ height: 1.5, background: OURS.ink, margin: '9px 0 7px' }} />
      <p className="font-mono" style={{ fontSize: 7.5, lineHeight: 1.5, color: OURS.ink }}>
        Sun, August 9, 2026 &nbsp;·&nbsp; Space LES &nbsp;·&nbsp; 155 Suffolk St &nbsp;·&nbsp; NYC
      </p>
    </div>
  );
}
