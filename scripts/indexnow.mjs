#!/usr/bin/env node
/**
 * Submit the exported sitemap to IndexNow.
 *
 * IndexNow feeds Bing, Yandex, Seznam and Naver. Bing's index also backs
 * Copilot and several AI answer surfaces, so this is the fastest free way to
 * tell those crawlers that a page changed. Google ignores IndexNow and finds
 * the same URLs through sitemap.xml, which is why both exist.
 *
 * Run it only after the deployment is live: the protocol verifies ownership by
 * fetching the key file from the production host.
 *
 *   node scripts/indexnow.mjs --dry-run
 *   node scripts/indexnow.mjs
 */
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const HOST = 'aitoolspk.tech';
const ORIGIN = `https://${HOST}`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const dryRun = process.argv.includes('--dry-run');

const keyFiles = (await readdir('public')).filter((name) =>
  /^[a-f0-9]{32}\.txt$/i.test(name)
);
if (keyFiles.length !== 1)
  throw new Error(
    `Expected exactly one IndexNow key file in public/, found ${keyFiles.length}`
  );
const keyFile = keyFiles[0];
const key = keyFile.replace(/\.txt$/i, '');
const keyBody = (await readFile(`public/${keyFile}`, 'utf8')).trim();
if (keyBody !== key)
  throw new Error(`${keyFile} must contain exactly the key "${key}"`);
const keyLocation = `${ORIGIN}/${keyFile}`;

if (!existsSync('out/sitemap.xml'))
  throw new Error('Run `npm run build` first: out/sitemap.xml is missing.');
const sitemap = await readFile('out/sitemap.xml', 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) throw new Error('Sitemap contains no URLs');
if (urlList.length > 10000)
  throw new Error('IndexNow accepts at most 10,000 URLs per request');

const payload = { host: HOST, key, keyLocation, urlList };
console.log(`IndexNow: ${urlList.length} URLs from out/sitemap.xml`);
console.log(`Key file: ${keyLocation}`);

if (dryRun) {
  console.log('Dry run — nothing submitted.');
  process.exit(0);
}

const ownership = await fetch(`${keyLocation}?indexnow-preflight=1`, {
  redirect: 'follow',
});
if (!ownership.ok)
  throw new Error(
    `Key file is not live at ${keyLocation} (HTTP ${ownership.status}). Deploy first, then retry.`
  );

const response = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});
const detail = await response.text();
await mkdir('reports', { recursive: true });
await writeFile(
  'reports/indexnow.json',
  JSON.stringify(
    {
      submittedAt: new Date().toISOString(),
      endpoint: ENDPOINT,
      status: response.status,
      urls: urlList.length,
      detail: detail.slice(0, 2000),
    },
    null,
    2
  ) + '\n'
);
console.log(`IndexNow responded ${response.status}`);
if (detail) console.log(detail.slice(0, 2000));
if (!response.ok) process.exitCode = 1;
