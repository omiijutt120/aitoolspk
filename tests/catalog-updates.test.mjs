import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyCatalogUpdates } from '../scripts/catalog-updates.mjs';
import { whatsappUrl } from '../src/lib/commerce.mjs';

const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8'));
const updates = JSON.parse(readFileSync('data/catalog-updates.json', 'utf8'));
const keep = 'PK-1C4151BB27E1';
const mergedIds = ['PK-8F87F47B2D50', 'PK-F08F8B73C1FF'];

test('Gemini Pro 18-month listings consolidate to one PKR 1200 full seller warranty plan', () => {
  const active = catalog.filter(
    (p) =>
      p.approval !== 'excluded' &&
      p.brandSlug === 'gemini' &&
      p.duration === '18 months' &&
      /pro/i.test(p.name)
  );
  assert.equal(active.length, 1);
  const product = active[0];
  assert.equal(product.id, keep);
  assert.equal(product.price, 1200);
  assert.equal(product.warranty, 'Full seller warranty (18 months)');
  assert.equal(product.date, '2026-10-24');
  assert.equal(
    product.approval,
    'pending',
    'Price/warranty updates do not establish resale authorization'
  );
  const message = new URL(whatsappUrl(product, 'confirm')).searchParams.get(
    'text'
  );
  for (const expected of [
    '1,200',
    product.warranty,
    product.id,
    product.duration,
  ])
    assert.ok(message.includes(expected));
  const publicCatalog = JSON.parse(
    readFileSync('public/catalog/index.json', 'utf8')
  );
  for (const id of mergedIds) {
    assert.equal(catalog.find((p) => p.id === id).approval, 'excluded');
    assert.equal(catalog.find((p) => p.id === id).purchasable, false);
    assert.equal(
      publicCatalog.some((p) => p.id === id),
      false
    );
  }
});

test('owner updates remain idempotent and cannot approve products or add supplier fields', () => {
  assert.deepEqual(applyCatalogUpdates(catalog, updates), catalog);
  assert.deepEqual(
    applyCatalogUpdates(applyCatalogUpdates(catalog, updates), updates),
    catalog
  );
  const product = catalog.find((p) => p.id === keep);
  for (const patch of [
    { price: 0 },
    { price: 1200 },
    { approval: 'approved' },
    { CostPKR: 1 },
  ])
    assert.throws(() =>
      applyCatalogUpdates([product], { products: { [keep]: patch } })
    );
  assert.throws(
    () =>
      applyCatalogUpdates([product], {
        products: { unknown: { price: 1200, date: '2026-10-24' } },
      }),
    /Unknown/
  );
});

test('reimported and previously approved duplicate variants cannot reappear as purchasable', () => {
  const original = catalog.map((p) =>
    mergedIds.includes(p.id)
      ? { ...p, approval: 'approved', purchasable: true }
      : p.id === keep
        ? { ...p, price: 800, warranty: 'Not specified' }
        : p
  );
  const result = applyCatalogUpdates(original, updates);
  assert.deepEqual(result, catalog);
  const before = new Map(catalog.map((p) => [p.id, p]));
  for (const p of result.filter(
    (p) => p.id !== keep && !mergedIds.includes(p.id)
  ))
    assert.deepEqual(p, before.get(p.id));
});
