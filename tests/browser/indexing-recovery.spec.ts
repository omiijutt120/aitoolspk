import { test, expect } from '@playwright/test';
import catalog from '../../data/catalog.json';

test('category navigation uses clean URLs when the category cannot narrow the collection', async ({
  page,
  request,
}) => {
  const response = await request.get('/category/entertainment/');
  const html = await response.text();
  for (const slug of ['tv360', 'youku', 'iqiyi', 'apple']) {
    expect(html).toContain(`href="/plans/${slug}/"`);
    expect(html).not.toContain(`href="/plans/${slug}/?category=`);
  }
  const catalogRequests: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('/catalog/index.json')) catalogRequests.push(r.url());
  });
  await page.goto('/category/entertainment/');
  await page.locator('[data-collection="tv360"]').click();
  await expect(page).toHaveURL(/\/plans\/tv360\/$/);
  await expect(
    page.getByRole('region', { name: 'tv360 buying guide', exact: true })
  ).toBeVisible();
  expect(catalogRequests).toEqual([]);

  // Existing shared filter URLs remain usable and nominate the clean URL.
  await page.goto('/plans/tv360/?category=entertainment');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://aitoolspk.tech/plans/tv360/'
  );
  await expect(page.locator('.product-card')).toHaveCount(4);
});

test('removing redundant categories preserves price limits and meaningful mixed-category filters', async ({
  page,
}) => {
  await page.goto('/category/entertainment/?max=50000');
  const tv360 = page.locator('[data-collection="tv360"]');
  await expect(tv360).toHaveAttribute('href', '/plans/tv360/?max=50000');
  const gemini = page.locator('[data-collection="gemini"]');
  await expect(gemini).toBeVisible();
  const href = new URL(
    (await gemini.getAttribute('href'))!,
    'https://aitoolspk.tech'
  );
  expect(href.searchParams.get('category')).toBe('entertainment');
  expect(href.searchParams.get('max')).toBe('50000');
  await gemini.click();
  await expect(page).toHaveURL(/\/plans\/gemini\/\?/);
  await expect(page.locator('h1')).toHaveText(
    'Gemini plans & prices in Pakistan'
  );
  // Navigation and the filtered catalog commit asynchronously. Assert the
  // settled result instead of taking a one-off snapshot during hydration.
  // This category contains one Gemini/YouTube bundle, not the video plans.
  await expect(page.locator('.product-card .category-mini')).toHaveText([
    'Entertainment',
  ]);
  await expect(page.getByRole('status').first()).toContainText('matching');
});

test('affected collection guides fit mobile, tablet and desktop without changing publication controls', async ({
  page,
  request,
}) => {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/plans/railway/');
    await expect(
      page.getByRole('heading', {
        name: 'Separate Railway subscription access from hosting usage costs',
      })
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
  }
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toMatch(
    /<loc>https:\/\/aitoolspk.tech\/plans\/railway\/<\/loc>\s*<lastmod>2026-10-27<\/lastmod>/
  );
  expect(sitemap).not.toContain('?category=');
  await page
    .getByRole('link', { name: 'View Details', exact: true })
    .first()
    .click();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    /noindex/
  );
});

test('hyphenated catalog terms reach product pages and the exact WhatsApp enquiry', async ({
  page,
}) => {
  for (const [name, duration, warranty] of [
    [
      'Galaxy Play VIP 30-day full warranty',
      '30 days',
      'full warranty (listed; unverified)',
    ],
    [
      'Youku VIP 30-day full warranty',
      '30 days',
      'full warranty (listed; unverified)',
    ],
    [
      'Redeem Apple Music Individual 5 months with 1-day warranty',
      '5 months',
      '1-day warranty (listed; unverified)',
    ],
  ]) {
    const product = catalog.find((p) => p.name === name)!;
    await page.goto(`/tool/${product.slug}/`);
    const link = page.locator('.detail-action .buy-button');
    const message = new URL(
      (await link.getAttribute('href'))!
    ).searchParams.get('text');
    for (const value of [product.id, duration, warranty])
      expect(message).toContain(value);
    await expect(page.locator('main')).toContainText(duration);
    await expect(page.locator('main')).toContainText(warranty);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /noindex/
    );
  }
});
