import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as pagination from '../src/lib/pagination.ts';

test('paginated descriptions preserve the first page and identify later pages', () => {
  assert.equal(typeof pagination.pageDescription, 'function');
  const description = 'Compare listed plans and verify access before ordering.';
  assert.equal(pagination.pageDescription(description, 1), description);
  const descriptions = Array.from({ length: 6 }, (_, i) =>
    pagination.pageDescription(description, i + 1)
  );
  assert.equal(new Set(descriptions).size, 6);
  assert.equal(descriptions[1], `Page 2: ${description}`);
  assert.equal(descriptions[5], `Page 6: ${description}`);
});
