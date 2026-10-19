import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import catalog from '../../data/catalog.json';
test('approved offers have exact order links and expire without a redeploy', async ({
  page,
}) => {
  const product = {
    ...catalog[1],
    approval: 'approved',
    purchasable: true,
    stock: 'in-stock',
    date: '2026-10-19',
  };
  await page.clock.install({ time: new Date('2026-10-20T00:00:00+05:00') });
  await page.route('**/catalog/index.json', (route) =>
    route.fulfill({ json: [product] })
  );
  await page.goto('/tools/');
  const buy = page.getByRole('link', {
    name: `Buy Now: ${product.name}`,
    exact: true,
  });
  await expect(buy).toBeVisible();
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
  await expect(
    page.getByRole('button', {
      name: `Buy Now unavailable: ${product.name}`,
      exact: true,
    })
  ).toBeDisabled();
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
    'Find the right AI tools'
  );
  await expect(
    page.getByRole('link', { name: 'View Details', exact: true }).first()
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'View Details', exact: true })
    .first()
    .click();
  await expect(page.locator('.detail-summary h1')).toBeVisible();
  await expect(page.locator('.detail-action .buy-button')).toBeDisabled();
  const inquiry = page.getByRole('link', {
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
  await expect(page.getByRole('status')).toContainText('offers');
  await expect(page.getByRole('status')).not.toContainText('Loading');
  await expect(page.locator('.product-card').first()).toContainText(/chatgpt/i);
  await page.locator('#catalog-search').fill('cluade');
  await expect(page.locator('.product-card').first()).toContainText(/claude/i);
  await page.locator('#catalog-search').fill('');
  await page.locator('#sort').selectOption('price-asc');
  await expect(page).toHaveURL(/sort=price-asc/);
  const values = await page
    .locator('.product-card-price strong')
    .allTextContents();
  expect(values.map((v) => Number(v.replace(/[^\d]/g, '')))).toEqual(
    values.map((v) => Number(v.replace(/[^\d]/g, ''))).sort((a, b) => a - b)
  );
  await page.locator('#catalog-search').fill('zzqnonexistentproduct');
  await expect(page.getByText('No tools found.')).toBeVisible();
  await page.getByRole('button', { name: 'Clear all filters' }).click();
  await expect(page.locator('.product-card')).toHaveCount(24);
  await page.getByRole('button', { name: 'Page 2', exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Page 2', exact: true })
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
    .selectOption('out-of-stock');
  await page.getByRole('button', { name: /Show .* offers/ }).click();
  await expect(page.locator('.product-card').first()).toContainText(
    'Out of stock'
  );
});
for (const width of [375, 390, 768, 1024, 1440]) {
  test(`responsive layout ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
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
    await expect(page.locator('.product-card').first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true);
  });
}
test('homepage, catalog, policy and details pass automated WCAG AA checks', async ({
  page,
}) => {
  for (const url of ['/', '/tools/', '/privacy-policy/']) {
    await page.goto(url);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(results.violations, null, 2)
    ).toEqual([]);
  }
  await page.goto('/');
  await page
    .getByRole('link', { name: 'View Details', exact: true })
    .first()
    .click();
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    results.violations,
    JSON.stringify(results.violations, null, 2)
  ).toEqual([]);
});
