import Link from 'next/link';
import { Panel } from '@/components/PageFrame';
import { RESEARCH_AREAS } from '@/lib/content';

// 3-column table layout matching the live site:
// number | title | description, with horizontal rules between rows.
export function ResearchAreas() {
  return (
    <Panel variant="white" className="md:p-16">
      <div className="flex items-start justify-between gap-8">
        <h2 className="text-h2 leading-[1.05] md:text-h2-lg">Our Research Areas</h2>
        <Link
          href="/resources"
          className="hidden md:flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-ink text-center text-xs leading-snug text-ink hover:bg-ink hover:text-paper"
        >
          Read more about our upcoming case studies
        </Link>
      </div>

      <ol className="mt-12 border-t border-rule">
        {RESEARCH_AREAS.map((r) => (
          <li
            key={r.n}
            className="grid grid-cols-1 gap-y-4 border-b border-rule py-8 md:grid-cols-[80px_1fr_1.2fr] md:gap-x-12 md:py-10"
          >
            <span className="text-sm tracking-wide text-muted">{r.n}</span>
            <h3 className="text-h5 leading-tight md:text-h4">{r.title}</h3>
            <div className="text-body leading-relaxed text-muted">
              {r.cta ? (
                <p>
                  {r.blurb}{' '}
                  <Link href={r.cta.href} className="underline decoration-from-font underline-offset-4 text-ink hover:text-sage">
                    {r.cta.label}
                  </Link>
                </p>
              ) : (
                <p>{r.blurb}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
