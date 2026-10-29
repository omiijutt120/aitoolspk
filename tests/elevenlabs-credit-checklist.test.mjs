import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Built-export browser tests also verify HTML visibility and route isolation.
test('ElevenLabs credit checklist is dated, sourced and first-page-only', () => {
  const source = readFileSync('src/app/plans/[slug]/page.tsx', 'utf8');
  assert.match(source, /slug === 'elevenlabs' && page === 1/);
  assert.match(source, /aria-labelledby="elevenlabs-credit-checklist"/);
  assert.match(source, /Credits are not a fixed number of audio minutes/);
  assert.match(source, /dateTime="2026-10-27"/);
  assert.match(source, /href="https:\/\/elevenlabs.io\/docs\/overview\/administration\/billing"/);
  assert.match(source, /Vendor documentation does not verify any listed offer/);
  assert.doesNotMatch(source, /^['"]use client['"]/);
});
