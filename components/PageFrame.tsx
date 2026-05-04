// Outer frame — taupe wrapper with consistent inset that creates the
// "panels float on a colored mat" feeling of the live Wix site.

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-taupe min-h-screen">
      <div className="mx-auto max-w-[1500px] px-6 pt-6 pb-6 md:px-10 md:pt-8 md:pb-8">
        <div className="space-y-6 md:space-y-8">{children}</div>
      </div>
    </div>
  );
}

// Each section becomes a "panel" — white rounded card with generous padding.
// Use `dark` for the black-background variants (Possibilia callout, footer).
export function Panel({
  children,
  variant = 'white',
  className = '',
  full = false,
  id,
}: {
  children: React.ReactNode;
  variant?: 'white' | 'dark' | 'image';
  className?: string;
  full?: boolean;
  id?: string;
}) {
  const bg =
    variant === 'dark'
      ? 'bg-dark text-white'
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
