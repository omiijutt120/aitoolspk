import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import catalog from '../../data/catalog.json';
import type { Product } from '../../src/lib/types';
import { isStale } from '../../src/lib/commerce.mjs';

const added = (catalog as Product[]).filter(
  (p) => p.sourceType === 'seller-listed'
);

test('all six new offers retain exact prices, honest eligibility, canonical, warranty and official images', async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.clock.install({ time: new Date('2026-10-23T12:00:00+05:00') });
  const titles = new Set<string>();
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const p of added) {
    await page.goto(`/tool/${p.slug}/`);
    await expect(page.locator('h1')).toHaveText(p.name);
    await expect(page.locator('.detail-price')).toHaveText(
      `PKR ${p.price.toLocaleString('en-PK')}`
    );
    await expect(page.locator('.detail-summary .stock-badge')).toHaveText(
      p.stock === 'in-stock' ? 'Available' : 'Stock unconfirmed'
    );
    await expect(page.locator('.detail-warranty-badge')).toContainText(
      'Full Duration Warranty'
    );
    await expect(
      page.getByRole('heading', { name: 'Included features' })
    ).toBeVisible();
    await expect(
      page.getByText(
        "Your subscription includes AI Tools PK's seller-provided warranty",
        { exact: false }
      )
    ).toBeVisible();
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
      'href',
      `https://aitoolspk.tech/tool/${p.slug}/`
    );
    if (p.approval === 'approved')
      await expect(page.locator('meta[name=robots]')).not.toHaveAttribute(
        'content',
        /noindex/
      );
    else
      await expect(page.locator('meta[name=robots]')).toHaveAttribute(
        'content',
        /noindex/
      );
    titles.add(await page.title());
    expect(
      sitemap.includes(`<loc>https://aitoolspk.tech/tool/${p.slug}/</loc>`)
    ).toBe(p.approval === 'approved');
    expect(
      await page
        .locator('.detail-art img')
        .evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0
        )
    ).toBe(true);
    const schemas = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const product = schemas
      .map((text) => JSON.parse(text))
      .find((s) => s['@type'] === 'Product');
    if (p.approval !== 'approved') expect(product).toBeUndefined();
    else {
      expect(product.sku).toBe(p.id);
      if (product.offers) {
        expect(product.offers).toMatchObject({
          price: p.price,
          priceCurrency: 'PKR',
          url: `https://aitoolspk.tech/tool/${p.slug}/`,
        });
      } else expect(isStale(p) || p.stock !== 'in-stock').toBe(true);
    }
    const href = await page
      .locator('.detail-action .buy-button')
      .getAttribute('href');
    const link = new URL(href!);
    expect(link.pathname).toBe('/923714549245');
    const message = link.searchParams.get('text')!;
    for (const expected of [
      p.id,
      p.name,
      p.duration,
      p.price.toLocaleString('en-PK'),
      'Full Duration Warranty',
      'AI Tools PK (seller warranty)',
    ])
      expect(message).toContain(expected);
  }
  expect(titles.size).toBe(6);
  expect(errors).toEqual([]);
});

test('new collection cards keep descriptions, warranty badges, details and Buy Now for every exact offer', async ({
  page,
}) => {
  for (const brand of ['helium-10', 'midjourney', 'envato', 'vidiq']) {
    await page.goto(`/plans/${brand}/`);
    const plans = added.filter((p) => p.brandSlug === brand);
    await expect(page.locator('.product-card')).toHaveCount(plans.length);
    for (const p of plans) {
      const card = page
        .locator('.product-card')
        .filter({ has: page.getByRole('link', { name: p.name, exact: true }) });
      // The two Midjourney durations share a product title; their detail URLs identify them.
      const exactCard =
        p.brandSlug === 'midjourney'
          ? page
              .locator('.product-card')
              .filter({ has: page.locator(`a[href="/tool/${p.slug}/"]`) })
          : card;
      await expect(exactCard.locator('.product-summary')).toHaveText(
        p.summary!
      );
      await expect(exactCard.locator('.seller-warranty-badge')).toHaveText(
        'Full Duration Warranty'
      );
      await expect(
        exactCard.getByRole('link', { name: 'View Details', exact: true })
      ).toHaveAttribute('href', `/tool/${p.slug}/`);
      await expect(exactCard.locator('.buy-button')).toHaveAttribute(
        'href',
        /^https:\/\/wa\.me\/923714549245\?text=/
      );
    }
  }
});

