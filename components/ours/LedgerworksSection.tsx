'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { OURS } from './tokens';
import { ARTWORKS } from '@/lib/storefront';
import { BuyModal } from '@/components/storefront/BuyModal';
import { EthPieceCheckout } from '@/components/storefront/EthPieceCheckout';

// Ledgerworks — the wall as hung. Desktop: the screen plays The Pope,
// hovering a placard raises it legibly (all placards standardised to the
// manifesto's width), hovering a work opens a loupe — magnifying prints,
// playing HD video for The Pope, and playing the on-chain Vimeo for
// Recycle Group. Mobile: the wall sits on top and everything below folds
// into an accordion, one section per work, left to right.
const IMG_W = 2400;
const IMG_H = 1528;
const SCREEN = { x: 1069, y: 394, w: 246, h: 438 };
const V = '?v=10';
const ZOOM = 2.34;                 // 10% less than before
const LOUPE_W = '35%';             // 30% larger than before
// every raised placard shares the manifesto's width (which puts the
// manifesto itself at 90% of the wall height — the agreed standard)
const HUD_W = `${((0.9 / ((177 / 100) * (IMG_W / IMG_H))) * 100).toFixed(1)}%`;

type PlacardSpot = {
  slug: string;
  rect: { x: number; y: number; w: number; h: number };
  img: string;
  href?: string;
  /** CTA line rendered under the placard image in the raised card. */
  cta?: string;
};

const SPOTS: PlacardSpot[] = [
  { slug: 'recycle-main', rect: { x: 38, y: 993, w: 93, h: 127 }, img: 'lw-recycle-main', href: 'https://bit.ly/forest-of-expired-links' },
  { slug: 'recycle-quote', rect: { x: 339, y: 986, w: 94, h: 93 }, img: 'lw-recycle-quote' },
  { slug: 'yura-main', rect: { x: 498, y: 1002, w: 92, h: 119 }, img: 'lw-yura-main', href: 'https://yuramiron.art' },
  { slug: 'yura-quote', rect: { x: 904, y: 1066, w: 93, h: 94 }, img: 'lw-yura-quote' },
  { slug: 'mauricio-main', rect: { x: 1203, y: 871, w: 92, h: 144 }, img: 'lw-mauricio-main', href: 'https://superrare.com/mpommella' },
  { slug: 'anjola-main', rect: { x: 1681, y: 1089, w: 96, h: 114 }, img: 'lw-anjola-main', href: 'https://anjieverselabs.com' },
  { slug: 'manifesto', rect: { x: 1265, y: 1036, w: 100, h: 177 }, img: 'lw-manifesto' },
  { slug: 'anjola-quote', rect: { x: 1835, y: 1077, w: 94, h: 95 }, img: 'lw-anjola-quote' },
  // The main placard's printed QR pointed at Nahuel's Self-Similar
  // writeup — the raised card now says so and clicks through.
  { slug: 'nahuel-main', rect: { x: 2143, y: 976, w: 94, h: 108 }, img: 'lw-nahuel-main', href: 'https://tinyurl.com/nahueldna', cta: 'Click to read →' },
  // The "two ways" placard — its raised card carries the generate CTA
  // and clicks through to Nahuel's mint platform.
  { slug: 'nahuel-genpi', rect: { x: 2143, y: 1096, w: 94, h: 113 }, img: 'lw-nahuel-genpi', href: 'https://genpi.org', cta: 'Click here to generate yours →' },
];

// The four collect placards (the printed QR cards in the photograph).
// On screen the QR content is covered with a small on-chain link mark;
// hovering raises a compact collect card (name · chain icon · price ·
// click to collect) and clicking opens the piece's purchase modal —
// Stripe checkout for the USD pieces, the ETH flow for The Pope, and
// an outbound Gazelli card for Recycle Group (gallery-represented).
type CollectSpot = {
  slug: string;
  rect: { x: number; y: number; w: number; h: number };
  piece: { title: string; artist: string; price: string };
  action:
    | { kind: 'stripe'; id: string }
    | { kind: 'eth'; id: string; title: string; ethAmount: string; image: string }
    | { kind: 'external'; href: string; cta: string; note: string };
};

