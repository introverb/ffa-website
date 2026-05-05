import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { Placeholder } from '@/components/Placeholder';
import { PROJECTS } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Possibilia',
  description:
    'Possibilia is the foundation’s magazine — fiction, criticism, and original artwork imagining an optimistic, realistic future.',
};

export default function PossibiliaPage() {
  return (
    <>
      <Panel variant="white" className="md:p-20">
        <p className="text-sm underline decoration-from-font underline-offset-4 text-muted">
          Possibilia · Issue 0
        </p>
        <h1 className="mt-8 max-w-4xl text-h1 leading-[1.05] md:text-h1-lg">
          A magazine for the future we&rsquo;d actually want to live in.
        </h1>
        <p className="mt-10 max-w-prose text-body-lg leading-relaxed text-ink/80">
          Possibilia publishes fiction, essays, criticism, and original artwork that imagine an
          optimistic and realistic future. Issue 0 is in production. We&rsquo;re looking for
          contributors across every role.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/contact" className="btn-solid">Pitch us</Link>
          <Link href="/donate" className="btn">Sponsor an issue</Link>
        </div>
      </Panel>

      <Panel variant="image" full className="aspect-[16/9]">
        <Placeholder src="/images/possibilia-hero.jpg" alt="Possibilia hero" ratio="16/9" priority />
      </Panel>

      <Panel variant="white" className="md:p-20">
        <div className="grid gap-14 md:grid-cols-3">
          <Pillar title="Fiction" body="Original short fiction set in a believable, recognizably better tomorrow. We pay professional rates and consider new voices alongside established writers." />
          <Pillar title="Criticism & essays" body="Long-form writing on the aesthetics of the future across film, architecture, design, and games — the canon and the cracks in it." />
          <Pillar title="Artwork" body="Cover art, interior illustration, photography, and graphic essays. We commission and pay; we do not run uncredited generative work." />
        </div>
      </Panel>

      <Panel variant="white" className="md:p-16">
        <p className="text-sm underline decoration-from-font underline-offset-4 text-muted">Featured projects</p>
        <h2 className="mt-6 text-h2 md:text-h2-lg">From the foundation&rsquo;s files.</h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {PROJECTS.map((p) => (
            <div key={p.title}>
              <Placeholder src={p.image} alt={p.title} ratio="square" />
              <h3 className="mt-5 text-h6 leading-snug">{p.title}</h3>
            </div>
          ))}
        </div>
      </Panel>

      <Panel variant="dark" className="md:p-16">
        <h2 className="text-h2 md:text-h2-lg">We&rsquo;re hiring contributors for Issue 0.</h2>
        <p className="mt-6 max-w-prose text-body-lg leading-relaxed text-white/85">
          Writers, artists, editors, technical advisors, and donors. Read the submission guide
          or send a pitch directly.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/possibilia-submissions" className="btn">How to submit</Link>
          <Link href="/contact" className="btn-solid">Send a pitch</Link>
        </div>
      </Panel>

      <Panel variant="white" className="md:p-16">
        <p className="eyebrow">Recommended reading</p>
        <Link href="/resources/manifesto" className="group mt-6 block">
          <h2 className="text-h3 leading-tight md:text-h3-lg group-hover:text-sage">
            Manifesto: forging our future through optimistic science fiction
          </h2>
          <p className="mt-3 text-sm uppercase tracking-[0.08em] text-muted">
            July 9, 2024 · Olli Payne
          </p>
          <p className="mt-4 max-w-prose text-body leading-relaxed text-muted">
            Why we believe the stories we tell about tomorrow shape the world we actually build
            &mdash; and how an optimistic, realistic aesthetic can reset the canon.
          </p>
          <p className="mt-6 text-sm underline decoration-from-font underline-offset-4 text-ink group-hover:text-sage">
            Read the manifesto →
          </p>
        </Link>
      </Panel>
    </>
  );
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-h4">{title}</h3>
      <p className="mt-4 text-body leading-relaxed text-muted">{body}</p>
    </div>
  );
}
