import { test, expect } from '@playwright/test';
import catalog from '../../data/catalog.json';
import selection from '../../data/storefront.json';
import {
  orderCatalog,
  homeSelection,
  isApiProduct,
} from '../../src/lib/catalog-order';
import type { Product } from '../../src/lib/types';

test('owner-selected plans lead; every API offer follows the non-API catalog', () => {
  const products = catalog as Product[];
  const ordered = orderCatalog(products);
  expect(ordered.slice(0, 19).map((p) => p.id)).toEqual(
    selection.featuredProductIds
  );
  expect(new Set(ordered.map((p) => p.id)).size).toBe(products.length);
  const apiStart = ordered.findIndex(isApiProduct);
  expect(apiStart).toBeGreaterThan(19);
  expect(ordered.slice(apiStart).every(isApiProduct)).toBe(true);
  const home = homeSelection(products);
  expect(home).toHaveLength(24);
  expect(home.some(isApiProduct)).toBe(false);
});

test('homepage shows only 24 plans with exact owner-selected order and prices', async ({
  page,
}) => {
  const catalogRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/catalog/index.json'))
      catalogRequests.push(request.url());
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const cards = page.locator('.home-product-grid .product-card');
  await expect(cards).toHaveCount(24);
  await expect(page.locator('.brand').first()).toHaveText('AiToolsPk');
  for (let i = 0; i < selection.featuredProductIds.length; i++) {
    const product = catalog.find(
      (p) => p.id === selection.featuredProductIds[i]
    )!;
    await expect(cards.nth(i).locator('h3')).toHaveText(product.name);
    await expect(cards.nth(i).locator('.product-card-price strong')).toHaveText(
      `PKR ${product.price.toLocaleString('en-PK')}`
    );
  }
  await page.locator('.home-discovery').scrollIntoViewIfNeeded();
  await expect(cards).toHaveCount(24);
  expect(catalogRequests).toEqual([]);
  await expect(page.locator('.catalog-loader')).toHaveCount(0);
});

test('both discovery links work and the finder focuses usable search', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('link', { name: 'Find your next tool', exact: true })
    .click();
  await expect(page).toHaveURL(/\/tools\/\?focus=search/);
  await expect(page.locator('#catalog-search')).toBeFocused();
  await page.locator('#catalog-search').fill('Windows 11 Pro License Key');
  await expect(page.locator('.product-card').first()).toContainText(
    /Windows 11 Pro/i
  );
  await page.goto('/');
  await page.getByRole('link', { name: 'Show all tools', exact: true }).click();
  await expect(page).toHaveURL(/\/tools\/$/);
  await expect(page.locator('.result-count')).toContainText('811');
  await expect(page.locator('.product-card')).toHaveCount(24);
});

test('all featured detail links resolve and WhatsApp enquiries include the exact plan', async ({
  page,
  request,
}) => {
  await page.goto('/');
  const cards = page.locator('.home-product-grid .product-card');
  const urls = await cards
    .getByRole('link', { name: 'View Details', exact: true })
    .evaluateAll((links) =>
      links.map((a) => (a as HTMLAnchorElement).getAttribute('href')!)
    );
  for (const href of urls) expect((await request.get(href)).status()).toBe(200);
  const enquiries = cards.locator('.card-inquiry a');
  await expect(enquiries).toHaveCount(24);
  const chosen = homeSelection(catalog as Product[]);
  for (let i = 0; i < chosen.length; i++) {
    const p = chosen[i];
    const url = new URL((await enquiries.nth(i).getAttribute('href'))!);
    expect(url.hostname).toBe('wa.me');
    expect(url.pathname).toBe('/923714549245');
    const message = url.searchParams.get('text')!;
    for (const term of [
      p.name,
      p.id,
      p.duration,
      p.warranty,
      p.access,
      `PKR ${p.price.toLocaleString('en-PK')}`,
    ])
      expect(message).toContain(term);
    expect(message).toContain('confirm availability');
  }
  const popup = page.waitForEvent('popup');
  await page
    .context()
    .route('https://wa.me/**', (route) =>
      route.fulfill({ status: 200, body: 'WhatsApp navigation verified' })
    );
  await enquiries.first().click();
  const opened = await popup;
  await opened.waitForLoadState();
  expect(opened.url()).toContain('https://wa.me/923714549245?text=');
  await opened.close();
});

