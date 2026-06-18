import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Skip the built-in image optimizer. Sources in public/images/ are
    // already pre-sized (~2000px max, mozjpeg q82) by scripts/optimize-images.mjs.
    // Railway's containers don't persist the optimizer's on-disk cache between
    // deploys / cold starts, so every fresh container re-runs the transform
    // for each requested variant - slow for no payoff on already-web-ready files.
    // If you ever drop in an unoptimized hero, run the script before committing.
    unoptimized: true,
  },
  reactStrictMode: true,
  // .mdx files are content (rendered via dynamic imports inside routes), not
  // routes themselves - so we don't add 'mdx' to pageExtensions. The MDX
  // plugin still lets webpack resolve and compile .mdx imports.
  // Clean URL for the OURS sponsorship brief — served as a static
  // HTML file from /public, but exposed at /ours/sponsor-brief
  // (no .html suffix) so the URL is shareable as-is. The brief is a
  // standalone document with its own typographic system (Saira + Barlow
  // + DM Mono via Google Fonts) and bespoke layout (corner marks,
  // print styles, full-bleed banner), so it lives outside the Next.js
  // PageFrame rather than wrapped in it.
  async rewrites() {
    return [
      {
        source: '/ours/sponsor-brief',
        destination: '/ours-sponsor-brief.html',
      },
      // Same pattern as the sponsor brief — standalone static HTML in
      // /public surfaced at a clean URL so the artist brief can be
      // texted/shared as-is. Lives outside the Next.js PageFrame
      // because it has its own typographic system + bespoke layout.
      {
        source: '/ours/artist-brief',
        destination: '/ours-artist-brief.html',
      },
      // Patron briefs — same rewrite pattern as the OURS briefs.
      // Two siblings under /patrons/: the private path (individual
      // donors, $1k+, two CTAs — start the conversation + give now)
      // and the corporate path ($5k+, single conversation CTA).
      // Each is a standalone static HTML doc in /public, surfaced
      // at a clean shareable URL.
      {
        source: '/patrons/private',
        destination: '/patrons-private.html',
      },
      {
        source: '/patrons/corporate',
        destination: '/patrons-corporate.html',
      },
    ];
  },
  async redirects() {
    return [
      // Canonical-domain redirect: send all www traffic to the bare
      // apex domain with a permanent (308) redirect, so search engines
      // and visitors consolidate on one host. Pairs with SITE_URL
      // (bare) used across metadata, sitemap, robots, and schema. Both
      // hosts already route to this app on Railway, so this rewrite is
      // what actually performs the consolidation.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.futureaesthetics.foundation' }],
        destination: 'https://futureaesthetics.foundation/:path*',
        permanent: true,
      },
      // The /resources/[slug] dynamic route was a placeholder shell that
      // shipped dev-facing copy if anyone hit it. Removed in this commit;
      // permanent redirect catches the only valid slug ("submit-to-possibilia")
      // in case it's been indexed or shared externally.
      {
        source: '/resources/submit-to-possibilia',
        destination: '/possibilia-submissions',
        permanent: true,
      },
      // /partnerships was merged into /support — Refer, Give, Partner,
      // and Other Ways now live on one page. The #partner anchor lands
      // visitors on the sponsorship section that used to be the whole
      // /partnerships page.
      {
        source: '/partnerships',
        destination: '/support#partner',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  // Default rehype/remark stack for now; can layer on plugins later
  // (smartypants, syntax highlighting, etc.) without changing this signature.
});

export default withMDX(nextConfig);
