'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Floating "Home" pill in the same slot the menu pill used to occupy.
// Hidden on the homepage itself — only appears on subpages so visitors have
// a quick way back. Wears the FFA logo + wordmark; the logo is inverted to
// read on the glassy dark pill (the source SVG embeds a black raster, so
// brightness-0/invert is the simplest way to flip it to white).
// Wordmark hides under the sm breakpoint to keep the pill from overflowing
// narrow viewports — logo alone still reads as "tap to home".
export function HomeButton() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <Link
      href="/"
      aria-label="Foundation for Future Aesthetics — back to home"
      className="menu-pill-position inline-flex items-center gap-3 rounded-full border border-white/85 bg-black/35 px-5 py-2 text-sm uppercase tracking-[0.14em] text-white backdrop-blur-md transition hover:bg-black/55"
    >
      <Image
        src="/images/logo.svg"
        alt=""
        width={28}
        height={24}
        className="h-5 w-auto brightness-0 invert"
        priority
      />
      <span className="hidden sm:inline">Foundation for Future Aesthetics</span>
    </Link>
  );
}
