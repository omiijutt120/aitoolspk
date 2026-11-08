import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { displayName } from '../src/lib/product-name.ts';

const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8'));
const products = Array.isArray(catalog) ? catalog : catalog.products;

test('keeps the quantity and duration when the warranty clause is dropped', () => {
  const cases = [
    [
      'CHATGPT PRO $500 1 month no warranty',
      'no warranty (listed; unverified)',
      'ChatGPT Pro $500 1 month',
      'ChatGPT',
    ],
    [
      'Tele Bot 1 month full warranty',
      'full warranty (listed; unverified)',
      'Tele Bot 1 month',
    ],
    [
      'Kling Ultra 4.0 Flash 26k credit 1 month warranty 2 days',
      'warranty 2 days (listed; unverified)',
      'Kling Ultra 4.0 Flash 26K credit 1 month',
    ],
    [
      'Microsoft 365 Admin Family 1 Month full warranty',
      'full warranty (listed; unverified)',
      'Microsoft 365 Admin Family 1 month',
    ],
  ];
  for (const [name, warranty, expected, brand] of cases) {
    assert.equal(displayName(name, warranty, brand), expected);
  }
});

test('never truncates a name that does not have a duplicate warranty suffix', () => {
  const cases = [
    ['Gmail Random IP 7-10 days 2FA', 'Not specified'],
    ['Gmail (New) - Login All', 'Not specified'],
    ['Facebook Blue Check Dormant 1-8 Months Login Warranty', 'Not specified'],
    ['Discord Gifting Badge x10', 'full warranty (listed; unverified)'],
  ];
  for (const [name, warranty] of cases) {
    const shown = displayName(name, warranty);
    assert.ok(shown.length >= name.length - 30, `${name} → ${shown}`);
    assert.ok(!/[\s,;:(-]$/.test(shown), `${name} → ${shown}`);
  }
});

test('leaves a name intact when the warranty wording is load-bearing', () => {
  assert.equal(
    displayName('Meitu VIP+ 7D includes 5D warranty', 'not stated'),
    'Meitu VIP+ 7D includes 5D warranty'
  );
});

test('drops the dangling bracket left by a removed clause', () => {
  assert.equal(
    displayName(
      '66K Decor Discord / Profile Effect Cheap (Login Type) - full warranty',
      'full warranty (listed; unverified)'
    ),
    '66K Decor Discord / Profile Effect Cheap'
  );
});

test('sentence-cases shouting while keeping marks and units', () => {
  assert.equal(
    displayName('GMAIL TRIAL DATE 6 MONTHS HAS 2FA', 'Not specified'),
    'Gmail Trial Date 6 months has 2FA'
  );
  assert.equal(
    displayName('CANVA PRO SLOT ADD FAMILY 1 YEAR', '1 year'),
    'Canva Pro Slot Add Family 1 year'
  );
  assert.equal(
    displayName('MICROSOFT OFFICE 365 PREMIUM SLOT 5 MONTHS full warranty', 'full warranty'),
    'Microsoft Office 365 Premium Slot 5 months'
  );
});

test('moves a bracketed provider in front', () => {
  assert.equal(
    displayName('[Astra] API 50M Token Codex 3 Days - full warranty', 'full warranty'),
    'Astra: API 50M token Codex 3 days'
  );
});

test('restores brand spelling but not an all-lowercase brand guess', () => {
  assert.equal(
    displayName('CHATGPT PLUS 30 DAYS', '30 days', 'ChatGPT'),
    'ChatGPT Plus 30 days'
  );
  assert.equal(displayName('Meitu VIP 7 Days', '7 days'), 'Meitu VIP 7 days');
  assert.equal(displayName('LOVABLE PRO 1 MONTH', '1 month', 'lovable'), 'Lovable Pro 1 month');
});

test('display output is stable and never empty across the whole catalogue', () => {
  for (const product of products) {
    const shown = displayName(product.name, product.warranty, product.brand);
    assert.ok(shown.trim().length > 0, `empty display name for ${product.id}`);
    assert.equal(
      displayName(shown, product.warranty, product.brand),
      shown,
      `unstable output for ${product.name}`
    );
    assert.ok(
      !/[\s,;:(-]$/.test(shown),
      `dangling punctuation for ${product.name} → ${shown}`
    );
  }
});

