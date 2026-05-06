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
// surrounding panel width. Frosted, translucent — subtle in its default
// state with everything (logo, text) at reduced opacity, lifting to
// full white on hover.
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
          <span className="hidden font-heading text-xs font-semibold tracking-tight text-white/55 transition-colors group-hover:text-white lg:inline">
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
                activeParent={item.children.some((c) => isActive(c.href))}
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

// Hover-on-desktop, click-on-mobile dropdown. Listens for outside
// clicks and Escape to close. Trigger button matches the visual
// treatment of regular nav links and lights up when any child route
// is active.
function NavDropdown({
  label,
  items,
  activeParent,
}: {
  label: string;
  items: NavLink[];
  activeParent: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

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
        className={`inline-flex items-center gap-1.5 transition-colors hover:text-white ${
          activeParent ? 'text-white/80' : 'text-white/55'
        }`}
      >
        {label}
        <svg
          aria-hidden
          viewBox="0 0 12 8"
          width="10"
          height="7"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 1.5l5 5 5-5" />
        </svg>
      </button>
      {open && (
        <ul
          role="menu"
          aria-label={label}
          className="absolute right-0 top-full mt-3 min-w-[10rem] rounded-2xl border border-white/25 bg-black/35 p-2 text-xs uppercase tracking-[0.12em] backdrop-blur-md md:text-sm"
        >
          {items.map((item) => (
            <li key={item.href} role="none">
              <Link
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
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
