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
      <div className="relative z-10 flex h-full flex-col justify-center px-8 py-20 md:px-16">
        <p className="text-sm underline decoration-from-font underline-offset-4 text-white/95 drop-shadow">
          What We&rsquo;re Building
        </p>
        <h2 className="mt-6 text-h1 leading-[1.02] text-white drop-shadow md:text-h1-lg">
          Our Initiatives
        </h2>
        <p className="mt-10 max-w-md text-body leading-relaxed text-white/95 drop-shadow">
          A thoughtful, strategic approach to setting concrete goals - paired with the programs
          that will help us get there.
        </p>
      </div>
    </Panel>
  );
}
