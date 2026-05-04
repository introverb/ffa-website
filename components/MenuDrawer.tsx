'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MenuButton } from './MenuButton';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/possibilia', label: 'Possibilia' },
  { href: '/resources', label: 'Resources' },
  { href: '/contact', label: 'Contact' },
  { href: '/donate', label: 'Donate' },
];

// Right-side slide-in drawer with stacked nav items (matches the Wix site).
export function MenuDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <MenuButton open={open} onToggle={() => setOpen((v) => !v)} />

      {/* backdrop */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        id="site-menu"
        aria-label="Site menu"
        className={`fixed right-0 top-0 z-40 h-full w-[88%] max-w-[440px] bg-dark/92 px-12 pt-32 backdrop-blur-md transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav>
          <ul className="space-y-2 text-white">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="block py-1 text-h3 leading-tight hover:text-sage-light"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
