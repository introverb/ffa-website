'use client';

import { usePathname } from 'next/navigation';
import { SiteNav } from './SiteNav';

// Outer frame - taupe wrapper with consistent inset that creates the
// "panels float on a colored mat" feeling of the live Wix site. The
// SiteNav lives inside this container so its pill width matches the
// panels below it.
//
// The OURS storefront (/ours/collect) swaps the mat itself to charcoal
// (bg-ink) instead of the site's usual taupe — a "bottom layer" dark
// backdrop for that one section, not just its panels. Client Component
// (usePathname) so this one route can override without a prop having
// to thread down from the root layout that renders PageFrame.
export function PageFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCollect = pathname?.startsWith('/ours/collect');
  return (
    <div className={`min-h-screen ${isCollect ? 'bg-ink' : 'bg-taupe'}`}>
      <div className="mx-auto max-w-[1500px] px-6 pt-6 pb-6 md:px-10 md:pt-8 md:pb-8">
        <div className="space-y-6 md:space-y-8">
          <SiteNav />
          {children}
        </div>
      </div>
    </div>
  );
}

// Each section becomes a "panel" - white rounded card with generous padding.
// Use `dark` for the black-background variants (Possibilia callout, footer).
// Use `cream` for the palette's `cream` token (#F5EEE4, "Vellum") with
// dark text — a warm off-white card, distinct from `image`'s plain
// bg-cream (no text-color opinion, used for full-bleed image panels).
export function Panel({
  children,
  variant = 'white',
  className = '',
  full = false,
  id,
}: {
  children: React.ReactNode;
  variant?: 'white' | 'dark' | 'image' | 'cream';
  className?: string;
  full?: boolean;
  id?: string;
}) {
  const bg =
    variant === 'dark'
      ? 'bg-dark text-white'
      : variant === 'cream'
      ? 'bg-cream text-ink'
      : variant === 'image'
      ? 'bg-cream'
      : 'bg-paper text-ink';
  const padding = full ? '' : 'p-8 md:p-14';
  return (
    <section id={id} className={`relative overflow-hidden rounded-3xl ${bg} ${padding} ${className}`}>
      {children}
    </section>
  );
}
