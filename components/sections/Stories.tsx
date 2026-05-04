import Link from 'next/link';
import { Placeholder } from '@/components/Placeholder';
import { STORIES } from '@/lib/content';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function Stories() {
  return (
    <section className="container-wide py-24">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Stories</p>
          <h2 className="mt-3 text-h2 md:text-h2-lg">From the foundation</h2>
        </div>
        <Link href="/resources" className="link-underline text-sm">
          Read all →
        </Link>
      </div>

      <div className="mt-12 grid gap-12 md:grid-cols-2">
        {STORIES.map((s) => (
          <article key={s.slug} className="group">
            <Link href={`/resources/${s.slug}`} className="block">
              <Placeholder src={s.image} alt={s.title} ratio="4/3" />
              <div className="mt-6 flex items-center gap-3 text-eyebrow text-muted">
                <span>{formatDate(s.date)}</span>
                <span aria-hidden>·</span>
                <span>{s.author}</span>
              </div>
              <h3 className="mt-3 text-h4 leading-tight group-hover:text-sage">
                {s.title}
              </h3>
              <p className="mt-3 max-w-prose text-body leading-relaxed text-muted">
                {s.excerpt}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
