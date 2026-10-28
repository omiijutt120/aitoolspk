import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('API buyer guide separates provider billing, units and expiry on page one', () => {
  const source = readFileSync('src/app/plans/[slug]/page.tsx', 'utf8');
  assert.match(source, /slug === 'api' && page === 1/);
  assert.match(source, /aria-labelledby="api-credit-guide"/);
  assert.match(source, /Compare API providers, units and expiry/);
  assert.match(source, /Max and Team/);
  assert.match(source, /Pro is not eligible/);
  assert.match(source, /Gemini API/);
  assert.match(source, /provider or gateway/);
  assert.match(source, /conversion/);
  assert.match(source, /Vendor documentation does not verify any listed offer/);
  assert.match(source, /dateTime="2026-10-28"/);
  assert.match(source, /href="https:\/\/platform.claude.com\/docs\/en\/about-claude\/api-credits-for-subscribers"/);
  assert.match(source, /href="https:\/\/ai.google.dev\/gemini-api\/docs\/billing"/);
  assert.doesNotMatch(source, /^['"]use client['"]/);
});
