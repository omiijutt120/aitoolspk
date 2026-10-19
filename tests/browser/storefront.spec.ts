import { test, expect } from '@playwright/test';

test('the homepage contains the full catalog without a browse gate', async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto('/');
  await expect(page.locator('.result-count')).toContainText('811');
  await expect(
    page.getByRole('link', { name: 'Find your next tool', exact: true })
  ).toHaveCount(0);
  await expect(
    page.getByRole('navigation', { name: 'Catalog pages' })
  ).toHaveCount(0);
  await expect(page.locator('.product-card')).toHaveCount(32);
  expect(
    await page.locator('.product-card .product-logo img').count()
  ).toBeGreaterThan(25);
  let previous = 32;
  while (previous < 811) {
    await page.locator('.catalog-loader').scrollIntoViewIfNeeded();
    await expect
      .poll(() => page.locator('.product-card').count())
      .toBeGreaterThan(previous);
    previous = await page.locator('.product-card').count();
  }
  await expect(page.locator('.product-card')).toHaveCount(811);
  expect(new URL(page.url()).pathname).toBe('/');
  await expect(page.locator('.catalog-loader')).toContainText('all 811 offers');
});

test('homepage category and brand controls filter in place', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Filter by category' })
    .getByRole('button', { name: 'Design', exact: true })
    .click();
  await expect(page).toHaveURL(/category=design/);
  await expect(page.locator('.product-card .category-mini').first()).toHaveText(
    'Design'
  );
  await page.getByRole('button', { name: 'Filter Canva', exact: true }).click();
  await expect(page).toHaveURL(/brand=Canva/);
  const cards = page.locator('.product-card');
  await expect(cards).toHaveCount(13);
  for (const text of await cards
    .locator('.product-identity>span')
    .allTextContents())
    expect(text).toBe('Canva');
  await page.getByRole('button', { name: 'Clear all', exact: true }).click();
  await expect(page.locator('.result-count')).toContainText('811');
  await page.locator('#catalog-search').fill('Windows 11 Pro License Key');
  await expect(page.locator('.product-card').first()).toContainText(
    /Windows 11 Pro/i
  );
  expect(new URL(page.url()).pathname).toBe('/');
});

test('global search and keyboard shortcut lead to homepage results', async ({
  page,
}) => {
  await page.goto('/contact/');
  await page.keyboard.press('Control+k');
  await expect(page.locator('#site-search')).toBeFocused();
  await page.locator('#site-search').fill('Canva');
  await page.locator('#site-search').press('Enter');
  await expect(page).toHaveURL(/\/\?q=Canva/);
  await expect(page.locator('.product-card').first()).toContainText(/Canva/i);
});

test('the logo showcase applies its brand filter without a route change', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('link', { name: 'Browse Canva plans', exact: true })
    .click();
  await expect(page.locator('.result-count')).toContainText('13');
  await expect(page.locator('.product-card')).toHaveCount(13);
  expect(new URL(page.url()).pathname).toBe('/');
});
