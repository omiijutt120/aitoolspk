import { test, expect } from '@playwright/test';
import catalog from '../../data/catalog.json';
import { collectionProducts } from '../../src/lib/collections';
import type { Product } from '../../src/lib/types';

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

test.describe('crawlable pagination without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('page two contains its actual plans and native links reach page three', async ({
    page,
  }) => {
    const plans = collectionProducts(catalog as Product[], 'chatgpt');
    await page.goto('/plans/chatgpt/page/2/');
    await expect(page.locator('.product-card h3')).toHaveText(
      plans.slice(24, 48).map((p) => p.name)
    );
    await expect(
      page.getByRole('link', { name: 'Page 2', exact: true })
    ).toHaveAttribute('aria-current', 'page');
    await page.getByRole('link', { name: 'Next page', exact: true }).click();
    await expect(page).toHaveURL(/\/plans\/chatgpt\/page\/3\/$/);
    await expect(page.locator('.product-card h3')).toHaveText(
      plans.slice(48, 72).map((p) => p.name)
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://aitoolspk.tech/plans/chatgpt/page/3/'
    );
  });
});
