import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import catalog from '../../data/catalog.json';
import { collectionSlug } from '../../src/lib/collections';
import type { Product } from '../../src/lib/types';
test('approved offers have exact order links and expire without a redeploy', async ({
  page,
}) => {
  const product: Product = {
    ...(catalog[1] as Product),
    approval: 'approved',
    purchasable: true,
    stock: 'in-stock',
    date: '2026-10-19',
  };
  await page.clock.install({ time: new Date('2026-10-20T00:00:00+05:00') });
  await page.route('**/catalog/index.json', (route) =>
    route.fulfill({ json: [product] })
  );
  await page.goto(`/plans/${collectionSlug(product)}/?sort=relevance`);
  const buy = page.getByRole('link', {
    name: `Buy Now: ${product.name}`,
    exact: true,
  });
  await expect(buy).toBeVisible();
  await expect(
    page.locator('.product-card').filter({ has: buy }).locator('.stock-badge')
  ).toHaveText('Available');
  await expect(buy).toHaveAttribute('href', /I%20want%20to%20order/);
  const link = new URL((await buy.getAttribute('href')) as string);
  expect(link.hostname).toBe('wa.me');
  expect(link.pathname).toBe('/923714549245');
  for (const term of [
    product.name,
    product.id,
    product.duration,
    product.warranty,
    product.access,
  ])
    expect(link.searchParams.get('text')).toContain(term);
  await page.clock.setSystemTime(new Date('2026-10-28T00:00:00+05:00'));
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(buy).toHaveAttribute('href', /please%20confirm%20availability/);
  await expect(page.locator('.product-card')).toContainText(
    'Quote needs refresh'
  );
});
test('homepage, details and rendered UI produce no console errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'How to order' })
    .hover();
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'AI tools & subscriptions.'
  );
  await expect(page.locator('.collection-card').first()).toBeVisible();
  await page.locator('.collection-card').first().click();
  await page
    .getByRole('link', { name: 'View Details', exact: true })
    .first()
    .click();
  await expect(page.locator('.detail-summary h1')).toBeVisible();
  await expect(page.locator('.detail-action .buy-button')).toHaveAttribute(
    'href',
    /^https:\/\/wa\.me\/923714549245\?text=/
  );
  const inquiry = page.locator('.detail-action').getByRole('link', {
    name: /Confirm availability on WhatsApp/,
  });
  await expect(inquiry).toHaveAttribute(
    'href',
    /^https:\/\/wa\.me\/923714549245\?text=/
  );
  expect(errors).toEqual([]);
});
test('search, fuzzy matching, filters, pagination and URL persistence', async ({
  page,
}) => {
  await page.goto('/tools/?q=chatgpt');
  await expect(page.getByRole('status')).toContainText('plans');
  await expect(page.getByRole('status')).not.toContainText('Loading');
  await expect(page.locator('.collection-card').first()).toContainText(
    /chatgpt/i
  );
  await page.locator('#catalog-search').fill('cluade');
  await expect(page.locator('.collection-card').first()).toContainText(
    /claude/i
  );
  await page.locator('#catalog-search').fill('');
  await page.locator('#sort').selectOption('price-asc');
  await expect(page).toHaveURL(/sort=price-asc/);
  const values = await page
    .locator('.collection-card strong')
    .allTextContents();
  expect(values.map((v) => Number(v.replace(/[^\d]/g, '')))).toEqual(
    values.map((v) => Number(v.replace(/[^\d]/g, ''))).sort((a, b) => a - b)
  );
  await page.locator('#catalog-search').fill('zzqnonexistentproduct');
  await expect(page.getByText('No tools found.')).toBeVisible();
  await page.getByRole('button', { name: 'Clear all filters' }).click();
  await expect(page.locator('.collection-card')).toHaveCount(24);
  await page.getByRole('link', { name: 'Page 2', exact: true }).click();
  await expect(page).toHaveURL(/\/page\/2\//);
  await page.reload();
  await expect(
    page.getByRole('link', { name: 'Page 2', exact: true })
  ).toHaveAttribute('aria-current', 'page');
});
test('navigation and mobile filter dialogs support keyboard close', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('button', { name: 'Open navigation' })
  ).toBeFocused();
  await page.goto('/tools/');
  await page.getByRole('button', { name: /Filters/ }).click();
  await expect(
    page.getByRole('dialog', { name: 'Filter tools' })
  ).toBeVisible();
  await page
    .getByRole('dialog')
    .getByLabel('Availability', { exact: true })
    .selectOption('in-stock');
  await page.getByRole('button', { name: /Show .* offers/ }).click();
  await page.locator('.collection-card').first().click();
  await expect(page.locator('.product-card').first()).toContainText(
    'Available'
  );
});
for (const width of [320, 375, 390, 600, 768, 820, 1024, 1280, 1440]) {
  test(`responsive layout ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const parent = page
      .locator('.home-collection-grid .collection-card')
      .first();
    await expect(parent).toBeVisible();
    expect((await parent.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true);
    await page.screenshot({
      path: `reports/home-${width}.png`,
      fullPage: true,
    });
    await page.goto('/tools/');
    await expect(page.locator('.collection-card').first()).toBeVisible();
    if (width === 390) {
      const mobileAccessibility = await new AxeBuilder({ page })
        .withRules(['select-name', 'heading-order'])
        .analyze();
      expect(mobileAccessibility.violations).toEqual([]);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true);
    await page.goto('/plans/chatgpt/');
    await expect(page.locator('.product-card').first()).toBeVisible();
    const actions = page.locator('.product-card .product-buttons').first();
    const details = await actions
      .getByRole('link', { name: 'View Details', exact: true })
      .boundingBox();
    expect(details?.height).toBeGreaterThanOrEqual(width <= 600 ? 44 : 38);
    expect(details?.width).toBeGreaterThanOrEqual(44);
    expect(
      (await actions.locator('.buy-button').boundingBox())?.height
    ).toBeGreaterThanOrEqual(48);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
  });
}
test('homepage, catalog, policy and details pass automated WCAG AA checks', async ({
  page,
}) => {
  for (const url of [
    '/',
    '/tools/',
    '/plans/chatgpt/',
    '/plans/api/',
    '/privacy-policy/',
  ]) {
    await page.goto(url);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(results.violations, null, 2)
    ).toEqual([]);
  }
  await page.goto('/plans/chatgpt/');
  const productName = (
    await page.locator('.product-card h3').first().innerText()
  ).trim();
  await page
    .getByRole('link', { name: 'View Details', exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/tool\/[^/]+\/$/);
  await expect.poll(() => page.title()).toContain(productName);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    results.violations,
    JSON.stringify(results.violations, null, 2)
  ).toEqual([]);
});
