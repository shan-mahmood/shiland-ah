/** @type {import('next').NextConfig} */
const NOINDEX = 'noindex, nofollow, noarchive';

const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  // This app is a subfolder alongside the main site's lockfile; pin the trace
  // root so Next doesn't infer the parent Astro project as the workspace root.
  outputFileTracingRoot: path.join(__dirname),
  // Belt-and-suspenders: emit X-Robots-Tag on EVERY route so nothing served
  // from this project can ever be indexed. Mirrored in vercel.json.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: NOINDEX }],
      },
    ];
  },
};

module.exports = nextConfig;
