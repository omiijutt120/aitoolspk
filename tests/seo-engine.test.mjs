import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  buildIntelligence,
  csv,
  importGscPages,
  ORIGIN,
} from '../scripts/seo/engine.mjs';
import { inspectHtml } from '../scripts/seo/html.mjs';
import {
  contentFingerprint,
  publicationDecision,
} from '../src/lib/seo-publication.mjs';
import { collectionSlug } from '../src/lib/catalog-identity.mjs';
import { disallowedPaths, robotsAllows } from '../scripts/seo/crawl.mjs';

const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8'));
const now = new Date('2026-10-23T12:00:00+05:00');
const approved = () => ({
  ...catalog[0],
  approval: 'approved',
  stock: 'in-stock',
  purchasable: true,
  risk: false,
  date: '2026-10-23',
  description:
    'A reviewed description with the precise purchased package and limits.',
  duration: '1 month',
  warranty:
    'Seller replacement during the purchased month under agreed exclusions',
  access: 'Authorized workspace invitation',
  renewal: 'Manual renewal; confirm the next price',
});
const review = (p) => ({
  reviewedAt: '2026-10-23',
  contentFingerprint: contentFingerprint(p),
  distinctIntent: true,
  usefulContent: true,
  publication: 'ready',
});

test('explicit live audits honor generic robots groups, wildcards and more-specific allow rules', () => {
  const rules = disallowedPaths(
    'User-agent: *\nDisallow: /private/\nAllow: /private/public/\nDisallow: /*?\nUser-agent: Other\nDisallow: /'
  );
  assert.equal(robotsAllows('/private/test/', rules), false);
  assert.equal(robotsAllows('/private/public/test/', rules), true);
  assert.equal(robotsAllows('/tools/', rules), true);
  assert.equal(robotsAllows('/tools/?q=x', rules), false);
});

test('every catalog offer receives one exact-price SEO identity without supplier evidence', () => {
  const result = buildIntelligence(catalog, {}, {}, [], now);
  assert.equal(result.products.length, catalog.length);
  assert.equal(new Set(result.products.map((p) => p.id)).size, catalog.length);
  assert.equal(
    result.collections.reduce((sum, c) => sum + c.offerCount, 0),
    catalog.filter((p) => p.approval !== 'excluded').length
  );
  for (const [i, row] of result.products.entries()) {
    const source = catalog[i];
    assert.equal(row.listedRetailPricePKR, source.price);
    assert.equal(row.canonical, `${ORIGIN}/tool/${source.slug}/`);
    assert.equal(row.parentCollection, collectionSlug(source));
    assert.equal(row.metrics.impressions, null);
    assert.equal(row.metrics.searchVolume, null);
  }
  assert.doesNotMatch(
    JSON.stringify(result),
    /"(?:authorizationEvidence|deliveryEvidence|CostPKR|OriginalPrice|PurchaseRequirements)"/
  );
});

test('commercial approval cannot be bypassed by editorial flags or an SEO score', () => {
  const p = { ...approved(), approval: 'pending' };
  const result = publicationDecision(p, review(p), now);
  assert.equal(result.state, 'NEEDS_REVIEW');
  assert.equal(result.productSchemaEligible, false);
  assert.equal(result.offerSchemaEligible, false);
});

test('approved offer requires current, specific, useful content and a distinct-intent review', () => {
  const p = approved();
  assert.equal(publicationDecision(p, {}, now).state, 'NEEDS_REVIEW');
  assert.equal(
    publicationDecision(p, review(p), now).state,
    'APPROVED_INDEXABLE'
  );
  assert.equal(
    publicationDecision(p, { ...review(p), publication: 'hold' }, now).state,
    'INFORMATIONAL_NOINDEX'
  );
  assert.equal(
    publicationDecision({ ...p, access: 'Not specified' }, review(p), now)
      .indexable,
    false
  );
  assert.equal(
    publicationDecision(p, { ...review(p), distinctIntent: false }, now)
      .indexable,
    false
  );
  assert.equal(
    publicationDecision(p, { ...review(p), reviewedAt: '2030-01-01' }, now)
      .indexable,
    false
  );
  assert.equal(
    publicationDecision(p, { ...review(p), reviewedAt: '2026-02-30' }, now)
      .indexable,
    false
  );
  assert.equal(
    publicationDecision(p, { ...review(p), publication: undefined }, now)
      .indexable,
    false
  );
  assert.equal(
    publicationDecision({ ...p, price: p.price + 1 }, review(p), now).indexable,
    false
  );
  assert.equal(
    publicationDecision({ ...p, approval: 'excluded' }, review(p), now).state,
    'EXCLUDED'
  );
});

