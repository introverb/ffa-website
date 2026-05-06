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
};

const withMDX = createMDX({
  // Default rehype/remark stack for now; can layer on plugins later
  // (smartypants, syntax highlighting, etc.) without changing this signature.
});

export default withMDX(nextConfig);
