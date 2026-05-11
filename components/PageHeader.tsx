import Image from 'next/image';
import { Panel } from './PageFrame';

// Shared header panel for sub-pages (Resources, Support, Contact,
// Possibilia stories + artifacts). Standardizes:
//   - Hero artwork as a shared visual signature across the site
//   - Editorial masthead row (Foundation · year) above a hairline rule
//   - Existing eyebrow + h1 + body copy
//   - Optional CTA slot pinned to the right column at 240px wide
//   - A consistent min-height so all four pages feel like the same kind
//     of header regardless of body length
//
// Two image treatments - pick via `imageMode`:
//
// `frosted` (default): hero.jpg is blurred heavily (blur-3xl) and scaled
// past the panel edges so the blur doesn't leave soft borders. A
// bg-paper/35 overlay keeps text contrast strong; you can sense the
// warmth/texture of the underlying image without recognizing the
// subject. Used for top-level sub-pages where the image is just an
// atmospheric signature.
//
// `peek`: solid paper background behind the text column, the actual
// hero image fades in via a horizontal CSS mask gradient on the right
// ~40% of the panel. Text never sits on top of visible-image area, so
// readability is never compromised - and you get a real glimpse of the
// artwork. Used on Possibilia story pages and Artifact pages, where the
// hero is editorial cover art that earns its own visual presence.
type PageHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  /** Background image. Defaults to hero.jpg. */
  image?: string;
  /** CSS object-position for the peek-revealed image (e.g. `'center 25%'`).
   *  Only applies in 'peek' mode; the frosted layer stays centered.
   *  Defaults to centered. */
  imagePosition?: string;
  cta?: React.ReactNode;
  /** Image treatment, frosted atmospheric (default) or peek reveal. */
  imageMode?: 'frosted' | 'peek';
  /** Horizontally mirror the hero image (frosted blur layer, triangle
   *  reveal, parallel-band reveal, and peek reveal all flip together). */
  flipImage?: boolean;
};

