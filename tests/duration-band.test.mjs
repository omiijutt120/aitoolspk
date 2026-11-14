import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { bandSpread, durationBand } from '../src/lib/duration-band.ts';

// The collection page answers "how much?" with one line per duration. That is
// only honest while each band maps to what the seller actually stated, so the
// whitelist is tested against the strings really present in the catalogue.
test('only unambiguous month and year labels are banded', () => {
  for (const label of ['1 month', '1 months', '30 days', '28 days', '31 days'])
    assert.equal(durationBand(label), 'month', label);
  for (const label of [
    '1 year',
    '1 years',
    '12 months',
    '365 days',
    '  1 Year  ',
  ])
    assert.equal(durationBand(label), 'year', label);
});

test('a label stating two durations or a different length is not guessed', () => {
  for (const label of [
    '10 months / 1 day',
    '1 months / 1 year',
    '5–10 months',
    '18 months',
    '3 months',
    '90 days',
    '7 days',
    '2 years',
    '10 years',
    '100 years',
    'Not specified',
    '',
    null,
    undefined,
  ])
    assert.equal(durationBand(label), null, String(label));
});

test('a middle figure is only called typical while the band is comparable', () => {
  assert.equal(bandSpread({ minPrice: 72, medianPrice: 470 }), 'narrow');
  assert.equal(bandSpread({ minPrice: 400, medianPrice: 758 }), 'narrow');
  assert.equal(bandSpread({ minPrice: 400, medianPrice: 400 }), 'narrow');
  // Gemini month: Rs 419 shared slot and a Rs 151,234 credit pack.
  assert.equal(bandSpread({ minPrice: 419, medianPrice: 23853 }), 'wide');
  // ChatGPT month: Rs 112 listing and a Rs 96,936 Pro credit pack.
  assert.equal(bandSpread({ minPrice: 112, medianPrice: 5377 }), 'wide');
});

test('the collection table is scoped to the first page', () => {
  const source = readFileSync('src/app/plans/[slug]/page.tsx', 'utf8');
  assert.match(source, /\{page === 1 && <CollectionCostAnswer collection=\{c\} \/>\}/);
});
