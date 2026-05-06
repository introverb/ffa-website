import type { ArtifactMeta } from '@/lib/possibilia';

export const meta: ArtifactMeta = {
  slug: 'long-way-home',
  title: 'The Long Way Home',
  date: '2024-08-01',
  author: 'the Possibilia Editorial Team',
  excerpt:
    'Two place vignettes from a future country: a dense remote-work city in the Montana mountains, and a barn-futurism stretch of rural Texas linked by freight rail.',
  hero: {
    // Lesath establishes the "place" feeling for the whole package;
    // each section gets its own full-bleed feature image below.
    src: '/possibilia/artifacts/long-way-home/lesath.jpg',
    alt: 'The Long Way Home, cover artwork',
    objectPosition: 'center 35%',
    artist: 'Andres Osorio and Olli Payne',
  },
  // Two sections, each rendered as its own block (eyebrow + h2 +
  // featureImage + body). Brushcross also gets an inline audio
  // player above its body text.
  sections: [
    {
      eyebrow: 'An Urban Futurism Artifact',
      title: 'The Long Way Home: Lesath, Montana',
      featureImage: {
        src: '/possibilia/artifacts/long-way-home/lesath.jpg',
        alt: 'Lesath, Montana, concept art',
      },
      bodyFile: 'lesath',
    },
    {
      eyebrow: 'A Barn Futurism Artifact',
      title: 'The Long Way Home: Brushcross, TX',
      featureImage: {
        src: '/possibilia/artifacts/long-way-home/bushcross.jpg',
        alt: 'Brushcross, TX, concept art',
      },
      bodyFile: 'brushcross',
      audio: {
        src: '/possibilia/artifacts/long-way-home/brushcross.mp3',
      },
    },
  ],
};
