import { test, expect } from '@playwright/test';

const GOOGLE_URL = 'https://g.page/r/CUS6xCaiNJfsEBM/review';
const YELP_URL =
  'https://www.yelp.com/writeareview/biz/HgbmSUfm2jFgBkkU_ToULw?return_url=%2Fbiz%2FHgbmSUfm2jFgBkkU_ToULw&review_origin=biz-details-war-button';

test('score 9 → review state with correct Google href', async ({ page }) => {
  await page.goto('/rate?fn=Sam&pet=Bella');

  // Manual pick + Continue.
  await page.getByRole('button', { name: 'Score 9' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(
    page.getByRole('heading', { name: 'Thank you — that means a lot.' })
  ).toBeVisible();

  const google = page.getByRole('link', { name: 'Leave a Google review' });
  await expect(google).toHaveAttribute('href', GOOGLE_URL);
  await expect(google).toHaveAttribute('target', '_blank');
  const yelp = page.getByRole('link', { name: 'Leave a Yelp review' });
  await expect(yelp).toHaveAttribute('href', YELP_URL);
  await expect(yelp).toHaveAttribute('target', '_blank');
});

test('?s=8 → review state (promoter boundary)', async ({ page }) => {
  await page.goto('/rate?s=8&fn=Sam');
  await expect(
    page.getByRole('heading', { name: 'Thank you — that means a lot.' })
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Leave a Google review' })
  ).toHaveAttribute('href', GOOGLE_URL);
});

test('?s=7 → feedback state with rating pill', async ({ page }) => {
  await page.goto('/rate?s=7&fn=Sam&pet=Bella');
  await expect(
    page.getByRole('heading', { name: "We'd like to make this right." })
  ).toBeVisible();
  await expect(page.getByText('You rated us 7/10')).toBeVisible();
  await expect(
    page.getByText('This goes to our team only — it is not posted publicly.')
  ).toBeVisible();
});

test('empty / too-short feedback shows an error', async ({ page }) => {
  await page.goto('/rate?s=3&cid=abc123');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByText('Please add a few words')).toBeVisible();
  // Still on the feedback form, not the thank-you.
  await expect(
    page.getByRole('heading', { name: "We'd like to make this right." })
  ).toBeVisible();
});

test('feedback submit → thank-you with clinic phone', async ({ page }) => {
  await page.goto('/rate?s=4&cid=abc123');
  await page
    .getByPlaceholder('What could we have done better?')
    .fill('The wait was too long and nobody updated us.');
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(
    page.getByRole('heading', { name: 'Thank you — we hear you.' })
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: '(803) 752-4950' })
  ).toHaveAttribute('href', 'tel:+18037524950');
});

test('feedback shows contact input only when cid+email absent', async ({
  page,
}) => {
  await page.goto('/rate?s=5');
  await expect(page.getByLabel('Best way to reach you (optional)')).toBeVisible();

  await page.goto('/rate?s=5&cid=abc123');
  await expect(
    page.getByLabel('Best way to reach you (optional)')
  ).toHaveCount(0);
});

test('/api/event rejects invalid score', async ({ request }) => {
  const res = await request.post('/api/event', {
    data: { event: 'score', score: 11, bucket: 'promoter' },
  });
  expect(res.status()).toBe(400);
  const json = await res.json();
  expect(json.error).toBe('invalid_score');
});

test('/api/event rejects invalid event', async ({ request }) => {
  const res = await request.post('/api/event', {
    data: { event: 'bogus', score: 9 },
  });
  expect(res.status()).toBe(400);
  expect((await res.json()).error).toBe('invalid_event');
});

test('/api/event accepts a valid score event', async ({ request }) => {
  const res = await request.post('/api/event', {
    data: { event: 'score', score: 9, bucket: 'promoter', cid: 'x' },
  });
  expect(res.status()).toBe(200);
  expect((await res.json()).ok).toBe(true);
});
