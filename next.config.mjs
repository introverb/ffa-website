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
      // Possibilia Issue 0 pre-order interstitial — same standalone
      // static-HTML pattern as the briefs above. Walks a buyer through
      // Artizen's Rewards section (screenshot + 3 steps + the "the big
      // support bar mints an artifact, not the magazine" warning)
      // before handing off to the real Artizen checkout. /q/mag (the
      // program's presale QR, p17 + p45) now points here instead of
      // straight to Artizen — see the redirect below.
      {
        source: '/preorder',
        destination: '/preorder.html',
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
      // OURS program QRs — printed Aug 2026, do not delete slugs.
      // Each /q/* short path is baked into a QR code in the printed
      // OURS program (22mm codes; short paths keep scan density low).
      // Destinations are intentionally editable: statusCode 302 (not
      // permanent/308, not 307) so browsers never cache the hop and
      // targets can be repointed after print. Next.js's default
      // trailing-slash normalization means /q/give/ also resolves.
      // ─────────────────────────────────────────────────────────────
      // Donate — same destination as the support page's "Give in USD"
      // button (every.org checkout).
      {
        source: '/q/give',
        destination: 'https://www.every.org/foundation-for-future-aesthetics/donate',
        statusCode: 302,
      },
      // Possibilia Issue 0 pre-order (program p17 + p45). Routes through
      // the /preorder interstitial (screenshot + steps + the "artifact
      // vs. magazine" warning) rather than straight to Artizen — buyers
      // land there first and the page's own button makes the final hop.
      {
        source: '/q/mag',
        destination: '/preorder',
        statusCode: 302,
      },
      // Sponsor credit, program p18.
      {
        source: '/q/medici',
        destination: 'https://medicimag.com',
        statusCode: 302,
      },
      // Sponsor credit, program p19.
      {
        source: '/q/leverage',
        destination: 'https://leverage.institute',
        statusCode: 302,
      },
      // OURS artwork storefront (live sales page).
      {
        source: '/q/collect',
        destination: '/ours/collect',
        statusCode: 302,
      },
      // Ledgerworks (née "Web3 Wall") — lands on the Ledgerworks
      // section at the bottom of the storefront page. Source path is
      // unchanged: it's printed on physical QR codes in the OURS
      // program, so it can't be renamed even though the on-page
      // section it points to now goes by a different name.
      {
        source: '/q/web3',
        destination: '/ours/collect#ledgerworks',
        statusCode: 302,
      },
      // The short-lived standalone /ours/web3 placeholder route was
      // folded into the storefront page (Jul 2026); catch anyone who
      // saved the old URL. Source kept as the old name for the same
      // reason as /q/web3 above — it's what old links actually point to.
      {
        source: '/ours/web3',
        destination: '/ours/collect#ledgerworks',
        statusCode: 302,
      },
      // Private-patron brief (the individual-donor path from the
      // support page's Patronage cards).
      {
        source: '/q/patron',
        destination: '/patrons/private',
        statusCode: 302,
      },
      // Individual Ledgerworks pieces — QR placards next to each piece
      // on the exhibition wall. The three FFA/Stripe (or ETH) pieces
      // deep-link straight to their modal on the storefront page
      // (?piece=<id>, opened automatically — see LedgerworksSection).
      // Recycle Group and Nahuel Aquiles are fulfilled externally, so
      // their placards skip the modal and go straight to the outside
      // listing (their gallery / genpi.org) instead.
      {
        source: '/q/pope',
        destination: '/ours/collect?piece=mauricio-pommella-the-pope',
        statusCode: 302,
      },
      {
        source: '/q/solara',
        destination: '/ours/collect?piece=yura-miron-solara-plaza',
        statusCode: 302,
      },
      {
        source: '/q/anjola',
        destination: '/ours/collect?piece=anjoladave-an-ending-a-beginning',
        statusCode: 302,
      },
      {
        source: '/q/recycle',
        destination: 'https://bit.ly/forest-of-expired-links',
        statusCode: 302,
      },
      {
        source: '/q/nahuel',
        destination: 'https://genpi.org',
        statusCode: 302,
      },
      // OURS sponsorship brief (linked from the sponsor section on
      // /support).
      {
        source: '/q/sponsor',
        destination: '/ours/sponsor-brief',
        statusCode: 302,
      },
      // Afterparty — shell page for now; fill in details (or repoint)
      // once the afterparty plan is set.
      {
        source: '/q/after',
        destination: '/ours/after',
        statusCode: 302,
      },
    ];
  },
};

const withMDX = createMDX({
  // Default rehype/remark stack for now; can layer on plugins later
  // (smartypants, syntax highlighting, etc.) without changing this signature.
});

export default withMDX(nextConfig);
