import Link from 'next/link';
import Image from 'next/image';
import { Panel } from './PageFrame';

// Top-level nav, kept in sync with components/SiteNav.tsx — flat list
// of five entries that show on both desktop and mobile. The /resources
// page was labeled "Musings" in the nav for a while; the label now
// matches the page's own title (Resources).
const PRIMARY_NAV = [
  { href: '/possibilia', label: 'Possibilia' },
  { href: '/ours', label: 'OURS' },
  { href: '/resources', label: 'Resources' },
  { href: '/support', label: 'Support' },
  { href: '/contact', label: 'Contact' },
];

// Black footer panel.
//
// Desktop (md+): logo + 501c3 line on the left, the primary-nav list
// stacked on the right, X icon below.
//
// Mobile: stacks more compactly. Single column of nav links under the
// logo block. X icon anchors the bottom edge.
export function Footer() {
  return (
    <Panel variant="dark" className="md:p-16">
      <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between md:gap-12">
        <div className="text-white">
          <Link href="/" className="block">
            <Image
              src="/images/logo.png"
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
            <span className="text-white/70">
              is a 501(c)(3) nonprofit, founded 2023.
            </span>
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

        {/* Mobile-only single-column nav. Hidden at md+ where the
            desktop block on the right takes over. */}
        <div className="w-full text-white md:hidden">
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

        {/* Desktop right side — Candid seal at the left, then nav
            links + X stacked at the far right (bottom-aligned). Moving
            the seal out of the left column and inline here keeps the
            footer short. Hidden on mobile, where the block above and
            the row below take over. */}
        <div className="hidden md:flex md:items-end md:gap-8">
          <CandidSeal />
          <div className="flex flex-col items-end gap-2 text-white">
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
      </div>

      {/* Mobile-only bottom row — X icon + Candid seal. Hidden at md+
          where the desktop block above carries both. */}
      <div className="mt-10 flex items-center gap-6 md:hidden">
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
        <CandidSeal />
      </div>
    </Panel>
  );
}

// Candid (GuideStar) transparency seal — the official SVG from Candid's
// widget endpoint, saved locally. Self-backed (silver frame, white
// interior) so it sits on the dark footer with no extra backing and
// stays legible. 80px display, 108px-native SVG so it stays crisp.
// Re-fetch the widget endpoint when the tier changes; the filename
// carries the tier + year. Rendered both in the desktop right block
// (right of the links) and the mobile bottom row.
function CandidSeal() {
  return (
    <a
      href="https://app.candid.org/profile/15666823/foundation-for-future-aesthetics-inc"
      target="_blank"
      rel="noopener noreferrer"
      data-goatcounter-click="outbound:candid-seal"
      className="inline-block shrink-0 transition-opacity hover:opacity-80"
    >
      <Image
        src="/images/candid-seal-silver-2026.svg"
        alt="Candid Silver Transparency Seal 2026"
        width={108}
        height={108}
        className="h-20 w-20"
      />
    </a>
  );
}
