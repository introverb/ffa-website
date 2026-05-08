'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FfaLogo } from './FfaLogo';

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
// Two layouts driven by viewport:
//   - mobile (default): a compact pill with the logo on the left and a
//     hamburger button on the right. Tapping the hamburger slides in a
//     full-height frosted drawer from the right with the nav stack;
//     Resources renders as an accordion so its three children stay
//     visually grouped under the parent without taking another tap.
//   - md+ : the original horizontal pill nav with hover dropdowns.
//
// Both layouts share the outer pill chrome so the chrome reads as one
// component across breakpoints; only the contents swap.
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
          {/* Inline FfaLogo — currentColor inherits the link's text
              color (white-ish via the surrounding nav). h-6/h-7
              constraints stay the same as the previous <Image>. */}
          <FfaLogo className="h-6 w-auto text-white opacity-55 transition-opacity group-hover:opacity-100 md:h-7" />
          <span className="hidden font-heading text-lg font-semibold tracking-tight text-white/55 transition-colors group-hover:text-white lg:inline">
            Foundation for Future Aesthetics
          </span>
        </Link>

        {/* Desktop: horizontal nav with hover dropdowns. Hidden below md
            so the hamburger takes over. */}
        <ul className="hidden items-center gap-4 text-xs uppercase tracking-[0.12em] sm:gap-6 md:flex md:gap-10 md:text-sm">
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

        {/* Mobile: hamburger button + slide-in drawer. md:hidden so the
            desktop layout above takes over at md+. */}
        <MobileNav isActive={isActive} />
      </div>
    </nav>
  );
}

// Mobile drawer. Owns its open/close state. Hamburger button lives in
// the nav pill; clicking flips a portal-mounted drawer in from the
// right with the same frosted chrome as the rest of the nav. Resources
// is rendered as an accordion in the drawer so its children stay
// visually nested under the parent without requiring a second tap.
function MobileNav({ isActive }: { isActive: (href: string) => boolean }) {
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  // Close the drawer when the route actually changes — Link clicks
  // inside the drawer should always feel like "navigate then close",
  // and an explicit handler on every Link covers that.
  function closeAll() {
    setOpen(false);
  }

  // Lock body scroll while the drawer is open + listen for Escape.
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

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white"
      >
        {/* Three-line hamburger; swaps to an X when the drawer is
            already open so the same control toggles. */}
        {open ? (
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 4l12 12M16 4L4 16" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 6h14M3 10h14M3 14h14" />
          </svg>
        )}
      </button>

      {/* Backdrop + drawer. Outer div catches taps anywhere outside
          the drawer to dismiss. The drawer itself stops propagation. */}
      {open && (
        <div
          onClick={closeAll}
          className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute right-3 top-3 flex max-h-[calc(100vh-1.5rem)] w-[min(20rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-white/30 bg-black/60 backdrop-blur-2xl backdrop-saturate-150"
          >
            <div className="flex items-center justify-between px-5 py-3">
              <span className="font-heading text-sm font-semibold tracking-tight text-white/80">
                Menu
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={closeAll}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M4 4l12 12M16 4L4 16" />
                </svg>
              </button>
            </div>
            <ul className="flex flex-col gap-1 overflow-y-auto px-3 pb-5 text-sm uppercase tracking-[0.1em]">
              {NAV.map((item) => {
                if (isDropdown(item)) {
                  const childActive = item.children.some((c) => isActive(c.href));
                  return (
                    <li key={item.label}>
                      <button
                        type="button"
                        aria-expanded={resourcesOpen}
                        onClick={() => setResourcesOpen((v) => !v)}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors hover:bg-white/10 ${
                          childActive ? 'text-white' : 'text-white/70'
                        }`}
                      >
                        <span>{item.label}</span>
                        {/* Chevron rotates 90° when expanded — clear
                            visual that the section is open. */}
                        <svg
                          viewBox="0 0 12 12"
                          width="10"
                          height="10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          className={`transition-transform ${resourcesOpen ? 'rotate-90' : ''}`}
                        >
                          <path d="M4 2l4 4-4 4" />
                        </svg>
                      </button>
                      {resourcesOpen && (
                        <ul className="mt-1 flex flex-col gap-0.5 pl-3">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={closeAll}
                                className={`block rounded-xl px-4 py-2.5 transition-colors hover:bg-white/10 ${
                                  isActive(child.href) ? 'text-white' : 'text-white/65'
                                }`}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeAll}
                      className={`block rounded-xl px-4 py-3 transition-colors hover:bg-white/10 ${
                        isActive(item.href) ? 'text-white' : 'text-white/70'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
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
