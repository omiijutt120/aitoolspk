import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import * as policy from '../scripts/production-policy.mjs';

const owned = 'https://aitoolspk.tech';
const legacy = process.env.REDIRECT_LEGACY_SNAPSHOT;
const smoke = readFileSync(legacy || new URL('../scripts/production-smoke.mjs', import.meta.url), 'utf8');
// Legacy mode executes the original callback/expression, not a missing-export fallback.
const legacyRoute = legacy ? new Function('productionRequestAllowed', `return ${smoke.match(/await context\.route\('\*\*\/\*', (.+)\);/)[1]}`)(policy.productionRequestAllowed) : null;
const legacySitemap = legacy ? new Function('fetch', 'origin', `return ${smoke.match(/const sitemap = (await fetch\(.+\));/)[1].replace(/^await /, '')}`) : null;

async function fixture(run) {
  let targetHits = 0;
  let sourceHits = 0;
  const target = createServer((req, res) => { targetHits++; res.end('<h1>escaped</h1>'); });
  const source = createServer((req, res) => {
    sourceHits++;
    if (req.url.startsWith('/redirect/')) {
      res.writeHead(Number(req.url.split('/')[2]), { Location: `http://127.0.0.1:${target.address().port}/escaped` });
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' }); res.end('<h1>normal</h1>');
    }
  });
  try {
    for (const server of [target, source]) await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    await run({ source: `http://127.0.0.1:${source.address().port}`, targetHits: () => targetHits, sourceHits: () => sourceHits });
  } finally {
    for (const server of [source, target]) {
      server.closeAllConnections();
      await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  }
}

async function browserVisit(f, path) {
  const browser = await chromium.launch({ channel: 'chrome', chromiumSandbox: true, headless: true });
  try {
    const context = await browser.newContext({ ignoreHTTPSErrors: false, serviceWorkers: 'block' });
    let intercepted = 0;
    await context.route('**/*', async (route) => {
      intercepted++;
      const request = route.request();
      // TEST ONLY: replace the transport, never the production allow-list.
      // Legacy continue uses loopback navigation with the owned logical identity.
      // New helper sees the real owned URL and route.fetch alone goes to loopback.
      const facade = new Proxy(route, { get(object, key) {
        if (key === 'request' && legacy) return () => ({ url: () => request.url().startsWith(f.source) ? owned + path : request.url(), method: () => request.method() });
        if (key === 'fetch') return (options) => route.fetch({ ...options, url: f.source + new URL(request.url()).pathname });
        const value = Reflect.get(object, key); return typeof value === 'function' ? value.bind(object) : value;
      } });
      await (legacy ? legacyRoute(facade) : policy.guardProductionRoute(facade));
    });
    const page = await context.newPage();
    let response;
    let error;
    try { response = await page.goto((legacy ? f.source : owned) + path, { waitUntil: 'load', timeout: 10000 }); }
    catch (failure) { error = failure.message; }
    return { status: response?.status(), text: response ? await page.locator('h1').textContent() : null, error, intercepted };
  } finally { await browser.close(); }
}

test('browser rejects redirect before any off-origin target request (real sandboxed Chromium)', { timeout: 60000 }, async () => {
  await fixture(async (f) => {
    for (const status of [301, 302, 303, 307, 308]) {
      const result = await browserVisit(f, `/redirect/${status}`);
      console.log(JSON.stringify({ mode: legacy ? 'legacy' : 'guarded', path: 'browser', redirectStatus: status, sourceHits: f.sourceHits(), targetHits: f.targetHits(), ...result }));
      assert.equal(f.targetHits(), 0, 'off-origin redirect target must receive NO browser request');
      assert.ok(result.error, 'redirect must abort navigation');
    }
    assert.equal(f.sourceHits(), 5);
  });
});

test('browser preserves normal 200 response', { timeout: 30000 }, async () => {
  await fixture(async (f) => {
    const result = await browserVisit(f, '/normal');
    assert.equal(result.status, 200); assert.equal(result.text, 'normal');
    assert.equal(f.sourceHits(), 1); assert.equal(f.targetHits(), 0);
  });
});

async function sitemapVisit(f, path) {
  const original = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.equal(new URL(url).origin, owned, 'test transport only accepts logical owned requests');
    const response = await original(f.source + path, options);
    // Preserve the logical URL only for the initial fixture response.
    return new Proxy(response, { get(object, key) {
      if (key === 'url') return response.url.startsWith(f.source) ? owned + path : response.url;
      const value = Reflect.get(object, key, object); return typeof value === 'function' ? value.bind(object) : value;
    } });
  };
  try {
    return await (legacy ? legacySitemap(globalThis.fetch, owned) : policy.fetchProductionSitemap(owned + path));
  } finally { globalThis.fetch = original; }
}

