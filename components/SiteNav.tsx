'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/possibilia', label: 'Possibilia' },
  { href: '/resources', label: 'Resources' },
  { href: '/donate', label: 'Donate' },
  { href: '/contact', label: 'Contact' },
];

// Sticky elongated pill sitting at the top of every page. Stretches to
// match the surrounding panels' width (rendered inside PageFrame's
// max-w container). Glassy black backdrop matches the look of the
// previous menu pill; logo is brightness-0 invert to read white on dark.
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
      <div className="flex items-center justify-between gap-4 rounded-full border border-white/85 bg-black/35 px-5 py-2.5 text-white backdrop-blur-md md:px-7 md:py-3">
        <Link
          href="/"
          aria-label="Home — Foundation for Future Aesthetics"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/images/logo.svg"
            alt=""
            width={28}
            height={24}
            className="h-6 w-auto brightness-0 invert md:h-7"
            priority
          />
        </Link>
        <ul className="flex items-center gap-4 text-xs uppercase tracking-[0.12em] sm:gap-6 md:gap-10 md:text-sm">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`transition hover:text-sage-light ${
                  isActive(item.href) ? 'text-white' : 'text-white/75'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
