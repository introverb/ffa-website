import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import { ChapterizedAudio } from '@/components/ChapterizedAudio';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import {
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
    title: `${meta.title} · Possibilia`,
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
        imagePosition={meta.hero.objectPosition}
        imageMode="peek"
        body={
          <p className="text-sm uppercase tracking-[0.08em] text-sage">
            {formatDate(meta.date)}
            <br />
            <span className="md:whitespace-nowrap">
              Story by {meta.storyAuthor}
              {meta.companionAuthor && (
                <>
                  {' · '}Companion by {meta.companionAuthor}
                </>
              )}
              {meta.hero.artist && (
                <>
                  {' · '}Cover by {meta.hero.artist}
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
          <p className="text-sm uppercase tracking-[0.08em] text-sage">
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
            <p className="text-sm uppercase tracking-[0.08em] text-sage">
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
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Interview</p>
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
