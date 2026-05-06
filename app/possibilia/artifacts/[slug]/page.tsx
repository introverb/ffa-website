import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
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

// Renders a single Artifact from Tomorrow. Structure:
//   1. PageHeader (peek treatment — hero reveals on the right of the
//      masthead, matching the story pages)
//   2. Optional full-bleed `featureImage` panel for centerpiece artwork
//      that should dominate the page (a pamphlet, poster, print piece)
//   3. Body text panel with the artifact MDX content (max-w-3xl)
export default async function ArtifactPage({ params }: Params) {
  const meta = await safeMeta(params.slug);
  if (!meta) notFound();

  const Body = (await import(`@/content/artifacts/${params.slug}/artifact.mdx`))
    .default;

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
            <span className="md:whitespace-nowrap">
              By {meta.author}
              {meta.hero.artist && (
                <>
                  {' · '}Art by {meta.hero.artist}
                </>
              )}
            </span>
          </p>
        }
      />

      {meta.featureImage && (
        <Panel variant="white" full className="overflow-hidden">
          {/* Full-bleed feature image. width/height are aspect hints;
              w-full h-auto + unoptimized images means the file's
              intrinsic ratio drives layout. */}
          <Image
            src={meta.featureImage.src}
            alt={meta.featureImage.alt}
            width={2400}
            height={1800}
            sizes="100vw"
            priority
            className="block h-auto w-full"
          />
        </Panel>
      )}

      <Panel variant="white" className="md:p-20">
        <div className="mx-auto max-w-3xl">
          <article>
            <Body />
          </article>
        </div>
      </Panel>
    </>
  );
}
