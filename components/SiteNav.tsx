'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Flat top-level nav — five items, no dropdowns. Resources used to
// be a dropdown containing Musings and Support; those got promoted
// to top-level in their own right, so the dropdown is gone.
type NavLink = { href: string; label: string };

const NAV: NavLink[] = [
  { href: '/possibilia', label: 'Possibilia' },
  { href: '/ours', label: 'OURS' },
  { href: '/resources', label: 'Musings' },
  { href: '/support', label: 'Support' },
  { href: '/contact', label: 'Contact' },
];

// Two completely different layouts, swapped at md.
//
// **Desktop (md+)**: the original elongated sticky pill across the
// top of the page — logo on the left, horizontal nav on the right.
//
// **Mobile**: a single 44px frosted-glass pill anchored fixed in the
// upper-right corner of the viewport. Tapping the pill expands it
// into a frosted-glass card that drops down beneath it with the same
// nav links. No bar across the top, no logo block — just the pill.
export function SiteNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <nav aria-label="Site navigation">
      {/* Desktop bar — sticky at top, hidden on mobile. */}
      <div className="sticky top-6 z-50 hidden md:top-8 md:block">
        <div className="flex items-center justify-between gap-4 rounded-full border border-white/25 bg-black/20 px-5 py-2.5 backdrop-blur-md md:px-7 md:py-3">
          <Link
            href="/"
            aria-label="Home, Foundation for Future Aesthetics"
            className="group flex shrink-0 items-center gap-2.5"
          >
            <Image
              src="/images/logo.png"
              alt=""
              width={28}
              height={24}
              className="h-6 w-auto opacity-55 brightness-0 invert transition-opacity group-hover:opacity-100 md:h-7"
              priority
            />
            <span className="hidden font-heading text-lg font-semibold tracking-tight text-white/55 transition-colors group-hover:text-white lg:inline">
              Foundation for Future Aesthetics
            </span>
          </Link>
          <ul className="flex items-center gap-4 text-xs uppercase tracking-[0.12em] sm:gap-6 md:gap-10 md:text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`transition-colors hover:text-white ${
                    isActive(item.href) ? 'text-white/80' : 'text-white/55'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile floating pill + expanded menu — only on mobile. */}
      <MobileMenuPill isActive={isActive} />
    </nav>
  );
}

// Mobile-only floating pill. Owns its own open/close state. The pill
// itself is fixed at top-4 right-4 (16px from each edge); when open,
// a separate frosted-glass card drops down beneath it with the nav
// links. A backdrop catches taps outside both elements to dismiss.
function MobileMenuPill({ isActive }: { isActive: (href: string) => boolean }) {
  const [open, setOpen] = useState(false);

  // Lock body scroll + Escape-to-close while the menu is open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      {/* Backdrop. Only mounted when open; click anywhere outside the
          pill / menu to dismiss. backdrop-blur-sm darkens the page
          underneath so the pill+menu read as the active surface. */}
      {open && (
        <div
          onClick={close}
          aria-hidden
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        />
      )}

      {/* Pill — the always-visible trigger. Frosted glass with the
          FFA lettermark on the left and the hamburger / X on the
          right. The logo here is a visual anchor (not a separate
          link) — tapping anywhere on the pill opens the menu, and
          the menu's first item is a Home link that handles the
          actual navigation. */}
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fixed right-4 top-4 z-50 flex h-11 items-center gap-2.5 rounded-full border border-white/30 bg-black/55 px-3.5 text-white backdrop-blur-2xl backdrop-saturate-150 transition-colors hover:bg-black/70"
      >
        <Image
          src="/images/logo.png"
          alt=""
          width={24}
          height={26}
          className="h-5 w-auto opacity-85 brightness-0 invert"
        />
        {open ? (
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M4 4l12 12M16 4L4 16" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M3 6h14M3 10h14M3 14h14" />
          </svg>
        )}
      </button>

      {/* Expanded menu card. Anchored top-right (right-4) just below
          the pill (top is 16px page edge + 44px pill + 8px gap = 68px).
          Same frosted chrome as the pill so the two read as a single
          component that "expanded." */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed right-4 top-[4.25rem] z-50 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/30 bg-black/60 backdrop-blur-2xl backdrop-saturate-150"
        >
          <ul className="flex flex-col gap-1 p-3 text-sm uppercase tracking-[0.1em]">
            {/* Home link — mobile-only entry. Desktop's left-aligned
                logo + wordmark already handles "back to home"; on
                mobile the pill's logo is a visual-only anchor so the
                menu needs an explicit Home item. */}
            <li>
              <Link
                href="/"
                onClick={close}
                className={`block rounded-xl px-4 py-3 transition-colors hover:bg-white/10 ${
                  isActive('/') ? 'text-white' : 'text-white/70'
                }`}
              >
                Home
              </Link>
            </li>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className={`block rounded-xl px-4 py-3 transition-colors hover:bg-white/10 ${
                    isActive(item.href) ? 'text-white' : 'text-white/70'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
