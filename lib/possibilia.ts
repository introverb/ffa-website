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
  /** Issue identifier - e.g. "Issue 0", "Issue 1". */
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
    /** Optional CSS object-position for the peek-revealed image, e.g.
     *  `'center 25%'` to shift the visible portion toward the top of
     *  the source image. Defaults to centered. */
    objectPosition?: string;
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
   *  own panel below the companion piece.
   *
   *  Supply *one* of `src` or `youtubeId`:
   *    - `src` → renders an inline <audio> player with optional chapter
   *      jump-buttons beneath it.
   *    - `youtubeId` → renders an embedded YouTube video (used when the
   *      conversation is too large to ship through Git LFS, or when
   *      we'd rather not pay LFS bandwidth on every redeploy).
   */
  interview?: {
    /** Whether the interview is audio or video. Drives the placeholder
     *  eyebrow when media isn't yet available ("Audio coming soon" vs
     *  "Video coming soon"). Defaults to 'audio'. */
    kind?: 'audio' | 'video';
    /** Audio source path under /public, e.g. `/possibilia/<slug>/interview.mp3`. */
    src?: string;
    /** YouTube video ID - the 11-char string after `v=` in the watch URL. */
    youtubeId?: string;
    /** Custom poster image shown before the user clicks play. Defaults
     *  to the package hero. Use this when the hero doesn't read well
     *  as a video thumbnail and a custom still serves better. */
    posterSrc?: string;
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

// ---------- Artifacts from Tomorrow ----------
//
// "Artifacts from Tomorrow" are short pieces, ephemera, and visual
// experiments by the editorial team - sibling content to Possibilia
// stories but lighter-weight. Each one is a single MDX body (no
// story/companion split, no required audio), rendered through the same
// PageHeader treatment as the stories so they share an editorial frame.
// Lives at /possibilia/artifacts/[slug].

/** Shape every artifact's meta.ts must export. */
export type ArtifactMeta = {
  /** Slug = folder name under content/artifacts. */
  slug: string;
  /** Artifact title. */
  title: string;
  /** ISO date (YYYY-MM-DD) for sorting + display. */
  date: string;
  /** Maker / author byline. */
  author: string;
  /** 1–2 line teaser shown on the listings page. */
  excerpt: string;
  /** Hero artwork that goes into the page header. */
  hero: {
    src: string;
    alt: string;
    artist?: string;
    objectPosition?: string;
  };
  /** Optional full-bleed feature image, rendered as its own panel
   *  between the PageHeader and the body text. Use for centerpiece
   *  artwork that should read as huge on the page (e.g. a poster,
   *  pamphlet, or print piece that the artifact is showing off). */
  featureImage?: {
    src: string;
    alt: string;
  };
  /** Optional multi-section layout. When set, the route renders each
   *  section as its own block (eyebrow + title + featureImage + body
   *  + optional audio), and ignores the top-level body MDX. Use for
   *  collection artifacts that bundle multiple mini-pieces under one
   *  page (e.g. "The Long Way Home" with two place vignettes). */
  sections?: Array<{
    /** Section title shown as h2 above the body. */
    title: string;
    /** Optional categorical eyebrow above the title (e.g. "An Urban
     *  Futurism Artifact"). */
    eyebrow?: string;
    /** Optional full-bleed feature image for this section. */
    featureImage?: { src: string; alt: string };
    /** Filename (without .mdx) of the section body, located at
     *  content/artifacts/<slug>/<bodyFile>.mdx. */
    bodyFile: string;
    /** Optional audio (mp3 path under /public) rendered above the
     *  section body with a "Listen along" eyebrow. */
    audio?: { src: string };
  }>;
};

const ARTIFACTS_DIR = path.join(process.cwd(), 'content/artifacts');

/** Returns every artifact slug, in the order they appear on disk. */
export async function getArtifactSlugs(): Promise<string[]> {
  let entries: import('node:fs').Dirent[];
  try {
    entries = await fs.readdir(ARTIFACTS_DIR, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

/** Reads + returns every artifact's meta, sorted newest-first by date. */
export async function getAllArtifacts(): Promise<ArtifactMeta[]> {
  const slugs = await getArtifactSlugs();
  const artifacts = await Promise.all(
    slugs.map(async (slug) => {
      const mod = await import(`@/content/artifacts/${slug}/meta`);
      return mod.meta as ArtifactMeta;
    }),
  );
  return artifacts.sort((a, b) => b.date.localeCompare(a.date));
}
