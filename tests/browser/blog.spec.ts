import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import posts from '../../data/blog/posts.json';
import catalog from '../../data/catalog.json';
import { collectionSlug } from '../../src/lib/catalog-identity.mjs';

const collections = new Set(
  catalog.filter((p) => p.approval !== 'excluded').map(collectionSlug)
);
const origin = 'https://aitoolspk.tech';

test('product library covers every active collection through native pagination without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  const found = new Set<string>();
  const count = Math.ceil(collections.size / 24);
  for (let number = 1; number <= count; number++) {
    const path = number === 1 ? '/blog/' : `/blog/page/${number}/`;
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${origin}${path}`
    );
    const links = await page
      .locator('.blog-library-card h3 a')
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute('href')!)
      );
    expect(links.length).toBeLessThanOrEqual(24);
    for (const href of links) {
      const slug = href.split('/')[2];
      expect(found.has(slug)).toBe(false);
      found.add(slug);
    }
    if (number === count) expect(links.at(-1)).toBe('/plans/api/');
  }
  expect([...found].sort()).toEqual([...collections].sort());
  await context.close();
});

test('library search finds off-page products, has a useful empty state and resets', async ({
  page,
}) => {
  await page.goto('/blog/');
  const search = page.getByRole('searchbox', {
    name: 'Search product library',
  });
  await search.fill('APIs');
  await expect(page.locator('.blog-library-card')).toHaveCount(1);
  await expect(page.locator('.blog-library-card h3 a')).toHaveAttribute(
    'href',
    '/plans/api/'
  );
  await search.fill('no-such-tool-998877');
  await expect(
    page.getByRole('heading', { name: 'No matching tools' })
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Show all collections', exact: true })
    .click();
  await expect(search).toHaveValue('');
  await expect(page.locator('.blog-library-card')).toHaveCount(24);
  await page
    .getByRole('link', { name: 'Product library page 2', exact: true })
    .click();
  await expect(page).toHaveURL(/\/blog\/page\/2\/#product-library$/);
  await expect(
    page.getByRole('link', { name: 'Product library page 2', exact: true })
  ).toHaveAttribute('aria-current', 'page');
});

test('articles are indexable, use truthful BlogPosting metadata and show exact catalog details', async ({
  page,
  request,
}) => {
  test.setTimeout(180000);
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const post of posts) {
    const path = `/blog/${post.slug}/`;
    expect(sitemap).toContain(`${origin}${path}`);
    await page.goto(path);
    await expect(page.locator('h1')).toHaveText(post.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${origin}${path}`
    );
    const robots = await page.evaluate(
      () =>
        document
          .querySelector('meta[name="robots"]')
          ?.getAttribute('content') || ''
    );
    expect(robots).not.toContain('noindex');
    const schema = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts
          .map((script) => JSON.parse(script.textContent || '{}'))
          .find((item) => item['@type'] === 'BlogPosting')
      );
    expect(schema.headline).toBe(post.title);
    expect(schema.author.name).toBe('AiToolsPk');
    expect(schema.citation).toEqual(post.sources.map((source) => source.href));
    expect(schema.image[0]).toBe(
      `${origin}/og/collections/${post.collection}.png`
    );
    const image = await request.get(new URL(schema.image[0]).pathname);
    expect(image.ok()).toBe(true);
    const links = page.locator('.blog-plan-sample');
    for (let i = 0; i < (await links.count()); i++) {
      const card = links.nth(i);
      const href = await card.locator('h3 a').getAttribute('href');
      const product = catalog.find((p) => `/tool/${p.slug}/` === href)!;
      expect(product.approval).not.toBe('excluded');
      await expect(card).toContainText(
        `Listed PKR ${product.price.toLocaleString('en-PK')}`
      );
      await expect(card).toContainText(product.id);
      await expect(card).toContainText(product.warranty);
    }
  }
});

for (const width of [375, 768, 1280, 1440]) {
  test(`blog and article work at ${width}px without overflow, accessibility errors or broken assets`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    for (const path of ['/blog/', `/blog/${posts[0].slug}/`]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth
        )
      ).toBe(true);
      await page.locator('footer').scrollIntoViewIfNeeded();
      expect(
        await page.locator('img').evaluateAll((images) =>
          images
            .filter((element) => {
              const image = element as HTMLImageElement;
              return image.complete && image.naturalWidth === 0;
            })
            .map((element) => (element as HTMLImageElement).src)
        )
      ).toEqual([]);
      const accessibility = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(accessibility.violations).toEqual([]);
      await page.screenshot({
        path: `reports/seo/blog-${path === '/blog/' ? 'hub' : 'article'}-${width}.png`,
        fullPage: true,
      });
    }
    expect(errors).toEqual([]);
  });
}

test('mobile menu exposes blog and its article links lead back to real plans', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Blog', exact: true })
    .click();
  await expect(page).toHaveURL(/\/blog\/$/);
  await page.locator('.blog-card h3 a').first().click();
  await expect(page.locator('h1')).toHaveText(posts[0].title);
  await page.locator('#plans .button').click();
  await expect(page).toHaveURL(/\/plans\/chatgpt\/$/);
  await expect(page.locator('.blog-collection-link a').first()).toHaveAttribute(
    'href',
    `/blog/${posts[0].slug}/`
  );
});
