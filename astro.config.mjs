// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Canonical production origin. Update if the domain changes at cutover.
const SITE = 'https://shilandah.com';

export default defineConfig({
  site: SITE,
  // Every legacy URL ends in a trailing slash — preserve exactly for SEO.
  trailingSlash: 'always',
  // Site is static by default; the adapter lets individual routes opt into
  // on-demand rendering via `export const prerender = false` — used only by the
  // /api/event webhook proxy that keeps the GHL URLs server-side.
  output: 'static',
  adapter: vercel(),
  build: {
    // Emit /path/index.html so trailing-slash URLs resolve as static files.
    format: 'directory',
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      // Keep noindex/utility pages out of the sitemap.
      filter: (page) =>
        !page.includes('/privacy-policy/') &&
        !page.includes('/404') &&
        !page.includes('/reviews'),
    }),
  ],
});
