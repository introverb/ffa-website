import Image from 'next/image';
import { Panel } from './PageFrame';

// Shared header panel for sub-pages (Resources, Partnerships, Donate,
// Contact, Possibilia stories + artifacts). Standardizes:
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
};

export function PageHeader({
  eyebrow,
  title,
  body,
  image = '/images/hero.jpg',
  imagePosition,
  cta,
  imageMode = 'frosted',
}: PageHeaderProps) {
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
            className="scale-125 object-cover blur-3xl"
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
              className="scale-105 object-cover"
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
            className="scale-125 object-cover blur-3xl"
            priority
          />
          <div className="absolute inset-0 bg-paper/35" />
        </div>
      )}

      {/* Content */}
      <div className="relative p-8 md:p-12">
        {/* Masthead row */}
        <p className="text-xs uppercase tracking-[0.18em] text-ink/55">
          Foundation for Future Aesthetics &nbsp;·&nbsp; 2026
        </p>
        <hr className="mt-3 border-rule" />

        <div
          className={
            cta
              ? 'mt-7 grid gap-10 md:grid-cols-[1fr_240px] md:items-center'
              : 'mt-7'
          }
        >
          <div>
            <p className="text-sm underline decoration-from-font underline-offset-4 text-muted">
              {eyebrow}
            </p>
            <h1 className="mt-5 max-w-3xl text-h2 leading-[1.05] md:text-h2-lg">
              {title}
            </h1>
            {body && (
              <div className="mt-5 max-w-prose text-body-lg leading-relaxed text-ink/80">
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
