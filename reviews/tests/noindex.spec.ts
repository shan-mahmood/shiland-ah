import { test, expect } from '@playwright/test';

test('/rate serves X-Robots-Tag noindex header', async ({ request }) => {
  const res = await request.get('/rate');
  expect(res.status()).toBe(200);
  const header = res.headers()['x-robots-tag'];
  expect(header).toBeTruthy();
  expect(header).toContain('noindex');
  expect(header).toContain('nofollow');
  expect(header).toContain('noarchive');
});

test('/rate renders robots meta tag with noindex, nofollow', async ({
  page,
}) => {
  await page.goto('/rate');
  const content = await page
    .locator('meta[name="robots"]')
    .first()
    .getAttribute('content');
  expect(content).toBeTruthy();
  expect(content).toContain('noindex');
  expect(content).toContain('nofollow');
});

test('/robots.txt disallows everything', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toMatch(/user-agent:\s*\*/i);
  expect(body).toMatch(/disallow:\s*\//i);
});

test('/ redirects to /rate (302) with noindex', async ({ request }) => {
  const res = await request.get('/?s=9', { maxRedirects: 0 });
  expect(res.status()).toBe(302);
  expect(res.headers()['location']).toContain('/rate');
  expect(res.headers()['x-robots-tag']).toContain('noindex');
});
