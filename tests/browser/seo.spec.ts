import { test, expect } from '@playwright/test';
import catalog from '../../data/catalog.json';
import { collectionProducts } from '../../src/lib/collections';
import type { Product } from '../../src/lib/types';
import { displayName } from '../../src/lib/product-name';

const shown = (p: Product) => displayName(p.name, p.warranty, p.brand);

test('every sitemap URL serves an indexable self-canonical page without a redirect', async ({
  request,
}) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const urls = [
    ...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g),
  ].map((m) => m[1]);
  expect(new Set(urls).size).toBe(urls.length);
  for (let i = 0; i < urls.length; i += 8) {
    await Promise.all(
      urls.slice(i, i + 8).map(async (url) => {
        const target = new URL(url);
        expect(target.origin).toBe('https://aitoolspk.tech');
        expect(target.search).toBe('');
        const page = await request.get(target.pathname, { maxRedirects: 0 });
        expect(page.status(), url).toBe(200);
        expect(page.headers()['x-robots-tag'] || '').not.toContain('noindex');
        const head =
          (await page.text()).match(/<head[^>]*>([\s\S]*?)<\/head>/)?.[1] || '';
        expect(head, url).toContain(`rel="canonical" href="${url}"`);
        expect(head, url).not.toContain('noindex');
      })
    );
  }
});

test('canonical tags are present once in server head, including pagination and tracking copies', async ({
  request,
  page,
}) => {
  for (const [path, canonical] of [
    ['/', '/'],
    ['/tools/?utm_source=canonical-audit&sort=price-asc', '/tools/'],
    ['/tools/page/2/', '/tools/page/2/'],
    ['/plans/chatgpt/page/2/', '/plans/chatgpt/page/2/'],
    ['/category/design/?brand=Canva', '/category/design/'],
  ]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/)?.[1] || '';
    const tags = html.match(/<link\b[^>]*rel="canonical"[^>]*>/g) || [];
    expect(tags).toHaveLength(1);
    expect(head).toContain(
      `rel="canonical" href="https://aitoolspk.tech${canonical}"`
    );
    expect(head).not.toContain('noindex');
  }
  await page.goto('/tools/page/2/?sort=price-asc&utm_source=canonical-audit');
  await expect(page.locator('.collection-card').first()).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://aitoolspk.tech/tools/page/2/'
  );
});

test('audited landing-page titles fit their search intent without boilerplate repetition', async ({
  request,
}) => {
  const paths = [
    '/about/',
    '/category/amazon-fba/',
    '/category/ai-image-generation/',
    '/category/creative-resources/',
    '/category/youtube-seo/',
    '/category/software/page/2/',
    '/tools/page/2/',
    '/tools/page/3/',
    '/tools/page/4/',
    '/tools/page/5/',
    '/plans/microsoft/page/2/',
    '/plans/canva/',
    '/guides/understanding-credits-and-plan-duration/',
    '/guides/buy-ai-subscription-pakistan-payment-checklist/',
    '/guides/chatgpt-claude-gemini-plan-comparison-pakistan/',
    '/guides/canva-pro-pakistan-buying-checklist/',
    '/guides/seller-warranty-vs-vendor-warranty/',
    '/guides/private-shared-workspace-access/',
    '/guides/subscriptions-vs-api-credits/',
    '/guides/creative-tool-licenses-client-work/',
  ];
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    const rawTitle = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
    const title = rawTitle
      .replaceAll('&amp;', '&')
      .replaceAll('&quot;', '"')
      .replaceAll('&#x27;', "'");
    expect(title.length, `${path}: ${title}`).toBeLessThanOrEqual(60);
    expect(title, path).not.toMatch(/tools tools|AiToolsPk.*AiToolsPk/i);
  }
});

test('ordering instructions introduce an H2 before step H3s', async ({
  page,
}) => {
  await page.goto('/how-to-order/');
  const levels = await page.locator('main h1, main h2, main h3').evaluateAll(
    (nodes) => nodes.map((node) => Number(node.tagName.slice(1)))
  );
  expect(levels[0]).toBe(1);
  expect(levels[1]).toBe(2);
  // The page now opens with a written answer before the steps, so the first
  // H3 is no longer the third heading. What must still hold is that the steps
  // are introduced by an H2 and no heading level is skipped on the way down.
  const firstH3 = levels.indexOf(3);
  expect(firstH3).toBeGreaterThan(0);
  expect(Math.max(...levels.slice(0, firstH3))).toBe(2);
});

test.describe('crawlable pagination without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('page two contains its actual plans and native links reach page three', async ({
    page,
  }) => {
    const plans = collectionProducts(catalog as Product[], 'chatgpt');
    await page.goto('/plans/chatgpt/page/2/');
    await expect(page.locator('.product-card h3')).toHaveText(
      plans.slice(24, 48).map(shown)
    );
    await expect(
      page.getByRole('link', { name: 'Page 2', exact: true })
    ).toHaveAttribute('aria-current', 'page');
    await page.getByRole('link', { name: 'Next page', exact: true }).click();
    await expect(page).toHaveURL(/\/plans\/chatgpt\/page\/3\/$/);
    await expect(page.locator('.product-card h3')).toHaveText(
      plans.slice(48, 72).map(shown)
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://aitoolspk.tech/plans/chatgpt/page/3/'
    );
  });
});
