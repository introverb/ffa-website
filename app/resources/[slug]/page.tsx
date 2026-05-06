import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { Placeholder } from '@/components/Placeholder';
import { STORIES } from '@/lib/content';

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const story = STORIES.find((s) => s.slug === params.slug);
  if (!story) return { title: 'Article not found' };
  return { title: story.title, description: story.excerpt };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function StoryPage({ params }: Params) {
  const story = STORIES.find((s) => s.slug === params.slug);
  if (!story) notFound();

  return (
    <Panel variant="white" className="md:p-20">
      <div className="mx-auto max-w-3xl">
        <Link href="/resources" className="text-sm underline decoration-from-font underline-offset-4 text-muted hover:text-sage">
          ← Back to resources
        </Link>
        <p className="mt-10 text-sm uppercase tracking-[0.08em] text-sage">
          {formatDate(story.date)} · {story.author}
        </p>
        <h1 className="mt-4 text-h2 leading-tight md:text-h2-lg">{story.title}</h1>
        <div className="mt-12">
          <Placeholder src={story.image} alt={story.title} ratio="16/9" priority />
        </div>
        <div className="mt-14 space-y-6 text-body-lg leading-relaxed text-ink/90">
          <p className="text-h6 text-ink">{story.excerpt}</p>
          <p>
            The body of this article lives in <code>app/resources/[slug]/page.tsx</code>. Replace
            this placeholder with your final copy: either inline, by importing MDX, or by wiring
            this route to a CMS such as Contentful, Sanity, or Notion.
          </p>
          <p>
            Each story uses the same shell: an eyebrow with date and author, a title, a hero image,
            and the body.
          </p>
        </div>
      </div>
    </Panel>
  );
}
