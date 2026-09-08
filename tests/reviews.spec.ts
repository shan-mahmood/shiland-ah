import { test, expect } from '@playwright/test';

const GOOGLE_URL = 'https://g.page/r/CUS6xCaiNJfsEBM/review';
const YELP_URL =
  'https://www.yelp.com/writeareview/biz/HgbmSUfm2jFgBkkU_ToULw?return_url=%2Fbiz%2FHgbmSUfm2jFgBkkU_ToULw&review_origin=biz-details-war-button';

test('/reviews/ renders the noindex robots meta', async ({ page }) => {
  await page.goto('/reviews/');
  const content = await page
    .locator('meta[name="robots"]')
    .first()
    .getAttribute('content');
  expect(content).toContain('noindex');
  expect(content).toContain('nofollow');
  expect(content).toContain('noarchive');
});

test('score 9 → review state with correct Google + Yelp hrefs', async ({ page }) => {
  await page.goto('/reviews/?fn=Sam&pet=Bella');
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
  await page.goto('/reviews/?s=8&fn=Sam');
  await expect(
    page.getByRole('heading', { name: 'Thank you — that means a lot.' })
  ).toBeVisible();
});

test('?s=7 → feedback state with rating pill + private note', async ({ page }) => {
  await page.goto('/reviews/?s=7&fn=Sam&pet=Bella');
  await expect(
    page.getByRole('heading', { name: "We'd like to make this right." })
  ).toBeVisible();
  await expect(page.getByText('You rated us 7/10')).toBeVisible();
  await expect(
    page.getByText('This goes to our team only — it is not posted publicly.')
  ).toBeVisible();
});

test('personalizes copy from fn + pet', async ({ page }) => {
  await page.goto('/reviews/?fn=Sam&pet=Bella');
  await expect(page.getByRole('heading', { name: 'How did we do, Sam?' })).toBeVisible();
  await expect(page.getByText("based on Bella's visit?")).toBeVisible();
});

test('empty / too-short feedback shows an error and stays on the form', async ({ page }) => {
  await page.goto('/reviews/?s=3&cid=abc123');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByText('Please add a few words')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: "We'd like to make this right." })
  ).toBeVisible();
});

test('feedback submit → thank-you with clinic phone', async ({ page }) => {
  await page.goto('/reviews/?s=4&cid=abc123');
  await page
    .getByPlaceholder('What could we have done better?')
    .fill('The wait was too long and nobody updated us.');
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(
    page.getByRole('heading', { name: 'Thank you — we hear you.' })
  ).toBeVisible();
  await expect(page.getByRole('link', { name: '(803) 752-4950' })).toHaveAttribute(
    'href',
    'tel:+18037524950'
  );
});

test('contact field shows only when cid + email are both absent', async ({ page }) => {
  await page.goto('/reviews/?s=5');
  await expect(page.getByLabel('Best way to reach you (optional)')).toBeVisible();

  await page.goto('/reviews/?s=5&cid=abc123');
  await expect(page.getByLabel('Best way to reach you (optional)')).toBeHidden();
});

test('Continue is disabled until a score is picked', async ({ page }) => {
  await page.goto('/reviews/');
  const cont = page.getByRole('button', { name: 'Continue' });
  await expect(cont).toBeDisabled();
  await page.getByRole('button', { name: 'Score 6' }).click();
  await expect(cont).toBeEnabled();
});
