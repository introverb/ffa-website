import type { PackageMeta } from '@/lib/possibilia';

export const meta: PackageMeta = {
  slug: 'touch-me-in-the-third-place',
  issue: 'Issue 0',
  title: 'Touch Me in the Third Place',
  date: '2024-05-01',
  storyAuthor: 'Taylor Stuckey',
  companionAuthor: 'Eli Dourado',
  excerpt:
    'On THE THIRD PLACE — a mile-long community center suspended in the clouds — a young director sets out to film a documentary about its most famous muse, who turns out to be very much alive and watching.',
  hero: {
    src: '/possibilia/touch-me-in-the-third-place/the-third-place.png',
    alt: 'Touch Me in the Third Place — cover artwork',
  },
  // Drop the audio file at /public/possibilia/touch-me-in-the-third-place/story.mp3
  // and the inline player at the top of the story panel will activate.
  storyAudio: {
    src: '/possibilia/touch-me-in-the-third-place/story.mp3',
  },
  // Drop the audio file at /public/possibilia/touch-me-in-the-third-place/companion.mp3
  // and the inline player at the top of the companion panel will activate.
  companionAudio: {
    src: '/possibilia/touch-me-in-the-third-place/companion.mp3',
  },
  // TODO: interview is a video for this one. The source AVI is too large +
  // unplayable in browsers; need a re-encoded MP4 (H.264) before we can wire
  // it up. Once that's available, drop it next to the audio files and add an
  // `interview` block here.
};
