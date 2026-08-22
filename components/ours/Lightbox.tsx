'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { OURS } from './tokens';

// Full-screen image viewer for the OURS page — the phone's answer to
// every desktop hover-zoom. Pinch to zoom (pointer events, so it also
// works with a trackpad's ctrl-wheel), drag to pan, double-tap to jump
// between 1× and 2.5×, swipe left/right at 1× to move through a set.
// Same chrome as the page's modals: ink scrim, thin orange ring on the
// close button, mono counter.

export type LightboxItem = { src: string; alt: string; caption?: string };

const MAX = 4;

export function Lightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: LightboxItem[];
  index: number;
  onIndexChange?: (i: number) => void;
  onClose: () => void;
}) {
  const item = items[index];
  const [t, setT] = useState({ s: 1, x: 0, y: 0 });
  const tRef = useRef(t);
  tRef.current = t;
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ dist: number; s: number; cx: number; cy: number; x: number; y: number } | null>(null);
  const lastTap = useRef(0);
  const swipe = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const reset = useCallback(() => setT({ s: 1, x: 0, y: 0 }), []);
  useEffect(() => reset(), [index, reset]);

  // lock the page behind, close on Escape, arrows step
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onIndexChange && index < items.length - 1) onIndexChange(index + 1);
      if (e.key === 'ArrowLeft' && onIndexChange && index > 0) onIndexChange(index - 1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onIndexChange, index, items.length]);

  const clampT = (s: number, x: number, y: number) => {
    const el = imgRef.current;
    if (!el) return { s, x, y };
    // allow panning until the image's edge reaches the viewport centre
    const r = el.getBoundingClientRect();
    const halfW = (r.width / tRef.current.s) * s * 0.5;
    const halfH = (r.height / tRef.current.s) * s * 0.5;
    const limX = Math.max(0, halfW - window.innerWidth * 0.5 + window.innerWidth * 0.5);
    const limY = Math.max(0, halfH - window.innerHeight * 0.5 + window.innerHeight * 0.5);
    return { s, x: Math.max(-limX, Math.min(limX, x)), y: Math.max(-limY, Math.min(limY, y)) };
  };

  const zoomAt = (factor: number, px: number, py: number) => {
    const cur = tRef.current;
    const s = Math.max(1, Math.min(MAX, cur.s * factor));
    const k = s / cur.s;
    // keep the point under the cursor/fingers fixed
    const ox = px - window.innerWidth / 2;
    const oy = py - window.innerHeight / 2;
    const x = ox - (ox - cur.x) * k;
    const y = oy - (oy - cur.y) * k;
    setT(s === 1 ? { s: 1, x: 0, y: 0 } : clampT(s, x, y));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = Array.from(pointers.current.values());
    if (pts.length === 2) {
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      gesture.current = { dist, s: tRef.current.s, cx: (pts[0].x + pts[1].x) / 2, cy: (pts[0].y + pts[1].y) / 2, x: tRef.current.x, y: tRef.current.y };
      swipe.current = null;
    } else if (pts.length === 1) {
      swipe.current = { x: e.clientX, y: e.clientY, moved: false };
      gesture.current = { dist: 0, s: tRef.current.s, cx: e.clientX, cy: e.clientY, x: tRef.current.x, y: tRef.current.y };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = Array.from(pointers.current.values());
    const g = gesture.current;
    if (!g) return;
    if (pts.length === 2 && g.dist > 0) {
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const s = Math.max(1, Math.min(MAX, g.s * (dist / g.dist)));
      const mx = (pts[0].x + pts[1].x) / 2, my = (pts[0].y + pts[1].y) / 2;
      const k = s / g.s;
      const ox = g.cx - window.innerWidth / 2, oy = g.cy - window.innerHeight / 2;
      const x = ox - (ox - g.x) * k + (mx - g.cx);
      const y = oy - (oy - g.y) * k + (my - g.cy);
      setT(s === 1 ? { s: 1, x: 0, y: 0 } : clampT(s, x, y));
    } else if (pts.length === 1) {
      const dx = e.clientX - g.cx, dy = e.clientY - g.cy;
      if (swipe.current && Math.hypot(dx, dy) > 6) swipe.current.moved = true;
      if (tRef.current.s > 1) setT(clampT(tRef.current.s, g.x + dx, g.y + dy));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      const sw = swipe.current;
      swipe.current = null;
      gesture.current = null;
      if (sw) {
        const dx = e.clientX - sw.x, dy = e.clientY - sw.y;
        if (tRef.current.s === 1 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && onIndexChange) {
          if (dx < 0 && index < items.length - 1) onIndexChange(index + 1);
          if (dx > 0 && index > 0) onIndexChange(index - 1);
          return;
        }
        if (!sw.moved) {
          const now = Date.now();
          if (now - lastTap.current < 300) {
            // double tap: toggle 1× ↔ 2.5× around the tap
            if (tRef.current.s > 1) reset();
            else zoomAt(2.5, e.clientX, e.clientY);
            lastTap.current = 0;
          } else {
            lastTap.current = now;
          }
        }
      }
    } else {
      // one finger lifted mid-pinch: restart as a pan from here
      const pts = Array.from(pointers.current.values());
      gesture.current = { dist: 0, s: tRef.current.s, cx: pts[0].x, cy: pts[0].y, x: tRef.current.x, y: tRef.current.y };
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY);
  };

  if (!item) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center"
      style={{ background: 'rgba(40,40,40,0.92)', touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={item.src}
        alt={item.alt}
        draggable={false}
        className="select-none"
        style={{
          maxWidth: '100vw',
          maxHeight: '100vh',
          width: 'auto',
          height: 'auto',
          transform: `translate(${t.x}px, ${t.y}px) scale(${t.s})`,
          transition: pointers.current.size ? 'none' : 'transform 180ms ease',
          willChange: 'transform',
        }}
      />

      <button
        type="button"
        onClick={onClose}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white font-mono text-sm"
        style={{ color: OURS.ink, boxShadow: `inset 0 0 0 1px ${OURS.orange}` }}
      >
        ✕
      </button>

      {(items.length > 1 || item.caption) && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 px-6 pb-6 text-center"
          style={{ color: 'rgba(240,238,235,0.8)' }}
        >
          {item.caption && <p className="text-[12px] leading-snug">{item.caption}</p>}
          {items.length > 1 && (
            <p className="font-mono text-[10px] uppercase tracking-[0.16em]">
              {index + 1} / {items.length} · swipe
            </p>
          )}
        </div>
      )}
      {t.s === 1 && (
        <p
          className="pointer-events-none absolute left-0 right-0 top-6 text-center font-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ color: 'rgba(240,238,235,0.5)' }}
        >
          Pinch or double-tap to zoom
        </p>
      )}
    </div>,
    document.body
  );
}
