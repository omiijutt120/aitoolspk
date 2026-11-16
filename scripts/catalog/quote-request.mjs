#!/usr/bin/env node
/**
 * Write the seller a spreadsheet instead of a question.
 *
 *   npm run catalog:quote-request
 *   npm run catalog:quote-request -- --collection netflix
 *
 * Output: reports/quotes/quote-request.csv plus a one-page summary with the
 * counts, the collections, and the exact WhatsApp message. The CSV has six
 * blank columns for the seller; everything before them is what the site
 * currently claims, including the date it was captured.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from '../lib/args.mjs';
import { toCsv } from '../lib/csv.mjs';
import {
  buildRequestRows,
  collectionSummary,
  REQUEST_COLUMNS,
} from './quotes.mjs';

const WHATSAPP = '+92 371 4549245';

const money = (value) => `PKR ${new Intl.NumberFormat('en-PK').format(value)}`;

function renderSummary(rows, { collection, quoteDates }) {
  const summary = collectionSummary(rows);
  const table = summary
    .map(
      (entry) =>
        `| ${entry.collection} | ${entry.plans} | ${money(entry.cheapest)} | ${money(entry.dearest)} | https://aitoolspk.tech/plans/${entry.collection}/ |`
    )
    .join('\n');
  const message = `Assalam o alaikum. I am re-checking the ${rows.length} listing${
    rows.length === 1 ? '' : 's'
  } on the site against today's stock and prices.

I have attached one CSV with a row per plan. Please fill these columns and send it back:
- seller_price_pkr — your current price in PKR for that exact plan
- seller_confirms — yes, no, or withdrawn
- seller_warranty — the replacement/coverage term, in your words
- seller_access — how the buyer receives it (private profile, own account, workspace slot, or the exact method)
- seller_renewal — whether it renews, and at what price
- notes — anything a buyer must know before paying

Rows you leave blank stay unpublished. I will not guess a price or a warranty term.

Thank you.`;
  return `# Seller quote request${collection ? ` — ${collection}` : ''}

**Listings awaiting confirmation:** ${rows.length}
**Captured:** ${quoteDates}
**Contact on file:** WhatsApp ${WHATSAPP}

Send \`quote-request.csv\` to the seller, then put the returned file at
\`reports/quotes/quote-response.csv\` and run:

\`\`\`
npm run catalog:quote-apply -- --quote-date YYYY-MM-DD
\`\`\`

A blank cell changes nothing. \`seller_confirms=yes\` changes the price and the
quote date; \`withdrawn\` marks the listing out of stock. Approval is never
changed by this command — a price is not resale authorization.

## Collections in this file

| Collection | Plans | Cheapest | Dearest | Page |
| --- | ---: | ---: | ---: | --- |
${table}

## Message to send

\`\`\`
${message}
\`\`\`
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2), {
    known: ['collection', 'out', 'help'],
  });
  if (args.has('help')) {
    console.log(
      'Usage: node scripts/catalog/quote-request.mjs [--collection <slug>] [--out reports/quotes]'
    );
    return 0;
  }
  const collection = args.get('collection', '');
  const outDir = args.get('out', path.join('reports', 'quotes'));
  const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8'));
  const rows = buildRequestRows(catalog, { collection });
  if (!rows.length) {
    console.error(
      collection
        ? `No pending listings for collection "${collection}".`
        : 'No pending listings. Nothing to request.'
    );
    return 1;
  }
  const quoteDates = [...new Set(rows.map((row) => row.quote_date))].sort();
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    path.join(outDir, 'quote-request.csv'),
    toCsv(rows, REQUEST_COLUMNS)
  );
  writeFileSync(
    path.join(outDir, 'quote-request-summary.md'),
    renderSummary(rows, {
      collection,
      quoteDates: quoteDates.join(', '),
    })
  );
  console.log(
    `Wrote ${rows.length} row(s) to ${path.join(outDir, 'quote-request.csv')}.`
  );
  console.log(
    `Quote dates in this file: ${quoteDates.join(', ')}. Summary: ${path.join(outDir, 'quote-request-summary.md')}.`
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
