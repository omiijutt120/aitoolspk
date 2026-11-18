#!/usr/bin/env node
/** Analyze a Search Console queries.csv export without account credentials. */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from '../lib/args.mjs';
import { parseCsv, toSafeCsv } from '../lib/csv.mjs';
import { analyzeQueries } from './segments.mjs';

export function analyzeDirectory(dir) {
  const names = new Map(
    readdirSync(dir).map((name) => [name.toLowerCase(), name])
  );
  const queryFile = path.join(dir, names.get('queries.csv') ?? 'queries.csv');
  if (!existsSync(queryFile)) throw new Error(`Missing Queries.csv in ${dir}`);
  const queryRows = parseCsv(readFileSync(queryFile, 'utf8'));
  let dailyTotals;
  const dailyFile = path.join(
    dir,
    names.get('daily.csv') ?? names.get('chart.csv') ?? 'daily.csv'
  );
  if (existsSync(dailyFile)) {
    const daily = parseCsv(readFileSync(dailyFile, 'utf8'));
    dailyTotals = { clicks: 0, impressions: 0 };
    for (const row of daily) {
      const rawClicks = row.clicks ?? row.Clicks ?? '';
      const rawImpressions = row.impressions ?? row.Impressions ?? '';
      const clicks = Number(rawClicks);
      const impressions = Number(rawImpressions);
      if (
        !/^\d+$/.test(rawClicks) ||
        !/^\d+$/.test(rawImpressions) ||
        !Number.isSafeInteger(clicks) ||
        !Number.isSafeInteger(impressions)
      )
        throw new Error(`Invalid daily metrics in ${dailyFile}`);
      dailyTotals.clicks += clicks;
      dailyTotals.impressions += impressions;
    }
  }
  const result = analyzeQueries(queryRows, { dailyTotals });
  writeFileSync(
    path.join(dir, 'query-segments.csv'),
    toSafeCsv(result.detailed, ['query', 'segment', 'clicks', 'impressions'])
  );
  writeFileSync(
    path.join(dir, 'query-segment-summary.json'),
    `${JSON.stringify(result.summary, null, 2)}\n`
  );
  return result.summary;
}

if (
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url
) {
  try {
    const args = parseArgs(process.argv.slice(2), { known: ['dir', 'help'] });
    if (args.has('help'))
      console.log('Usage: npm run gsc:analyze -- --dir reports/gsc/export');
    else {
      const dir = args.get('dir', path.join('reports', 'gsc', 'export'));
      const summary = analyzeDirectory(dir);
      console.log(
        `Analyzed ${summary.visibleQueryRows.queries} visible query rows in ${dir}.`
      );
      console.log(JSON.stringify(summary, null, 2));
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
