'use client';

import { usePathname } from 'next/navigation';
import { SiteNav } from './SiteNav';

// Route-aware chrome. Most of the site renders inside the editorial
// "mat" — a taupe background, a max-width container, the sticky nav,
// the page's rounded panels, and the footer (the structure that used
// to live in PageFrame + the root layout).
//
// A small set of BARE_ROUTES opt out: they keep the nav for wayfinding
// but drop the taupe mat, the panel chrome, and the footer, rendering
// full-bleed so the page can own its own look. Right now that's just
// the retro Eucatastrophe search page.
//
// Client component so it can branch on the active route; `footer` is
// passed in as a prop (a server-rendered node) so the Footer stays a
// server component and nothing has to become client to support this.
const BARE_ROUTES = ['/eucatastrophe'];

export function SiteChrome({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );

  if (bare) {
    return (
      // Dark charcoal mat for the bare routes (the Eucatastrophe dark/
      // terminal theme). Nav stays in the standard constrained
      // container; the page content renders full-bleed below it, with
      // no footer.
      <div className="min-h-screen bg-dark">
        <div className="mx-auto max-w-[1500px] px-6 pt-6 md:px-10 md:pt-8">
          <SiteNav />
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-taupe">
      <div className="mx-auto max-w-[1500px] px-6 pb-6 pt-6 md:px-10 md:pb-8 md:pt-8">
        <div className="space-y-6 md:space-y-8">
          <SiteNav />
          {children}
          {footer}
        </div>
      </div>
    </div>
  );
}
