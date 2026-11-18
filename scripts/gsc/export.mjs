#!/usr/bin/env node
/**
 * Pull the same three tables the owner exports by hand from Search Console:
 * daily totals, top queries and top pages.
 *
 * The hand export is the reason the audit could not be repeated on demand. This
 * writes the three tables into one dated folder so next month's numbers are
 * comparable with this month's, and so a page-level row can be read without
 * opening the UI.
 *
 *   npm run gsc:export
 *   npm run gsc:export -- --days 90 --out reports/gsc/export-2026-11-16
 *
 * Search Console withholds rows below its own threshold; the summary records
 * how many rows came back so a shrinking table is never mistaken for a drop in
 * impressions.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from '../lib/args.mjs';
import { toSafeCsv } from '../lib/csv.mjs';
import { getAccessToken, querySearchAnalytics } from './client.mjs';
import { analyzeDirectory } from './analyze.mjs';

const SITE = 'sc-domain:aitoolspk.tech';
const HELP = `Usage: node scripts/gsc/export.mjs [options]

  --site <identifier>   Search Console property (default ${SITE})
  --days <n>            length of the window ending yesterday (default 90)
  --start <YYYY-MM-DD>  explicit start date, overrides --days
  --end <YYYY-MM-DD>    explicit end date (default: yesterday)
  --out <dir>           where to write (default reports/gsc/export)
  --help

Writes daily.csv, queries.csv, pages.csv, query-pages.csv, countries.csv,
devices.csv, search-appearances.csv, query-segments.csv and summary.json.`;

const iso = (date) => date.toISOString().slice(0, 10);
const percent = (value) => `${(value * 100).toFixed(2)}%`;
const round = (value, digits = 2) => Number(value.toFixed(digits));

function windowFrom({ days, end }) {
  const endDate = end ? new Date(`${end}T00:00:00Z`) : new Date();
  if (!end) endDate.setUTCDate(endDate.getUTCDate() - 1);
  if (Number.isNaN(endDate.getTime()))
    throw new Error('--end must be a date like 2026-11-15');
  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - (days - 1));
  return { startDate: iso(startDate), endDate: iso(endDate) };
}

async function main() {
  const args = parseArgs(process.argv.slice(2), {
    known: ['site', 'days', 'start', 'end', 'out', 'help'],
  });
  if (args.has('help')) {
    console.log(HELP);
    return 0;
  }
  const site = args.get('site', process.env.GSC_SITE || SITE);
  const days = args.number('days', 90);
  if (!(days >= 1)) throw new Error('--days must be at least 1');
  let { startDate, endDate } = windowFrom({ days, end: args.get('end') });
  if (args.get('start')) startDate = args.get('start');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate))
    throw new Error('--start must be a date like 2026-08-18');
  if (startDate > endDate)
    throw new Error(`The window is empty: ${startDate} → ${endDate}`);

  const outDir = args.get('out', path.join('reports', 'gsc', 'export'));
  const { token, source } = await getAccessToken();
  const common = { token, site, startDate, endDate };
  console.log(`Reading ${site} from ${startDate} to ${endDate} (${source}).`);

  const [daily, queries, pages, queryPages, countries, devices, appearances] =
    await Promise.all([
      querySearchAnalytics({ ...common, dimensions: ['date'] }),
      querySearchAnalytics({ ...common, dimensions: ['query'] }),
      querySearchAnalytics({ ...common, dimensions: ['page'] }),
      querySearchAnalytics({ ...common, dimensions: ['query', 'page'] }),
      querySearchAnalytics({ ...common, dimensions: ['country'] }),
      querySearchAnalytics({ ...common, dimensions: ['device'] }),
      querySearchAnalytics({ ...common, dimensions: ['searchAppearance'] }),
    ]);

  const dailyRows = daily.map((row) => ({
    date: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: percent(row.ctr),
    position: round(row.position),
  }));
  const queryRows = queries.map((row) => ({
    query: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: percent(row.ctr),
    position: round(row.position),
  }));
  const pageRows = pages.map((row) => ({
    page: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: percent(row.ctr),
    position: round(row.position),
  }));

  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    path.join(outDir, 'daily.csv'),
    toSafeCsv(dailyRows, Object.keys(dailyRows[0] ?? { date: '' }))
  );
  writeFileSync(
    path.join(outDir, 'queries.csv'),
    toSafeCsv(queryRows, Object.keys(queryRows[0] ?? { query: '' }))
  );
  writeFileSync(
    path.join(outDir, 'pages.csv'),
    toSafeCsv(pageRows, Object.keys(pageRows[0] ?? { page: '' }))
  );
  for (const [file, input, keys] of [
    ['query-pages.csv', queryPages, ['query', 'page']],
    ['countries.csv', countries, ['country']],
    ['devices.csv', devices, ['device']],
    ['search-appearances.csv', appearances, ['searchAppearance']],
  ]) {
    const rows = input.map((row) => ({
      ...Object.fromEntries(keys.map((key, index) => [key, row.keys[index]])),
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: percent(row.ctr),
      position: round(row.position),
    }));
    writeFileSync(
      path.join(outDir, file),
      toSafeCsv(rows, [...keys, 'clicks', 'impressions', 'ctr', 'position'])
    );
  }
  const querySegments = analyzeDirectory(outDir);

  const total = (rows, key) => rows.reduce((sum, row) => sum + row[key], 0);
  const summary = {
    checkedAt: new Date().toISOString(),
    site,
    source,
    startDate,
    endDate,
    rowCounts: {
      daily: dailyRows.length,
      queries: queryRows.length,
      pages: pageRows.length,
      queryPages: queryPages.length,
      countries: countries.length,
      devices: devices.length,
      appearances: appearances.length,
    },
    querySegments,
    limitations: [
      'Query and page totals are independent dimensions; only query-pages.csv pairs them.',
      'Search Console may omit anonymized queries; unreported query metrics are not a search-intent segment.',
      ...(queryPages.length === 25000
        ? [
            'Query-page rows reached the 25,000-row API limit; this export may be incomplete.',
          ]
        : []),
    ],
    // Reported separately on purpose: Search Console's own tables disagree.
    totals: {
      daily: {
        clicks: total(dailyRows, 'clicks'),
        impressions: total(dailyRows, 'impressions'),
      },
      queries: {
        clicks: total(queryRows, 'clicks'),
        impressions: total(queryRows, 'impressions'),
      },
      pages: {
        clicks: total(pageRows, 'clicks'),
        impressions: total(pageRows, 'impressions'),
      },
    },
    topQueries: queryRows.slice(0, 10),
    topPages: pageRows.slice(0, 10),
  };
  writeFileSync(
    path.join(outDir, 'summary.json'),
    `${JSON.stringify(summary, null, 2)}\n`
  );
  writeFileSync(
    path.join('reports', 'gsc', 'latest.json'),
    `${JSON.stringify({ dir: outDir, checkedAt: summary.checkedAt, startDate, endDate }, null, 2)}\n`
  );

  console.log(
    `Rows: ${summary.rowCounts.queries} queries, ${summary.rowCounts.pages} pages, ${summary.rowCounts.daily} days.`
  );
  console.log(
    `Clicks/impressions — daily ${summary.totals.daily.clicks}/${summary.totals.daily.impressions}, ` +
      `queries ${summary.totals.queries.clicks}/${summary.totals.queries.impressions}, ` +
      `pages ${summary.totals.pages.clicks}/${summary.totals.pages.impressions}.`
  );
  console.log(`Wrote ${outDir}.`);
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
