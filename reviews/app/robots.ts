import type { MetadataRoute } from 'next';

// /robots.txt — disallow everything. No sitemap is referenced.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
  };
}
