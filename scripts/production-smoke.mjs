import { chromium, devices } from '@playwright/test';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { productionRequestAllowed } from './production-policy.mjs';

const origin = 'https://aitoolspk.tech';
const expected = process.env.EXPECTED_PRODUCTION_SHA;
assert.match(expected || '', /^[a-f0-9]{40}$/);
const dir = 'reports/production-browser';
mkdirSync(dir, { recursive: true });
const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8'));
const pending = catalog.find((p) => p.approval === 'pending');
assert.ok(pending, 'Representative intentionally noindex offer required');
const routes = ['/', '/tools/', '/guides/', '/how-to-order/', '/contact/', `/tool/${pending.slug}/`];
const summary = { origin, expectedProductionSHA: expected, harnessSHA: process.env.GITHUB_SHA || null,
  shaBasis: 'GitHub successful Pages deployment independently verified by operator; response hashes retained, no embedded site SHA claim',
  observedAt: new Date().toISOString(), sandbox: true, readonly: true, pages: [], errors: [] };
let browser;
try {
  // Use the hosted runner's distro-installed Chrome and its supported sandbox profile.
  browser = await chromium.launch({ channel: 'chrome', chromiumSandbox: true });
  for (const [device, settings] of [['desktop', { viewport: { width: 1440, height: 1000 } }], ['mobile', devices['iPhone 13']]]) {
    const context = await browser.newContext({ ...settings, ignoreHTTPSErrors: false,
      recordHar: { path: `${dir}/${device}.har`, mode: 'minimal', content: 'omit' } });
    await context.route('**/*', (route) => productionRequestAllowed(route.request().url(), route.request().method()) ? route.continue() : route.abort());
    const page = await context.newPage();
    let current;
    page.on('pageerror', (error) => summary.errors.push({ path: current, device, type: 'pageerror', message: error.message }));
    page.on('console', (message) => { if (message.type() === 'error') summary.errors.push({ path: current, device, type: 'console', message: message.text() }); });
    page.on('response', (response) => { if (new URL(response.url()).origin === origin && response.status() >= 400) summary.errors.push({ path: current, device, type: 'resource', url: response.url(), status: response.status() }); });
    for (const [index, route] of routes.entries()) {
      current = route;
      const response = await page.goto(origin + route, { waitUntil: 'networkidle', timeout: 45000 });
      assert.equal(response.status(), 200, route);
      assert.equal(new URL(page.url()).origin, origin);
      assert.equal(page.url(), origin + route);
      await page.locator('h1').waitFor();
      assert.equal(await page.locator('h1').count(), 1, route);
      const canonical = await page.locator('head link[rel="canonical"]').evaluateAll((els) => els.map((el) => el.href));
      assert.deepEqual(canonical, [origin + route]);
      const description = await page.locator('head meta[name="description"]').getAttribute('content');
      assert.ok(description && description.length > 20, route);
      const robots = await page.locator('head meta[name="robots"]').getAttribute('content');
      const noindex = (robots || '').toLowerCase().split(/[\s,]+/).includes('noindex');
      assert.equal(noindex, route.startsWith('/tool/'), route);
      const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
      assert.ok(schemas.length > 0, route);
      for (const schema of schemas) JSON.parse(schema);
      if (noindex) assert.ok(!schemas.some((s) => /"@type"\s*:\s*"(?:Product|Offer)"/.test(s)));
      const whatsapp = await page.locator('a[href*="wa.me/"]').evaluateAll((els) => els.map((el) => el.href));
      assert.ok(whatsapp.length > 0, `Missing inquiry link ${route}`);
      for (const href of whatsapp) assert.match(href, /^https:\/\/wa\.me\/\d+(?:\?|$)/);
      assert.ok(await page.locator('body').evaluate((el) => el.scrollWidth <= window.innerWidth + 2), `Horizontal overflow ${route} ${device}`);
      const screenshot = `${device}-${index}.png`;
      await page.screenshot({ path: `${dir}/${screenshot}`, fullPage: true });
      summary.pages.push({ route, device, status: response.status(), finalURL: page.url(), canonical, robots, schemaCount: schemas.length,
        inquiryLinks: whatsapp.length, screenshot, responseSHA256: createHash('sha256').update(await response.body()).digest('hex') });
    }
    await context.close();
  }
  const sitemap = await fetch(origin + '/sitemap.xml');
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  assert.ok(!xml.includes(origin + `/tool/${pending.slug}/`));
  summary.sitemap = { status: sitemap.status, pendingOfferExcluded: true, sha256: createHash('sha256').update(xml).digest('hex') };
  assert.deepEqual(summary.errors, [], 'JS console/page/resource errors');
  summary.status = 'PASS';
} catch (error) {
  summary.status = 'FAIL'; summary.failure = error.message;
  throw error;
} finally {
  if (browser) await browser.close();
  writeFileSync(`${dir}/summary.json`, JSON.stringify(summary, null, 2));
}
