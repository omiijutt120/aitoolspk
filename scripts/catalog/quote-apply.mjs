#!/usr/bin/env node
/**
 * Apply a returned seller sheet to the catalogue.
 *
 *   npm run catalog:quote-apply -- --quote-date 2026-11-16
 *   npm run catalog:quote-apply -- --quote-date 2026-11-16 --dry-run
 *
 * The date is required and is written only where a row was actually confirmed,
 * because the published quote date has to be the date the seller confirmed it,
 * not the date the script ran. The command refuses the whole file if one row is
 * ambiguous, and it never changes `approval`.
 */
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from '../lib/args.mjs';
import { parseCsv } from '../lib/csv.mjs';
import { applyResponse, publicationReadiness, QuoteError } from './quotes.mjs';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function main() {
  const args = parseArgs(process.argv.slice(2), {
    known: ['input', 'quote-date', 'dry-run', 'out', 'help'],
  });
  if (args.has('help')) {
    console.log(`Usage: node scripts/catalog/quote-apply.mjs --quote-date YYYY-MM-DD [options]

  --input <file>       returned sheet (default reports/quotes/quote-response.csv)
  --quote-date <date>  the date the seller confirmed the prices (required)
  --dry-run            validate and print, but do not write data/catalog.json
  --out <dir>          receipt directory (default reports/quotes)`);
    return 0;
  }
  const quoteDate = args.get('quote-date', '');
  if (!quoteDate)
    throw new Error(
      'Pass --quote-date YYYY-MM-DD: the seller confirmation date is part of the price.'
    );
  if (quoteDate > today())
    throw new Error(`--quote-date ${quoteDate} is in the future.`);
  const inputFile = args.get(
    'input',
    path.join('reports', 'quotes', 'quote-response.csv')
  );
  const outDir = args.get('out', path.join('reports', 'quotes'));
  const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8'));
  const reviews = JSON.parse(
    readFileSync(path.join('data', 'seo', 'editorial.json'), 'utf8')
  );
  const reviewMap = Array.isArray(reviews)
    ? Object.fromEntries(
        reviews
          .filter((review) => review.id)
          .map((review) => [review.id, review])
      )
    : reviews;
  const rows = parseCsv(readFileSync(inputFile, 'utf8'));
  if (!rows.length) throw new Error(`${inputFile} has no data rows.`);

  const result = applyResponse(catalog, rows, {
    quoteDate,
    reviews: reviewMap,
  });
  const confirmed = result.changes.filter((c) => c.confirmed === 'yes');
  const declined = result.changes.filter((c) => c.confirmed === 'no');
  const withdrawn = result.changes.filter((c) => c.confirmed === 'withdrawn');
  const changed = result.changes.filter((c) => !c.unchanged);

  const receipt = {
    appliedAt: new Date().toISOString(),
    quoteDate,
    input: inputFile,
    dryRun: args.has('dry-run'),
    counts: {
      rows: result.changes.length,
      confirmed: confirmed.length,
      declined: declined.length,
      withdrawn: withdrawn.length,
      changed: changed.length,
      priceChanges: confirmed.filter(
        (change) => change.before.price !== change.after.price
      ).length,
    },
    warnings: result.warnings,
    changes: result.changes,
    publicationReadiness: publicationReadiness(result.catalog, reviewMap),
  };

  if (!args.has('dry-run') && changed.length) {
    const target = path.join('data', 'catalog.json');
    const temporary = `${target}.tmp`;
    writeFileSync(temporary, `${JSON.stringify(result.catalog, null, 2)}\n`);
    renameSync(temporary, target);
  }
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    path.join(outDir, 'quote-apply-receipt.json'),
    `${JSON.stringify(receipt, null, 2)}\n`
  );

  console.log(
    `${args.has('dry-run') ? 'Would apply' : 'Applied'} ${confirmed.length} confirmed, ${declined.length} declined, ${withdrawn.length} withdrawn; ${changed.length} row(s) change the catalogue.`
  );
  for (const warning of result.warnings) console.warn(`  warning: ${warning}`);
  console.log(
    `Publication states after this file: ${JSON.stringify(receipt.publicationReadiness)}`
  );
  console.log(`Receipt: ${path.join(outDir, 'quote-apply-receipt.json')}`);
  return 0;
}

if (
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url
) {
  try {
    process.exitCode = main();
  } catch (error) {
    if (error instanceof QuoteError) console.error(error.message);
    else console.error(error.message);
    process.exitCode = 1;
  }
}
