import type { ArtifactMeta } from '@/lib/possibilia';

export const meta: ArtifactMeta = {
  slug: 'tapedeck-brittanica',
  title: 'TAEPDECK BRITANNICA',
  date: '2024-06-01',
  author: 'the Possibilia Editorial Team',
  excerpt:
    'Internal product notes for a fictional petabyte-scale tape archive built for the inner solar system. A Britannica for the cosmos, in cassette form.',
  hero: {
    // Concept art reads better than the pamphlet in the wide-short
    // peek panel; the pamphlet (a tall portrait) gets its own
    // full-bleed treatment immediately below.
    src: '/possibilia/artifacts/tapedeck-brittanica/concept-art.jpg',
    alt: 'TAEPDECK BRITANNICA, concept art',
    // Per-section author credits live in the body (Charles for the
    // notes, Andres for the concept art); the page-header byline is
    // a single editorial-team credit.
  },
  // The pamphlet is the centerpiece artifact: tall, dense, meant to
  // be read up close. Full-bleed panel makes it as large as the page
  // allows so the typography and detail are legible.
  featureImage: {
    src: '/possibilia/artifacts/tapedeck-brittanica/pamphlet.jpg',
    alt: 'TAEPDECK BRITANNICA pamphlet',
  },
};
