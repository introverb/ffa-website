import type { PackageMeta } from '@/lib/possibilia';

// Example package — placeholder content showing the file structure for
// real Possibilia packages. Replace with a real story by:
//   1. Renaming this folder to your slug (e.g. "1-the-mountain")
//   2. Editing this meta to match (title, date, authors, hero artwork)
//   3. Replacing story.mdx with the story content (copy-paste from Substack)
//   4. Replacing companion.mdx with the companion essay (or delete if none)
//
// Each new package goes in its own folder under content/possibilia/.
export const meta: PackageMeta = {
  slug: '0-example',
  issue: 'Issue 0',
  title: 'Example package title',
  date: '2026-05-05',
  storyAuthor: 'Olli Payne',
  companionAuthor: 'Companion Author',
  excerpt:
    'A 1–2 line teaser describing this story for the listings page. Pulled from meta.ts, not from the story body.',
  hero: {
    src: '/images/initiative-possibilia.jpg',
    alt: 'Example hero artwork',
    artist: 'Artist Name',
  },
};
