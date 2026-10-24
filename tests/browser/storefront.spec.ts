import { test, expect } from '@playwright/test';
import catalog from '../../data/catalog.json';
import selection from '../../data/storefront.json';
import { orderCatalog, isApiProduct } from '../../src/lib/catalog-order';
import {
  groupCollections,
  collectionProducts,
  collectionSlug,
  homeCollections,
} from '../../src/lib/collections';
import type { Product } from '../../src/lib/types';

const products = (catalog as Product[]).filter((p) => p.approval !== 'excluded');
const groups = groupCollections(products);
const home = homeCollections(products);
const chatgpt = collectionProducts(products, 'chatgpt');
const api = collectionProducts(products, 'api');

test('parents partition every offer once; API, APIGPT and ZAPI stay separate from subscriptions', () => {
  const ordered = orderCatalog(products);
  expect(ordered.slice(0, 19).map((p) => p.id)).toEqual(
    selection.featuredProductIds
  );
  expect(
    ordered.slice(ordered.findIndex(isApiProduct)).every(isApiProduct)
  ).toBe(true);
  const assigned = groups.flatMap((g) =>
    collectionProducts(products, g.slug).map((p) => p.id)
  );
  expect(assigned).toHaveLength(products.length);
  expect(new Set(assigned).size).toBe(products.length);
  expect(groups.reduce((n, g) => n + g.count, 0)).toBe(products.length);
  expect(api.every(isApiProduct)).toBe(true);
  expect(
    chatgpt.every((p) => !isApiProduct(p) && p.brandSlug === 'chatgpt')
  ).toBe(true);
  expect(
    products
      .filter((p) => p.brandSlug === 'apigpt')
      .every((p) => collectionSlug(p) === 'api')
  ).toBe(true);
  expect(groups.at(-1)?.slug).toBe('api');
  expect(new Set(home.map((g) => g.slug)).size).toBe(home.length);
  for (const g of groups) {
    const plans = collectionProducts(products, g.slug);
    expect(g.count).toBe(plans.length);
    expect(g.minPrice).toBe(Math.min(...plans.map((p) => p.price)));
  }
});

test('homepage has one parent per tool, exact counts, starting prices and working collection URLs', async ({
  page,
  request,
}) => {
  const requests: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('/catalog/index.json')) requests.push(r.url());
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const cards = page.locator('.home-collection-grid .collection-card');
  await expect(cards).toHaveCount(home.length);
  await expect(page.locator('.product-card')).toHaveCount(0);
  await expect(page.locator('.brand').first()).toHaveText('AiToolsPk');
  for (let i = 0; i < home.length; i++) {
    const g = home[i];
    await expect(cards.nth(i).locator('h3')).toHaveText(g.title);
    await expect(cards.nth(i).locator('.collection-count')).toContainText(
      String(g.count)
    );
    await expect(cards.nth(i).locator('strong')).toHaveText(
      `PKR ${g.minPrice.toLocaleString('en-PK')}`
    );
    expect((await request.get(`/plans/${g.slug}/`)).status()).toBe(200);
  }
  await expect(cards.last()).toHaveAttribute('data-collection', 'api');
  expect(requests).toEqual([]);
});

test('both discovery links work; plan search opens its matching parent with the query preserved', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.featured-catalog-heading')).toContainText(
    `${products.length} plans`
  );
  await page
    .getByRole('link', { name: 'Find your next tool', exact: true })
    .click();
  await expect(page.locator('#catalog-search')).toBeFocused();
  await page.locator('#catalog-search').fill('Windows 11 Pro License Key');
  await expect(page.locator('.collection-card').first()).toContainText(
    /Microsoft/i
  );
  await page.locator('#catalog-search').press('Escape');
  await page.locator('.collection-card').first().click();
  await expect(page.locator('.product-card').first()).toContainText(
    /Windows 11 Pro/i
  );
  await page.goto('/');
  await page
    .locator('.featured-catalog-heading')
    .getByRole('link', { name: /Show all tools/ })
    .click();
  await expect(page.locator('.result-count strong')).toHaveText(
    String(products.length)
  );
  await expect(page.locator('.collection-card')).toHaveCount(24);
});

