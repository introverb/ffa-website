import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';

// Default component overrides for MDX content. Editorial pages (Possibilia
// stories + companion pieces) lean on these to inherit the site's typography
// instead of unstyled HTML defaults. Story authors writing markdown don't
// have to think about classes — they just write paragraphs and headings,
// and FFA's editorial type kicks in automatically.
//
// Override per-story by passing `components` to the MDX component at render
// time if a piece needs custom treatment.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...rest }) => (
      <h1
        className="mt-12 text-h2 leading-tight text-ink first:mt-0 md:text-h2-lg"
        {...rest}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...rest }) => (
      <h2
        className="mt-12 text-h3 leading-tight text-ink first:mt-0 md:text-h3-lg"
        {...rest}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...rest }) => (
      <h3 className="mt-10 text-h4 leading-tight text-ink first:mt-0" {...rest}>
        {children}
      </h3>
    ),
    p: ({ children, ...rest }) => (
      <p
        className="mt-5 text-body-lg leading-relaxed text-ink/85 first:mt-0"
        {...rest}
      >
        {children}
      </p>
    ),
    a: ({ children, ...rest }) => (
      <a
        className="underline decoration-from-font underline-offset-4 text-ink hover:text-sage"
        {...rest}
      >
        {children}
      </a>
    ),
    blockquote: ({ children, ...rest }) => (
      <blockquote
        className="mt-8 border-l-2 border-sage pl-6 text-body-lg italic leading-relaxed text-ink/85"
        {...rest}
      >
        {children}
      </blockquote>
    ),
    ul: ({ children, ...rest }) => (
      <ul
        className="mt-5 ml-6 list-disc space-y-2 text-body-lg leading-relaxed text-ink/85 marker:text-sage"
        {...rest}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...rest }) => (
      <ol
        className="mt-5 ml-6 list-decimal space-y-2 text-body-lg leading-relaxed text-ink/85 marker:text-sage"
        {...rest}
      >
        {children}
      </ol>
    ),
    // Markdown horizontal rules render as a centered "* * *" instead of a
    // line — story authors writing scene breaks get the typographic mark
    // that reads as a deliberate pause rather than a divider.
    hr: () => (
      <p
        aria-hidden
        className="my-12 text-center text-h6 tracking-[0.5em] text-muted"
      >
        * * *
      </p>
    ),
    // Markdown images render as a figure + figcaption, where the alt text
    // doubles as the visible caption (italic, muted) below the artwork.
    // Story authors only need to write `![Caption](path)` — no extra HTML.
    img: ({ src, alt, width, height, ...rest }) => {
      if (!src || typeof src !== 'string') return null;
      return (
        <figure className="my-10">
          <Image
            src={src}
            alt={alt ?? ''}
            width={width ? Number(width) : 1600}
            height={height ? Number(height) : 1000}
            className="h-auto w-full rounded-md"
            {...rest}
          />
          {alt && (
            <figcaption className="mt-3 text-center text-sm italic text-muted">
              {alt}
            </figcaption>
          )}
        </figure>
      );
    },
    ...components,
  };
}
