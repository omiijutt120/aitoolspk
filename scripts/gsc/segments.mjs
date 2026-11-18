/**
 * Conservative query buckets for Search Console exports. Classification is a
 * reporting aid, not a claim about a searcher's intent or a landing page.
 */
export const OPAQUE_QUERY = /^ai[0-9]+$/i;

export function classifyQuery(value) {
  const query = String(value).trim().toLowerCase();
  if (OPAQUE_QUERY.test(query)) return 'numerical';
  if (/\b(?:aitoolspk|ai\s*tools\s*pk|aitools\s*pk)\b/i.test(query))
    return 'branded';
  if (
    /^(?:how|what|which|why|when|where|can|is|are|kya|kaise)\b|\b(?:vs|versus|difference|review|meaning|explained|guide)\b/i.test(
      query
    )
  )
    return 'informational';
  if (
    /\b(?:buy|purchase|subscription|subscribe|price|pricing|cost|rate|plan|plans|premium|pro|package|packages|pkr|rs\.?|rupees|kitne|sasti)\b/i.test(
      query
    )
  )
    return 'commercial candidate';
  return 'unclassified';
}

const field = (row, names) => {
  for (const name of names) if (Object.hasOwn(row, name)) return row[name];
  return undefined;
};

export function analyzeQueries(rows, { dailyTotals } = {}) {
  const buckets = new Map();
  const detailed = rows.map((row) => {
    const query = field(row, ['query', 'Top queries', 'Query']);
    const rawClicks = String(field(row, ['clicks', 'Clicks']) ?? '');
    const rawImpressions = String(
      field(row, ['impressions', 'Impressions']) ?? ''
    );
    const clicks = Number(rawClicks);
    const impressions = Number(rawImpressions);
    if (
      !query ||
      !/^\d+$/.test(rawClicks) ||
      !/^\d+$/.test(rawImpressions) ||
      !Number.isSafeInteger(clicks) ||
      !Number.isSafeInteger(impressions) ||
      clicks < 0 ||
      impressions < clicks
    )
      throw new Error(
        'Query export needs a query, nonnegative clicks and impressions'
      );
    const segment = classifyQuery(query);
    const total = buckets.get(segment) ?? {
      queries: 0,
      clicks: 0,
      impressions: 0,
    };
    total.queries += 1;
    total.clicks += clicks;
    total.impressions += impressions;
    buckets.set(segment, total);
    return { query, segment, clicks, impressions };
  });
  const visible = {
    queries: detailed.length,
    clicks: detailed.reduce((sum, row) => sum + row.clicks, 0),
    impressions: detailed.reduce((sum, row) => sum + row.impressions, 0),
  };
  const segments = Object.fromEntries(
    [
      'numerical',
      'branded',
      'informational',
      'commercial candidate',
      'unclassified',
    ].map((name) => [
      name,
      buckets.get(name) ?? { queries: 0, clicks: 0, impressions: 0 },
    ])
  );
  const result = { visibleQueryRows: visible, segments };
  if (dailyTotals) {
    if (
      dailyTotals.impressions < visible.impressions ||
      dailyTotals.clicks < visible.clicks
    )
      result.reconciliation =
        'Daily and query totals disagree; check date, property, search type and filters.';
    else
      result.unreportedQueryMetrics = {
        clicks: dailyTotals.clicks - visible.clicks,
        impressions: dailyTotals.impressions - visible.impressions,
      };
  }
  return { detailed, summary: result };
}
