#!/usr/bin/env node
/**
 * Verify backlink listings against the live web.
 *
 * A backlink is only worth recording once something is actually on the page.
 * This script fetches each `listing_url` from data/seo/backlinks.csv and reports:
 *
 *   linked        the page is up and contains an anchor to the site
 *   dofollow      ... and the anchor carries no nofollow/sponsored/ugc rel
 *   mentioned     the domain appears as text but not as a link
 *   no-link       the page is up but does not reference the site at all
 *   blocked       the host refuses non-browser clients (403/429/503) - check by hand
 *   missing       the listing URL 404s or is gone
 *   unreachable   DNS/connection failure
 *
 * Usage:
 *   npm run seo:backlinks
 *   npm run seo:backlinks -- --csv path/to/file.csv
 *   npm run seo:backlinks -- --url https://example.com/listing
 *
 * Writes reports/seo/backlinks.json and exits non-zero only on `missing` or
 * `unreachable`, so bot-gated hosts never fail a build.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const SITE = /(?:https?:\/\/)?(?:www\.)?aitoolspk\.tech/i;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const TIMEOUT_MS = 25000;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      if (row.some((v) => v.trim())) rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    if (row.some((v) => v.trim())) rows.push(row);
  }
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));
  return rows.slice(1).map((values) => {
    const record = {};
    header.forEach((key, index) => {
      record[key] = (values[index] ?? '').trim();
    });
    return record;
  });
}

function relOf(anchor) {
  const rel = (anchor.match(/\brel\s*=\s*["']([^"']*)["']/i) || [, ''])[1];
  return rel.toLowerCase().split(/\s+/).filter(Boolean);
}

function anchorsToSite(html) {
  const found = [];
  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    const tag = match[0];
    const href = (tag.match(/\bhref\s*=\s*["']([^"']*)["']/i) || [, ''])[1];
    if (!SITE.test(href)) continue;
    const rel = relOf(tag);
    found.push({
      href,
      rel,
      nofollow: rel.some((v) => ['nofollow', 'sponsored', 'ugc'].includes(v)),
    });
  }
  return found;
}

async function check(url) {
  const started = Date.now();
  const base = { url, checked: new Date().toISOString() };
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const result = {
      ...base,
      httpStatus: response.status,
      finalUrl: response.url,
      ms: Date.now() - started,
    };
    if ([403, 429, 503, 999].includes(response.status))
      return { ...result, status: 'blocked', detail: 'host refuses non-browser clients' };
    if (response.status === 404 || response.status === 410)
      return { ...result, status: 'missing', detail: `HTTP ${response.status}` };
    if (!response.ok)
      return { ...result, status: 'missing', detail: `HTTP ${response.status}` };

    const html = await response.text();
    const anchors = anchorsToSite(html);
    if (anchors.length) {
      const dofollow = anchors.filter((a) => !a.nofollow);
      return {
        ...result,
        status: dofollow.length ? 'dofollow' : 'linked',
        anchorCount: anchors.length,
        dofollowCount: dofollow.length,
        sample: anchors.slice(0, 3).map((a) => ({ href: a.href, rel: a.rel.join(' ') })),
      };
    }
    if (SITE.test(html))
      return { ...result, status: 'mentioned', detail: 'domain appears as text, not a link' };
    return { ...result, status: 'no-link', detail: 'page reachable, no reference found' };
  } catch (error) {
    return {
      ...base,
      status: 'unreachable',
      httpStatus: 0,
      detail: `${error.name}: ${String(error.message).slice(0, 80)}`,
      ms: Date.now() - started,
    };
  }
}

const args = process.argv.slice(2);
const valueOf = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};

const single = valueOf('--url');
const csvPath = path.resolve(valueOf('--csv') || 'data/seo/backlinks.csv');

let rows;
if (single) rows = [{ platform: 'ad-hoc', listing_url: single }];
else {
  if (!existsSync(csvPath)) {
    console.error(`Missing ${csvPath}. Fill listing_url for each platform first.`);
    process.exit(1);
  }
  rows = parseCsv(readFileSync(csvPath, 'utf8'));
}

const pending = rows.filter((row) => row.listing_url);
const skipped = rows.length - pending.length;

if (pending.length === 0) {
  console.log(
    `No listing_url values set in ${path.relative(process.cwd(), csvPath)} (${skipped} rows waiting).`
  );
  console.log('Add the public URL of each profile or listing you created, then run again.');
  process.exit(0);
}

const results = [];
const queue = [...pending];
await Promise.all(
  Array.from({ length: Math.min(5, queue.length) }, async () => {
    while (queue.length) {
      const row = queue.shift();
      const url = row.listing_url;
      const outcome = await check(url);
      results.push({ platform: row.platform || url, tier: row.tier || '', ...outcome });
    }
  })
);

results.sort((a, b) => a.platform.localeCompare(b.platform));

const widths = {
  platform: Math.max(8, ...results.map((r) => r.platform.length)),
};
const label = {
  dofollow: 'DOFOLLOW ',
  linked: 'linked   ',
  mentioned: 'mentioned',
  'no-link': 'no link  ',
  blocked: 'blocked  ',
  missing: 'MISSING  ',
  unreachable: 'UNREACH ',
};

console.log('');
console.log('Backlink verification');
console.log('=====================');
for (const r of results) {
  const pad = ' '.repeat(Math.max(0, widths.platform - r.platform.length));
  console.log(
    `${label[r.status] || r.status} ${r.platform}${pad} ${r.url}` +
      (r.detail ? `\n${' '.repeat(10)}${r.detail}` : '')
  );
}

const count = (status) => results.filter((r) => r.status === status).length;
const dofollow = count('dofollow');
const linked = count('linked');
const summary = {
  checkedAt: new Date().toISOString(),
  csv: path.relative(process.cwd(), csvPath),
  verified: results.length,
  awaitingUrl: skipped,
  dofollow,
  linkedNofollow: linked,
  mentioned: count('mentioned'),
  noLink: count('no-link'),
  blocked: count('blocked'),
  missing: count('missing'),
  unreachable: count('unreachable'),
};

console.log('');
console.log(
  `${results.length} checked: ${dofollow} dofollow, ${linked} nofollow, ` +
    `${summary.mentioned} mentioned-only, ${summary.noLink} no link, ` +
    `${summary.blocked} bot-blocked, ${summary.missing} missing, ${summary.unreachable} unreachable`
);
if (skipped) console.log(`${skipped} platform rows still have no listing_url.`);

mkdirSync('reports/seo', { recursive: true });
writeFileSync(
  'reports/seo/backlinks.json',
  `${JSON.stringify({ summary, results }, null, 2)}\n`
);
console.log('Wrote reports/seo/backlinks.json');

if (summary.missing > 0 || summary.unreachable > 0) process.exit(1);

