#!/usr/bin/env node
/**
 * Ask Google for the index status of every URL in the sitemap.
 *
 * This is the one Search Console action that has an API: URL Inspection
 * reports the verdict, coverage state, crawl time and the canonical Google
 * chose, per URL. It does not replace "Request Indexing" (that has no API and
 * stays a click in the UI), but it replaces the guessing about which pages are
 * missing and turns the next recrawl into a measurement.
 *
 *   npm run gsc:inspect -- --dry-run
 *   npm run gsc:inspect
 *   npm run gsc:inspect -- --from live --limit 20
 *   npm run gsc:inspect -- --only /plans/
 *
 * Writes reports/gsc/index-status.csv and reports/gsc/index-status.json.
 * Quota: 2,000 inspections per property per day; a 188-URL sitemap is 10%.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from '../lib/args.mjs';
import { toCsv } from '../lib/csv.mjs';
import { getAccessToken, inspectUrl, sleep } from './client.mjs';
import { loadSitemap, ORIGIN } from './sitemap.mjs';

const SITE = 'sc-domain:aitoolspk.tech';
const HELP = `Usage: node scripts/gsc/inspect.mjs [options]

  --from live|out/sitemap.xml  where to read URLs (default out/sitemap.xml)
  --site <identifier>          Search Console property (default ${SITE})
  --limit <n>                  inspect at most n URLs
  --only <substring>           inspect URLs containing this text
  --delay <ms>                 pause between calls (default 150)
  --out <dir>                  report directory (default reports/gsc)
  --dry-run                    print the plan without calling Google
  --help

Needs GSC_ACCESS_TOKEN, or GSC_SERVICE_ACCOUNT_FILE /
GSC_SERVICE_ACCOUNT with a service account key that has been added as a user
on the property. Run "npm run gsc:sites" if the property identifier is unclear.`;

async function main() {
  const args = parseArgs(process.argv.slice(2), {
    known: ['from', 'site', 'limit', 'only', 'delay', 'out', 'dry-run', 'help'],
  });
  if (args.has('help')) {
    console.log(HELP);
    return 0;
  }
  const site = args.get('site', process.env.GSC_SITE || SITE);
  const outDir = args.get('out', path.join('reports', 'gsc'));
  const delay = args.number('delay', 150);
  const limit = args.number('limit', Infinity);
  const only = args.get('only', '');
  let urls = await loadSitemap({ from: args.get('from', 'out/sitemap.xml') });
  const sitemapUrls = urls.length;
  if (only) urls = urls.filter((url) => url.includes(only));
  if (Number.isFinite(limit)) urls = urls.slice(0, Math.max(0, limit));

  if (args.has('dry-run')) {
    console.log(
      `Would inspect ${urls.length} URL(s) on property ${site} (${ORIGIN}).`
    );
    for (const url of urls.slice(0, 5)) console.log(`  ${url}`);
    if (urls.length > 5) console.log(`  …and ${urls.length - 5} more`);
    console.log(
      'No request was made. Set the credential and run without --dry-run.'
    );
    return 0;
  }

  const { token, source } = await getAccessToken();
  console.log(`Inspecting ${urls.length} URL(s) on ${site} via ${source}.`);
  const rows = [];
  const failures = [];
  for (const [index, url] of urls.entries()) {
    try {
      rows.push(await inspectUrl({ token, site, url }));
    } catch (error) {
      failures.push({ url, error: error.message });
      console.error(`  FAIL ${url} — ${error.message}`);
    }
    if ((index + 1) % 25 === 0)
      console.log(`  ${index + 1}/${urls.length} inspected`);
    if (delay) await sleep(delay);
  }

  const byCoverage = {};
  const byVerdict = {};
  for (const row of rows) {
    const coverage = row.coverageState || '(none)';
    byCoverage[coverage] = (byCoverage[coverage] ?? 0) + 1;
    const verdict = row.verdict || '(none)';
    byVerdict[verdict] = (byVerdict[verdict] ?? 0) + 1;
  }
  const notIndexed = rows
    .filter((row) => row.verdict !== 'PASS')
    .map((row) => ({
      url: row.url,
      verdict: row.verdict,
      coverageState: row.coverageState,
      lastCrawlTime: row.lastCrawlTime,
    }));

  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    path.join(outDir, 'index-status.csv'),
    toCsv(
      rows,
      [
        'url',
        'verdict',
        'coverage_state',
        'indexing_state',
        'robots_state',
        'page_fetch_state',
        'last_crawl_time',
        'google_canonical',
        'user_canonical',
        'crawled_as',
        'sitemaps',
        'referring_urls',
      ].map((key) => ({
        key,
        header: key,
      }))
    )
  );
  const summary = {
    checkedAt: new Date().toISOString(),
    site,
    source,
    sitemapUrls,
    selectedUrls: urls.length,
    inspected: rows.length,
    failed: failures.length,
    byVerdict,
    byCoverage,
    notIndexed,
    failures,
  };
  writeFileSync(
    path.join(outDir, 'index-status.json'),
    `${JSON.stringify(summary, null, 2)}\n`
  );

  console.log(`\nVerdicts: ${JSON.stringify(byVerdict)}`);
  console.log('Coverage states:');
  for (const [coverage, count] of Object.entries(byCoverage).sort(
    (a, b) => b[1] - a[1]
  ))
    console.log(`  ${count.toString().padStart(4)}  ${coverage}`);
  console.log(
    `\nWrote ${path.join(outDir, 'index-status.csv')} and index-status.json.`
  );
  console.log(
    'Next: npm run gsc:queue — it turns the non-PASS rows into a click list.'
  );
  if (failures.length) {
    console.error(`${failures.length} inspection(s) failed; see the JSON.`);
    return 1;
  }
  return 0;
}

main().then(
  (code) => {
    process.exitCode = code;
  },
  (error) => {
    console.error(error.message);
    process.exitCode = 1;
  }
);
