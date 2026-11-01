import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  readFileSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { tmpdir } from 'node:os';
import {
  premiumProducts,
  mergePremiumProducts,
  preserveCommittedReviews,
} from '../scripts/premium-catalog.mjs';
import { whatsappUrl, whatsappIntent } from '../src/lib/commerce.mjs';

const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8'));
const definitions = JSON.parse(
  readFileSync('data/premium-products.json', 'utf8')
);
const brands = JSON.parse(readFileSync('data/brands.json', 'utf8'));
const additions = catalog.filter((p) => p.sourceType === 'seller-listed');

test('premium approvals reject blank or placeholder terms after public sanitization', () => {
  const product = additions[0];
  const approved = {
    status: 'approved',
    authorizationEvidence: 'synthetic fixture',
    deliveryEvidence: 'synthetic fixture',
    reviewedAt: '2026-10-23',
    stockCheckedAt: '2026-10-23',
    stockStatus: 'in-stock',
    description: 'Reviewed package and its explicit limits',
    duration: '1 month',
    warranty: 'Seller replacement under agreed exclusions',
    access: 'Authorized invitation',
    renewal: 'Manual renewal with a new quote',
  };
  for (const access of ['https://example.com', '<b> </b>', 'Not specified'])
    assert.throws(
      () =>
        premiumProducts(
          definitions,
          brands,
          {},
          { [product.id]: { ...approved, access } }
        ),
      /sanitized public terms/
    );
  const result = premiumProducts(
    definitions,
    brands,
    {},
    { [product.id]: approved }
  ).find((p) => p.id === product.id);
  assert.equal(result.access, approved.access);
  assert.equal(result.warranty, approved.warranty);
  assert.equal(
    result.sellerWarranty,
    false,
    'A narrower reviewed warranty cannot inherit full-duration promises'
  );
  assert.equal(result.description, approved.description);
  assert.equal(result.renewal, approved.renewal);
});

test('clean CI preserves commercial review/exclusion and refuses changed approved prices', () => {
  const generated = additions[0];
  const approved = {
    ...generated,
    approval: 'approved',
    description: 'Reviewed exact terms',
    access: 'Authorized invitation',
  };
  assert.equal(
    preserveCommittedReviews([approved], [generated])[0].approval,
    'approved'
  );
  assert.equal(
    preserveCommittedReviews([approved], [generated])[0].description,
    approved.description
  );
  assert.equal(
    preserveCommittedReviews(
      [{ ...approved, approval: 'excluded' }],
      [generated]
    )[0].approval,
    'excluded'
  );
  assert.throws(
    () =>
      preserveCommittedReviews(
        [approved],
        [{ ...generated, price: generated.price + 1 }]
      ),
    /Reimport locally/
  );
  assert.equal(
    preserveCommittedReviews([approved], [generated], {
      [generated.id]: { status: 'pending' },
    })[0].approval,
    'pending'
  );
});

test('legacy records retain the reviewed baseline after term-parser corrections', () => {
  const original = catalog.filter((p) => p.sourceType !== 'seller-listed');
  assert.equal(original.length, 811);
  const changedIds = new Set([
    'PK-8F87F47B2D50',
    'PK-F08F8B73C1FF',
    'PK-1C4151BB27E1',
  ]);
  const unchanged = original.filter((p) => !changedIds.has(p.id));
  assert.equal(unchanged.length, 808);
  // Reviewed 29 October: 65 term corrections; 30 October: 16 range/age corrections.
  // Prices, identities, slugs, quote dates and approval states stayed unchanged.
  assert.equal(
    createHash('sha256').update(JSON.stringify(unchanged)).digest('hex'),
    'd40630cb5c361a42210f029e7b15a400d74ce78805a6f771472504d97a842d2a'
  );
});

test('five owner-authored products produce six exact subscription prices with official assets', () => {
  assert.equal(definitions.products.length, 5);
  assert.equal(additions.length, 6);
  assert.deepEqual(
    Object.fromEntries(additions.map((p) => [p.slug, p.price])),
    {
      'helium-10-platinum': 2500,
      'helium-10-diamond': 4800,
      'midjourney-standard': 4000,
      'midjourney-standard-3-months': 8000,
      'envato-elements': 2000,
      'vidiq-max': 3000,
    }
  );
  assert.deepEqual(premiumProducts(definitions, brands), additions);
  for (const p of additions) {
    assert.equal(p.warranty, 'Full Duration Warranty');
    assert.equal(p.sellerWarranty, true);
    assert.equal(p.stock, 'unconfirmed');
    assert.equal(p.approval, 'pending');
    assert.equal(p.purchasable, false);
    assert.ok(existsSync(`public${p.logo}`));
    assert.ok(p.features.length > 0 && p.summary && p.fairUsage);
  }
});