export function PageHeader({
  eyebrow,
  title,
  body,
  image = '/images/hero.jpg',
  imagePosition,
  cta,
  imageMode = 'frosted',
  flipImage = false,
}: PageHeaderProps) {
  // The base/blurred image is scaled to 125% so its blurred edges
  // bleed past the panel and don't leave soft borders. The reveal
  // layers (triangle, band, peek mask) sit at 105% to hide tiny
  // alignment seams. To horizontally flip, we negate the x-axis
  // scale while keeping the same magnitude on both axes.
  const blurScale = flipImage ? 'scale-y-125 scale-x-[-1.25]' : 'scale-125';
  const revealScale = flipImage ? 'scale-y-105 scale-x-[-1.05]' : 'scale-105';
  return (
    <Panel variant="white" full className="relative md:h-[410px]">
      {imageMode === 'peek' ? (
        <div aria-hidden className="absolute inset-0 overflow-hidden rounded-3xl">
          {/* Base layer: heavily-frosted hero (matches the default
              `frosted` treatment so the left side under the text reads
              identically to the rest of the site's mastheads). */}
          <Image
            src={image}
            alt=""
            fill
            sizes="100vw"
            className={`${blurScale} object-cover blur-3xl`}
            priority
          />
          {/* Paper veil sits on the frosted layer for legibility. */}
          <div className="absolute inset-0 bg-paper/35" />
          {/* Reveal layer: the same image without blur, masked so it's
              invisible on the left and fades in across the right edge.
              Paint order = frosted-blur + paper veil + crisp image; the
              mask only paints the crisp image where text isn't. */}
          <div
            className="absolute inset-0"
            style={{
              WebkitMaskImage:
                'linear-gradient(to right, transparent 60%, black 100%)',
              maskImage:
                'linear-gradient(to right, transparent 60%, black 100%)',
            }}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              className={`${revealScale} object-cover`}
              style={imagePosition ? { objectPosition: imagePosition } : undefined}
            />
          </div>
        </div>
      ) : (
        <div aria-hidden className="absolute inset-0 overflow-hidden rounded-3xl">
          <Image
            src={image}
            alt=""
            fill
            sizes="100vw"
            className={`${blurScale} object-cover blur-3xl`}
            priority
          />
          <div className="absolute inset-0 bg-paper/35" />
          {/* Lower-right triangle reveal: the same hero, rendered
              crisp, clipped to a right-triangle anchored at the
              bottom-right corner. Anchors the otherwise-ethereal
              frosted plane with a hard geometric beat.

              Two polygons stacked at different breakpoints so the
              triangle reads at every viewport without overlapping
              wrapped body copy. Mobile: smaller corner (right 20%
              × bottom 30%) tucks under the text. Desktop: larger
              statement (right 30% × bottom 50%) where there's room. */}
          <div
            className="absolute inset-0 md:hidden"
            style={{
              clipPath: 'polygon(80% 100%, 100% 100%, 100% 70%)',
              WebkitClipPath: 'polygon(80% 100%, 100% 100%, 100% 70%)',
            }}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              className={`${revealScale} object-cover`}
            />
          </div>
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              clipPath: 'polygon(70% 100%, 100% 100%, 100% 50%)',
              WebkitClipPath: 'polygon(70% 100%, 100% 100%, 100% 50%)',
            }}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              className={`${revealScale} object-cover`}
            />
          </div>
          {/* Parallel-band reveal: a thin parallelogram running
              parallel to the triangle's hypotenuse, offset toward
              upper-left. Reads as a "line of sky" running alongside
              the triangle. Same dual-polygon treatment as above —
              mobile is smaller and tucked further into the corner. */}
          <div
            className="absolute inset-0 md:hidden"
            style={{
              clipPath: 'polygon(74% 105%, 105% 56%, 105% 53%, 71% 105%)',
              WebkitClipPath: 'polygon(74% 105%, 105% 56%, 105% 53%, 71% 105%)',
            }}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              className={`${revealScale} object-cover`}
            />
          </div>
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              clipPath: 'polygon(64% 105%, 105% 36%, 105% 32%, 61% 105%)',
              WebkitClipPath: 'polygon(64% 105%, 105% 36%, 105% 32%, 61% 105%)',
            }}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              className={`${revealScale} object-cover`}
            />
          </div>
        </div>
      )}

      {/* Content. Peek-mode headers are used on Possibilia story and
          Artifact pages, where the right ~40% of the panel reveals
          editorial cover art. On narrow mobile screens that reveal
          encroaches on the text column, so we flip text colors light
          (text-paper) on mobile and add drop-shadows for legibility
          over the image. At md+ the text column is comfortably to
          the left of the reveal mask, so the original dark palette
          comes back unchanged via md: overrides. */}
      <div className="relative p-8 md:p-12">
        {/* Masthead row */}
        <p
          className={`text-xs uppercase tracking-[0.18em] ${
            imageMode === 'peek'
              ? 'text-paper drop-shadow md:text-ink/55 md:drop-shadow-none'
              : 'text-ink/55'
          }`}
        >
          Foundation for Future Aesthetics &nbsp;·&nbsp; 2026
        </p>
        <hr
          className={`mt-3 ${
            imageMode === 'peek'
              ? 'border-paper/40 md:border-rule'
              : 'border-rule'
          }`}
        />

        <div
          className={
            cta
              ? 'mt-7 grid gap-10 md:grid-cols-[1fr_240px] md:items-center'
              : 'mt-7'
          }
        >
          <div>
            <p
              className={`text-sm underline decoration-from-font underline-offset-4 ${
                imageMode === 'peek'
                  ? 'text-paper drop-shadow md:text-muted md:drop-shadow-none'
                  : 'text-muted'
              }`}
            >
              {eyebrow}
            </p>
            <h1
              className={`mt-5 max-w-3xl text-h2 leading-[1.05] md:text-h2-lg ${
                imageMode === 'peek'
                  ? 'text-paper drop-shadow-md md:text-ink md:drop-shadow-none'
                  : ''
              }`}
            >
              {title}
            </h1>
            {body && (
              <div
                className={`mt-5 max-w-prose text-body-lg leading-relaxed ${
                  imageMode === 'peek'
                    ? 'text-paper drop-shadow md:text-ink/80 md:drop-shadow-none'
                    : 'text-ink/80'
                }`}
              >
                {body}
              </div>
            )}
          </div>
          {cta && <div className="flex flex-col gap-4">{cta}</div>}
        </div>
      </div>
    </Panel>
  );
}