for (const width of [390, 768, 1440]) {
  test(`Midjourney duration changes price, canonical, warranty and WhatsApp together at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.clock.install({ time: new Date('2026-10-23T12:00:00+05:00') });
    await page.goto('/tool/midjourney-standard/');
    await expect(page.locator('.detail-price')).toHaveText('PKR 4,000');
    await page
      .getByLabel('Subscription duration', { exact: true })
      .selectOption('midjourney-standard-3-months');
    await expect(page).toHaveURL(/\/tool\/midjourney-standard-3-months\/$/);
    await expect(page.locator('.detail-price')).toHaveText('PKR 8,000');
    await expect(page.locator('.duration-saving')).toContainText(
      'Save PKR 4,000'
    );
    // React reconciles route metadata after the new page content commits.
    // Assert it settles to one canonical before reading a strict locator.
    await expect(page.locator('link[rel=canonical]')).toHaveCount(1);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
      'href',
      'https://aitoolspk.tech/tool/midjourney-standard-3-months/'
    );
    const buy =
      width < 600
        ? page.locator('.mobile-purchase .buy-button')
        : page.locator('.detail-action .buy-button');
    await expect(buy).toBeVisible();
    const message = new URL((await buy.getAttribute('href'))!).searchParams.get(
      'text'
    )!;
    expect(message).toContain('PKR 8,000');
    expect(message).toContain('Duration: 3 months');
    expect(message).toContain(
      added.find((p) => p.slug === 'midjourney-standard-3-months')!.id
    );
    await page
      .context()
      .route('https://wa.me/**', (r) =>
        r.fulfill({ body: 'WhatsApp verified' })
      );
    const popup = page.waitForEvent('popup');
    await buy.click();
    const opened = await popup;
    await opened.waitForLoadState();
    expect(new URL(opened.url()).searchParams.get('text')).toContain(
      'PKR 8,000'
    );
    await opened.close();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    await page.screenshot({ path: `reports/premium-midjourney-${width}.png` });
    await page.goBack();
    await expect(page.locator('.detail-price')).toHaveText('PKR 4,000');
    await expect(
      page.getByLabel('Subscription duration', { exact: true })
    ).toHaveValue('midjourney-standard');
  });
}

test('Helium exclusions, fair usage and Envato licensing limits remain explicit; new selector is accessible', async ({
  page,
}) => {
  await page.goto('/tool/helium-10-platinum/');
  await expect(
    page.getByText('Cerebro is not included in this Platinum package.')
  ).toBeVisible();
  await expect(
    page.getByText('Magnet is not included in this Platinum package.')
  ).toBeVisible();
  await expect(page.locator('.official-price-reference')).toContainText(
    'USD 129/month'
  );
  await page.goto('/tool/helium-10-diamond/');
  await expect(page.locator('.official-price-reference')).toContainText(
    'USD 359/month'
  );
  await expect(
    page
      .getByText('Unlimited searches are not offered.', { exact: false })
      .first()
  ).toBeVisible();
  await page.goto('/tool/envato-elements/');
  await expect(
    page.getByText('Unrestricted commercial use is not promised.', {
      exact: false,
    })
  ).toBeVisible();
  await page.goto('/tool/midjourney-standard/');
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(audit.violations).toEqual([]);
});

test.describe('Midjourney without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('duration links retain correct price and WhatsApp product identity', async ({
    page,
  }) => {
    await page.goto('/tool/midjourney-standard/');
    await page
      .getByRole('link', { name: '3 months: PKR 8,000', exact: true })
      .click();
    await expect(page.locator('.detail-price')).toHaveText('PKR 8,000');
    const message = new URL(
      (await page.locator('.detail-action .buy-button').getAttribute('href'))!
    ).searchParams.get('text')!;
    expect(message).toContain('Duration: 3 months');
    expect(message).toContain('PKR 8,000');
  });
});
