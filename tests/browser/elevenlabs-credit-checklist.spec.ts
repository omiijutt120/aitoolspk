import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [390, 1280]) {
  test(`ElevenLabs credit checklist at ${width}px`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 900 });
    const response = await request.get('/plans/elevenlabs/');
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('id="elevenlabs-credit-checklist"');
    await page.goto('/plans/elevenlabs/');
    const section = page.getByRole('region', {
      name: 'Compare ElevenLabs credits before choosing',
    });
    await expect(section).toBeVisible();
    await expect(section).toContainText('Credits are not a fixed number of audio minutes');
    await expect(section).toContainText('Vendor documentation does not verify any listed offer');
    await expect(section.locator('time')).toHaveAttribute('datetime', '2026-10-27');
    await expect(section.getByRole('link', { name: 'ElevenLabs billing documentation' }))
      .toHaveAttribute('href', 'https://elevenlabs.io/docs/overview/administration/billing');
    await expect(section.getByRole('link', { name: 'ordering checklist' }))
      .toHaveAttribute('href', '/how-to-order/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href', 'https://aitoolspk.tech/plans/elevenlabs/'
    );
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const accessibility = await new AxeBuilder({ page })
      .include('section[aria-labelledby="elevenlabs-credit-checklist"]')
      .analyze();
    expect(accessibility.violations).toEqual([]);
    for (const path of ['/plans/gemini/', '/plans/gemini/page/2/', '/plans/canva/', '/plans/chatgpt/page/2/']) {
      await page.goto(path);
      await expect(page.locator('#elevenlabs-credit-checklist')).toHaveCount(0);
    }
    // This 16-offer collection has no second page; do not create one for copy.
    expect((await request.get('/plans/elevenlabs/page/2/')).status()).toBe(404);
  });
}

test.describe('ElevenLabs credit checklist without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('server copy and ordering link remain usable', async ({ page }) => {
    await page.goto('/plans/elevenlabs/');
    const section = page.getByRole('region', {
      name: 'Compare ElevenLabs credits before choosing',
    });
    await expect(section).toBeVisible();
    await section.getByRole('link', { name: 'ordering checklist' }).click();
    await expect(page).toHaveURL(/\/how-to-order\/$/);
    await expect(page.locator('#before-you-order')).toBeVisible();
  });
});
