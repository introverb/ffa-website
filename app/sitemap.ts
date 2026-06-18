import { MetadataRoute } from 'next';
import { getAllPackages, getAllArtifacts } from '@/lib/possibilia';

// Next.js 13+ app-router sitemap. Exported as a default async function;
// Next serves the result at /sitemap.xml at build time and on
// revalidation. Search engines (Google, Bing, DuckDuckGo) crawl this
// file to discover the site's pages + decide how often to recrawl.
//
// Includes:
//   - Every static route the site exposes (build time = lastModified)
//   - Every Possibilia story under /possibilia/[slug] (publication
//     date from meta.date = lastModified — gives search engines a
//     real "new content" signal when a story drops)
//   - Every Artifact under /possibilia/artifacts/[slug] (same model)
//
// New static routes need a one-line addition to STATIC_ROUTES below.
// Dynamic Possibilia + artifact routes appear automatically as
// folders land in content/.

const SITE_URL = 'https://futureaesthetics.foundation';

// `priority` is a relative ranking hint (0.0–1.0). Search engines treat
// it loosely — homepage at 1.0, main destinations at 0.8–0.9, deep
// content at 0.6–0.7, utility pages at 0.5.
const STATIC_ROUTES: Array<{ path: string; priority: number }> = [
  { path: '/', priority: 1.0 },
  { path: '/possibilia', priority: 0.9 },
  { path: '/ours', priority: 0.9 },
  { path: '/support', priority: 0.8 },
  { path: '/contact', priority: 0.7 },
  { path: '/resources', priority: 0.6 },
  { path: '/resources/manifesto', priority: 0.6 },
  { path: '/possibilia-submissions', priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Build-time stamp for static routes. They're re-deployed when their
  // page.tsx changes, so "now" at sitemap-generation time is a good
  // proxy for "last meaningful change."
  const buildTime = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: buildTime,
      priority,
    }),
  );

  // Possibilia stories — each lives at /possibilia/[slug]. Using
  // meta.date (the canonical publication date) for lastModified gives
  // search engines a real recrawl signal when a story is added or
  // its publication date is updated.
  const packages = await getAllPackages();
  const packageEntries: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${SITE_URL}/possibilia/${pkg.slug}`,
    lastModified: new Date(pkg.date),
    priority: 0.7,
  }));

  // Artifacts from Tomorrow — same model, /possibilia/artifacts/[slug].
  const artifacts = await getAllArtifacts();
  const artifactEntries: MetadataRoute.Sitemap = artifacts.map((art) => ({
    url: `${SITE_URL}/possibilia/artifacts/${art.slug}`,
    lastModified: new Date(art.date),
    priority: 0.6,
  }));

  return [...staticEntries, ...packageEntries, ...artifactEntries];
}
