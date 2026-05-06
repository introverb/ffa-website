import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import { Placeholder } from '@/components/Placeholder';
import { getAllPackages, getAllArtifacts } from '@/lib/possibilia';

export const metadata: Metadata = {
  title: 'Possibilia',
  description:
    'Possibilia is the foundation’s magazine - fiction, companion pieces, and original artwork imagining an optimistic, realistic future.',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function PossibiliaPage() {
  const [packages, artifacts] = await Promise.all([
    getAllPackages(),
    getAllArtifacts(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Possibilia Magazine"
        title="A magazine for the future we’d actually want to live in."
        image="/images/initiative-possibilia.jpg"
      />

      {/* Recently published - driven by content/possibilia/<slug>/meta.ts.
          Each package is a story + (optional) companion essay + artwork
          credit; the dynamic route at /possibilia/[slug] renders the full
          piece. Listings here are sorted newest-first by meta.date. */}
      <Panel variant="white" className="md:p-16">
        <p className="text-sm underline decoration-from-font underline-offset-4 text-muted">
          Recently published
        </p>
        <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
          Stories, art, and essays.
        </h2>
        {packages.length === 0 ? (
          <p className="mt-10 max-w-prose text-body leading-relaxed text-muted">
            Issue 0 is in production. New packages will appear here as they go live.
          </p>
        ) : (
          <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((p) => (
              <li key={p.slug}>
                <Link href={`/possibilia/${p.slug}`} className="group block">
                  <Placeholder
                    src={p.hero.src}
                    alt={p.hero.alt}
                    ratio="4/3"
                  />
                  <p className="mt-5 text-sm uppercase tracking-[0.08em] text-muted">
                    {formatDate(p.date)}
                    <br />
                    Story by {p.storyAuthor}
                    {p.companionAuthor && (
                      <>
                        <br />
                        Essay by {p.companionAuthor}
                      </>
                    )}
                    {p.hero.artist && (
                      <>
                        <br />
                        Art by {p.hero.artist}
                      </>
                    )}
                  </p>
                  <h3 className="mt-2 text-h5 leading-tight group-hover:text-sage md:text-h4">
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-body leading-relaxed text-muted">
                    {p.excerpt}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* Artifacts from Tomorrow - short pieces, ephemera, and visual
          experiments by the editorial team. Each artifact has its own
          page at /possibilia/artifacts/<slug>, mirroring the story-page
          treatment so the editorial frame stays consistent. */}
      <Panel variant="white" className="md:p-16">
        <p className="text-sm underline decoration-from-font underline-offset-4 text-muted">
          Artifacts from Tomorrow
        </p>
        <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
          Tidbits, ephemera, and other curiosities.
        </h2>
        {artifacts.length === 0 ? (
          <p className="mt-10 max-w-prose text-body leading-relaxed text-muted">
            Coming soon - short pieces, images, and experiments from the editorial team.
          </p>
        ) : (
          <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {artifacts.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/possibilia/artifacts/${a.slug}`}
                  className="group block"
                >
                  <Placeholder
                    src={a.hero.src}
                    alt={a.hero.alt}
                    ratio="4/3"
                  />
                  <p className="mt-5 text-sm uppercase tracking-[0.08em] text-muted">
                    {formatDate(a.date)}
                    <br />
                    By {a.author}
                    {a.hero.artist && (
                      <>
                        <br />
                        Art by {a.hero.artist}
                      </>
                    )}
                  </p>
                  <h3 className="mt-2 text-h5 leading-tight group-hover:text-sage md:text-h4">
                    {a.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-body leading-relaxed text-muted">
                    {a.excerpt}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* Seeking contributors - black panel housing the three editorial
          pillars (Fiction / Companion pieces / Artwork) that used to live
          in their own panel. CTAs are submit + sponsor; "send a pitch"
          lived here previously and was cut. */}
      <Panel variant="dark" className="md:p-16">
        <h2 className="text-h2 leading-[1.05] md:text-h2-lg">
          We&rsquo;re seeking contributors for print and online publication.
        </h2>
        <div className="mt-12 grid gap-12 md:grid-cols-3">
          <DarkPillar
            title="Fiction"
            body="Original short fiction set in a believable, recognizably better tomorrow. We pay professional rates and consider new voices alongside established writers."
          />
          <DarkPillar
            title="Companion pieces"
            body="Nonfiction by working scientists, researchers, and field experts - companion essays that ground each story in the real research and ongoing work behind it."
          />
          <DarkPillar
            title="Artwork"
            body="Cover art, interior illustration, photography, and graphic essays. We commission and pay; we do not run uncredited generative work."
          />
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/possibilia-submissions" className="btn">
            How to submit
          </Link>
          <Link href="/support#donate" className="btn-solid">
            Sponsor a story
          </Link>
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
            Why we believe the stories we tell about tomorrow shape the world we actually
            build, and how an optimistic, realistic aesthetic can reset the canon.
          </p>
          <p className="mt-6 text-sm underline decoration-from-font underline-offset-4 text-ink group-hover:text-sage">
            Read the manifesto →
          </p>
        </Link>
      </Panel>
    </>
  );
}

function DarkPillar({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-h4">{title}</h3>
      <p className="mt-4 text-body leading-relaxed text-white/75">{body}</p>
    </div>
  );
}
