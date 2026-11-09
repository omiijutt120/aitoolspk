import { test, expect } from '@playwright/test';

for (const slug of ['netflix', 'adobe', 'buzzy-ai']) {
  test(`${slug} warranty summary distinguishes labels from verified periods`, async ({ page }) => {
    await page.goto(`/plans/${slug}/`);
    const summary = page.getByRole('heading', {
      name: /What warranty labels do .+ listings carry\?/,
    }).locator('+ p');
    await expect(summary).toBeVisible();
    await expect(summary).toContainText('A label alone does not establish a coverage period or verified remedy.');
    await expect(summary).not.toContainText('rows state a seller warranty period');
    if (slug === 'netflix') {
      await expect(summary).toContainText('4 of 5 rows carry a seller warranty label, 1 has no specified warranty label.');
    }
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://aitoolspk.tech/plans/${slug}/`);
  });
}