test('each new WhatsApp message preserves selected duration, PKR price, warranty and identity', () => {
  for (const p of additions) {
    const link = new URL(
      whatsappUrl(p, whatsappIntent(p, new Date('2026-10-23T12:00:00+05:00')))
    );
    assert.equal(link.hostname, 'wa.me');
    assert.equal(link.pathname, '/923714549245');
    for (const value of [
      p.name,
      p.duration,
      p.price.toLocaleString('en-PK'),
      p.warranty,
      p.id,
    ])
      assert.ok(link.searchParams.get('text').includes(value));
    assert.ok(!link.searchParams.get('text').includes('about restock'));
  }
  const options = additions.filter(
    (p) => p.variantGroup === 'midjourney-standard'
  );
  assert.equal(options[0].price * 3 - options[1].price, 4000);
  assert.notEqual(options[0].id, options[1].id);
});

test('reimports reject collisions and preserve original rows when premium offers are merged', () => {
  const original = catalog.filter((p) => p.sourceType !== 'seller-listed');
  assert.deepEqual(mergePremiumProducts(original, additions), catalog);
  assert.throws(
    () => mergePremiumProducts(original, [original[0]]),
    /Duplicate/
  );
  assert.throws(
    () =>
      mergePremiumProducts(original, [{ ...additions[0], id: original[0].id }]),
    /Duplicate/
  );
  assert.throws(
    () => premiumProducts({ ...definitions, updatedAt: 'invalid' }, brands),
    /confirmation date/
  );
  assert.throws(
    () =>
      premiumProducts(
        definitions,
        brands,
        {},
        { [additions[0].id]: { status: 'approved' } }
      ),
    /Approval evidence/
  );
});

test('clean-checkout imports refresh premium products without needing the private CSV and stay idempotent', () => {
  const root = path.resolve(tmpdir());
  const dir = mkdtempSync(path.join(root, 'aitoolspk-premium-test-'));
  try {
    mkdirSync(path.join(dir, 'data'));
    mkdirSync(path.join(dir, 'public', 'catalog'), { recursive: true });
    for (const file of [
      'premium-products.json',
      'brands.json',
      'inventory.json',
      'catalog-updates.json',
    ])
      writeFileSync(path.join(dir, 'data', file), readFileSync(`data/${file}`));
    writeFileSync(
      path.join(dir, 'data', 'catalog.json'),
      JSON.stringify(catalog.filter((p) => p.sourceType !== 'seller-listed'))
    );
    const script = path.resolve('scripts/import-catalog.mjs');
    execFileSync(process.execPath, [script, '--if-present'], { cwd: dir });
    const first = readFileSync(path.join(dir, 'data', 'catalog.json'), 'utf8');
    assert.deepEqual(JSON.parse(first), catalog);
    execFileSync(process.execPath, [script, '--if-present'], { cwd: dir });
    assert.equal(
      readFileSync(path.join(dir, 'data', 'catalog.json'), 'utf8'),
      first
    );
    assert.deepEqual(
      JSON.parse(
        readFileSync(path.join(dir, 'public', 'catalog', 'index.json'), 'utf8')
      ),
      catalog.filter((p) => p.approval !== 'excluded')
    );
  } finally {
    if (
      path.dirname(path.resolve(dir)) !== root ||
      !path.basename(dir).startsWith('aitoolspk-premium-test-')
    )
      throw new Error('Unsafe test cleanup target');
    rmSync(dir, { recursive: true, force: true });
  }
});

test('new offers respect newer stock updates without changing their quoted price date', () => {
  const p = additions[0];
  const updated = premiumProducts(definitions, brands, {
    [p.id]: { stock: 'out-of-stock', checkedAt: '2026-10-24' },
  }).find((item) => item.id === p.id);
  assert.equal(updated.stock, 'out-of-stock');
  assert.equal(updated.purchasable, false);
  assert.equal(updated.date, p.date);
  assert.equal(updated.price, p.price);
  assert.equal(whatsappIntent(updated), 'restock');
});
