import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import { ChapterizedAudio } from '@/components/ChapterizedAudio';
import { getArtifactSlugs, type ArtifactMeta } from '@/lib/possibilia';

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
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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
// artifact layouts. width/height on Image are aspect hints; w-full
// h-auto + unoptimized images means the file's intrinsic ratio drives
// layout.
function FeaturePanel({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <Panel variant="white" full className="overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={2400}
        height={1800}
        sizes="100vw"
        priority={priority}
        className="block h-auto w-full"
      />
    </Panel>
  );
}

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

  return (
    <>
      <PageHeader
        eyebrow="Possibilia · Artifacts from Tomorrow"
        title={meta.title}
        image={meta.hero.src}
        imagePosition={meta.hero.objectPosition}
        imageMode="peek"
        body={
          <p className="text-sm uppercase tracking-[0.08em] text-sage">
            {formatDate(meta.date)}
            <br />
            By {meta.author}
            {meta.hero.artist && (
              <>
                <br />
                Art by {meta.hero.artist}
              </>
            )}
          </p>
        }
      />

      {/* Single-body layout: optional feature image, then the body. */}
      {SingleBody && meta.featureImage && (
        <FeaturePanel
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

      {/* Multi-section layout: each section is its own sticky stack.
          The title panel pins just below the SiteNav (top-[7rem]);
          the feature image pins 5px lower so it covers the title
          except for a 5px peek at the very top — the same scroll
          stack effect the Initiatives band uses. Body flows below
          the pinned image, stays behind it via stacking order so
          the cover never breaks. Each `relative` wrapper scopes
          the stickiness to its own section's vertical range, so
          when section 1 ends, its pins release and section 2's
          stack takes over. */}
      {meta.sections &&
        sectionBodies &&
        meta.sections.map((section, i) => {
          const SectionBody = sectionBodies[i];
          return (
            <div key={section.bodyFile} className="relative space-y-6 md:space-y-8">
              <div className="sticky top-[7rem] z-10">
                <Panel
                  variant="white"
                  className="bg-leather text-paper md:p-12"
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
              </div>

              {section.featureImage && (
                <div className="sticky top-[calc(7rem+5px)] z-20">
                  <Panel
                    variant="white"
                    full
                    className="overflow-hidden shadow-[0_-18px_36px_-12px_rgba(0,0,0,0.22)]"
                  >
                    <Image
                      src={section.featureImage.src}
                      alt={section.featureImage.alt}
                      width={2400}
                      height={1800}
                      sizes="100vw"
                      priority={i === 0}
                      className="block h-auto w-full"
                    />
                  </Panel>
                </div>
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

