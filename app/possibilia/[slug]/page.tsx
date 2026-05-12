import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import { ChapterizedAudio } from '@/components/ChapterizedAudio';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { JsonLd } from '@/components/JsonLd';
import {
  getPackageSlugs,
  hasCompanion,
  type PackageMeta,
} from '@/lib/possibilia';
import { renderWithArtistLinks } from '@/lib/artists';

type Params = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs = await getPackageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const meta = await safeMeta(params.slug);
  if (!meta) return { title: 'Possibilia' };
  return {
    title: `${meta.title} · Possibilia`,
    description: meta.excerpt,
    alternates: { canonical: `/possibilia/${params.slug}` },
    openGraph: {
      type: 'article',
      title: `${meta.title} · Possibilia`,
      description: meta.excerpt,
      publishedTime: meta.date,
      authors: [meta.storyAuthor],
      images: [{ url: meta.hero.src, alt: meta.hero.alt }],
    },
    twitter: { images: [meta.hero.src] },
  };
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

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.excerpt,
    datePublished: meta.date,
    author: [
      { '@type': 'Person', name: meta.storyAuthor },
      ...(meta.companionAuthor
        ? [{ '@type': 'Person', name: meta.companionAuthor }]
        : []),
    ],
    publisher: {
      '@type': 'NonprofitOrganization',
      name: 'Foundation for Future Aesthetics',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.futureaesthetics.foundation/images/logo.png',
      },
    },
    image: `https://www.futureaesthetics.foundation${meta.hero.src}`,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'PublicationIssue',
      name: meta.issue,
    },
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <PageHeader
        eyebrow={`Possibilia · ${meta.issue}`}
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
            <span className="md:whitespace-nowrap">
              Story by {meta.storyAuthor}
              {meta.companionAuthor && (
                <>
                  {' · '}Companion by {meta.companionAuthor}
                </>
              )}
              {meta.hero.artist && (
                <>
                  {' · '}Cover by {renderWithArtistLinks(meta.hero.artist)}
                </>
              )}
            </span>
            {meta.interview && (
              <>
                <br />
                Keep scrolling for a conversation with the author
              </>
            )}
          </p>
        }
      />

      <Panel variant="white" className="md:p-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm uppercase tracking-[0.08em] text-leather">
            Story · {meta.storyAuthor}
          </p>
          {meta.storyAudio && (
            <div className="mt-8">
              <p className="mb-3 text-eyebrow text-muted">Listen along</p>
              <ChapterizedAudio src={meta.storyAudio.src} />
            </div>
          )}
          <article className="mt-8">
            <Story />
          </article>
        </div>
      </Panel>

      {Companion && (
        <Panel variant="white" className="md:p-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm uppercase tracking-[0.08em] text-leather">
              Companion piece{meta.companionAuthor ? ` · ${meta.companionAuthor}` : ''}
            </p>
            {meta.companionAudio && (
              <div className="mt-8">
                <p className="mb-3 text-eyebrow text-muted">Listen along</p>
                <ChapterizedAudio src={meta.companionAudio.src} />
              </div>
            )}
            <article className="mt-8">
              <Companion />
            </article>
          </div>
        </Panel>
      )}

      {meta.interview && (
        <Panel variant="white" className="md:p-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm uppercase tracking-[0.08em] text-leather">Interview</p>
            {meta.interview.title && (
              <h2 className="mt-4 text-h3 leading-tight md:text-h3-lg">
                {meta.interview.title}
              </h2>
            )}
            {meta.interview.description && (
              <p className="mt-4 max-w-prose text-body leading-relaxed text-ink/80">
                {meta.interview.description}
              </p>
            )}
            <div className="mt-8">
              {/* Audio interviews → "Listen along" eyebrow.
                  Video interviews waiting on a youtubeId →
                  "Video coming soon" placeholder.
                  Once youtubeId is set, the eyebrow disappears and the
                  YouTube embed renders below. */}
              {meta.interview.youtubeId ? null : meta.interview.src ? (
                <p className="mb-3 text-eyebrow text-muted">Listen along</p>
              ) : (
                <p className="mb-3 text-eyebrow text-muted">Video coming soon</p>
              )}
              {meta.interview.youtubeId ? (
                <YouTubeEmbed
                  videoId={meta.interview.youtubeId}
                  title={meta.interview.title}
                  poster={meta.interview.posterSrc ?? meta.hero.src}
                />
              ) : meta.interview.src ? (
                <ChapterizedAudio
                  src={meta.interview.src}
                  chapters={meta.interview.chapters}
                />
              ) : null}
            </div>
          </div>
        </Panel>
      )}

    </>
  );
}
