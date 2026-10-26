import { test, expect } from '@playwright/test';

// Covers every indexable route, not just one pagination template.
test('sitemap descriptions are unique and pagination-aware in server HTML', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  const urls = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname);
  expect(urls.length).toBeGreaterThan(0);
  const descriptions = new Map<string, string>();
  let paginated = 0;
  for (const path of urls) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    const description = /<meta name="description" content="([^"]+)"/.exec(html)?.[1];
    expect(description, path).toBeTruthy();
    expect(descriptions.get(description!), `Duplicate description: ${path}`).toBeUndefined();
    descriptions.set(description!, path);
    expect(html).toContain(`<meta property="og:description" content="${description}"`);
    expect(html).toContain(`<meta name="twitter:description" content="${description}"`);
    const page = /\/page\/(\d+)\/$/.exec(path)?.[1];
    if (page) {
      paginated++;
      expect(description, path).toMatch(new RegExp(`^Page ${page}: `));
    }
  }
  expect(paginated).toBeGreaterThan(0);
});
