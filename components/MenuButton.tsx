'use client';

import { useEffect } from 'react';

type Props = {
  open: boolean;
  onToggle: () => void;
  variant?: 'light' | 'dark';
};

// Pill-shaped menu button (top-right of hero). Toggles to X when open.
export function MenuButton({ open, onToggle, variant = 'light' }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onToggle();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onToggle]);

  const ring = variant === 'light' ? 'border-white/85 text-white' : 'border-ink text-ink';
  return (
    <button
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="site-menu"
      className={`menu-pill-position inline-flex items-center gap-2 rounded-full border bg-black/35 px-5 py-2 text-sm uppercase tracking-[0.14em] backdrop-blur-md transition hover:bg-black/55 ${ring}`}
    >
      <span aria-hidden className="grid h-3.5 w-4">
        {open ? (
          <span className="relative block h-full w-full">
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 rotate-45 bg-current" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 -rotate-45 bg-current" />
          </span>
        ) : (
          <>
            <span className="block h-px w-full bg-current" />
            <span className="block h-px w-full bg-current" />
            <span className="block h-px w-full bg-current" />
          </>
        )}
      </span>
      {open ? 'Close' : 'Menu'}
    </button>
  );
}