test('brand showcase and global keyboard search navigate to full catalog results', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('link', { name: 'Browse Canva plans', exact: true })
    .click();
  await expect(page).toHaveURL(/\/tools\/\?brand=Canva/);
  await expect(page.locator('.result-count')).toContainText('13');
  await expect(page.locator('.product-card')).toHaveCount(13);
  await page.goto('/contact/');
  await page.waitForLoadState('networkidle');
  await page.keyboard.press('Control+k');
  await expect(page.locator('#site-search')).toBeFocused();
  await page.locator('#site-search').fill('Canva');
  await page.locator('#site-search').press('Enter');
  await expect(page).toHaveURL(/\/tools\/\?q=Canva/);
  await expect(page.locator('.product-card').first()).toContainText(/Canva/i);
});

test('full catalog tabs, brand filters and last-page API offers work', async ({
  page,
}) => {
  await page.goto('/tools/');
  await expect(page.locator('.result-count')).toContainText('811');
  await page
    .getByRole('navigation', { name: 'Filter by category' })
    .getByRole('button', { name: 'Design', exact: true })
    .click();
  await expect(page).toHaveURL(/category=design/);
  await expect(page.locator('.product-card .category-mini').first()).toHaveText(
    'Design'
  );
  await page.getByRole('button', { name: 'Filter Canva', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(13);
  await page.getByRole('button', { name: 'Clear all', exact: true }).click();
  await expect(page.locator('.result-count')).toContainText('811');
  await page.getByRole('button', { name: 'Page 34', exact: true }).click();
  await expect(page).toHaveURL(/page=34/);
  await expect(page.locator('.product-card')).toHaveCount(19);
  for (const name of await page.locator('.product-card h3').allTextContents())
    expect(name).toMatch(/api/i);
});

test('advanced filters, price limits, sorting and page arrows perform their actions', async ({
  page,
}) => {
  await page.goto('/tools/');
  await expect(page.locator('.result-count')).toContainText('811');
  const filters = page.locator('.desktop-filters');
  await filters.locator('summary').click();
  const sample = catalog.find(
    (p) => p.duration === '1 month' && p.access !== 'Not specified'
  )!;
  const fields = [
    ['Durations', 'duration', sample.duration],
    ['Warranty terms', 'warranty', sample.warranty],
    ['Access types', 'access', sample.access],
    ['Review status', 'approval', 'pending'],
    ['Availability', 'stock', 'in-stock'],
  ];
  for (const [label, key, value] of fields) {
    await filters.getByLabel(label, { exact: true }).selectOption(value);
    await expect
      .poll(() => new URL(page.url()).searchParams.get(key))
      .toBe(value);
    await expect(page.locator('.result-count strong')).toHaveText(
      String(catalog.filter((p) => p[key as keyof typeof p] === value).length)
    );
    await filters
      .getByRole('button', { name: 'Reset all', exact: true })
      .click();
    await expect(page.locator('.result-count strong')).toHaveText('811');
  }
  await filters.getByLabel('Minimum price in PKR').fill('500');
  await filters.getByLabel('Maximum price in PKR').fill('2000');
  await expect(page.locator('.result-count strong')).toHaveText(
    String(catalog.filter((p) => p.price >= 500 && p.price <= 2000).length)
  );
  await page.locator('#sort').selectOption('price-desc');
  const prices = (
    await page.locator('.product-card-price strong').allTextContents()
  ).map((p) => Number(p.replace(/\D/g, '')));
  expect(prices).toEqual([...prices].sort((a, b) => b - a));
  await page.locator('#sort').selectOption('name');
  const names = await page.locator('.product-card h3').allTextContents();
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  await filters.getByRole('button', { name: 'Reset all', exact: true }).click();
  await page.getByRole('button', { name: 'Next page', exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await page
    .getByRole('button', { name: 'Previous page', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Page 1', exact: true })
  ).toHaveAttribute('aria-current', 'page');
  await expect(
    page.getByRole('button', { name: 'Previous page', exact: true })
  ).toBeDisabled();
});

test.describe('phone touch interactions', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  test('navigation, discovery and filter drawer work by touch', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open navigation' }).tap();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Close navigation' }).tap();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await page
      .getByRole('link', { name: 'Find your next tool', exact: true })
      .tap();
    await expect(page.locator('#catalog-search')).toBeFocused();
    await page.getByRole('button', { name: /Filters/ }).tap();
    const drawer = page.getByRole('dialog', { name: 'Filter tools' });
    await expect(drawer).toBeVisible();
    await drawer
      .getByLabel('Availability', { exact: true })
      .selectOption('out-of-stock');
    await drawer.getByRole('button', { name: /Show .* offers/ }).tap();
    await expect(drawer).not.toBeVisible();
    await expect(page.locator('.product-card').first()).toContainText(
      'Out of stock'
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
  });
});