const COLLECT_SPOTS: CollectSpot[] = [
  {
    slug: 'recycle-collect',
    rect: { x: 244, y: 903, w: 61, h: 60 },
    piece: { title: 'Forest of Expired Links', artist: 'Recycle Group', price: '$11,000' },
    action: {
      kind: 'external',
      href: 'https://bit.ly/forest-of-expired-links',
      cta: 'Purchase through Gazelli Art House',
      note: 'ERC-721 video, on-chain. Gallery-represented — the sale completes on Gazelli Art House’s own listing.',
    },
  },
  {
    slug: 'yura-collect',
    rect: { x: 686, y: 1092, w: 61, h: 61 },
    piece: { title: 'Solara Plaza', artist: 'Yura Miron', price: '$350' },
    action: { kind: 'stripe', id: 'yura-miron-solara-plaza' },
  },
  {
    slug: 'mauricio-collect',
    rect: { x: 1355, y: 869, w: 60, h: 60 },
    piece: { title: 'The Pope', artist: 'Mauricio Pommella', price: '0.3 ETH' },
    action: {
      kind: 'eth',
      id: 'mauricio-pommella-the-pope',
      title: 'The Pope',
      ethAmount: '0.3',
      image: '/images/storefront/mauricio-pommella-the-pope.jpg',
    },
  },
  {
    slug: 'anjola-collect',
    rect: { x: 1496, y: 1081, w: 61, h: 61 },
    piece: { title: 'An Ending, A Beginning', artist: 'AnjolaDave', price: '$960' },
    action: { kind: 'stripe', id: 'anjoladave-an-ending-a-beginning' },
  },
];

// The on-chain mark for the collect placards: two interlocked angular
// links on the 45° diagonal — chain as in chain-link, chain as in
// on-chain. Thin-stroked so it stays crisp and un-chunky at placard
// size.
function ChainIcon({ style, color = 'currentColor' }: { style?: React.CSSProperties; color?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="miter"
      aria-hidden
      style={style}
    >
      <path d="M8.6 4.6 14 10l-5.4 5.4L3.2 10z" />
      <path d="M15.4 8.6 20.8 14l-5.4 5.4L10 14z" />
    </svg>
  );
}

type WorkSpot = {
  slug: string;
  rect: { x: number; y: number; w: number; h: number };
  /** 'none' = no hover loupe (Recycle's piece is a click-through only). */
  kind: 'image' | 'video' | 'none';
  src?: string;
  /** Clicking the work opens this in a new tab. */
  href?: string;
};

const WORK_SPOTS: WorkSpot[] = [
  // Recycle's frame is the video piece itself: no loupe, clicking
  // opens the film on Vimeo.
  { slug: 'recycle', rect: { x: 67, y: 517, w: 481, h: 408 }, kind: 'none', href: 'https://vimeo.com/1192225993' },
  { slug: 'yura', rect: { x: 615, y: 560, w: 320, h: 445 }, kind: 'image', src: '/images/ours/loupe-yura.webp', href: 'https://yuramiron.art' },
  { slug: 'pope', rect: { x: 1055, y: 380, w: 275, h: 465 }, kind: 'video', src: '/images/ours/pope-hd.mp4', href: 'https://superrare.com/mpommella' },
  { slug: 'anjola', rect: { x: 1443, y: 540, w: 402, h: 495 }, kind: 'image', src: '/images/ours/loupe-anjola.webp', href: 'https://anjieverselabs.com' },
  { slug: 'nahuel', rect: { x: 1955, y: 540, w: 295, h: 385 }, kind: 'image', src: '/images/ours/loupe-nahuel.webp' },
];

const VIMEO_SRC = 'https://player.vimeo.com/video/1192225993?background=1&autoplay=1&loop=1&muted=1';