test('sitemap rejects redirects before any off-origin target request (real native fetch)', { timeout: 30000 }, async () => {
  await fixture(async (f) => {
    for (const status of [301, 302, 303, 307, 308]) {
      let error;
      try { await sitemapVisit(f, `/redirect/${status}`); } catch (failure) { error = failure.message; }
      console.log(JSON.stringify({ mode: legacy ? 'legacy' : 'guarded', path: 'sitemap', redirectStatus: status, sourceHits: f.sourceHits(), targetHits: f.targetHits(), error }));
      assert.equal(f.targetHits(), 0, 'off-origin redirect target must receive NO sitemap request');
      assert.match(error || '', /redirect/i);
    }
    assert.equal(f.sourceHits(), 5);
  });
});

test('sitemap preserves normal 200 response', async () => {
  await fixture(async (f) => {
    const response = await sitemapVisit(f, '/normal');
    assert.equal(response.status, 200); assert.match(await response.text(), /normal/);
    assert.equal(f.sourceHits(), 1); assert.equal(f.targetHits(), 0);
  });
});

if (!legacy) {
  test('guarded entry points reject disallowed URL/method before transport', async () => {
    for (const [url, method] of [
      ['https://evil.test/', 'GET'], ['http://aitoolspk.tech/', 'GET'],
      ['https://aitoolspk.tech:8443/', 'HEAD'], ['https://aitoolspk.tech/', 'POST'],
      ['https://user:pass@aitoolspk.tech/', 'GET'], ['https://aitoolspk.tech.evil.test/', 'GET'],
    ]) {
      let aborted = 0;
      let transports = 0;
      await policy.guardProductionRoute({
        request: () => ({ url: () => url, method: () => method }),
        abort: async () => { aborted++; },
        fetch: () => { transports++; throw new Error('unexpected transport'); },
      });
      assert.equal(aborted, 1); assert.equal(transports, 0);
      const original = globalThis.fetch;
      globalThis.fetch = () => { transports++; throw new Error('unexpected transport'); };
      try {
        if (method === 'GET') await assert.rejects(policy.fetchProductionSitemap(url), /Disallowed/);
      } finally { globalThis.fetch = original; }
      assert.equal(transports, 0);
    }
    assert.equal(policy.productionRequestAllowed(owned + '/', 'HEAD'), true);
  });

  test('sitemap verifies final response URL independently of redirect status', async () => {
    const original = globalThis.fetch;
    let cancelled = false;
    globalThis.fetch = async () => ({ status: 200, url: 'https://evil.test/', body: { cancel: async () => { cancelled = true; } } });
    try { await assert.rejects(policy.fetchProductionSitemap(owned + '/sitemap.xml'), /response URL/); }
    finally { globalThis.fetch = original; }
    assert.equal(cancelled, true);
  });

  test('smoke invokes guarded paths without weakening sandbox or TLS', () => {
    assert.match(smoke, /context\.route\('\*\*\/\*', guardProductionRoute\)/);
    assert.match(smoke, /await fetchProductionSitemap\(origin \+ '\/sitemap\.xml'\)/);
    assert.doesNotMatch(smoke, /route\.continue\(|await fetch\(/);
    assert.match(smoke, /chromiumSandbox: true/); assert.match(smoke, /ignoreHTTPSErrors: false/);
  });
}