test('stock and dated purchase eligibility stay separate from stable editorial indexability', () => {
  const p = approved();
  assert.equal(
    publicationDecision(p, review(p), now).offerSchemaEligible,
    true
  );
  const out = { ...p, stock: 'out-of-stock', purchasable: false };
  assert.equal(publicationDecision(out, review(out), now).indexable, true);
  assert.equal(
    publicationDecision(out, review(out), now).offerSchemaEligible,
    false
  );
  assert.equal(
    publicationDecision(p, review(p), new Date('2026-11-10'))
      .offerSchemaEligible,
    false
  );
  assert.equal(
    contentFingerprint({ ...p, date: '2026-10-24' }),
    contentFingerprint(p),
    'Quote confirmation alone does not invalidate the distinct-content review'
  );
});

test('changed and removed offers are detected and shared-intent variants target the same parent', () => {
  const a = approved(),
    b = { ...a, id: 'PK-SECOND', slug: 'second-plan', price: a.price + 100 };
  const first = buildIntelligence([a, b], {}, {}, [], now);
  assert.equal(
    first.products[0].keyword.targetUrl,
    first.products[1].keyword.targetUrl
  );
  assert.deepEqual(first.products[0].uniqueness.exactDescriptionPeerIds, [
    b.id,
  ]);
  const second = buildIntelligence(
    [{ ...a, price: a.price + 1 }],
    {},
    {},
    first.products,
    now
  );
  assert.equal(second.products[0].change, 'changed');
  assert.deepEqual(second.summary.removedIds, [b.id]);
  assert.throws(() => buildIntelligence([a, a]), /duplicate/);
  assert.throws(
    () => buildIntelligence([a], { unknown: {} }),
    /Unknown editorial/
  );
});

test('HTML inspection ignores RSC data as native links and recursively validates schema', () => {
  const html = `<head><title>A &amp; B</title><meta content="noindex, follow" name="robots"><link href="${ORIGIN}/tool/test/" rel="canonical"><meta property="og:url" content="${ORIGIN}/tool/test/"></head>
    <h1>One <span>heading</span></h1><a href="/tools/?q=x">Tools</a>
    <script>const fake='<a href="/fake/">fake</a><h1>fake</h1>';</script>
    <script type="application/ld+json">{"@graph":[{"@type":"Product","offers":{"@type":"Offer"}}]}</script>`;
  const result = inspectHtml(html, `${ORIGIN}/tool/test/`);
  assert.equal(result.title, 'A & B');
  assert.equal(result.indexable, false);
  assert.deepEqual(result.h1, ['One heading']);
  assert.deepEqual(result.internalLinks, [`${ORIGIN}/tools/`]);
  assert.deepEqual(result.schemaTypes, ['Product', 'Offer']);
  assert.deepEqual(
    inspectHtml('<script type="application/ld+json">bad</script>', ORIGIN)
      .errors,
    ['invalid-json-ld']
  );
});

test('GSC export importer requires scope, real headers, site-matching URLs and valid metrics', () => {
  const scope = {
    site: ORIGIN,
    startDate: '2026-10-01',
    endDate: '2026-10-22',
    searchType: 'web',
    country: 'pak',
    device: 'mobile',
  };
  const valid = `Top pages,Clicks,Impressions,CTR,Position\n${ORIGIN}/tools/,10,100,10%,4.5\n`;
  assert.equal(importGscPages(valid, scope)[0].ctr, 0.1);
  assert.throws(() => importGscPages(valid, {}), /scope|requires/);
  assert.throws(
    () => importGscPages(valid.replace(ORIGIN, 'https://example.com'), scope),
    /Foreign/
  );
  assert.throws(
    () => importGscPages(valid.replace('10%,', '10,'), scope),
    /percent/
  );
  assert.throws(
    () => importGscPages(valid.replace('10,100', '200,100'), scope),
    /Invalid/
  );
  assert.throws(
    () => importGscPages(valid.replace('10,100', ',100'), scope),
    /Missing/
  );
  assert.throws(
    () => importGscPages(valid, { ...scope, startDate: '2026-02-30' }),
    /requires/
  );
  assert.throws(
    () => importGscPages('query,clicks\nhello,1', scope),
    /headers/
  );
});

test('review CSV preserves quotes/newlines and prevents spreadsheet formula execution', () => {
  const result = csv(
    [{ id: '=SUM(1,2)', description: 'line1\n"line2"' }],
    ['id', 'description']
  );
  assert.ok(result.includes('"\'=SUM(1,2)"'));
  assert.ok(result.includes('"line1\n""line2"""'));
});
