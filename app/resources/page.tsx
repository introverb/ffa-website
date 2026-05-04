import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { Placeholder } from '@/components/Placeholder';
import { STORIES, RESEARCH_AREAS } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Essays, research notes, and submission guides from the Foundation for Future Aesthetics.',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function ResourcesPage() {
  return (
    <>
      <Panel variant="white" className="md:p-20">
        <p className="text-sm underline decoration-from-font underline-offset-4 text-muted">Resources</p>
        <h1 className="mt-8 max-w-4xl text-h1 leading-[1.05] md:text-h1-lg">
          Essays, research, and guides.
        </h1>
        <p className="mt-10 max-w-prose text-body-lg leading-relaxed text-ink/80">
          Long-form writing from the foundation, plus reading lists, research notes, and the
          guidelines we use when commissioning work.
        </p>
      </Panel>

      <Panel variant="white" className="md:p-16">
        <div className="grid gap-12 md:grid-cols-2">
          {STORIES.map((s) => (
            <article key={s.slug} className="group">
              <Link href={`/resources/${s.slug}`} className="block">
                <Placeholder src={s.image} alt={s.title} ratio="4/3" />
                <div className="mt-6 flex items-center gap-3 text-sm uppercase tracking-[0.08em] text-muted">
                  <span>{formatDate(s.date)}</span>
                  <span aria-hidden>·</span>
                  <span>{s.author}</span>
                </div>
                <h2 className="mt-3 text-h4 leading-tight group-hover:text-sage">{s.title}</h2>
                <p className="mt-3 max-w-prose text-body leading-relaxed text-muted">{s.excerpt}</p>
              </Link>
            </article>
          ))}
        </div>
      </Panel>

      <Panel variant="white" className="md:p-16">
        <h2 className="text-h2 md:text-h2-lg">Our Research Areas</h2>
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

      <Panel variant="white" className="md:p-16">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-sm underline decoration-from-font underline-offset-4 text-muted">For contributors</p>
            <h2 className="mt-6 text-h3 md:text-h3-lg">Submission guide.</h2>
          </div>
          <div className="text-body-lg leading-relaxed text-ink/85">
            <p>
              We accept fiction up to 7,500 words, essays up to 5,000 words, and pitches for
              artwork or photography. Send a brief description, two relevant samples, and a
              proposed timeline. We respond within four weeks.
            </p>
            <p className="mt-4">
              Contributors are paid on acceptance at professional rates. We do not publish
              uncredited generative AI work.
            </p>
            <Link href="/contact" className="mt-8 inline-block btn">Send a submission</Link>
          </div>
        </div>
      </Panel>
    </>
  );
}
