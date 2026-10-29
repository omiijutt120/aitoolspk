import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [390, 1280]) {
  test(`ChatGPT buyer clarity and metadata at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/plans/chatgpt/');
    const disclosure = page.getByRole('region', {
      name: 'Before comparing ChatGPT plans',
    });
    await expect(disclosure).toBeVisible();
    await expect(disclosure).toContainText(
      'Subscription duration is not the warranty period'
    );
    await expect(disclosure).toContainText(
      'Stock availability does not confirm access approval or resale eligibility'
    );
    await expect(disclosure.getByRole('link', { name: 'ordering checklist' }))
      .toHaveAttribute('href', '/how-to-order/');
    await expect(disclosure.getByRole('link', { name: 'refund policy' }))
      .toHaveAttribute('href', '/refund-policy/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href', 'https://aitoolspk.tech/plans/chatgpt/'
    );
    const schemas = await page.locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) => nodes.map((node) => JSON.parse(node.textContent || '{}')));
    expect(schemas.some((schema) => schema['@type'] === 'BreadcrumbList')).toBe(true);
    expect(schemas.some((schema) => schema['@type'] === 'FAQPage')).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const accessibility = await new AxeBuilder({ page })
      .include('section[aria-labelledby="chatgpt-buyer-clarity"]')
      .analyze();
    expect(accessibility.violations).toEqual([]);
    await page.goto('/plans/chatgpt/page/2/');
    await expect(page.locator('#chatgpt-buyer-clarity')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href', 'https://aitoolspk.tech/plans/chatgpt/page/2/'
    );
    await page.goto('/plans/canva/');
    await expect(page.locator('#chatgpt-buyer-clarity')).toHaveCount(0);
  });
}

test.describe('buyer clarity without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('disclosure and existing policy destinations are usable', async ({ page }) => {
    await page.goto('/plans/chatgpt/');
    const disclosure = page.getByRole('region', { name: 'Before comparing ChatGPT plans' });
    await expect(disclosure).toBeVisible();
    await disclosure.getByRole('link', { name: 'ordering checklist' }).click();
    await expect(page).toHaveURL(/\/how-to-order\/$/);
    await expect(page.locator('#before-you-order')).toBeVisible();
    await page.goto('/plans/chatgpt/');
    await disclosure.getByRole('link', { name: 'refund policy' }).click();
    await expect(page).toHaveURL(/\/refund-policy\/$/);
    await expect(page.locator('h1')).toBeVisible();
  });
});
