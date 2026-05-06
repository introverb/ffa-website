import type { PackageMeta } from '@/lib/possibilia';

export const meta: PackageMeta = {
  slug: 'ponds',
  issue: 'Issue 0',
  title: 'Ponds',
  date: '2024-04-01',
  storyAuthor: 'Orion Ruffin-Green',
  companionAuthor: 'Anna-Sofia Lesiv',
  excerpt:
    'A sculptor in the asteroid Beltway holds his family close across the light-seconds - through a haptic uplink, and through the green ponds his mother carried from Earth.',
  hero: {
    src: '/possibilia/ponds/the-ponds-in-our-eyes.jpg',
    alt: 'Ponds, cover artwork',
    artist: 'Michael Simmons',
    objectPosition: 'center 25%',
  },
  // The mp3 in /public/possibilia/ponds/story.mp3 is the story narration
  // and lives at the top of the story panel.
  storyAudio: {
    src: '/possibilia/ponds/story.mp3',
  },
  // Interview is a video, hosted on YouTube to keep video out of the
  // LFS budget. The custom-poster click-to-play hides YouTube branding
  // until the user actually presses play.
  interview: {
    kind: 'video',
    youtubeId: 'fdHlkTSG0Mc',
    title: 'Ponds: Haptic Feedback and Sensory Substitution',
    description:
      'A conversation between author Orion Ruffin-Green and Possibilia editor Charles Rosenbauer on haptic feedback, sensory substitution, and the technologies of intimacy.',
  },
};
