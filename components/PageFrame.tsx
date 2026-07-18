import { SiteNav } from './SiteNav';

// Outer frame - taupe wrapper with consistent inset that creates the
// "panels float on a colored mat" feeling of the live Wix site. The
// SiteNav lives inside this container so its pill width matches the
// panels below it.

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-taupe min-h-screen">
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
// Use `charcoal` for a softer dark surface (the palette's `ink` token,
// #3B3A3A) rather than `dark`'s near-black (#151414) — first use: the
// OURS storefront, a moodier "gallery" surface distinct from the
// site's standard dark panels.
export function Panel({
  children,
  variant = 'white',
  className = '',
  full = false,
  id,
}: {
  children: React.ReactNode;
  variant?: 'white' | 'dark' | 'image' | 'charcoal';
  className?: string;
  full?: boolean;
  id?: string;
}) {
  const bg =
    variant === 'dark'
      ? 'bg-dark text-white'
      : variant === 'charcoal'
      ? 'bg-ink text-white'
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
