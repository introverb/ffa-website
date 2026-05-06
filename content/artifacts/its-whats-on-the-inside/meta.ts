import type { ArtifactMeta } from '@/lib/possibilia';

export const meta: ArtifactMeta = {
  slug: 'its-whats-on-the-inside',
  title: 'It’s What’s on the Inside That Counts',
  date: '2024-07-01',
  author: 'the Possibilia Editorial Team',
  excerpt:
    'A speculative anime forum thread about a model’s post-surgery return, custom-printed organs, and the cultural backlash against transhuman aesthetics.',
  hero: {
    // confinal is landscape (~4:3) and reads well in the wide-short
    // peek panel. The portrait concept-art studies (con1–6) sit in
    // the body grid; the long forum-screenshot is the full-bleed
    // feature panel.
    src: '/possibilia/artifacts/its-whats-on-the-inside/confinal.jpg',
    alt: 'It’s What’s on the Inside That Counts, final concept art',
    objectPosition: 'center 30%',
  },
  // The forum screenshot is a tall vertical strip (5574x17759); the
  // full-bleed treatment lets the viewer scroll the thread at
  // readable size.
  featureImage: {
    src: '/possibilia/artifacts/its-whats-on-the-inside/forum.jpg',
    alt: 'Anime forum thread discussing the Cathy-Anode prosthetics',
  },
};
