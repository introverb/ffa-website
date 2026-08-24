import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { OursHeader } from '@/components/ours/OursHeader';
import { LouverWall } from '@/components/ours/LouverWall';

// The OURS page, post-event: the recap of the August 9, 2026 evening —
// the louver wall of sections, the gallery of works (with the
// storefront's live Buy flow), the program, and the photographs.
// Shipped 2026-08-17, replacing the pre-event page, which is preserved
// unlinked at /ours/pre-event — see OURS_PAGE_HISTORY.md.
export const metadata: Metadata = {
  title: 'OURS',
  description:
    'OURS was an exhibition and salon evening for visions of the future, presented by the Foundation for Future Aesthetics in New York City, August 2026 — the works, the words, and everything that came of it.',
  alternates: { canonical: '/ours' },
  openGraph: {
    images: [{ url: '/images/initiative-exhibitions.jpg', alt: 'OURS' }],
  },
  twitter: { images: ['/images/initiative-exhibitions.jpg'] },
};

export default function OursPage() {
  return (
    <>
      <OursHeader
        summary={
          <p>
            An exhibition and salon for visions of the future. One evening on the
            Lower East Side: the works, the words, and everything that came of it.
          </p>
        }
        meta={['August 2026', 'Space LES', 'NYC']}
        // The event film — the FINAL cut (Claude Sizzles), 720p with its mix
        // for the autoplaying muted header well.
        video="/images/ours/event-film.mp4"
        poster="/images/ours/event-film-poster.jpg"
      />
      <Panel variant="white" full className="p-4 md:p-14">
        <LouverWall />
      </Panel>
    </>
  );
}
