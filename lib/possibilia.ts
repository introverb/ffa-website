import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';

/** A single chapter marker on a chaptered audio recording. */
export type AudioChapter = {
  /** Time string like "0:00", "3:11", "1:22:05". */
  time: string;
  /** Chapter label shown next to the time. */
  label: string;
};

// Shape that every package's meta.ts must export. The dynamic route + the
// listings page both type-narrow against this shape, so adding a new field
// here forces every package to keep up.
export type PackageMeta = {
  /** Slug = folder name. Must match. */
  slug: string;
  /** Issue identifier — e.g. "Issue 0", "Issue 1". */
  issue: string;
  /** Package title (e.g. the story's title). */
  title: string;
  /** ISO date (YYYY-MM-DD) for sorting + display. */
  date: string;
  /** Author of the fiction piece. */
  storyAuthor: string;
  /** Author of the companion essay, if the package has one. */
  companionAuthor?: string;
  /** 1–2 line teaser shown on the listings page. */
  excerpt: string;
  /** Hero artwork that goes into the package PageHeader. */
  hero: {
    src: string;
    alt: string;
    artist?: string;
  };
  /** Optional audio recording of the story (full narration). */
  storyAudio?: {
    src: string;
  };
  /** Optional audio recording of the companion piece (full narration).
   *  Renders an inline player at the top of the companion panel, mirroring
   *  the story-audio treatment. */
  companionAudio?: {
    src: string;
  };
  /** Optional interview / conversation about the package. Renders as its
   *  own panel below the companion piece, with chapter timestamps if given. */
  interview?: {
    src: string;
    title?: string;
    description?: string;
    chapters?: AudioChapter[];
  };
};

const CONTENT_DIR = path.join(process.cwd(), 'content/possibilia');

/** Returns every package slug, in the order they appear on disk (alpha). */
export async function getPackageSlugs(): Promise<string[]> {
  let entries: import('node:fs').Dirent[];
  try {
    entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  } catch {
    // Directory may not exist yet on first build.
    return [];
  }
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

/** Reads + returns every package's meta, sorted newest-first by date. */
export async function getAllPackages(): Promise<PackageMeta[]> {
  const slugs = await getPackageSlugs();
  const packages = await Promise.all(
    slugs.map(async (slug) => {
      const mod = await import(`@/content/possibilia/${slug}/meta`);
      return mod.meta as PackageMeta;
    }),
  );
  return packages.sort((a, b) => b.date.localeCompare(a.date));
}

/** Returns whether a package folder contains a companion.mdx file. */
export async function hasCompanion(slug: string): Promise<boolean> {
  try {
    await fs.access(path.join(CONTENT_DIR, slug, 'companion.mdx'));
    return true;
  } catch {
    return false;
  }
}
