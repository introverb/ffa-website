import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import {
  getAllPackages,
  getPackageSlugs,
  hasCompanion,
  type PackageMeta,
} from '@/lib/possibilia';

type Params = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs = await getPackageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const meta = await safeMeta(params.slug);
  if (!meta) return { title: 'Possibilia' };
  return {
    title: `${meta.title} — Possibilia`,
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

async function safeMeta(slug: string): Promise<PackageMeta | null> {
  try {
    const mod = await import(`@/content/possibilia/${slug}/meta`);
    return mod.meta as PackageMeta;
  } catch {
    return null;
  }
}

export default async function PossibiliaPackagePage({ params }: Params) {
  const meta = await safeMeta(params.slug);
  if (!meta) notFound();

  const Story = (await import(`@/content/possibilia/${params.slug}/story.mdx`))
    .default;

  const companionExists = await hasCompanion(params.slug);
  const Companion = companionExists
    ? (await import(`@/content/possibilia/${params.slug}/companion.mdx`)).default
    : null;

  return (
    <>
      <PageHeader
        eyebrow={`Possibilia · ${meta.issue}`}
        title={meta.title}
        image={meta.hero.src}
        body={
          <p>
            <span className="text-sm uppercase tracking-[0.08em] text-sage">
              {formatDate(meta.date)} · {meta.storyAuthor}
            </span>
          </p>
        }
      />

      <Panel variant="white" className="md:p-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm uppercase tracking-[0.08em] text-sage">
            Story · {meta.storyAuthor}
          </p>
          <article className="mt-8">
            <Story />
          </article>
        </div>
      </Panel>

      {Companion && (
        <Panel variant="white" className="md:p-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm uppercase tracking-[0.08em] text-sage">
              Companion piece{meta.companionAuthor ? ` · ${meta.companionAuthor}` : ''}
            </p>
            <article className="mt-8">
              <Companion />
            </article>
          </div>
        </Panel>
      )}

      {meta.hero.artist && (
        <Panel variant="white" className="md:p-12">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm uppercase tracking-[0.08em] text-muted">
              Artwork by {meta.hero.artist}
            </p>
          </div>
        </Panel>
      )}
    </>
  );
}
