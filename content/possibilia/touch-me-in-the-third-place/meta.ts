import type { PackageMeta } from '@/lib/possibilia';

export const meta: PackageMeta = {
  slug: 'touch-me-in-the-third-place',
  issue: 'Issue 0',
  title: 'Touch Me in the Third Place',
  date: '2024-05-01',
  storyAuthor: 'Taylor Stuckey',
  companionAuthor: 'Eli Dourado',
  excerpt:
    'On THE THIRD PLACE - a mile-long community center suspended in the clouds - a young director sets out to film a documentary about its most famous muse, who turns out to be very much alive and watching.',
  hero: {
    src: '/possibilia/touch-me-in-the-third-place/the-third-place.png',
    alt: 'Touch Me in the Third Place, cover artwork',
    artist: 'Colby Green',
    objectPosition: 'center 25%',
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
  // Interview is a video - hosted on YouTube to keep video out of the
  // Git LFS bandwidth budget. The interview panel renders the embedded
  // player from this id; the "Video coming soon" placeholder is gated
  // behind `!youtubeId`, so it disappears as soon as this is set.
  interview: {
    kind: 'video',
    youtubeId: 'Lc75tI_1C-Y',
    title: 'The Third Place: The Post-Post-"Art Movement"',
    description:
      'The Possibilia editors spend some time with Tay talking about the essence of art, recent stagnation, and a direction for the future.',
  },
};
