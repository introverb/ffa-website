'use client';

import { useCallback, useRef, useState } from 'react';
import { OURS } from './tokens';

// Ledgerworks — the wall as hung. Desktop: the screen plays The Pope,
// hovering a placard raises it legibly (all placards standardised to the
// manifesto's width), hovering a work opens a loupe — magnifying prints,
// playing HD video for The Pope, and playing the on-chain Vimeo for
// Recycle Group. Mobile: the wall sits on top and everything below folds
// into an accordion, one section per work, left to right.
const IMG_W = 2400;
const IMG_H = 1528;
const SCREEN = { x: 1069, y: 394, w: 246, h: 438 };
const V = '?v=8';
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
};

const SPOTS: PlacardSpot[] = [
  { slug: 'recycle-main', rect: { x: 38, y: 993, w: 93, h: 127 }, img: 'lw-recycle-main', href: 'https://bit.ly/forest-of-expired-links' },
  { slug: 'recycle-qr', rect: { x: 244, y: 903, w: 61, h: 60 }, img: 'lw-recycle-qr', href: '/ours/collect' },
  { slug: 'recycle-quote', rect: { x: 339, y: 986, w: 94, h: 93 }, img: 'lw-recycle-quote' },
  { slug: 'yura-main', rect: { x: 498, y: 1002, w: 92, h: 119 }, img: 'lw-yura-main', href: 'https://yuramiron.art' },
  { slug: 'yura-qr', rect: { x: 686, y: 1092, w: 61, h: 61 }, img: 'lw-yura-qr', href: '/ours/collect' },
  { slug: 'yura-quote', rect: { x: 904, y: 1066, w: 93, h: 94 }, img: 'lw-yura-quote' },
  { slug: 'mauricio-main', rect: { x: 1203, y: 871, w: 92, h: 144 }, img: 'lw-mauricio-main', href: 'https://superrare.com/mpommella' },
  { slug: 'anjola-main', rect: { x: 1681, y: 1089, w: 96, h: 114 }, img: 'lw-anjola-main' },
  { slug: 'manifesto', rect: { x: 1265, y: 1036, w: 100, h: 177 }, img: 'lw-manifesto' },
  { slug: 'mauricio-qr', rect: { x: 1355, y: 869, w: 60, h: 60 }, img: 'lw-mauricio-qr', href: '/ours/collect' },
  { slug: 'anjola-qr', rect: { x: 1496, y: 1081, w: 61, h: 61 }, img: 'lw-anjola-qr', href: '/ours/collect' },
  { slug: 'anjola-quote', rect: { x: 1835, y: 1077, w: 94, h: 95 }, img: 'lw-anjola-quote' },
  { slug: 'nahuel-main', rect: { x: 2143, y: 976, w: 94, h: 108 }, img: 'lw-nahuel-main', href: 'https://tinyurl.com/nahueldna' },
  { slug: 'nahuel-genpi', rect: { x: 2143, y: 1096, w: 94, h: 113 }, img: 'lw-nahuel-genpi', href: 'https://genpi.org' },
];

type WorkSpot = {
  slug: string;
  rect: { x: number; y: number; w: number; h: number };
  kind: 'image' | 'video' | 'vimeo';
  src?: string;
};

const WORK_SPOTS: WorkSpot[] = [
  { slug: 'recycle', rect: { x: 67, y: 517, w: 481, h: 408 }, kind: 'vimeo' },
  { slug: 'yura', rect: { x: 615, y: 560, w: 320, h: 445 }, kind: 'image', src: '/images/ours/loupe-yura.webp' },
  { slug: 'pope', rect: { x: 1055, y: 380, w: 275, h: 465 }, kind: 'video', src: '/images/ours/pope-hd.mp4' },
  { slug: 'anjola', rect: { x: 1443, y: 540, w: 402, h: 495 }, kind: 'image', src: '/images/ours/loupe-anjola.webp' },
  { slug: 'nahuel', rect: { x: 1955, y: 540, w: 295, h: 385 }, kind: 'image', src: '/images/ours/loupe-nahuel.webp' },
];

const VIMEO_SRC = 'https://player.vimeo.com/video/1192225993?background=1&autoplay=1&loop=1&muted=1';

// Mobile accordion, one section per work, wall order left to right.
const MOBILE: {
  title: string;
  sub: string;
  media: { kind: 'image' | 'video' | 'vimeo'; src?: string };
  placards: string[];
}[] = [
  { title: 'Recycle Group', sub: 'Forest of Expired Links', media: { kind: 'vimeo' }, placards: ['lw-recycle-main', 'lw-recycle-quote', 'lw-recycle-qr'] },
  { title: 'Yura Miron', sub: 'Solara Plaza', media: { kind: 'image', src: '/images/ours/loupe-yura.webp' }, placards: ['lw-yura-main', 'lw-yura-quote', 'lw-yura-qr'] },
  { title: 'Mauricio Pommella', sub: 'The Pope', media: { kind: 'video', src: '/images/ours/pope-hd.mp4' }, placards: ['lw-mauricio-main', 'lw-manifesto', 'lw-mauricio-qr'] },
  { title: 'AnjolaDave', sub: 'An Ending, A Beginning', media: { kind: 'image', src: '/images/ours/loupe-anjola.webp' }, placards: ['lw-anjola-main', 'lw-anjola-quote', 'lw-anjola-qr'] },
  { title: 'Nahuel Aquiles', sub: 'Self-Similar', media: { kind: 'image', src: '/images/ours/loupe-nahuel.webp' }, placards: ['lw-nahuel-main', 'lw-nahuel-genpi'] },
];

