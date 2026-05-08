import Link from 'next/link';
import Image from 'next/image';
import { Panel } from './PageFrame';

// Top-level nav items shown on all breakpoints.
const PRIMARY_NAV = [
  { href: '/possibilia', label: 'Possibilia' },
  { href: '/contact', label: 'Contact' },
  { href: '/support', label: 'Support' },
];

// "Resources" sub-nav — surfaced as a second mobile column so the
// hamburger drawer's content has a flat equivalent at the bottom of
// every page. Hidden on desktop where the original two-column layout
// holds (logo block left, three-link list right).
const RESOURCES_NAV = [
  { href: '/resources', label: 'Musings' },
  { href: '/partnerships', label: 'Partnerships' },
];

// Black footer panel.
//
// Desktop (md+): logo + 501c3 line on the left, the three-link primary
// nav stacked on the right, X icon below.
//
// Mobile: stacks more compactly. Two link columns side-by-side
// underneath the logo block (Site / Resources) so a finger can reach
// every section without scrolling past a single right-aligned column.
// X icon anchors the bottom edge.
export function Footer() {
  return (
    <Panel variant="dark" className="md:p-16">
      <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between md:gap-12">
        <div className="text-white">
          <Link href="/" className="block">
            <Image
              src="/images/logo.svg"
              alt="FFA"
              width={56}
              height={48}
              className="h-12 w-auto"
            />
          </Link>
          <p className="mt-6 text-sm leading-relaxed">
            <Link href="/" className="underline decoration-from-font underline-offset-4">
              Foundation for Future Aesthetics
            </Link>
            <br />
            <span className="text-white/70">is a 501(c)(3) nonprofit.</span>
          </p>
          <p className="mt-4 text-xs leading-relaxed text-white/50">
            Imagery by{' '}
            <a
              href="https://www.behance.net/natist"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-from-font underline-offset-4 hover:text-white"
            >
              Seungjun Na
            </a>
            .
          </p>
        </div>

        {/* Mobile-only two-column nav. Hidden at md+ where the desktop
            single-column block on the right takes over. */}
        <div className="grid w-full grid-cols-2 gap-8 text-white md:hidden">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-white/50">Site</p>
            <ul className="mt-4 space-y-2">
              {PRIMARY_NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-sm underline decoration-from-font underline-offset-4 hover:text-sage-light"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-white/50">Resources</p>
            <ul className="mt-4 space-y-2">
              {RESOURCES_NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-sm underline decoration-from-font underline-offset-4 hover:text-sage-light"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Desktop right-side single-column nav. Hidden on mobile where
            the two-column grid above takes over. */}
        <div className="hidden flex-col items-start gap-2 text-white md:flex md:items-end">
          <ul className="space-y-2 text-right">
            {PRIMARY_NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="text-sm underline decoration-from-font underline-offset-4 hover:text-sage-light"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href="https://twitter.com/possibiliamag"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter / X"
            className="mt-6 inline-block text-white/60 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Mobile-only X icon, anchored at the bottom edge. Hidden at md+
          where the desktop block above carries it. */}
      <div className="mt-10 flex md:hidden">
        <a
          href="https://twitter.com/possibiliamag"
          target="_blank"
          rel="noreferrer"
          aria-label="Twitter / X"
          className="inline-block text-white/60 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>
    </Panel>
  );
}
