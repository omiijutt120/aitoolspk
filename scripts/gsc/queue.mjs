#!/usr/bin/env node
/**
 * Turn index status into a click list.
 *
 * "Request Indexing" is the one part of Search Console with no API, so it stays
 * manual by definition. What can be removed is the fumbling: this command
 * writes the exact URLs, in priority order, as a local page whose links open
 * URL Inspection with the URL already filled in.
 *
 * The list has three sources, in this order:
 *   1. reports/gsc/index-status.json — Google's own verdict, when it has been run
 *   2. the 10 November site: probe, for pages that predate the API run
 *   3. the pages this repository changed, which need a recrawl to show the new title
 *
 *   npm run gsc:queue
 *   npm run gsc:queue -- --site https://aitoolspk.tech/
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from '../lib/args.mjs';
import { ORIGIN } from './sitemap.mjs';

const SITE = 'sc-domain:aitoolspk.tech';

/** Measured 10 November 2026 with signed-out site: queries. See docs/seo. */
const BASELINE = [
  ['/plans/gemini/', "absent from Google's index on 10 Nov (site: probe)"],
  ['/plans/claude/', "absent from Google's index on 10 Nov (site: probe)"],
  ['/plans/grok/', "absent from Google's index on 10 Nov (site: probe)"],
  ['/plans/youtube/', "absent from Google's index on 10 Nov (site: probe)"],
  ['/plans/capcut/', "absent from Google's index on 10 Nov (site: probe)"],
  ['/plans/notion/', "absent from Google's index on 10 Nov (site: probe)"],
  ['/plans/kling/', "absent from Google's index on 10 Nov (site: probe)"],
  ['/plans/tiktok/', "absent from Google's index on 10 Nov (site: probe)"],
  ['/plans/canva/', "absent from Google's index on 10 Nov (site: probe)"],
  ['/plans/tele/', "absent from Google's index on 10 Nov (site: probe)"],
  ['/plans/grammarly/', "absent from Google's index on 10 Nov (site: probe)"],
  ['/plans/google/', 'page 1 missing on 10 Nov; page 2 was indexed'],
  ['/plans/microsoft/', 'page 1 missing on 10 Nov; page 2 was indexed'],
];

/** Surfaces whose title, H1 or description changed in the 16 November release. */
const RELEASE = [
  '/',
  '/price-index/',
  '/categories/',
  '/plans/netflix/',
  '/faq/',
  ...[
    'youtube',
    'discord',
    'tiktok',
    'vieon',
    'fpt-play',
    'netflix',
    'tv360',
    'spotify',
    'galaxy-play',
    'iqiyi',
    'apple',
    'youku',
    'gemini',
    'roblox',
    'xbox',
  ].map((slug) => `/plans/${slug}/`),
];

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]
  );

export function inspectDeepLink(site, url) {
  return `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(
    site
  )}&id=${encodeURIComponent(url)}`;
}

/**
 * @param {{ site?: string, status?: object | null, origin?: string }} options
 */
export function buildQueue({
  site = SITE,
  status = null,
  origin = ORIGIN,
} = {}) {
  const queue = new Map();
  const add = (pathname, reason, kind) => {
    const url = new URL(pathname, origin).href;
    if (!queue.has(url))
      queue.set(url, { url, reason, kind, coverageState: '' });
    return queue.get(url);
  };
  for (const [pathname, reason] of BASELINE) add(pathname, reason, 'probe');
  for (const pathname of RELEASE)
    add(
      pathname,
      'changed on 16 Nov — needs a recrawl to show the new title',
      'release'
    );

  // Only a run that covered the whole sitemap can prove a URL is indexed by
  // omission; a --limit run must not remove anything from the queue.
  const complete =
    status &&
    Number.isFinite(status.inspected) &&
    Number.isFinite(status.sitemapUrls) &&
    status.inspected >= status.sitemapUrls;
  const notIndexedUrls = new Set(
    (status?.notIndexed ?? []).map((row) => row.url)
  );
  for (const row of status?.notIndexed ?? []) {
    const entry =
      queue.get(row.url) ??
      add(row.url, row.coverageState || row.verdict, 'inspection');
    entry.coverageState = row.coverageState ?? '';
    entry.reason = `${row.coverageState || row.verdict} — URL Inspection, ${status.checkedAt.slice(0, 10)}`;
  }

  const indexed = [];
  if (complete)
    for (const entry of queue.values())
      if (entry.kind !== 'release' && !notIndexedUrls.has(entry.url))
        indexed.push(entry);

  return {
    site,
    source: status
      ? `URL Inspection run at ${status.checkedAt}`
      : 'the 10 November site: probe',
    complete: Boolean(complete),
    queue: [...queue.values()].filter((entry) => !indexed.includes(entry)),
    indexed,
  };
}

