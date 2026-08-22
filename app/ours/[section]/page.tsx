import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Panel } from '@/components/PageFrame';
import { OursHeader } from '@/components/ours/OursHeader';
import { LouverWall } from '@/components/ours/LouverWall';
import { SECTIONS } from '@/components/ours/tokens';

// /ours/<section> — the OURS page with that slat already open, so each
// section has a shareable URL: /ours/about, /ours/gallery,
// /ours/ledgerworks, /ours/visions, …
//
// Route precedence keeps the rest of /ours/* safe: real routes
// (collect, pre-event, checkin) win over this dynamic segment, and the
// config-level redirects/rewrites (attend, web3, after, the briefs)
// are applied before dynamic routes are considered. Anything else
// 404s via notFound below.
export function generateStaticParams() {
  return SECTIONS.map((s) => ({ section: s.id }));
}

export function generateMetadata({ params }: { params: { section: string } }): Metadata {
  const sec = SECTIONS.find((s) => s.id === params.section);
  if (!sec) return {};
  return {
    title: `OURS · ${sec.title}`,
    description: sec.blurb,
    alternates: { canonical: `/ours/${sec.id}` },
    openGraph: { images: [{ url: sec.image, alt: `OURS — ${sec.title}` }] },
  };
}

export default function OursSectionPage({ params }: { params: { section: string } }) {
  const sec = SECTIONS.find((s) => s.id === params.section);
  if (!sec) notFound();

  return (
    <>
      <OursHeader
        summary={
          <p>
            An exhibition and salon for visions of the future. One evening on the
            Lower East Side: the works, the words, and everything that came of it.
          </p>
        }
        meta={['August 2026', 'Space LES', 'New York City']}
        video="/images/ours/event-film.mp4"
        poster="/images/ours/event-film-poster.jpg"
      />
      <Panel variant="white" full className="p-4 md:p-14">
        <LouverWall initialOpen={sec.id} />
      </Panel>
    </>
  );
}
