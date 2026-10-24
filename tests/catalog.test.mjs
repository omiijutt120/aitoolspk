import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { parse } from 'csv-parse/sync';
import { normalize, clean } from '../scripts/import-catalog.mjs';
import {
  canBuy,
  whatsappUrl,
  isStale,
  whatsappIntent,
} from '../src/lib/commerce.mjs';
const source = existsSync('private/catalog.csv')
  ? parse(readFileSync('private/catalog.csv', 'utf8'), {
      columns: true,
      bom: true,
    })
  : null;
// Synthetic importer input. No supplier identifiers or private costs belong in fixtures.
const sample = {
  Source: 'synthetic-test',
  ProductID: 'example-plan',
  Name: 'Example 1 month',
  Category: 'none',
  SellingPricePKR: '1000',
  AvailableStock: '1',
  ListingStatus: 'In stock',
  RateDate: '2026-10-19',
};
const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8'));
const catalogUpdates = JSON.parse(
  readFileSync('data/catalog-updates.json', 'utf8')
);
test('all 811 offers retain exact integer retail prices and unique identities', () => {
  assert.equal(catalog.length, 811);
  assert.equal(new Set(catalog.map((p) => p.id)).size, 811);
  assert.equal(new Set(catalog.map((p) => p.slug)).size, 811);
  assert.ok(catalog.every((p) => Number.isSafeInteger(p.price) && p.price > 0));
});
test(
  'private CSV retains exact retail prices and identities',
  {
    skip:
      !source &&
      'Private CSV is intentionally absent from GitHub; public catalog checks still run',
  },
  () => {
    assert.equal(source.length, catalog.length);
    source.forEach((row, i) => {
      assert.equal(
        catalog[i].price,
        catalogUpdates.products[catalog[i].id]?.price ??
          Number(row.SellingPricePKR)
      );
      assert.equal(normalize(row).id, catalog[i].id);
    });
  }
);
test('owner-confirmed inventory survives imports without approving unverified offers', () => {
  const inventory = JSON.parse(readFileSync('data/inventory.json', 'utf8'));
  assert.equal(Object.keys(inventory).length, catalog.length);
  for (const p of catalog) {
    assert.equal(p.stock, inventory[p.id].stock);
    assert.equal(whatsappIntent(p), 'confirm');
  }
  const row = { ...sample, AvailableStock: '0', ListingStatus: 'Out of stock' };
  const original = normalize(row);
  const overrides = {
    [original.id]: { stock: 'in-stock', checkedAt: '2026-10-23' },
  };
  const updated = normalize(row, {}, {}, overrides);
  assert.equal(original.stock, 'out-of-stock');
  assert.equal(updated.stock, 'in-stock');
  assert.equal(updated.approval, 'pending');
  assert.equal(updated.purchasable, false);
  assert.equal(updated.price, original.price);
  assert.equal(updated.date, original.date);
  assert.equal(updated.warranty, original.warranty);
  assert.equal(
    normalize(
      row,
      {
        [original.id]: {
          stockStatus: 'out-of-stock',
          stockCheckedAt: '2026-10-24',
        },
      },
      {},
      overrides
    ).stock,
    'out-of-stock'
  );
  assert.throws(
    () =>
      normalize(
        row,
        {},
        {},
        {
          [original.id]: { stock: 'in-stock', checkedAt: 'invalid' },
        }
      ),
    /inventory confirmation date/
  );
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
  const p = normalize(sample);
  assert.throws(
    () => normalize(sample, { [p.id]: { status: 'approved' } }),
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
        message.startsWith('Hi AiToolsPk, I want to order:'),
        intent === 'order'
      );
    }
  }
});

test('every offer has a working WhatsApp intent without asserting unverified stock', () => {
  const now = new Date('2026-10-20T00:00:00+05:00');
  for (const product of catalog) {
    const intent = whatsappIntent(product, now);
    assert.equal(
      intent,
      product.stock === 'out-of-stock'
        ? 'restock'
        : canBuy(product, now)
          ? 'order'
          : 'confirm'
    );
    const link = new URL(whatsappUrl(product, intent));
    assert.equal(link.pathname, '/923714549245');
    assert.ok(link.searchParams.get('text').includes(product.id));
  }
  const approved = {
    ...catalog[0],
    approval: 'approved',
    purchasable: true,
    stock: 'in-stock',
    date: '2026-10-19',
  };
  assert.equal(whatsappIntent(approved, now), 'order');
  assert.equal(
    whatsappIntent(approved, new Date('2026-10-28T00:00:00+05:00')),
    'confirm'
  );
});
test('sanitization and variant distinctions', () => {
  assert.equal(
    clean('<b>Plan</b> https://vendor.test/private user@example.com'),
    'Plan'
  );
  const a = normalize({ ...sample, Name: 'Example 1 month 24H warranty' });
  const b = normalize({
    ...sample,
    ProductID: 'another',
    Name: 'Example 3 months full warranty',
  });
  assert.notEqual(a.id, b.id);
  assert.equal(a.duration, '1 month');
  assert.match(a.warranty, /24H warranty/);
  assert.equal(b.duration, '3 months');
  assert.match(b.warranty, /full warranty/);
  const shorthand = normalize({
    ...sample,
    Name: 'Example Plus 30D warranty 24H',
  });
  assert.equal(shorthand.duration, '30 days');
  assert.match(shorthand.warranty, /warranty 24H/);
  const credits = normalize({
    ...sample,
    Name: 'Example API 10M Credit 1 Day full warranty',
  });
  assert.equal(credits.duration, '1 day');
  assert.equal(credits.credits, '10M Credit');
  assert.equal(
    normalize({ ...sample, Name: 'Example ZAPI 1B Credit 1 Day' }).credits,
    '1B Credit'
  );
});