function renderHtml({ site, source, queue }) {
  const rows = queue
    .map(
      (entry, index) => `      <tr>
        <td class="n">${index + 1}</td>
        <td><a href="${escapeHtml(inspectDeepLink(site, entry.url))}" target="_blank" rel="noreferrer">${escapeHtml(entry.url.replace(ORIGIN, ''))}</a></td>
        <td>${escapeHtml(entry.reason)}</td>
      </tr>`
    )
    .join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Request Indexing queue — ${escapeHtml(site)}</title>
<style>
  body { font: 15px/1.5 system-ui, sans-serif; margin: 32px; max-width: 980px; color: #111; }
  h1 { font-size: 22px; } p { margin: 8px 0 16px; color: #333; }
  table { border-collapse: collapse; width: 100%; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #ddd; vertical-align: top; }
  th { font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: #555; }
  a { color: #0b57d0; } code { background: #f3f3f3; padding: 1px 4px; }
  .n { width: 32px; color: #777; }
</style>
</head>
<body>
<h1>Request Indexing queue</h1>
<p>${queue.length} URL(s). Source: ${escapeHtml(source)}. Each link opens URL Inspection with the URL filled in; click <strong>Request Indexing</strong>, then move to the next row.</p>
<p>Property: <code>${escapeHtml(site)}</code>. After the requests, re-run <code>npm run gsc:inspect</code> to record what Google says.</p>
<table>
  <thead><tr><th class="n">#</th><th>URL</th><th>Why it is in the queue</th></tr></thead>
  <tbody>
${rows}
  </tbody>
</table>
</body>
</html>
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2), {
    known: ['site', 'status', 'out', 'help'],
  });
  if (args.has('help')) {
    console.log(
      'Usage: node scripts/gsc/queue.mjs [--site <identifier>] [--status reports/gsc/index-status.json] [--out reports/gsc]'
    );
    return 0;
  }
  const site = args.get('site', SITE);
  const statusFile = args.get(
    'status',
    path.join('reports', 'gsc', 'index-status.json')
  );
  const outDir = args.get('out', path.join('reports', 'gsc'));
  const status = existsSync(statusFile)
    ? JSON.parse(readFileSync(statusFile, 'utf8'))
    : null;
  const result = buildQueue({ site, status });
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, 'request-indexing.html'), renderHtml(result));
  writeFileSync(
    path.join(outDir, 'request-indexing.txt'),
    [
      `Request Indexing queue — ${site}`,
      `Source: ${result.source}`,
      '',
      ...result.queue.map(
        (entry, index) => `${index + 1}. ${entry.url}\n   ${entry.reason}`
      ),
      '',
      'Open reports/gsc/request-indexing.html for one-click inspection links.',
      '',
    ].join('\n')
  );
  console.log(
    `Wrote ${result.queue.length} request(s) to ${path.join(outDir, 'request-indexing.html')}.`
  );
  if (result.indexed.length)
    console.log(
      `${result.indexed.length} baseline URL(s) now pass inspection and were removed from the queue.`
    );
  return 0;
}

if (
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url
) {
  try {
    process.exitCode = main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
