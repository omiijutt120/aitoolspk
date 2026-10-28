import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [390, 1280]) {
  test(`API provider and credit guide at ${width}px`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 900 });
    const response = await request.get('/plans/api/');
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('id="api-credit-guide"');
    await page.goto('/plans/api/');
    const section = page.getByRole('region', { name: 'Compare API providers, units and expiry' });
    await expect(section).toBeVisible();
    await expect(section).toContainText('10M Credit');
    await expect(section).toContainText('15M Token');
    await expect(section).toContainText('Pro is not eligible');
    await expect(section).toContainText('12 months');
    await expect(section).toContainText('Vendor documentation does not verify any listed offer');
    await expect(section.locator('time')).toHaveAttribute('datetime', '2026-10-28');
    await expect(section.getByRole('link', { name: 'Claude API credit eligibility' }))
      .toHaveAttribute('href', 'https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers');
    await expect(section.getByRole('link', { name: 'Gemini API billing documentation' }))
      .toHaveAttribute('href', 'https://ai.google.dev/gemini-api/docs/billing');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://aitoolspk.tech/plans/api/');
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const accessibility = await new AxeBuilder({ page }).include('section[aria-labelledby="api-credit-guide"]').analyze();
    expect(accessibility.violations).toEqual([]);
    for (const path of ['/plans/api/page/2/', '/plans/elevenlabs/', '/plans/claude/', '/plans/gemini/']) {
      const other = await request.get(path);
      expect(other.status()).toBe(200);
      expect(await other.text()).not.toContain('id="api-credit-guide"');
      await page.goto(path);
      await expect(page.locator('#api-credit-guide')).toHaveCount(0);
    }
  });
}

test.describe('API provider and credit guide without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('server guide links to the existing ordering checklist', async ({ page }) => {
    await page.goto('/plans/api/');
    const section = page.getByRole('region', { name: 'Compare API providers, units and expiry' });
    await expect(section).toBeVisible();
    await section.getByRole('link', { name: 'ordering checklist' }).click();
    await expect(page).toHaveURL(/\/how-to-order\/$/);
    await expect(page.locator('#before-you-order')).toBeVisible();
  });
});
