'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/possibilia', label: 'Possibilia' },
  { href: '/ours', label: 'OURS' },
  { href: '/resources', label: 'Resources' },
  { href: '/partnerships', label: 'Partnerships' },
  { href: '/support', label: 'Support' },
  { href: '/contact', label: 'Contact' },
];

// Sticky elongated pill at the top of every page. Stretches to match
// surrounding panel width. Frosted, translucent - subtle in its default
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
          aria-label="Home - Foundation for Future Aesthetics"
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
    </nav>
  );
}
