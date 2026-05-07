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
      { href: '/support', label: 'Support' },
      { href: '/partnerships', label: 'Partnerships' },
    ],
  },
  { href: '/contact', label: 'Contact' },
];

function isDropdown(item: NavItem): item is { label: string; children: NavLink[] } {
  return 'children' in item;
}

// Sticky elongated pill at the top of every page. Frosted, translucent
// — subtle in its default state with everything (logo, text) at
// reduced opacity, lifting to full white on hover.
//
// Dropdown items are rendered as a vertical stack of frosted pills
// directly below the trigger. The dropdown <ul> is a descendant of
// the trigger <li>, with `top-full` (so its top edge sits at the
// trigger's bottom edge — no gap, no dead zone) and a top padding
// large enough to clear the pill's own bottom padding plus an 8px
// visual breath. mouseleave on the wrapping <li> only fires when the
// cursor leaves both the trigger AND the dropdown together, so
// hover stays sticky even as the cursor crosses the visual gap.
export function SiteNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <nav
      aria-label="Site navigation"
      className="sticky top-6 z-50 md:top-8"
    >
      <div className="flex items-center justify-between gap-4 rounded-full border border-white/25 bg-black/20 px-5 py-2.5 backdrop-blur-md md:px-7 md:py-3">
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
          <span className="hidden font-heading text-lg font-semibold tracking-tight text-white/55 transition-colors group-hover:text-white lg:inline">
            Foundation for Future Aesthetics
          </span>
        </Link>
        <ul className="flex items-center gap-4 text-xs uppercase tracking-[0.12em] sm:gap-6 md:gap-10 md:text-sm">
          {NAV.map((item) =>
            isDropdown(item) ? (
              <NavDropdown
                key={item.label}
                label={item.label}
                items={item.children}
                isActive={isActive}
              />
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
    </nav>
  );
}

function NavDropdown({
  label,
  items,
  isActive,
}: {
  label: string;
  items: NavLink[];
  isActive: (href: string) => boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const activeParent = items.some((c) => isActive(c.href));

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className={`uppercase tracking-[0.12em] transition-colors hover:text-white ${
          activeParent ? 'text-white/80' : 'text-white/55'
        }`}
      >
        {label}
      </button>
      {open && (
        // top-full = top edge at li's bottom = trigger's bottom (zero
        // gap, so cursor never exits the li's hover area). pt-[19/21px]
        // = pill bottom padding + 1px border + 8px visual gap, so the
        // first pill clears the nav with the same rhythm gap that
        // separates the items from each other.
        <ul
          role="menu"
          aria-label={label}
          className="absolute left-1/2 top-full flex -translate-x-1/2 flex-col items-stretch gap-2 pt-[19px] text-xs uppercase tracking-[0.12em] md:pt-[21px] md:text-sm"
        >
          {items.map((item) => (
            <li key={item.href} role="none">
              <Link
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={`block w-full whitespace-nowrap rounded-full border border-white/30 bg-black/45 px-5 py-2.5 text-center backdrop-blur-2xl backdrop-saturate-150 transition-colors hover:text-white md:px-7 md:py-3 ${
                  isActive(item.href) ? 'text-white/80' : 'text-white/55'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
