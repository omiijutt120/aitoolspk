import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import catalog from '../../data/catalog.json';
import collectionContent from '../../data/seo/collection-content.json';
import extraGuides from '../../data/seo/additional-guides.json';

test.setTimeout(120000);

test('small logo slots use generated thumbnails that load on mobile and desktop', async ({
  page,
}) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const heroLogo = page.locator('.tool-wall-icons img').first();
    const cardLogo = page.locator('.collection-card img').first();
    await expect(heroLogo).toHaveAttribute('src', /\.small\.webp$/);
    await expect(cardLogo).toHaveAttribute('src', /\.card\.webp$/);
    for (const logo of [heroLogo, cardLogo]) {
      await logo.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          logo.evaluate(
            (image: HTMLImageElement) =>
              image.complete && image.naturalWidth > 0
          )
        )
        .toBe(true);
    }
    await page.goto('/plans/chatgpt/');
    await expect(page.locator('.collection-intro img')).toHaveAttribute(
      'src',
      /\.small\.webp$/
    );
    await page
      .getByRole('link', { name: 'View Details', exact: true })
      .first()
      .click();
    const detailLogo = page.locator('.product-logo.large img');
    await expect(detailLogo).toHaveAttribute('src', /\.card\.webp$/);
    await expect
      .poll(() =>
        detailLogo.evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0
        )
      )
      .toBe(true);
  }
});

test('expanded collections have distinct guidance, local social previews and accurate quote tables', async ({
  page,
  request,
}) => {
  for (const slug of Object.keys(collectionContent)) {
    await page.goto(`/plans/${slug}/`);
    await expect(
      page.getByRole('region', { name: `${slug} buying guide`, exact: true })
    ).toBeVisible();
    await expect(
      page.locator('.collection-buying-guide h3[lang="ur-Latn"]')
    ).toContainText('confirm karna chahiye');
    await expect(
      page.locator('.collection-buying-guide p[lang="ur-Latn"]')
    ).toContainText('PKR price');
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
      'href',
      `https://aitoolspk.tech/plans/${slug}/`
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      `https://aitoolspk.tech/og/collections/${slug}.png`
    );
    const image = await request.get(`/og/collections/${slug}.png`);
    expect(image.status()).toBe(200);
    expect(image.headers()['content-type']).toContain('image/png');
  }
  await page.goto('/plans/gemini/');
  const plan = catalog.find((p) => p.id === 'PK-1C4151BB27E1')!;
  const row = page.locator('.plan-comparison tr').filter({ hasText: plan.id });
  for (
    let remaining = 3;
    (await row.count()) === 0 && remaining > 0;
    remaining--
  ) {
    await page.getByRole('link', { name: 'Next page', exact: true }).click();
  }
  await page.locator('.plan-comparison summary').click();
  await expect(row).toContainText('PKR 1,200');
  await expect(row).toContainText('Full seller warranty (18 months)');
  expect(await row.locator('a').getAttribute('href')).toBe(
    `/tool/${plan.slug}/`
  );
});

test('all ten buying guides are discoverable with factual dates, schema and native cross-links', async ({
  page,
  request,
}) => {
  await page.goto('/guides/');
  await expect(page.locator('.document section h2 a')).toHaveCount(10);
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).not.toMatch(/^Host:/im);
  expect(robots).toContain('Sitemap: https://aitoolspk.tech/sitemap.xml');
  expect(sitemap).toContain('<lastmod>2026-10-24</lastmod>');
  const navigation = await (await request.get('/llms.txt')).text();
  expect(navigation).not.toContain('/tool/');
  for (const guide of extraGuides) {
    await page.goto(`/guides/${guide.slug}/`);
    await expect(page.locator('h1')).toHaveText(guide.title);
    expect(sitemap).toContain(
      `<loc>https://aitoolspk.tech/guides/${guide.slug}/</loc>`
    );
    expect(navigation).toContain(`/guides/${guide.slug}/`);
    const schema = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).map((s) => JSON.parse(s));
    expect(schema.find((s) => s['@type'] === 'Article').dateModified).toBe(
      guide.checked
    );
    expect(
      schema.some((s) =>
        ['FAQPage', 'HowTo', 'AggregateRating'].includes(s['@type'])
      )
    ).toBe(false);
  }
});

test('About, editorial policy and contact publish only supplied business contact details', async ({
  page,
}) => {
  for (const path of ['/about/', '/editorial-policy/', '/contact/']) {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.locator('a[href^="mailto:"]').count()).toBe(0);
    const schema = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).map((s) => JSON.parse(s));
    const org = schema.find((s) => s['@type'] === 'Organization');
    expect(org.contactPoint.telephone).toBe('+923714549245');
    expect(org.address).toBeUndefined();
    expect(org.sameAs).toBeUndefined();
    expect(schema.filter((s) => s['@type'] === 'BreadcrumbList')).toHaveLength(
      1
    );
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});

test('new content fits phone, tablet and desktop with a keyboard-operable comparison table', async ({
  page,
}) => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      '/',
      '/plans/chatgpt/',
      '/category/design/',
      '/about/',
      '/guides/subscriptions-vs-api-credits/',
    ]) {
      await page.goto(path);
      if (path === '/plans/chatgpt/') {
        await page.locator('.plan-comparison summary').focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('.plan-comparison table')).toBeVisible();
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();
        expect(results.violations).toEqual([]);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1
        ),
        `${path} at ${width}px`
      ).toBe(true);
    }
  }
});
