'use client';

import { useEffect, useRef, useState } from 'react';
import { OURS } from './tokens';

// The header panel's event film. Autoplays muted (the only autoplay
// browsers allow), with an on-brand "sound on" chip pinned to the
// film's bottom-right for as long as it's muted — the film carries a
// mix now, and this is the one affordance that reveals it. Clicking
// unmutes and the chip leaves.
export function HeaderFilm({ src, poster }: { src: string; poster?: string }) {
  const [muted, setMuted] = useState(true);
  const ref = useRef<HTMLVideoElement>(null);

  // React doesn't reliably reflect the `muted` prop into the DOM on
  // hydration; set it by hand so autoplay is never blocked.
  useEffect(() => {
    if (ref.current) ref.current.muted = true;
  }, []);

  const soundOn = () => {
    const v = ref.current;
    if (v) {
      v.muted = false;
      v.volume = 1;
      v.play().catch(() => {});
    }
    setMuted(false);
  };

  return (
    <div className="relative w-full">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        className="w-full rounded-xl md:max-h-full"
        style={{ aspectRatio: '16 / 9', objectFit: 'cover' }}
      />
      {muted && (
        <button
          type="button"
          onClick={soundOn}
          aria-label="Turn the sound on"
          className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full px-3.5 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-opacity hover:opacity-90"
          style={{
            background: 'rgba(255,255,255,0.88)',
            color: OURS.ink,
            boxShadow: `inset 0 0 0 1px ${OURS.orange}`,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          {/* speaker mark, thin-stroked like the chain icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
            strokeLinecap="round"
            aria-hidden
            style={{ width: 14, height: 14, color: OURS.orange }}
          >
            <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4z" />
            <path d="M15.5 9.2a4 4 0 0 1 0 5.6" />
            <path d="M17.8 7a7 7 0 0 1 0 10" />
          </svg>
          Sound on
        </button>
      )}
    </div>
  );
}
