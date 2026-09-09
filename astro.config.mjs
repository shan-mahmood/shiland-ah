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
  // NOTE: the legacy urgent-care slug 301 is handled by an on-demand page
  // (src/pages/pet-urgent-care-rock-hill-fort-mill/index.astro) rather than the
  // `redirects` config — under trailingSlash:'always' the config emits a
  // no-trailing-slash matcher that the add-slash rule shadows, yielding a 404.
  build: {
    // Emit /path/index.html so trailing-slash URLs resolve as static files.
    format: 'directory',
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      // Keep noindex/utility pages out of the sitemap (/rate is the noindex
      // review collector; /reviews is public and SHOULD be indexed).
      filter: (page) =>
        !page.includes('/privacy-policy/') &&
        !page.includes('/404') &&
        !page.includes('/rate') &&
        // Legacy slug that 301s to /urgent-care/ — keep it out of the sitemap.
        !page.includes('/pet-urgent-care-rock-hill-fort-mill'),
    }),
  ],
});
