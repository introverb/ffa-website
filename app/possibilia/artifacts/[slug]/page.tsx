import type { Metadata } from 'next';
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
    title: `${meta.title} - Artifacts from Tomorrow`,
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

// Renders a single Artifact from Tomorrow. Mirrors the Possibilia story
// page structure but simpler: header + a single MDX body panel. The
// header uses the peek treatment so the hero image reveals on the right
// edge of the masthead, matching the story pages.
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
            By {meta.author}
            {meta.hero.artist && (
              <>
                {' · '}Cover by {meta.hero.artist}
              </>
            )}
          </p>
        }
      />

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
