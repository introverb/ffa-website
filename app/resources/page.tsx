import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import { Placeholder } from '@/components/Placeholder';

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'The thinking behind the Foundation for Future Aesthetics, and the practical guides for contributing to it.',
};

const RESOURCES = [
  {
    href: '/resources/manifesto',
    title: 'Manifesto: forging our future through optimistic science fiction',
    blurb:
      'Why the stories we tell about tomorrow shape the world we actually build. The aesthetic case for an optimistic, realistic canon.',
    image: '/images/manifesto.jpg',
    ratio: '5/2' as const,
    objectPosition: undefined,
  },
  {
    href: '/possibilia-submissions',
    title: 'Submissions Guide',
    blurb:
      'How to pitch fiction, companion pieces, and original artwork for Possibilia Magazine - track-by-track requirements and what we look for.',
    image: '/images/possibilia-submissions.png',
    ratio: '5/2' as const,
    // Crop biased upward (~25% from top instead of centered)
    objectPosition: 'center 25%',
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Reading and writing."
        image="/images/manifesto.jpg"
        body={
          <p>
            Original articles, partnership announcements, collaborations, and the practical
            guides for joining the work. New posts land here periodically.
          </p>
        }
      />

      <Panel variant="white" className="md:p-16">
        <ul className="grid gap-12 md:grid-cols-2">
          {RESOURCES.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="group block">
                <Placeholder
                  src={r.image}
                  alt={r.title}
                  ratio={r.ratio}
                  objectPosition={r.objectPosition}
                />
                <h2 className="mt-6 text-h4 leading-tight md:text-h3 group-hover:text-sage">
                  {r.title}
                </h2>
                <p className="mt-3 max-w-prose text-body leading-relaxed text-muted">
                  {r.blurb}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
