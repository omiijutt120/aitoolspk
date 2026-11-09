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