// Mobile accordion, one section per work, wall order left to right.
const MOBILE: {
  title: string;
  sub: string;
  media: { kind: 'image' | 'video' | 'vimeo'; src?: string };
  placards: string[];
  /** COLLECT_SPOTS slug — renders the section's collect button. */
  collect?: string;
  /** Outbound routes (Nahuel's read + generate-on-genpi links). */
  external?: { href: string; label: string }[];
}[] = [
  { title: 'Recycle Group', sub: 'Forest of Expired Links', media: { kind: 'vimeo' }, placards: ['lw-recycle-main', 'lw-recycle-quote'], collect: 'recycle-collect' },
  { title: 'Yura Miron', sub: 'Solara Plaza', media: { kind: 'image', src: '/images/ours/loupe-yura.webp' }, placards: ['lw-yura-main', 'lw-yura-quote'], collect: 'yura-collect' },
  { title: 'Mauricio Pommella', sub: 'The Pope', media: { kind: 'video', src: '/images/ours/pope-hd.mp4' }, placards: ['lw-mauricio-main', 'lw-manifesto'], collect: 'mauricio-collect' },
  { title: 'AnjolaDave', sub: 'An Ending, A Beginning', media: { kind: 'image', src: '/images/ours/loupe-anjola.webp' }, placards: ['lw-anjola-main', 'lw-anjola-quote'], collect: 'anjola-collect' },
  { title: 'Nahuel Aquiles', sub: 'Self-Similar', media: { kind: 'image', src: '/images/ours/loupe-nahuel.webp' }, placards: ['lw-nahuel-main', 'lw-nahuel-genpi'], external: [
    { href: 'https://tinyurl.com/nahueldna', label: 'Click to read →' },
    { href: 'https://genpi.org', label: 'Click here to generate yours →' },
  ] },
];

// Photo gallery under the wall — the curated stills: three landscape
// shots either side of the large portrait frame. Culled from the full
// shoot per Olli's picks.
const GALLERY_LEFT = ['ap8_2627', 'ap8_4001', 'dsc_3201'];
const GALLERY_CENTER = 'dsc_3522';
const GALLERY_RIGHT = ['dsc_2164', 'dsc_3276', 'dsc_3812'];
const lw = (name: string) => `/images/ours/lwgallery/${name}.webp`;

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

