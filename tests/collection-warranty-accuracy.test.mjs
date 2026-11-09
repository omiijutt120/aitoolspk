import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { collectionFacts } from '../src/lib/collection-facts.ts';

const plan = (warranty, index) => ({
  id: `fixture-${index}`, name: 'Fixture', slug: `fixture-${index}`,
  price: 100, duration: '1 month', warranty,
});

test('unknown warranty placeholders are not counted as stated coverage', () => {
  const labels = ['Full Warranty (listed; unverified)', 'Not specified', ' unknown ', 'N/A', '-', '', ' No Warranty (listed; unverified) '];
  const facts = collectionFacts(labels.map(plan));
  assert.equal(facts.warrantyStated, 1);
  assert.equal(facts.warrantyNone, 1);
});

test('real Netflix records distinguish labels from unspecified warranty without mutating records', () => {
  const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8'));
  const netflix = catalog.filter((p) => p.brandSlug === 'netflix');
  const before = JSON.stringify(netflix);
  const facts = collectionFacts(netflix);
  assert.equal(facts.count, 5);
  assert.equal(facts.warrantyStated, 4);
  assert.equal(facts.warrantyNone, 0);
  assert.equal(JSON.stringify(netflix), before);
});

test('generic warranty labels do not become verified periods in collection prose', () => {
  const source = readFileSync('src/components/collection-guide.tsx', 'utf8');
  assert.doesNotMatch(source, /rows state a seller warranty period/);
  assert.doesNotMatch(source, /leaves' : 'leave'} the field blank/);
  assert.match(source, /rows carry a seller warranty label/);
  assert.match(source, /A label alone does not establish a coverage period/);
});
