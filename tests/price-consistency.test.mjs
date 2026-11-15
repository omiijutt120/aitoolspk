import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { collectionSlug } from '../src/lib/catalog-identity.mjs';

/*
 * One catalogue, one set of figures.
 *
 * Every surface is built from data/catalog.json, so these checks mostly guard
 * against a join or a rounding rule drifting on one page while the data stays
 * right - the failure that produces a homepage median that no collection page
 * agrees with. They read the exported HTML, because that is what ships.
 *
 * The export is not always present when unit tests run, so the file skips
 * rather than failing on a machine that has not built the site.
 */
const BUILT = existsSync('out/price-index/index.html');

const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8')).filter(
  (p) => p.approval !== 'excluded'
);

const byCollection = new Map();
for (const product of catalog) {
  const slug = collectionSlug(product);
  if (!byCollection.has(slug)) byCollection.set(slug, []);
  byCollection.get(slug).push(product.price);
}

function median(prices) {
  const sorted = [...prices].sort((a, b) => a - b);
  const middle = Math.floor((sorted.length - 1) / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[middle] + sorted[middle + 1]) / 2)
    : sorted[middle];
}

const money = (text) => Number(text.replace(/[^\d]/g, ''));

function priceIndexRows() {
  const html = readFileSync('out/price-index/index.html', 'utf8');
  const start = html.indexOf('id="all-tools"');
  const body = html.slice(start);
  const rows = [];
  for (const chunk of body.split('<tr id="tool-').slice(1)) {
    const row = chunk.slice(0, chunk.indexOf('</tr>'));
    const slug = /^([^"]+)"/.exec(row)[1];
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) =>
      m[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    );
    rows.push({
      slug,
      plans: money(cells[1]),
      from: money(cells[2]),
      ceiling: money(cells[3]),
    });
  }
  return rows;
}

test(
  'the price index quotes the catalogue minimum, maximum and plan count for every tool',
  { skip: !BUILT && 'run npm run build first' },
  () => {
    const rows = priceIndexRows();
    assert.equal(rows.length, byCollection.size);
    for (const row of rows) {
      const prices = byCollection.get(row.slug);
      assert.ok(prices, `price index lists an unknown collection: ${row.slug}`);
      assert.equal(row.plans, prices.length, `${row.slug} plan count`);
      assert.equal(row.from, Math.min(...prices), `${row.slug} starting price`);
      assert.equal(
        row.ceiling,
        Math.max(...prices),
        `${row.slug} highest price`
      );
    }
  }
);

test(
  'homepage cards quote the same median as the catalogue rows they summarise',
  { skip: !BUILT && 'run npm run build first' },
  () => {
    const html = readFileSync('out/index.html', 'utf8');
    const grid = html.slice(html.indexOf('home-collection-grid'));
    const cards = [
      ...grid.matchAll(/<a\b[^>]*class="collection-card[^"]*"[\s\S]*?<\/a>/g),
    ].map((m) => m[0]);
    assert.ok(
      cards.length > 20,
      `expected the featured grid, found ${cards.length}`
    );
    const seen = new Set();
    for (const card of cards) {
      const slug = /href="\/plans\/([^"/]+)\//.exec(card)?.[1];
      assert.ok(slug, 'homepage card links to a collection');
      const shown = money(/<strong>PKR ([\d,]+)<\/strong>/.exec(card)[1]);
      assert.equal(
        shown,
        median(byCollection.get(slug)),
        `${slug} card median`
      );
      assert.ok(!seen.has(slug), `homepage repeats ${slug}`);
      seen.add(slug);
    }
  }
);
