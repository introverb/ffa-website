import { Panel } from '@/components/PageFrame';

// Full-bleed image header with overlay text - matches the astronaut/desert
// hero on the live site at the top of the Initiatives band.
export function InitiativesHeader() {
  return (
    <Panel variant="image" full className="aspect-[2/1]">
      <div className="absolute inset-0">
        {/* Loads /public/images/initiatives-hero.jpg if present; falls back to
            the gradient when the file is missing. */}
        <div
          className="h-full w-full bg-gradient-to-br from-taupe via-cream to-sage/30 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/initiatives-hero.jpg')" }}
        />
      </div>
      {/* Mobile: shorter padding (py-12 instead of py-20) so the centered
          group has room to breathe inside the 2:1 panel without the
          larger heading bleeding off the edges; body copy hidden so
          eyebrow + h2 read cleanly without crowding the image. The
          heading drops from h1 → h2 on mobile so it lands in the same
          size as other section headings on the page. Desktop layout
          (py-20, h1-lg, body visible) is unchanged. */}
      <div className="relative z-10 flex h-full flex-col justify-center px-8 py-12 md:px-16 md:py-20">
        <p className="text-sm underline decoration-from-font underline-offset-4 text-white/95 drop-shadow">
          What We&rsquo;re Building
        </p>
        <h2 className="mt-6 text-h2 leading-[1.05] text-white drop-shadow md:text-h1-lg md:leading-[1.02]">
          Our Initiatives
        </h2>
        <p className="mt-10 hidden max-w-md text-body leading-relaxed text-white/95 drop-shadow md:block">
          A thoughtful, strategic approach to setting concrete goals, paired with the programs
          that will help us get there.
        </p>
      </div>
    </Panel>
  );
}
