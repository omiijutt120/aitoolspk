import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync('src/components/collection-guide.tsx', 'utf8');
const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8'));

test('collection comparison does not invent different entitlements for equivalent rows', () => {
  const pia = catalog.filter((plan) => plan.brandSlug === 'pia-vpn');
  assert.equal(pia.length, 2);
  assert.equal(new Set(pia.map((plan) => plan.duration)).size, 1);
  assert.ok(pia.every((plan) => plan.access === 'Not specified'));
  assert.doesNotMatch(source, /Both sit under one brand because/);
  assert.doesNotMatch(source, /Har plan ki duration, access aur warranty alag hoti hai/);
  assert.match(source, /A shared brand label does not establish identical or different/);
});
