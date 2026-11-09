import { test, expect } from '@playwright/test';

for (const slug of ['pia-vpn', 'tradingview', 'buzzy-ai']) {
  test(`${slug} comparison avoids unsupported package differences`, async ({ page }) => {
    await page.goto(`/plans/${slug}/`);
    const comparison = page.getByRole('heading', {
      name: /Which .+ listing is cheapest, and which is dearest\?/,
    }).locator('+ p');
    await expect(comparison).toContainText('A shared brand label does not establish identical or different entitlements.');
    await expect(comparison).not.toContainText('Both sit under one brand because');
    await expect(comparison.locator('a[href^="/tool/"]').first()).toBeVisible();
    await expect(page.locator('main')).not.toContainText('Har plan ki duration, access aur warranty alag hoti hai');
    await expect(page.locator('main')).toContainText('Duration, access aur warranty har product ID ke liye confirm karein.');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://aitoolspk.tech/plans/${slug}/`);
  });
}
