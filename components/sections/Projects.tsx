import Link from 'next/link';
import { Placeholder } from '@/components/Placeholder';
import { PROJECTS } from '@/lib/content';

export function Projects() {
  return (
    <section className="container-wide py-32">
      <div className="md:flex md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Latest projects</p>
          <h2 className="mt-3 text-h2 md:text-h2-lg">
            Recent commissions and case studies.
          </h2>
        </div>
        <Link href="/possibilia" className="mt-4 inline-block link-underline text-sm md:mt-0">
          View projects →
        </Link>
      </div>

      <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {PROJECTS.map((p) => (
          <Link key={p.title} href={p.href} className="group block">
            <Placeholder src={p.image} alt={p.title} ratio="square" />
            <h3 className="mt-5 text-h6 leading-snug group-hover:text-sage">{p.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
