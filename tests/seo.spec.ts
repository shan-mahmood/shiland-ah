import { test, expect } from '@playwright/test';

test('/services/ is indexable with one H1 and self-canonical', async ({ page, request }) => {
  await page.goto('/services/');
  await expect(page.locator('h1')).toHaveCount(1);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical).toContain('/services/');
  // Not noindexed.
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  const res = await request.get('/services/');
  expect(res.headers()['x-robots-tag']).toBeFalsy();
});

test('public /reviews/ is indexable (no noindex) with testimonials', async ({ page }) => {
  await page.goto('/reviews/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  await expect(page.getByText('Google review').first()).toBeVisible();
});

test('/urgent-care/ shows hours and links to contact + emergency', async ({ page }) => {
  await page.goto('/urgent-care/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Open 7 days a week' })).toBeVisible();
  await expect(page.locator('a[href="/contact-us/"]').first()).toBeVisible();
  await expect(
    page.locator('a[href="/pet-emergency-care-rock-hill-fort-mill/"]').first()
  ).toBeVisible();
});

test('emergency page has hours + after-hours note and no 24/7 claim', async ({ page }) => {
  await page.goto('/pet-emergency-care-rock-hill-fort-mill/');
  await expect(page.getByRole('heading', { name: 'After hours' })).toBeVisible();
  await expect(page.getByText('not a 24-hour hospital')).toBeVisible();
  await expect(page.locator('a[href="/urgent-care/"]').first()).toBeVisible();
  const body = (await page.locator('body').innerText()).toLowerCase();
  expect(body).not.toContain('24/7');
  expect(body).not.toContain('open 24 hours');
});

test('legacy urgent-care slug 301s to /urgent-care/', async ({ request }) => {
  const res = await request.get('/pet-urgent-care-rock-hill-fort-mill/', {
    maxRedirects: 0,
  });
  expect(res.status()).toBe(301);
  expect(res.headers()['location']).toContain('/urgent-care/');
});

test('Wednesday is open (no "Closed" in footer hours)', async ({ page }) => {
  await page.goto('/services/');
  const footHours = await page.locator('.foot-hours').innerText();
  expect(footHours).toContain('8 AM – 7 PM');
  expect(footHours).not.toContain('Closed');
});

test('no fragment nav links remain on the homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href="/#services"]')).toHaveCount(0);
  await expect(page.locator('a[href="/#reviews"]')).toHaveCount(0);
  await expect(page.locator('header a[href="/services/"]')).toBeVisible();
  await expect(page.locator('header a[href="/reviews/"]')).toBeVisible();
});

test('robots.txt disallows /rate, not /reviews', async ({ request }) => {
  const res = await request.get('/robots.txt');
  const body = await res.text();
  expect(body).toMatch(/disallow:\s*\/rate/i);
  expect(body).not.toMatch(/disallow:\s*\/reviews/i);
});
