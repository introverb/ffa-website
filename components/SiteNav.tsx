'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Nav model. Top-level items either link directly (`href`) or open a
// dropdown of child links (`children`). Resources groups Musings,
// Partnerships, and Support so the top-level nav stays short and the
// secondary content lives one click away.
type NavLink = { href: string; label: string };
type NavItem = NavLink | { label: string; children: NavLink[] };

const NAV: NavItem[] = [
  { href: '/possibilia', label: 'Possibilia' },
  { href: '/ours', label: 'OURS' },
  {
    label: 'Resources',
    children: [
      { href: '/resources', label: 'Musings' },
      { href: '/partnerships', label: 'Partnerships' },
      { href: '/support', label: 'Support' },
    ],
  },
  { href: '/contact', label: 'Contact' },
];

function isDropdown(item: NavItem): item is { label: string; children: NavLink[] } {
  return 'children' in item;
}

// Sticky elongated pill at the top of every page. Stretches to match
// surrounding panel width. Frosted, translucent — subtle in its
// default state with everything (logo, text) at reduced opacity,
// lifting to full white on hover.
//
// Resources opens a dropdown rendered as an extension of the pill
// itself: the dropdown is a sibling of the pill (not a child of the
// trigger button), positioned absolute at top-full of the nav with a
// 1px overlap so the pill's bottom border is hidden. Same bg, same
// border, no top border, rounded only at the bottom — reads as one
// continuous fabric.
export function SiteNav() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  // Small delay on close so the cursor can travel from the trigger
  // to the dropdown panel without closing in between.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }
  function scheduleClose(delay = 120) {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), delay);
  }

  useEffect(() => {
    if (!openMenu) return;
    function onClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenMenu(null);
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [openMenu]);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  const openItem = NAV.find((i) => isDropdown(i) && i.label === openMenu);
  const openChildren = openItem && isDropdown(openItem) ? openItem.children : null;

  return (
    <nav
      ref={navRef}
      aria-label="Site navigation"
      className="sticky top-6 z-50 md:top-8"
    >
      <div className="relative flex items-center justify-between gap-4 rounded-full border border-white/25 bg-black/20 px-5 py-2.5 backdrop-blur-md md:px-7 md:py-3">
        <Link
          href="/"
          aria-label="Home, Foundation for Future Aesthetics"
          className="group flex shrink-0 items-center gap-2.5"
        >
          <Image
            src="/images/logo.svg"
            alt=""
            width={28}
            height={24}
            className="h-6 w-auto opacity-55 brightness-0 invert transition-opacity group-hover:opacity-100 md:h-7"
            priority
          />
          <span className="hidden font-heading text-xs font-semibold tracking-tight text-white/55 transition-colors group-hover:text-white lg:inline">
            Foundation for Future Aesthetics
          </span>
        </Link>
        <ul className="flex items-center gap-4 text-xs uppercase tracking-[0.12em] sm:gap-6 md:gap-10 md:text-sm">
          {NAV.map((item) =>
            isDropdown(item) ? (
              <li key={item.label}>
                <button
                  type="button"
                  aria-expanded={openMenu === item.label}
                  aria-haspopup="menu"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenMenu(item.label);
                  }}
                  onMouseLeave={() => scheduleClose()}
                  onClick={() =>
                    setOpenMenu((prev) => (prev === item.label ? null : item.label))
                  }
                  className={`uppercase tracking-[0.12em] transition-colors hover:text-white ${
                    item.children.some((c) => isActive(c.href))
                      ? 'text-white/80'
                      : 'text-white/55'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ) : (
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
            ),
          )}
        </ul>
      </div>

      {/* Dropdown — each child link is its own frosted pill matching
          the nav bar's family. Wrapper has `pt-2` which doubles as
          (a) the visible spacing between the nav bar and the dropdown
          row, and (b) a transparent hover bridge so the cursor can
          travel from the trigger button down through the gap without
          the close timer firing. The wrapper itself catches hover
          across its full width — no `pointer-events-none` since that
          breaks the bridge. */}
      {openChildren && (
        <div
          className="absolute left-0 right-0 top-full flex justify-center pt-2"
          onMouseEnter={cancelClose}
          onMouseLeave={() => scheduleClose()}
        >
          <ul
            role="menu"
            aria-label={openMenu ?? undefined}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] md:text-sm"
          >
            {openChildren.map((item) => (
              <li key={item.href} role="none">
                <Link
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpenMenu(null)}
                  className={`block whitespace-nowrap rounded-full border border-white/25 bg-black/20 px-5 py-2.5 backdrop-blur-md transition-colors hover:text-white md:px-7 md:py-3 ${
                    isActive(item.href) ? 'text-white/80' : 'text-white/55'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