export function LedgerworksSection() {
  const [playing, setPlaying] = useState(false);
  const [hoverP, setHoverP] = useState<string | null>(null);
  const [hoverW, setHoverW] = useState<string | null>(null);
  const [hoverC, setHoverC] = useState<string | null>(null);
  const [openC, setOpenC] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ fx: 0.5, fy: 0.5 });
  const [media, setMedia] = useState({ w: 1, h: 1 });
  const [openM, setOpenM] = useState<number | null>(null);
  const loupeRef = useRef<HTMLDivElement>(null);
  const graceP = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spot = SPOTS.find((s) => s.slug === hoverP) ?? null;
  const wspot = WORK_SPOTS.find((s) => s.slug === hoverW) ?? null;
  const cspot = COLLECT_SPOTS.find((c) => c.slug === hoverC) ?? null;
  const copen = COLLECT_SPOTS.find((c) => c.slug === openC) ?? null;
  const hudLeft = spot ? spot.rect.x + spot.rect.w / 2 > IMG_W / 2 : false;
  const loupeLeft = wspot ? wspot.rect.x + wspot.rect.w / 2 > IMG_W / 2 : false;
  const cardLeft = cspot ? cspot.rect.x + cspot.rect.w / 2 > IMG_W / 2 : false;

  const enterP = useCallback((slug: string) => {
    if (graceP.current) clearTimeout(graceP.current);
    setHoverP(slug);
  }, []);
  const leaveP = useCallback(() => {
    if (graceP.current) clearTimeout(graceP.current);
    graceP.current = setTimeout(() => setHoverP(null), 220);
  }, []);

  const loupeStyle = (): React.CSSProperties => {
    const box = loupeRef.current;
    if (!box || media.w <= 1) return { opacity: 0 };
    const B = box.clientWidth, BH = box.clientHeight;
    const cover = Math.max(B / media.w, BH / media.h);
    const dw = media.w * cover * ZOOM, dh = media.h * cover * ZOOM;
    const ox = Math.max(0, Math.min(cursor.fx * dw - B / 2, dw - B));
    const oy = Math.max(0, Math.min(cursor.fy * dh - BH / 2, dh - BH));
    return { position: 'absolute', width: dw, height: dh, left: -ox, top: -oy, maxWidth: 'none' };
  };

  return (
    <div className="mt-8">
      <div className="relative mx-auto w-full max-w-[1400px] overflow-hidden rounded-3xl">
        <picture>
          <source srcSet={`/images/ours/ledgerworks-wall.webp${V}`} type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/ours/ledgerworks-wall.png${V}`}
            alt="The Ledgerworks wall as hung at OURS: five framed works and a backlit screen, wired together with black circuit-trace vinyl beneath the Ledgerworks sign."
            // rounded on the image itself, matching the orange ring's
            // radius exactly — the container clip alone let the image
            // corners square past the stroke
            className="block h-auto w-full rounded-3xl"
          />
        </picture>

        {/* thin OURS-orange stroke around the wall, matching the header
            panel's treatment — painted above the image, under the HUDs */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{ boxShadow: `inset 0 0 0 1px ${OURS.orange}` }}
        />

        <video
          src="/images/ours/pope.mp4"
          poster="/images/ours/pope-poster.jpg"
          muted loop playsInline autoPlay preload="metadata"
          onPlaying={() => setPlaying(true)}
          className="absolute"
          style={{
            left: pct(SCREEN.x, IMG_W), top: pct(SCREEN.y, IMG_H),
            width: pct(SCREEN.w, IMG_W), height: pct(SCREEN.h, IMG_H),
            objectFit: 'fill',
            filter: 'brightness(1.16) saturate(1.05)',
          }}
        />

        {/* ------- desktop interactions ------- */}
        {COLLECT_SPOTS.map((c) => (
          <button
            key={c.slug}
            onMouseEnter={() => setHoverC(c.slug)}
            onMouseLeave={() => setHoverC((cur) => (cur === c.slug ? null : cur))}
            onClick={() => setOpenC(c.slug)}
            aria-label={`Collect ${c.piece.title}, by ${c.piece.artist} — ${c.piece.price}`}
            className="absolute hidden border-0 bg-transparent p-0 lg:block"
            style={{
              left: pct(c.rect.x - 4, IMG_W), top: pct(c.rect.y - 4, IMG_H),
              width: pct(c.rect.w + 8, IMG_W), height: pct(c.rect.h + 8, IMG_H),
              cursor: 'pointer',
            }}
          />
        ))}

        {WORK_SPOTS.map((s) => {
          const Tag = s.href ? 'a' : 'div';
          return (
            <Tag
              key={s.slug}
              {...(s.href ? { href: s.href, target: '_blank', rel: 'noopener noreferrer' } : {})}
              onMouseEnter={() => { setHoverW(s.slug); if (s.kind === 'video') setMedia({ w: 720, h: 1280 }); }}
              onMouseLeave={() => setHoverW((c) => (c === s.slug ? null : c))}
              onMouseMove={(e: React.MouseEvent) => {
                const r = e.currentTarget.getBoundingClientRect();
                setCursor({
                  fx: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
                  fy: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
                });
              }}
              className="absolute hidden lg:block"
              style={{
                left: pct(s.rect.x, IMG_W), top: pct(s.rect.y, IMG_H),
                width: pct(s.rect.w, IMG_W), height: pct(s.rect.h, IMG_H),
                cursor: s.href ? 'pointer' : 'zoom-in',
              }}
            />
          );
        })}

        {SPOTS.map((s) => {
          // Placards with a destination are real links on the wall
          // itself — clicking the placard goes where its raised card
          // goes (artist site, SuperRare, Gazelli, the read/generate
          // pages). Quote placards stay hover-only.
          const Tag = s.href ? 'a' : 'div';
          return (
            <Tag
              key={s.slug}
              {...(s.href ? { href: s.href, target: s.href.startsWith('/') ? undefined : '_blank', rel: 'noopener noreferrer' } : {})}
              onMouseEnter={() => enterP(s.slug)}
              onMouseLeave={leaveP}
              className="absolute hidden lg:block"
              style={{
                left: pct(s.rect.x - 4, IMG_W), top: pct(s.rect.y - 4, IMG_H),
                width: pct(s.rect.w + 8, IMG_W), height: pct(s.rect.h + 8, IMG_H),
                cursor: s.href ? 'pointer' : 'zoom-in',
              }}
            />
          );
        })}

        <a
          href={spot?.href ?? undefined}
          target={spot?.href && !spot.href.startsWith('/') ? '_blank' : undefined}
          rel="noopener noreferrer"
          onMouseEnter={() => spot && enterP(spot.slug)}
          onMouseLeave={leaveP}
          className="absolute hidden overflow-hidden rounded-2xl lg:block"
          style={{
            top: '3%',
            width: HUD_W,
            ...(hudLeft ? { left: '1.6%' } : { right: '1.6%' }),
            boxShadow: `inset 0 0 0 1px ${OURS.hair}, 0 22px 48px -18px rgba(0,0,0,0.4)`,
            background: '#fff',
            opacity: spot ? 1 : 0,
            pointerEvents: spot ? 'auto' : 'none',
            cursor: spot?.href ? 'pointer' : 'default',
            transform: spot ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.98)',
            transition: 'opacity 220ms ease, transform 260ms ease',
          }}
        >
          {spot && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/ours/placards/${spot.img}.webp${V}`} alt="" className="block h-auto w-full" />
              {spot.cta && (
                <span
                  className="block px-4 pb-3.5 pt-1 text-center font-mono text-[11px] uppercase tracking-[0.14em]"
                  style={{ color: OURS.orange }}
                >
                  {spot.cta}
                </span>
              )}
            </>
          )}
        </a>

        {/* collect card — replaces the old QR-placard zoom for the four
            collect spots: name, chain mark, price, click to collect. */}
        <div
          className="pointer-events-none absolute hidden rounded-2xl bg-white p-6 text-center lg:block"
          style={{
            top: '3%',
            width: '17%',
            ...(cardLeft ? { left: '1.6%' } : { right: '1.6%' }),
            boxShadow: `inset 0 0 0 1px ${OURS.hair}, 0 22px 48px -18px rgba(0,0,0,0.4)`,
            opacity: cspot ? 1 : 0,
            transform: cspot ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.98)',
            transition: 'opacity 220ms ease, transform 260ms ease',
          }}
        >
          {cspot && (
            <>
              <div className="flex justify-center">
                <ChainIcon color={OURS.orange} style={{ width: 22, height: 22 }} />
              </div>
              <p
                className="mt-3 font-heading text-[15px] uppercase leading-tight"
                style={{ color: OURS.ink }}
              >
                {cspot.piece.title}
              </p>
              <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.12em]" style={{ color: OURS.gray }}>
                {cspot.piece.artist}
              </p>
              <p className="mt-3 font-mono text-[13px]" style={{ color: OURS.ink }}>
                {cspot.piece.price}
              </p>
              <p
                className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ color: OURS.orange }}
              >
                Click to collect →
              </p>
            </>
          )}
        </div>

        {/* the loupe — square magnifier for images, video for The Pope.
            Recycle's piece (kind 'none') skips it: that frame is a plain
            click-through to the film on Vimeo. */}
        <div
          ref={loupeRef}
          className="pointer-events-none absolute hidden overflow-hidden rounded-2xl lg:block"
          style={{
            top: '3%',
            width: LOUPE_W,
            aspectRatio: '1 / 1',
            ...(loupeLeft ? { left: '1.6%' } : { right: '1.6%' }),
            boxShadow: `inset 0 0 0 1px ${OURS.hair}, 0 22px 48px -18px rgba(0,0,0,0.4)`,
            background: '#0d0c0b',
            opacity: wspot && wspot.kind !== 'none' ? 1 : 0,
            transform: wspot && wspot.kind !== 'none' ? 'scale(1)' : 'scale(0.98)',
            transition: 'opacity 200ms ease, transform 240ms ease',
          }}
        >
          {wspot?.kind === 'image' && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={wspot.src}
              alt=""
              onLoad={(e) => setMedia({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
              style={loupeStyle()}
            />
          )}
          {wspot?.kind === 'video' && (
            <video src={wspot.src} muted loop playsInline autoPlay style={loupeStyle()} />
          )}
        </div>
      </div>

      <p
        className="mt-6 hidden text-center font-mono text-[10px] uppercase tracking-[0.14em] lg:block"
        style={{ color: OURS.gray }}
      >
        The wall, as hung — Mauricio Pommella&rsquo;s{' '}
        <span style={{ color: OURS.orange }}>The Pope</span>{' '}
        {playing ? 'playing in the screen' : 'loading…'} · hover a work to zoom, click to visit it · hover a placard to read it
      </p>

      {/* ------- mobile: accordion, wall order left to right ------- */}
      <div className="mt-6 space-y-3 lg:hidden">
        {MOBILE.map((sec, i) => {
          const open = openM === i;
          return (
            <div key={sec.title} className="overflow-hidden rounded-xl border" style={{ borderColor: OURS.hair }}>
              <button
                onClick={() => setOpenM(open ? null : i)}
                aria-expanded={open}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                style={{ background: OURS.cream }}
              >
                <span>
                  <span className="block font-heading text-[14px] uppercase leading-tight" style={{ color: OURS.ink }}>
                    {sec.title}
                  </span>
                  <span className="block text-[12px] italic" style={{ color: OURS.gray }}>
                    {sec.sub}
                  </span>
                </span>
                <span
                  className="font-mono text-lg leading-none transition-transform duration-300"
                  style={{ color: OURS.orange, transform: open ? 'rotate(45deg)' : 'none' }}
                >
                  +
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-500 ease-out"
                style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <div className="space-y-4 bg-white p-4">
                    {open && sec.media.kind === 'vimeo' && (
                      <div className="overflow-hidden rounded-lg" style={{ aspectRatio: '16 / 9' }}>
                        <iframe src={VIMEO_SRC} className="h-full w-full" style={{ border: 0 }} allow="autoplay; fullscreen" title={sec.sub} />
                      </div>
                    )}
                    {open && sec.media.kind === 'video' && (
                      <video src={sec.media.src} muted loop playsInline autoPlay className="w-full rounded-lg" />
                    )}
                    {sec.media.kind === 'image' && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={sec.media.src} alt={`${sec.title} — ${sec.sub}`} className="w-full rounded-lg" />
                    )}
                    {sec.placards.map((p) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={p} src={`/images/ours/placards/${p}.webp${V}`} alt="" className="w-full border" style={{ borderColor: OURS.hair }} />
                    ))}
                    {sec.collect &&
                      (() => {
                        const c = COLLECT_SPOTS.find((x) => x.slug === sec.collect);
                        return c ? (
                          <button
                            onClick={() => setOpenC(c.slug)}
                            className="ours-buy inline-flex items-center gap-2 border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors"
                            style={{ borderColor: OURS.orange, color: OURS.orange }}
                          >
                            <ChainIcon style={{ width: 14, height: 14 }} />
                            Collect — {c.piece.price} →
                          </button>
                        ) : null;
                      })()}
                    {sec.external?.map((ext) => (
                      <a
                        key={ext.href}
                        href={ext.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ours-buy mr-2 inline-flex items-center gap-2 border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors"
                        style={{ borderColor: OURS.orange, color: OURS.orange }}
                      >
                        <ChainIcon style={{ width: 14, height: 14 }} />
                        {ext.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* why FFA hangs on-chain work at all — the standing argument,
          full width between the wall and the photo gallery */}
      <div className="mt-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: OURS.orange }}>
          Why on-chain
        </p>
        <hr className="mt-1.5 h-[2px] w-12 border-0" style={{ background: OURS.orange }} />
        <div className="mt-5 w-full space-y-5 text-body-lg leading-relaxed text-ink/85">
          <p>
            The Foundation features on-chain work in all of its exhibitions as a rule,
            not a novelty. We believe that the utility offered by web3 may be the best
            provenance technology the art world has ever had. It creates a public,
            permanent, tamper-proof record of a work and every hand it has passed
            through. This produces not only proof of ownership for now, but preserves
            the legacy of a piece forever.
          </p>
          <p>
            The benefit to the artist is also indisputable. Resale royalties can be
            written into the work itself, so when a piece appreciates and changes
            hands, its artist shares in the upside automatically. This is a right
            physical artists have fought for for a century. Authentication no longer
            hinges on an expert&rsquo;s letter or a gallery&rsquo;s memory. Editions
            are honest. The ledger enforces scarcity in a way much more verifiable
            than a signature. And an artist&rsquo;s market stays legible to them:
            they know where their work travels and what it trades for.
          </p>
          <p>
            The blockchain widens what art can be and who can hold it. A collector
            anywhere on earth can support an artist directly, with no gatekeeper
            between them. The relationship outlives any platform, because the
            on-chain record does.
          </p>
          <p>
            Ledgerworks shares the same space as the oil paint and the ceramics as a
            display of works just as impressive, but also as an educational tool and
            a bridge to the future that more and more of the art world is exploring.
          </p>
        </div>
      </div>

      {/* ------- the wall in the room: photos & film ------- */}
      <div className="mt-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: OURS.orange }}>
          The wall, in the room
        </p>
        <hr className="mt-1.5 h-[2px] w-12 border-0" style={{ background: OURS.orange }} />
        <div className="mt-5 space-y-3">
          {/* the stills: portrait frame centred, three landscape shots a
              side. The side stacks set the row height; the portrait
              cover-fills it. On mobile everything stacks, portrait first. */}
          <div className="grid gap-3 sm:grid-cols-[1fr_1.15fr_1fr]">
            <div className="flex flex-col justify-between gap-3">
              {GALLERY_LEFT.map((name) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={name}
                  src={lw(name)}
                  alt="Ledgerworks at OURS"
                  className="block w-full rounded-xl"
                  loading="lazy"
                />
              ))}
            </div>
            <div className="order-first overflow-hidden rounded-xl sm:relative sm:order-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lw(GALLERY_CENTER)}
                alt="Ledgerworks at OURS — the backlit screen up close"
                className="block h-auto w-full sm:absolute sm:inset-0 sm:h-full sm:object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-between gap-3">
              {GALLERY_RIGHT.map((name) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={name}
                  src={lw(name)}
                  alt="Ledgerworks at OURS"
                  className="block w-full rounded-xl"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ------- collect modals ------- */}
      {COLLECT_SPOTS.map((c) => {
        if (c.action.kind !== 'stripe') return null;
        const artwork = ARTWORKS.find((a) => a.id === (c.action as { id: string }).id);
        if (!artwork) return null;
        return (
          <BuyModal
            key={c.slug}
            artwork={artwork}
            returnSection="ledgerworks"
            open={openC === c.slug}
            onOpenChange={(o) => {
              if (!o) setOpenC(null);
            }}
          />
        );
      })}
      {copen && copen.action.kind !== 'stripe' && (
        <LWCollectModal spot={copen} onClose={() => setOpenC(null)} />
      )}
    </div>
  );
}

// Modal for the two collect routes the Stripe BuyModal can't carry:
// The Pope's ETH flow (FFA wallet + QR + notify form, the same
// EthPieceCheckout the collect page uses) and Recycle Group's
// gallery-represented piece, which hands off to Gazelli Art House in a
// new tab. Same visual language as BuyModal — white, rounded-2xl, thin
// orange outline — and portaled to <body> for the same reason.
function LWCollectModal({ spot, onClose }: { spot: CollectSpot; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const eth = spot.action.kind === 'eth' ? spot.action : null;
  const ext = spot.action.kind === 'external' ? spot.action : null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] overflow-y-auto"
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
      <div className="relative flex min-h-full items-center justify-center p-4 md:p-8">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Collect ${spot.piece.title}, by ${spot.piece.artist}`}
          className={`relative w-full overflow-hidden rounded-2xl bg-white ${
            eth ? 'max-w-3xl md:grid md:grid-cols-[1fr_1.1fr]' : 'max-w-md'
          }`}
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
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 font-mono text-sm"
            style={{ color: OURS.ink, boxShadow: `inset 0 0 0 1px ${OURS.orange}` }}
          >
            ✕
          </button>

          {eth && (
            <div className="flex items-center justify-center p-6 md:p-8" style={{ background: '#F0EEEB' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={eth.image}
                alt={`${spot.piece.title}, by ${spot.piece.artist}`}
                className="h-auto w-full rounded-lg"
                style={{ maxHeight: '52vh', width: 'auto', maxWidth: '100%' }}
              />
            </div>
          )}

          <div className="flex flex-col p-7 md:p-9">
            <div className="flex items-center gap-2">
              <ChainIcon color={OURS.orange} style={{ width: 14, height: 14 }} />
              <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: OURS.orange }}>
                Ledgerworks · On-chain
              </p>
            </div>
            <h3 className="mt-3 text-h5 leading-tight text-ink md:text-h4">{spot.piece.title}</h3>
            <p className="mt-1.5 text-sm uppercase tracking-[0.08em] text-sage">{spot.piece.artist}</p>
            <p className="mt-4 text-h5 text-ink">{spot.piece.price}</p>

            {ext && (
              <>
                <p className="mt-4 text-sm leading-relaxed text-muted">{ext.note}</p>
                <div className="mt-7 flex flex-wrap items-baseline gap-3">
                  <a
                    href={ext.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] uppercase tracking-[0.16em] transition-opacity hover:opacity-70"
                    style={{ color: OURS.orange }}
                    onClick={onClose}
                  >
                    {ext.cta} →
                  </a>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    Opens in a new tab
                  </span>
                </div>
              </>
            )}

            {eth && (
              <div className="mt-5">
                <EthPieceCheckout
                  artworkId={eth.id}
                  pieceTitle={eth.title}
                  ethAmount={eth.ethAmount}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
