import { MetadataRoute } from 'next';
import { getPackageSlugs, getArtifactSlugs } from '@/lib/possibilia';

// Next.js 13+ app-router sitemap. Exported as a default async function;
// Next serves the result at /sitemap.xml at build time and on
// revalidation. Search engines (Google, Bing, DuckDuckGo) crawl this
// file to discover the site's pages.
//
// Includes:
//   - Every static route the site exposes
//   - Every Possibilia story under /possibilia/[slug] (auto-discovered
//     from content/possibilia/)
//   - Every Artifact under /possibilia/artifacts/[slug] (auto-discovered
//     from content/artifacts/)
//
// New static routes need a one-line addition to STATIC_ROUTES below.
// Dynamic Possibilia + artifact routes appear automatically as folders
// land in content/.

const SITE_URL = 'https://www.futureaesthetics.foundation';

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
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      priority,
    }),
  );

  // Possibilia stories — each lives at /possibilia/[slug].
  const packageSlugs = await getPackageSlugs();
  const packageEntries: MetadataRoute.Sitemap = packageSlugs.map((slug) => ({
    url: `${SITE_URL}/possibilia/${slug}`,
    lastModified,
    priority: 0.7,
  }));

  // Artifacts from Tomorrow — each lives at /possibilia/artifacts/[slug].
  const artifactSlugs = await getArtifactSlugs();
  const artifactEntries: MetadataRoute.Sitemap = artifactSlugs.map((slug) => ({
    url: `${SITE_URL}/possibilia/artifacts/${slug}`,
    lastModified,
    priority: 0.6,
  }));

  return [...staticEntries, ...packageEntries, ...artifactEntries];
}
