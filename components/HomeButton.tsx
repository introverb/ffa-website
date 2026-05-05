'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Floating "Home" pill in the same slot the menu pill used to occupy.
// Hidden on the homepage itself — only appears on subpages so visitors have
// a quick way back. Styling mirrors the old menu pill so the pill shape and
// glassy backdrop carry over.
export function HomeButton() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <Link
      href="/"
      aria-label="Back to home"
      className="menu-pill-position inline-flex items-center gap-2 rounded-full border border-white/85 bg-black/35 px-5 py-2 text-sm uppercase tracking-[0.14em] text-white backdrop-blur-md transition hover:bg-black/55"
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M10 12 6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Home
    </Link>
  );
}
