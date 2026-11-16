import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyResponse,
  buildRequestRows,
  missingFacts,
  QuoteError,
  validateResponse,
} from '../scripts/catalog/quotes.mjs';

const product = (overrides = {}) => ({
  id: 'PK-000000000001',
  slug: 'netflix-standard-1-month',
  name: 'Netflix Standard 1 month',
  brand: 'Netflix',
  brandSlug: 'netflix',
  category: 'entertainment',
  price: 500,
  duration: '1 month',
  warranty: 'Full warranty (listed; unverified)',
  access: 'Private profile',
  credits: '',
  stock: 'in-stock',
  approval: 'pending',
  description: 'Listing.',
  date: '2026-10-19',
  logo: '/logos/netflix.webp',
  purchasable: false,
  risk: false,
  renewal: 'Renewal terms are not confirmed.',
  ...overrides,
});

const catalog = [
  product(),
  product({
    id: 'PK-000000000002',
    name: 'Netflix Premium 3 months',
    price: 1500,
  }),
  product({ id: 'PK-000000000003', approval: 'excluded' }),
  product({
    id: 'PK-000000000004',
    name: 'Claude Pro 1 month',
    brand: 'Claude',
    brandSlug: 'claude',
    price: 2200,
  }),
];

test('the request sheet covers every pending row and nothing else', () => {
  const rows = buildRequestRows(catalog);
  assert.equal(rows.length, 3);
  assert.deepEqual(
    rows.map((row) => row.id),
    ['PK-000000000004', 'PK-000000000001', 'PK-000000000002']
  );
  const netflix = buildRequestRows(catalog, { collection: 'netflix' });
  assert.equal(netflix.length, 2);
  assert.ok(netflix.every((row) => row.collection === 'netflix'));
});

test('missing facts are named, not guessed', () => {
  assert.deepEqual(missingFacts(product()), ['warranty', 'renewal']);
  assert.deepEqual(
    missingFacts(
      product({ warranty: '30-day replacement', renewal: 'Renews at PKR 500' })
    ),
    []
  );
});

test('the seller columns start empty', () => {
  const [row] = buildRequestRows(catalog);
  for (const column of [
    'seller_price_pkr',
    'seller_confirms',
    'seller_warranty',
    'seller_access',
    'seller_renewal',
    'notes',
  ])
    assert.equal(row[column], '');
});

test('a returned row must answer confirm and price together', () => {
  const rows = [
    {
      __line: 2,
      id: 'PK-000000000001',
      seller_confirms: 'yes',
      seller_price_pkr: '',
    },
  ];
  assert.throws(() => validateResponse(rows, catalog), QuoteError);
});

test('unknown, duplicated and invalid rows are all reported at once', () => {
  const rows = [
    {
      __line: 2,
      id: 'PK-NOPE',
      seller_confirms: 'yes',
      seller_price_pkr: '100',
    },
    {
      __line: 3,
      id: 'PK-000000000001',
      seller_confirms: 'maybe',
      seller_price_pkr: '',
    },
    {
      __line: 4,
      id: 'PK-000000000002',
      seller_confirms: 'no',
      seller_price_pkr: '',
    },
    {
      __line: 5,
      id: 'PK-000000000002',
      seller_confirms: 'no',
      seller_price_pkr: '',
    },
  ];
  try {
    validateResponse(rows, catalog);
    assert.fail('expected a QuoteError');
  } catch (error) {
    assert.ok(error instanceof QuoteError);
    assert.equal(error.problems.length, 3);
    assert.deepEqual(
      error.problems.map((problem) => problem.line),
      [2, 3, 5]
    );
  }
});

test('a confirmed row updates price, date and the facts the seller supplied', () => {
  const rows = [
    {
      __line: 2,
      id: 'PK-000000000001',
      seller_confirms: 'yes',
      seller_price_pkr: '650',
      seller_warranty: '30-day replacement',
      seller_access: 'Your own profile on a shared account',
      seller_renewal: '',
    },
  ];
  const { catalog: next, changes } = applyResponse(catalog, rows, {
    quoteDate: '2026-11-16',
  });
  const updated = next.find((entry) => entry.id === 'PK-000000000001');
  assert.equal(updated.price, 650);
  assert.equal(updated.date, '2026-11-16');
  assert.equal(updated.warranty, '30-day replacement');
  assert.equal(updated.access, 'Your own profile on a shared account');
  assert.equal(
    updated.renewal,
    product().renewal,
    'a blank cell changes nothing'
  );
  assert.equal(updated.approval, 'pending', 'a price is not authorization');
  assert.equal(changes[0].confirmed, 'yes');
  assert.equal(catalog[0].price, 500, 'the input catalogue is not mutated');
});

test('a decline changes nothing and a withdrawal only changes stock', () => {
  const { catalog: next } = applyResponse(
    catalog,
    [
      { __line: 2, id: 'PK-000000000001', seller_confirms: 'no' },
      { __line: 3, id: 'PK-000000000002', seller_confirms: 'withdrawn' },
    ],
    { quoteDate: '2026-11-16' }
  );
  const declined = next.find((entry) => entry.id === 'PK-000000000001');
  assert.equal(declined.price, 500);
  assert.equal(declined.date, '2026-10-19');
  const withdrawn = next.find((entry) => entry.id === 'PK-000000000002');
  assert.equal(withdrawn.stock, 'out-of-stock');
  assert.equal(withdrawn.price, 1500);
});

test('a price that moves more than half is flagged for confirmation', () => {
  const { warnings } = applyResponse(
    catalog,
    [
      {
        __line: 2,
        id: 'PK-000000000001',
        seller_confirms: 'yes',
        seller_price_pkr: '9000',
      },
    ],
    { quoteDate: '2026-11-16' }
  );
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /more than 50%/);
});

test('the confirmation date is required and cannot be invented by the script', () => {
  assert.throws(
    () =>
      applyResponse(
        catalog,
        [{ __line: 2, id: 'PK-000000000001', seller_confirms: 'no' }],
        { quoteDate: '' }
      ),
    /--quote-date/
  );
});
