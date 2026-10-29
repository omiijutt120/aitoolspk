import { test, expect } from '@playwright/test';
import catalog from '../../data/catalog.json';
import { groupCollections } from '../../src/lib/collections';
import { categoryName } from '../../src/lib/categories';
import type { Product } from '../../src/lib/types';

const collections = groupCollections(catalog as Product[]);

test('every collection exposes only its related categories as native server links', async ({
  request,
}) => {
  for (const collection of collections) {
    const response = await request.get(`/plans/${collection.slug}/`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    const navigation = html.match(
      /<nav\b[^>]*aria-label="Related categories"[^>]*>([\s\S]*?)<\/nav>/
    )?.[1];
    expect(navigation, collection.slug).toBeDefined();
    const links = [...navigation!.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    expect(links.map((link) => link[1]), collection.slug).toEqual(
      collection.categories.map((slug) => `/category/${slug}/`)
    );
    for (const [index, slug] of collection.categories.entries()) {
      expect(links[index][2], collection.slug).toContain(
        categoryName(slug).replace(/&/g, '&amp;')
      );
    }
  }
});

test.describe('collection category navigation without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('a collection and its later page lead to the relevant category', async ({ page }) => {
    for (const path of ['/plans/chatgpt/', '/plans/chatgpt/page/2/']) {
      await page.goto(path);
      const navigation = page.getByRole('navigation', { name: 'Related categories' });
      await expect(navigation).toBeVisible();
      await navigation.getByRole('link', { name: 'AI Chat', exact: true }).click();
      await expect(page).toHaveURL(/\/category\/ai-chat\/$/);
      await expect(page.locator('h1')).toContainText('AI Chat');
    }
  });
});

test('mobile collection category navigation works after hydration', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/plans/figma/');
  const navigation = page.getByRole('navigation', { name: 'Related categories' });
  await expect(navigation).toBeVisible();
  await navigation.getByRole('link', { name: 'Design', exact: true }).click();
  await expect(page).toHaveURL(/\/category\/design\/$/);
  await expect(page.locator('h1')).toContainText('Design');
});
