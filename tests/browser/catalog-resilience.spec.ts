import { test, expect } from '@playwright/test';
import catalog from '../../data/catalog.json';

test('campaign parameters preserve canonical browsing without downloading or filtering the catalog', async ({
  page,
}) => {
  let requests = 0;
  page.on('request', (r) => {
    if (r.url().endsWith('/catalog/index.json')) requests++;
  });
  await page.goto(
    '/tools/?utm_source=google&utm_campaign=launch&gclid=example'
  );
  await page.waitForLoadState('networkidle');
  expect(requests).toBe(0);
  await expect(page.getByRole('status')).toContainText('plans to explore');
  await expect(page.getByRole('status')).not.toContainText('matching');
  await expect(page.locator('.active-filters')).toHaveCount(0);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
    'href',
    'https://aitoolspk.tech/tools/'
  );
  await page.locator('#catalog-search').fill('claude');
  await expect(page.locator('.collection-card').first()).toContainText(
    /claude/i
  );
  expect(requests).toBe(1);
  await expect(page.locator('.collection-card').first()).not.toHaveAttribute(
    'href',
    /utm_|gclid/
  );
});

for (const failure of ['http', 'error-object', 'invalid-row']) {
  test(`catalog ${failure} failure preserves browsing and retries without reloading`, async ({
    page,
  }) => {
    let requests = 0,
      documents = 0;
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (r) => {
      if (r.resourceType() === 'document') documents++;
    });
    await page.route('**/catalog/index.json', (route) => {
      requests++;
      if (requests > 1) return route.fulfill({ json: catalog });
      return failure === 'http'
        ? route.fulfill({ status: 503, body: 'Unavailable' })
        : route.fulfill({
            json:
              failure === 'error-object' ? { error: 'Unavailable' } : [null],
          });
    });
    await page.goto('/tools/?q=claude');
    await expect(page.locator('.catalog-notice[role=alert]')).toContainText(
      'could not load'
    );
    await expect(page.getByRole('status')).toContainText(
      'Showing the unfiltered catalog'
    );
    await expect(page.getByRole('status')).not.toContainText(
      'matching your filters'
    );
    await expect(page.locator('.collection-card').first()).toBeVisible();
    await page.getByRole('button', { name: 'Try again', exact: true }).click();
    await expect(page.getByRole('status')).toContainText(
      'matching your filters'
    );
    await expect(page.locator('.catalog-notice[role=alert]')).toHaveCount(0);
    await expect(page.locator('.collection-card').first()).toContainText(
      /claude/i
    );
    await expect(page.locator('#catalog-search')).toHaveValue('claude');
    expect(requests).toBe(2);
    expect(documents).toBe(1);
    expect(errors).toEqual([]);
  });
}

test('a stalled catalog request times out and offers recovery', async ({
  page,
}) => {
  await page.clock.install();
  await page.route('**/catalog/index.json', () => new Promise(() => {}));
  const requested = page.waitForRequest('**/catalog/index.json');
  await page.goto('/tools/?q=claude');
  await requested;
  await page.clock.runFor(16000);
  await expect(page.locator('.catalog-notice[role=alert]')).toBeVisible();
  await expect(page.getByRole('status')).not.toContainText('Loading');
  await page.getByRole('button', { name: 'Clear search', exact: true }).click();
  await expect(page.locator('.catalog-notice[role=alert]')).toHaveCount(0);
  await page.clock.runFor(200);
  await expect(page.getByRole('status')).toContainText('plans to explore');
});
