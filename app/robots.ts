import { MetadataRoute } from 'next';

// Next.js 13+ app-router robots.txt. Served at /robots.txt.
// Allows all crawlers across the entire site; points them at the
// sitemap so they can discover every page including dynamic
// Possibilia stories + artifacts.
//
// If we ever need to keep specific routes out of search indexes
// (e.g. a thank-you page that shouldn't get indexed in its own
// right), add a `disallow` entry here.

const SITE_URL = 'https://futureaesthetics.foundation';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
