import type { PackageMeta } from '@/lib/possibilia';

export const meta: PackageMeta = {
  slug: 'cyber-robot-ai-wartime',
  issue: 'Issue 0',
  title: 'Cyber Robot AI Wartime',
  date: '2024-03-01',
  storyAuthor: 'Christian Wolff',
  companionAuthor: 'Ben Landau-Taylor',
  excerpt:
    'The year is 2056. AI-powered robotic legions hurtle across a vast battlefield in a clash of startling proportion and lasting international consequences.',
  hero: {
    // "The Prince of Liechtenstein" as the page-header artwork - pairs
    // well with the new peek-reveal treatment, where the image's
    // composition reads through on the right side of the masthead.
    src: '/possibilia/cyber-robot-ai-wartime/prince-of-liechtenstein.jpg',
    alt: 'Cyber Robot AI Wartime, cover artwork',
    artist: 'Andres Osorio',
    objectPosition: 'center 40%',
  },
  // Drop the audio file at /public/possibilia/cyber-robot-ai-wartime/story.mp3
  // and the inline player at the top of the story panel will activate.
  storyAudio: {
    src: '/possibilia/cyber-robot-ai-wartime/story.mp3',
  },
  // Drop interview.mp3 in the same folder; chapter timestamps activate
  // jump-to-section buttons under the player.
  interview: {
    src: '/possibilia/cyber-robot-ai-wartime/interview.mp3',
    title: 'A Conversation with Christian Wolff',
    description:
      'Editors Charles Rosenbauer and Olli Payne find out Christian’s motivation for writing Cyber Robot AI Wartime and his thoughts on why limited warfare is a good path for humanity.',
    chapters: [
      { time: '0:00', label: 'Inspiration behind the story and the title' },
      { time: '3:11', label: 'The Realistic' },
      { time: '8:46', label: 'The Optimistic' },
      { time: '13:39', label: 'The locations & how we adopt limited warfare' },
      { time: '20:25', label: 'The medium of Sci-Fi' },
      { time: '25:33', label: 'Public perception of the story' },
      { time: '33:54', label: 'Christian’s writing process; humans and technology' },
      { time: '44:25', label: 'What we’d like to see in upcoming stories' },
      { time: '54:58', label: 'Christian’s favorite sci-fi & unconventional technologies' },
    ],
  },
};
