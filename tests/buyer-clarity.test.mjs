import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Keep this server-rendered disclosure on the canonical collection only.
// Browser coverage verifies visible content, links and pagination behavior.
test('ChatGPT comparison disclosure is scoped to its first collection page', () => {
  const source = readFileSync('src/app/plans/[slug]/page.tsx', 'utf8');
  assert.match(source, /slug === 'chatgpt' && page === 1/);
  assert.match(source, /aria-labelledby="chatgpt-buyer-clarity"/);
  assert.match(source, /Subscription duration is not the warranty period/);
  assert.match(source, /Stock availability does not confirm/);
  assert.match(source, /href="\/how-to-order\/"/);
  assert.match(source, /href="\/refund-policy\/"/);
});