test('ChatGPT parent exposes every exact variant across pages with correct detail and WhatsApp links', async ({
  page,
  request,
}) => {
  await page.goto('/');
  await page
    .locator('.home-collection-grid [data-collection="chatgpt"]')
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'ChatGPT plans'
  );
  await expect(page.locator('.result-count strong')).toHaveText(
    String(chatgpt.length)
  );
  const seen: string[] = [];
  for (let n = 1; n <= Math.ceil(chatgpt.length / 24); n++) {
    if (n > 1)
      await page.getByRole('link', { name: `Page ${n}`, exact: true }).click();
    const cards = page.locator('.product-card');
    const slice = chatgpt.slice((n - 1) * 24, n * 24);
    await expect(cards).toHaveCount(slice.length);
    for (let i = 0; i < slice.length; i++) {
      const p = slice[i];
      await expect(cards.nth(i).locator('h3')).toHaveText(p.name);
      await expect(
        cards.nth(i).locator('.product-card-price strong')
      ).toHaveText(`PKR ${p.price.toLocaleString('en-PK')}`);
      const href = await cards
        .nth(i)
        .getByRole('link', { name: 'View Details', exact: true })
        .getAttribute('href');
      expect((await request.get(href!)).status()).toBe(200);
      const url = new URL(
        (await cards.nth(i).locator('.buy-button').getAttribute('href'))!
      );
      expect(url.hostname).toBe('wa.me');
      expect(url.pathname).toBe('/923714549245');
      for (const field of [
        p.id,
        p.name,
        p.duration,
        p.warranty,
        p.access,
        `PKR ${p.price.toLocaleString('en-PK')}`,
      ])
        expect(url.searchParams.get('text')).toContain(field);
      seen.push(p.id);
    }
  }
  expect(seen).toEqual(chatgpt.map((p) => p.id));
  const buy = page.locator('.product-card .buy-button').first();
  const style = await buy.evaluate((el) => ({
    background: getComputedStyle(el).backgroundColor,
    height: el.getBoundingClientRect().height,
  }));
  expect(style.background).toBe('rgb(17, 19, 24)');
  expect(style.height).toBeGreaterThanOrEqual(48);
  await page
    .context()
    .route('https://wa.me/**', (r) =>
      r.fulfill({ body: 'WhatsApp navigation verified' })
    );
  const popup = page.waitForEvent('popup');
  await buy.click();
  const opened = await popup;
  await opened.waitForLoadState();
  expect(opened.url()).toContain('https://wa.me/923714549245?text=');
  await opened.close();
});

test('API collection includes every API plan and allows provider search', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('.home-collection-grid [data-collection="api"]').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('API plans');
  await expect(page.locator('.result-count strong')).toHaveText(
    String(api.length)
  );
  for (let n = 1; n <= Math.ceil(api.length / 24); n++) {
    if (n > 1)
      await page.getByRole('link', { name: `Page ${n}`, exact: true }).click();
    await expect(page.locator('.product-card h3')).toHaveText(
      api.slice((n - 1) * 24, n * 24).map((p) => p.name)
    );
  }
  await page.locator('#catalog-search').fill('ZAPI');
  await page.locator('#catalog-search').press('Escape');
  await expect(page.locator('.product-card').first()).toContainText(/ZAPI/i);
  await expect(page).toHaveURL(/\/plans\/api\/\?q=ZAPI/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://aitoolspk.tech/plans/api/'
  );
});

