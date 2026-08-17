import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import { ChapterizedAudio } from '@/components/ChapterizedAudio';
import { InspectablePanel } from '@/components/InspectablePanel';
import { JsonLd } from '@/components/JsonLd';
import { getArtifactSlugs, type ArtifactMeta } from '@/lib/possibilia';
import { renderWithArtistLinks } from '@/lib/artists';

type Params = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs = await getArtifactSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const meta = await safeMeta(params.slug);
  if (!meta) return { title: 'Artifacts from Tomorrow' };
  return {
    title: `${meta.title} · Artifacts from Tomorrow`,
    description: meta.excerpt,
    alternates: { canonical: `/possibilia/artifacts/${params.slug}` },
    openGraph: {
      type: 'article',
      title: `${meta.title} · Artifacts from Tomorrow`,
      description: meta.excerpt,
      publishedTime: meta.date,
      authors: [meta.author],
      images: [{ url: meta.hero.src, alt: meta.hero.alt }],
    },
    twitter: { images: [meta.hero.src] },
  };
}

async function safeMeta(slug: string): Promise<ArtifactMeta | null> {
  try {
    const mod = await import(`@/content/artifacts/${slug}/meta`);
    return mod.meta as ArtifactMeta;
  } catch {
    return null;
  }
}

// Full-bleed image panel — used by both single-body and multi-section
// artifact layouts. Now delegated to InspectablePanel, a client
// component that renders the same image inline AND opens it in a
// fullscreen lightbox on click — most artifact images are dense
// (concept art, design plans) and benefit from a real "blow it up"
// view. width/height on the inner Image are aspect hints.

// Renders a single Artifact from Tomorrow.
//
// Two layouts:
//   - Single-body (default): PageHeader → optional featureImage panel
//     → body MDX (artifact.mdx, max-w-3xl). Used for TAEPDECK, Inside,
//     etc.
//   - Multi-section: PageHeader → for each section, a header panel
//     (eyebrow + h2 title) → optional featureImage → body panel
//     (audio + section MDX, max-w-3xl). Used for collection artifacts
//     like "The Long Way Home" that bundle several mini-pieces.
export default async function ArtifactPage({ params }: Params) {
  const meta = await safeMeta(params.slug);
  if (!meta) notFound();

  // Pre-load every section body MDX in parallel so we can render
  // them inline below.
  const sectionBodies = meta.sections
    ? await Promise.all(
        meta.sections.map(async (s) => {
          const mod = await import(
            `@/content/artifacts/${params.slug}/${s.bodyFile}.mdx`
          );
          return mod.default as React.ComponentType;
        }),
      )
    : null;

  const SingleBody = !meta.sections
    ? (await import(`@/content/artifacts/${params.slug}/artifact.mdx`))
        .default
    : null;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.excerpt,
    datePublished: meta.date,
    author: { '@type': 'Person', name: meta.author },
    publisher: {
      '@type': 'NonprofitOrganization',
      name: 'Foundation for Future Aesthetics',
      logo: {
        '@type': 'ImageObject',
        url: 'https://futureaesthetics.foundation/images/logo.png',
      },
    },
    image: `https://futureaesthetics.foundation${meta.hero.src}`,
    inLanguage: 'en-US',
    articleSection: 'Artifacts from Tomorrow',
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <PageHeader
        eyebrow="Possibilia · Artifacts from Tomorrow"
        title={meta.title}
        image={meta.hero.src}
        imagePosition={meta.hero.objectPosition}
        imageMode="peek"
        body={
          // Light on mobile (drop-shadow for legibility over the
          // peek-mode image reveal) → sage on desktop where the
          // body sits over the frosted+veiled column. md:* restores
          // the original treatment.
          <p className="text-sm uppercase tracking-[0.08em] text-paper drop-shadow md:text-sage md:drop-shadow-none">
            By {meta.author}
            {meta.hero.artist && (
              <>
                <br />
                Art by {renderWithArtistLinks(meta.hero.artist)}
              </>
            )}
          </p>
        }
      />

      {/* Single-body layout: optional feature image, then the body. */}
      {SingleBody && meta.featureImage && (
        <InspectablePanel
          src={meta.featureImage.src}
          alt={meta.featureImage.alt}
          priority
        />
      )}
      {SingleBody && (
        <Panel variant="white" className="md:p-20">
          <div className="mx-auto max-w-3xl">
            <article>
              <SingleBody />
            </article>
          </div>
        </Panel>
      )}

      {/* Multi-section layout: each section flows as its own stacked
          block — leather title panel, then feature image, then body.
          (Earlier we sticky-pinned title + image to mimic the
          Initiatives scroll stack, but the effect was distracting
          on long-form artifacts; better to just let each section
          read top-to-bottom.) The `!bg-leather` and `!text-paper`
          use Tailwind's important modifier to override Panel's
          default `bg-paper text-ink` — without `!` the variant's
          background wins by CSS source order. */}
      {meta.sections &&
        sectionBodies &&
        meta.sections.map((section, i) => {
          const SectionBody = sectionBodies[i];
          return (
            <div key={section.bodyFile} className="space-y-6 md:space-y-8">
              <Panel
                variant="white"
                className="!bg-leather !text-paper md:p-12"
              >
                {section.eyebrow && (
                  <p className="text-sm uppercase tracking-[0.08em] text-cream/70">
                    {section.eyebrow}
                  </p>
                )}
                <h2 className="mt-4 text-h2 leading-[1.05] text-paper md:text-h2-lg">
                  {section.title}
                </h2>
              </Panel>

              {section.featureImage && (
                <InspectablePanel
                  src={section.featureImage.src}
                  alt={section.featureImage.alt}
                  priority={i === 0}
                />
              )}

              <Panel variant="white" className="md:p-20">
                <div className="mx-auto max-w-3xl">
                  {section.audio && (
                    <div className="mb-10">
                      <p className="mb-3 text-eyebrow text-muted">Listen along</p>
                      <ChapterizedAudio src={section.audio.src} />
                    </div>
                  )}
                  <article>
                    <SectionBody />
                  </article>
                </div>
              </Panel>
            </div>
          );
        })}
    </>
  );
}

