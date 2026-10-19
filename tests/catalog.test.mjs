import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'csv-parse/sync';
import { normalize, clean } from '../scripts/import-catalog.mjs';
import { canBuy, whatsappUrl, isStale } from '../src/lib/commerce.mjs';
const source = parse(readFileSync('private/catalog.csv', 'utf8'), {
  columns: true,
  bom: true,
});
const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8'));
test('all 811 offers retain exact integer retail prices and unique identities', () => {
  assert.equal(source.length, 811);
  assert.equal(catalog.length, 811);
  assert.equal(new Set(catalog.map((p) => p.id)).size, 811);
  assert.equal(new Set(catalog.map((p) => p.slug)).size, 811);
  source.forEach((row, i) => {
    assert.equal(catalog[i].price, Number(row.SellingPricePKR));
    assert.equal(normalize(row).id, catalog[i].id);
  });
});
test('source stock matches the PRD snapshot', () => {
  assert.equal(catalog.filter((p) => p.stock === 'in-stock').length, 537);
  assert.equal(catalog.filter((p) => p.stock === 'out-of-stock').length, 192);
  assert.equal(catalog.filter((p) => p.stock === 'unconfirmed').length, 82);
});
test('public projection contains no confidential supplier fields, URLs, copy or evidence', () => {
  const forbidden = [
    'Source',
    'ProductID',
    'OriginalPrice',
    'OriginalCurrency',
    'ConversionRatePKR',
    'CostPKR',
    'EstimatedGrossProfitPKR',
    'PurchaseRequirements',
    'Sold',
    'PriceMethod',
    'RateSource',
    'authorizationEvidence',
    'deliveryEvidence',
  ];
  for (const p of catalog) {
    for (const key of forbidden) assert.equal(Object.hasOwn(p, key), false);
    assert.match(p.id, /^PK-[A-F0-9]{12}$/);
    assert.ok(!/https?:|www\.|@[\w.-]+\./i.test(p.name + p.description));
  }
  const publicCatalog = JSON.parse(
    readFileSync('public/catalog/index.json', 'utf8')
  );
  assert.equal(
    publicCatalog.length,
    catalog.filter((p) => p.approval !== 'excluded').length
  );
});
test('every unapproved offer is gated pending commercial approval', () => {
  assert.ok(
    catalog
      .filter((p) => p.approval !== 'approved')
      .every((p) => !canBuy(p, new Date('2026-10-19T12:00:00+05:00')))
  );
});
test('approval requires evidence, exact terms and reviewed stock', () => {
  const p = normalize(source[1]);
  assert.throws(
    () => normalize(source[1], { [p.id]: { status: 'approved' } }),
    /evidence/
  );
});
test('stock, quote expiry and approval are independent order gates', () => {
  const p = {
    ...catalog[1],
    stock: 'in-stock',
    approval: 'approved',
    purchasable: true,
    date: '2026-10-19',
  };
  const current = new Date('2026-10-20T00:00:00+05:00');
  assert.equal(canBuy(p, current), true);
  assert.equal(canBuy({ ...p, stock: 'out-of-stock' }, current), false);
  assert.equal(canBuy({ ...p, stock: 'unconfirmed' }, current), false);
  assert.equal(canBuy({ ...p, approval: 'pending' }, current), false);
  assert.equal(canBuy(p, new Date('2026-10-27T00:00:01+05:00')), false);
  assert.equal(isStale({ ...p, date: 'bad' }, current), true);
});
test('all offer messages preserve exact identity, warranty, plan, price and page', () => {
  for (const p of catalog) {
    for (const intent of ['order', 'restock', 'confirm']) {
      const url = new URL(whatsappUrl(p, intent));
      assert.equal(url.hostname, 'wa.me');
      assert.equal(url.pathname, '/923714549245');
      const message = url.searchParams.get('text');
      for (const value of [
        p.name,
        p.id,
        p.duration,
        p.warranty,
        p.access,
        p.price.toLocaleString('en-PK'),
        `https://aitoolspk.tech/tool/${p.slug}/`,
      ])
        assert.ok(message.includes(value));
      assert.equal(
        message.startsWith('Hi AItoolsPK, I want to order:'),
        intent === 'order'
      );
    }
  }
});
test('sanitization and variant distinctions', () => {
  assert.equal(
    clean('<b>Plan</b> https://vendor.test/private user@example.com'),
    'Plan'
  );
  const a = normalize({ ...source[1], Name: 'Example 1 month 24H warranty' });
  const b = normalize({
    ...source[1],
    ProductID: 'another',
    Name: 'Example 3 months full warranty',
  });
  assert.notEqual(a.id, b.id);
  assert.equal(a.duration, '1 month');
  assert.match(a.warranty, /24H warranty/);
  assert.equal(b.duration, '3 months');
  assert.match(b.warranty, /full warranty/);
  const shorthand = normalize({
    ...source[1],
    Name: 'Example Plus 30D warranty 24H',
  });
  assert.equal(shorthand.duration, '30 days');
  assert.match(shorthand.warranty, /warranty 24H/);
});