test('price filters and sort apply before grouping and survive opening a collection', async ({
  page,
}) => {
  await page.goto('/tools/');
  await expect(page.locator('.result-count strong')).toHaveText(
    String(products.length)
  );
  const filters = page.locator('.desktop-filters');
  await filters.getByLabel('Minimum price in PKR').fill('500');
  await filters.getByLabel('Maximum price in PKR').fill('2000');
  const filtered = products.filter((p) => p.price >= 500 && p.price <= 2000);
  await expect(page.locator('.result-count strong')).toHaveText(
    String(filtered.length)
  );
  await page.locator('#sort').selectOption('price-desc');
  const prices = (
    await page.locator('.collection-card strong').allTextContents()
  ).map((p) => Number(p.replace(/\D/g, '')));
  expect(prices).toEqual([...prices].sort((a, b) => b - a));
  const first = page.locator('.collection-card').first();
  const slug = await first.getAttribute('data-collection');
  await first.click();
  await expect(page).toHaveURL(/min=500/);
  await expect(page).toHaveURL(/max=2000/);
  await expect(page.locator('.result-count strong')).toHaveText(
    String(filtered.filter((p) => collectionSlug(p) === slug).length)
  );
  await page
    .locator('.desktop-filters')
    .getByRole('button', { name: 'Reset all', exact: true })
    .click();
  await expect(page.locator('.result-count strong')).toHaveText(
    String(collectionProducts(products, slug!).length)
  );
});

test('brand showcase opens all Canva plans and global keyboard search returns parent matches', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('link', { name: 'Browse Canva plans', exact: true })
    .click();
  await expect(page).toHaveURL(/\/plans\/canva\//);
  await expect(page.locator('.result-count strong')).toHaveText(
    String(collectionProducts(products, 'canva').length)
  );
  await page.goto('/contact/');
  await page.waitForLoadState('networkidle');
  await page.keyboard.press('Control+k');
  await page.locator('#site-search').fill('Canva');
  await page.locator('#site-search').press('Enter');
  await expect(page.locator('[data-collection="canva"]')).toBeVisible();
});

test.describe('phone touch flow', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  test('mobile navigation, parent cards, filter drawer and restock action work', async ({
    page,
  }) => {
    const out = { ...chatgpt[0], stock: 'out-of-stock', approval: 'pending' };
    await page.route('**/catalog/index.json', (r) =>
      r.fulfill({ json: [out] })
    );
    await page.goto('/');
    await page.getByRole('button', { name: 'Open navigation' }).tap();
    await page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'All tools', exact: true })
      .tap();
    await expect(page).toHaveURL(/\/tools\/$/);
    await page.locator('[data-collection="chatgpt"]').tap();
    await page.getByRole('button', { name: /Filters/ }).tap();
    const drawer = page.getByRole('dialog', { name: 'Filter tools' });
    await drawer
      .getByLabel('Availability', { exact: true })
      .selectOption('out-of-stock');
    await drawer.getByRole('button', { name: /Show .* offers/ }).tap();
    await expect(page.locator('.product-card')).toContainText('Out of stock');
    await page
      .context()
      .route('https://wa.me/**', (r) =>
        r.fulfill({ body: 'WhatsApp touch verified' })
      );
    const popup = page.waitForEvent('popup');
    await page.locator('.product-card .buy-button').tap();
    const opened = await popup;
    await opened.waitForLoadState();
    expect(opened.url()).toContain(
      'please%20let%20me%20know%20about%20restock'
    );
    await opened.close();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
  });
});

test.describe('native links without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('parent opens plan list and server-rendered Buy Now opens WhatsApp', async ({
    page,
  }) => {
    await page.goto('/');
    await page.locator('[data-collection="chatgpt"]').click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'ChatGPT plans'
    );
    const buy = page.locator('.product-card .buy-button').first();
    await expect(buy).toHaveAttribute(
      'href',
      /please%20confirm%20availability/
    );
    await page
      .context()
      .route('https://wa.me/**', (r) =>
        r.fulfill({ body: 'Native link verified' })
      );
    const popup = page.waitForEvent('popup');
    await buy.click();
    const opened = await popup;
    await opened.waitForLoadState();
    expect(opened.url()).toContain('https://wa.me/923714549245?text=');
    await opened.close();
  });
});
