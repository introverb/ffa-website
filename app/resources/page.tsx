import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
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
  },
  {
    href: '/possibilia-submissions',
    title: 'Submissions Guide',
    blurb:
      'How to pitch fiction, criticism, and original artwork for Possibilia, Issue 0 — track-by-track requirements and what we look for.',
    image: '/images/possibilia-submissions.png',
    ratio: '5/2' as const,
  },
];

export default function ResourcesPage() {
  return (
    <>
      <Panel variant="white" className="md:p-16">
        <p className="text-sm underline decoration-from-font underline-offset-4 text-muted">
          Resources
        </p>
        <h1 className="mt-6 max-w-4xl text-h2 leading-[1.05] md:text-h2-lg">
          Reading and writing.
        </h1>
        <p className="mt-6 max-w-prose text-body-lg leading-relaxed text-ink/80">
          The thinking behind the foundation, and the practical guide for joining it.
        </p>
      </Panel>

      <Panel variant="white" className="md:p-16">
        <ul className="grid gap-12 md:grid-cols-2">
          {RESOURCES.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="group block">
                <Placeholder src={r.image} alt={r.title} ratio={r.ratio} />
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
