import Image from 'next/image';
import { Panel } from './PageFrame';

// Shared header panel for sub-pages (Resources, Partnerships, Donate,
// Contact). Standardizes:
//   - Frosted hero.jpg as a shared visual signature across all sub-pages
//   - Editorial masthead row (Foundation · year) above a hairline rule
//   - Existing eyebrow + h1 + body copy
//   - Optional CTA slot pinned to the right column at 240px wide
//   - A consistent min-height so all four pages feel like the same kind
//     of header regardless of body length
//
// The frosted bg is hero.jpg blurred heavily (blur-3xl) and scaled past
// the panel edges so the blur doesn't leave soft borders. A bg-paper/85
// overlay keeps text contrast strong; you can sense the warmth/texture
// of the underlying image without recognizing the subject.
type PageHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  /** Background image — heavily frosted. Defaults to hero.jpg. */
  image?: string;
  cta?: React.ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  body,
  image = '/images/hero.jpg',
  cta,
}: PageHeaderProps) {
  return (
    <Panel variant="white" full className="relative md:h-[410px]">
      {/* Background: blurred image + paper-tinted overlay. Each page
          can pass a different image so the frosted signature varies
          subtly across the site while keeping the same treatment. */}
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
