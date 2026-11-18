import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeQueries, classifyQuery } from '../scripts/gsc/segments.mjs';
import { toSafeCsv } from '../scripts/lib/csv.mjs';

test('query buckets keep opaque codes distinct from brand and intent candidates', () => {
  assert.equal(classifyQuery('AI45527'), 'numerical');
  assert.equal(classifyQuery('AiToolsPk'), 'branded');
  assert.equal(classifyQuery('AI Tools PK official'), 'branded');
  assert.equal(
    classifyQuery('ChatGPT Plus price Pakistan'),
    'commercial candidate'
  );
  assert.equal(classifyQuery('How does ChatGPT Plus work?'), 'informational');
  assert.equal(classifyQuery('Netflix'), 'unclassified');
});

test('query totals disclose unreported metrics without attributing them to a page', () => {
  const { summary, detailed } = analyzeQueries(
    [
      { 'Top queries': 'ai24197', Clicks: '0', Impressions: '7' },
      {
        'Top queries': 'ChatGPT Plus price Pakistan',
        Clicks: '1',
        Impressions: '3',
      },
    ],
    { dailyTotals: { clicks: 2, impressions: 15 } }
  );
  assert.equal(summary.segments.numerical.impressions, 7);
  assert.equal(summary.segments['commercial candidate'].clicks, 1);
  assert.deepEqual(summary.unreportedQueryMetrics, {
    clicks: 1,
    impressions: 5,
  });
  assert.equal(detailed[0].segment, 'numerical');
});

test('mismatched scopes and invalid metrics are not silently reconciled', () => {
  const rows = [{ query: 'ai123', clicks: '0', impressions: '5' }];
  const { summary } = analyzeQueries(rows, {
    dailyTotals: { clicks: 0, impressions: 2 },
  });
  assert.match(summary.reconciliation, /disagree/);
  assert.equal(summary.unreportedQueryMetrics, undefined);
  assert.throws(
    () => analyzeQueries([{ query: 'x', clicks: '2', impressions: '1' }]),
    /nonnegative/
  );
  assert.throws(
    () => analyzeQueries([{ query: 'x', clicks: '', impressions: '1' }]),
    /nonnegative/
  );
});

test('human-opened exports neutralize spreadsheet formulas in query text', () => {
  assert.match(
    toSafeCsv([{ query: '=HYPERLINK("https://example.com")' }], ['query']),
    /^query\r\n"'=HYPERLINK/
  );
});