// Photo & film gallery under the wall. The room film (graded to match
// the photography, first/last 3s trimmed — both ends so the boomerang
// loop stays seamless) runs full width; beneath it, the curated
// stills: three landscape shots either side of the large portrait
// frame. Culled from the full shoot 2026-08-17 per Olli's picks.
const GALLERY_VIDEO = '/images/ours/lwgallery/ledgerworks-loop.mp4';
const GALLERY_LEFT = ['ap8_2627', 'ap8_4001', 'dsc_3812'];
const GALLERY_CENTER = 'dsc_3522';
const GALLERY_RIGHT = ['dsc_2164', 'dsc_3276', 'dsc_3201'];
const lw = (name: string) => `/images/ours/lwgallery/${name}.webp`;

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

export function LedgerworksSection() {
  const [playing, setPlaying] = useState(false);
  const [hoverP, setHoverP] = useState<string | null>(null);
  const [hoverW, setHoverW] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ fx: 0.5, fy: 0.5 });
  const [media, setMedia] = useState({ w: 1, h: 1 });
  const [openM, setOpenM] = useState<number | null>(null);
  const loupeRef = useRef<HTMLDivElement>(null);
  const graceP = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spot = SPOTS.find((s) => s.slug === hoverP) ?? null;
  const wspot = WORK_SPOTS.find((s) => s.slug === hoverW) ?? null;
  const hudLeft = spot ? spot.rect.x + spot.rect.w / 2 > IMG_W / 2 : false;
  const loupeLeft = wspot ? wspot.rect.x + wspot.rect.w / 2 > IMG_W / 2 : false;

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
      <div className="relative mx-auto w-full max-w-[1400px] overflow-hidden rounded-[2.5rem]">
        <picture>
          <source srcSet={`/images/ours/ledgerworks-wall.webp${V}`} type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/ours/ledgerworks-wall.png${V}`}
            alt="The Ledgerworks wall as hung at OURS: five framed works and a backlit screen, wired together with black circuit-trace vinyl beneath the Ledgerworks sign."
            className="block h-auto w-full"
          />
        </picture>

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
        {WORK_SPOTS.map((s) => (
          <div
            key={s.slug}
            onMouseEnter={() => { setHoverW(s.slug); if (s.kind === 'video') setMedia({ w: 720, h: 1280 }); }}
            onMouseLeave={() => setHoverW((c) => (c === s.slug ? null : c))}
            onMouseMove={(e) => {
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
              cursor: 'zoom-in',
            }}
          />
        ))}

        {SPOTS.map((s) => (
          <div
            key={s.slug}
            onMouseEnter={() => enterP(s.slug)}
            onMouseLeave={leaveP}
            className="absolute hidden lg:block"
            style={{
              left: pct(s.rect.x - 4, IMG_W), top: pct(s.rect.y - 4, IMG_H),
              width: pct(s.rect.w + 8, IMG_W), height: pct(s.rect.h + 8, IMG_H),
              cursor: 'zoom-in',
            }}
          />
        ))}

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
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/images/ours/placards/${spot.img}.webp${V}`} alt="" className="block h-auto w-full" />
          )}
        </a>

        {/* the loupe — video-shaped for the Vimeo, square otherwise */}
        <div
          ref={loupeRef}
          className="pointer-events-none absolute hidden overflow-hidden rounded-2xl lg:block"
          style={{
            top: '3%',
            width: wspot?.kind === 'vimeo' ? '46%' : LOUPE_W,
            aspectRatio: wspot?.kind === 'vimeo' ? '16 / 9' : '1 / 1',
            ...(loupeLeft ? { left: '1.6%' } : { right: '1.6%' }),
            boxShadow: `inset 0 0 0 1px ${OURS.hair}, 0 22px 48px -18px rgba(0,0,0,0.4)`,
            background: '#0d0c0b',
            opacity: wspot ? 1 : 0,
            transform: wspot ? 'scale(1)' : 'scale(0.98)',
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
          {wspot?.kind === 'vimeo' && (
            <iframe
              src={VIMEO_SRC}
              className="absolute inset-0 h-full w-full"
              style={{ border: 0 }}
              allow="autoplay; fullscreen"
              title="Recycle Group — Forest of Expired Links"
            />
          )}
        </div>
      </div>

      <p
        className="mt-6 hidden text-center font-mono text-[10px] uppercase tracking-[0.14em] lg:block"
        style={{ color: OURS.gray }}
      >
        The wall, as hung — Mauricio Pommella&rsquo;s{' '}
        <span style={{ color: OURS.orange }}>The Pope</span>{' '}
        {playing ? 'playing in the screen' : 'loading…'} · hover a work to zoom · hover a placard to read it
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
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ------- the wall in the room: photos & film ------- */}
      <div className="mt-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: OURS.orange }}>
          The wall, in the room
        </p>
        <hr className="mt-1.5 h-[2px] w-12 border-0" style={{ background: OURS.orange }} />
        <div className="mt-5 space-y-3">
          {/* the room film, full width of the section */}
          <video
            src={GALLERY_VIDEO}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            className="block w-full overflow-hidden rounded-xl"
          />
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
    </div>
  );
}
