import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import catalog from '../../data/catalog.json';

test('static browsing avoids the full-catalog download until search needs it', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().endsWith('/catalog/index.json'))
      requests.push(request.url());
  });
  await page.goto('/tools/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.collection-card')).toHaveCount(24);
  await expect(page.getByRole('status')).not.toContainText('Loading');
  expect(requests).toHaveLength(0);
  await page.locator('#catalog-search').fill('claude');
  await expect(page.locator('.collection-card').first()).toContainText(
    /claude/i
  );
  expect(requests).toHaveLength(1);
});

test('offer buyer-guide links are native and operational intelligence is never public', async ({
  page,
  request,
}) => {
  for (const product of [
    catalog[0],
    catalog.find((p) => p.sourceType === 'seller-listed')!,
  ]) {
    await page.goto(`/tool/${product.slug}/`);
    const section = page
      .getByRole('heading', { name: 'Compare before enquiring' })
      .locator('..');
    for (const slug of [
      'choosing-ai-subscriptions-pakistan',
      'understanding-credits-and-plan-duration',
    ]) {
      const link = section.locator(`a[href="/guides/${slug}/"]`);
      await expect(link).toBeVisible();
      expect(
        (await request.get((await link.getAttribute('href'))!)).status()
      ).toBe(200);
    }
  }
  expect(
    (await request.get('/reports/seo/product-seo-master.json')).status()
  ).toBe(404);
  expect((await request.get('/private/approvals.json')).status()).toBe(404);
});

test('root-domain HTML, scripts, styles and hydrated internal links never use the repository prefix', async ({
  page,
}) => {
  const failed: string[] = [];
  page.on('response', (r) => {
    if (r.url().startsWith('http://127.0.0.1:3000/') && r.status() >= 400)
      failed.push(r.url());
  });
  for (const path of [
    '/',
    '/tools/',
    '/categories/',
    '/plans/chatgpt/',
    '/category/ai-chat/',
    '/guides/',
  ]) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const urls = await page
      .locator('a[href],link[href],script[src],img[src]')
      .evaluateAll((es) =>
        es.map((e) => e.getAttribute('href') || e.getAttribute('src') || '')
      );
    expect(urls.some((url) => /^\/(?:aitoolspk)(?:\/|$)/.test(url))).toBe(
      false
    );
    // Next can inline CSS into head to avoid a blocking network request.
    expect(
      await page.locator('link[rel=stylesheet],head style').count()
    ).toBeGreaterThan(0);
    expect(
      await page
        .locator('h1')
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
    ).toBeGreaterThanOrEqual(28);
  }
  expect(failed).toEqual([]);
});

test('twelve priority collections expose specific sourced guidance and honest listing schema', async ({
  page,
}) => {
  const intros = new Set<string>();
  for (const slug of [
    'chatgpt',
    'gemini',
    'claude',
    'canva',
    'figma',
    'elevenlabs',
    'adobe',
    'capcut',
    'notion',
    'lovable',
    'n8n',
    'api',
  ]) {
    await page.goto(`/plans/${slug}/`);
    const guide = page.getByRole('region', { name: `${slug} buying guide` });
    await expect(guide).toBeVisible();
    await expect(guide.locator('h2').first()).toBeVisible();
    intros.add(await guide.locator('p').first().innerText());
    expect(await guide.locator('a[href^="https:"]').count()).toBeGreaterThan(0);
    const schema = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).map((t) => JSON.parse(t));
    const collection = schema.find((s) => s['@type'] === 'CollectionPage');
    expect(collection.url).toBe(`https://aitoolspk.tech/plans/${slug}/`);
    expect(collection.mainEntity.itemListElement.length).toBe(
      await page.locator('.product-card').count()
    );
    expect(
      schema.some((s) => s['@type'] === 'Product' || s['@type'] === 'Offer')
    ).toBe(false);
  }
  expect(intros.size).toBe(12);
  await page.goto('/plans/chatgpt/page/2/');
  await expect(page.locator('.collection-buying-guide')).toHaveCount(0);
  await expect(page.locator('h1')).toContainText('Page 2');
});

test('original guides have sourced visible text, one canonical, truthful Article dates and crawlable links', async ({
  page,
  request,
}) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const slug of [
    'choosing-ai-subscriptions-pakistan',
    'understanding-credits-and-plan-duration',
  ]) {
    await page.goto(`/guides/${slug}/`);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
      'href',
      `https://aitoolspk.tech/guides/${slug}/`
    );
    expect(sitemap).toContain(
      `<loc>https://aitoolspk.tech/guides/${slug}/</loc>`
    );
    const article = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    )
      .map((t) => JSON.parse(t))
      .find((s) => s['@type'] === 'Article');
    expect(article.dateModified).toBe('2026-10-23');
    expect(article.datePublished).toBeUndefined();
    expect(article.author.name).toBe('AiToolsPk');
    expect(
      await page.locator('.buying-guide a[href^="https:"]').count()
    ).toBeGreaterThan(0);
  }
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('pending premium and legacy offers stay out of indexing and purchase-rich schema', async ({
  request,
}) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const samples = [
    catalog[0],
    ...catalog.filter(
      (p) => 'sourceType' in p && p.sourceType === 'seller-listed'
    ),
  ];
  for (const product of samples) {
    const html = await (await request.get(`/tool/${product.slug}/`)).text();
    expect(html).toMatch(/name="robots" content="[^"]*noindex/);
    expect(sitemap).not.toContain(
      `<loc>https://aitoolspk.tech/tool/${product.slug}/</loc>`
    );
    for (const match of html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
    )) {
      const schema = JSON.parse(match[1]);
      expect(['Product', 'Offer', 'Review', 'AggregateRating']).not.toContain(
        schema['@type']
      );
    }
  }
});

test('unknown paths remain real 404s and buyer FAQs remain visible without retired rich-result markup', async ({
  page,
  request,
}) => {
  expect((await request.get('/guides/not-a-real-guide/')).status()).toBe(404);
  await page.goto('/faq/');
  await expect(page.locator('.faq-list details')).toHaveCount(6);
  expect(
    (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).some((t) => JSON.parse(t)['@type'] === 'FAQPage')
  ).toBe(false);
});

test.describe('guide reading without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('footer and guide links are native and readable', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('link', { name: 'Buying guides', exact: true })
      .click();
    await page
      .getByRole('link', {
        name: 'How to choose an AI subscription in Pakistan',
        exact: true,
      })
      .click();
    await expect(page.locator('h1')).toHaveText(
      'How to choose an AI subscription in Pakistan'
    );
    await expect(
      page.getByRole('heading', { name: 'Use a written enquiry checklist' })
    ).toBeVisible();
  });
});
