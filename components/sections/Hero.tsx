import Image from 'next/image';
import { Panel } from '@/components/PageFrame';

// Hero panel - 2:1 landscape. The source hero.jpg is 16:9, so we anchor the
// background to the top (`bg-top`) and let the bottom of the image crop off
// inside the shorter 2:1 frame.
export function Hero() {
  return (
    <Panel variant="image" full className="aspect-[2/1]">
      {/* Visually-hidden h1 so the homepage has a proper top-level heading
          for screen readers and SEO. The visible wordmark in the bottom-
          right is decorative; this carries the page's actual title. */}
      <h1 className="sr-only">Foundation for Future Aesthetics</h1>
      <div
        className="absolute inset-0 bg-gradient-to-br from-sage/70 via-taupe to-cream bg-cover bg-top"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      />

      {/* Giant ff lettermark, flush to the left edge of the panel. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[55%] select-none md:w-[50%]"
      >
        <Image
          src="/images/logo.svg"
          alt=""
          fill
          priority
          sizes="60vw"
          className="object-contain object-left"
        />
      </div>

      {/* Wordmark, bottom-right corner - 24px inset to mirror the menu pill's
          tolerance at the top-right corner. Sized at ~75% above the
          previous text-base/lg pair so the wordmark reads as an
          intentional anchor next to the giant ff lettermark on the left.
          Hidden on mobile — at narrow widths the type wraps awkwardly
          and competes with the lettermark; the SiteNav already carries
          the wordmark in its accessible label. */}
      <div className="absolute bottom-6 right-6 z-20 hidden md:block">
        <p className="font-heading text-[28px] font-semibold leading-tight tracking-tight text-white drop-shadow md:text-[32px]">
          Foundation for Future Aesthetics
        </p>
      </div>
    </Panel>
  );
}
