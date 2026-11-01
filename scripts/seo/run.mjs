import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { buildIntelligence, csv, importGscPages, ORIGIN } from './engine.mjs';
import { inspectExport } from './html.mjs';
import { crawlProduction } from './crawl.mjs';

const mode = process.argv[2] || 'report';
if (!['products', 'keywords', 'report', 'audit', 'validate'].includes(mode))
  throw new Error('Unknown SEO mode');
const directory = 'reports/seo';
mkdirSync(directory, { recursive: true });
if (process.argv.includes('--live')) {
  if (mode !== 'audit')
    throw new Error('--live is only supported by seo:audit');
  const result = await crawlProduction(directory);
  if (result.summary.pageErrors || result.summary.crawlCapReached)
    throw new Error(
      'Live crawl has failed requests/JSON-LD or incomplete coverage; inspect reports/seo/production-crawl.json'
    );
}
const read = (file, fallback) =>
  existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : fallback;
const write = (name, value) =>
  writeFileSync(
    `${directory}/${name}.json`,
    JSON.stringify(value, null, 2) + '\n'
  );
const writeCsv = (name, rows, columns) =>
  writeFileSync(`${directory}/${name}.csv`, csv(rows, columns));
const catalog = read('data/catalog.json', []);
if (!catalog.length) throw new Error('Public catalog missing');
const model = buildIntelligence(
  catalog,
  read('data/seo/editorial.json', {}),
  read(`${directory}/research-observations.json`, {}),
  read(`${directory}/product-seo-master.json`, [])
);
const inventory = read('data/inventory.json', {});
for (const product of model.products)
  product.commercialValidation.stockCheckedAt =
    inventory[product.id]?.checkedAt || null;
const live = read(`${directory}/production-crawl.json`, null);
if (live?.pages) {
  const byUrl = new Map(live.pages.map((p) => [p.url, p]));
  for (const product of model.products) {
    const page = byUrl.get(product.canonical);
    if (page) {
      product.technical.productionIndexable = page.indexable;
      product.technical.productionStatus = page.status;
      product.technical.productionObservedAt =
        live.completedAt || live.checkedAt;
    }
  }
}
const gscIndex = process.argv.indexOf('--gsc');
if (gscIndex !== -1) {
  const scopeIndex = process.argv.indexOf('--scope');
  if (scopeIndex === -1) throw new Error('--gsc requires --scope <local JSON>');
  const rows = importGscPages(
    readFileSync(process.argv[gscIndex + 1], 'utf8'),
    read(process.argv[scopeIndex + 1], null)
  );
  write('gsc-pages', { importedAt: new Date().toISOString(), rows });
}
const gsc = read(`${directory}/gsc-pages.json`, null);
if (gsc) {
  for (const row of model.products) {
    const match = gsc.rows.find((r) => r.url === row.canonical);
    if (match) {
      for (const key of ['clicks', 'impressions', 'ctr', 'averagePosition'])
        row.metrics[key] = match[key];
      row.metricsSource = {
        ...match.scope,
        source: match.source,
        importedAt: gsc.importedAt,
      };
    }
  }
  model.summary.metricsAvailability =
    'Optional GSC Pages import; only exact canonical matches, stored date/scope applies. Other metrics remain null.';
}
write('product-seo-master', model.products);
write('collection-seo-master', model.collections);
write('product-coverage', { generatedAt: model.generatedAt, ...model.summary });
function writeProductCsv() {
  writeCsv(
    'product-seo-master',
    model.products.map((p) => ({
      id: p.id,
      name: p.name,
      canonical: p.canonical,
      parentUrl: p.parentUrl,
      listedRetailPricePKR: p.listedRetailPricePKR,
      approvedRetailPricePKR: p.approvedRetailPricePKR,
      state: p.publication.state,
      blockers: p.publication.reasons,
      keyword: p.keyword.primary,
      targetUrl: p.keyword.targetUrl,
      keywordStatus: p.keyword.status,
      title: p.proposedMetadata.title,
      description: p.proposedMetadata.description,
      sourceFingerprint: p.sourceFingerprint,
      contentFingerprint: p.publication.contentFingerprint,
      heuristicScore: p.quality.heuristicScore,
      sources: p.research.sources,
      metrics: p.metrics,
      priceAgeDays: p.freshness.priceAgeDays,
      change: p.change,
      technical: p.technical,
      commercialValidation: p.commercialValidation,
      contentSpecification: p.contentSpecification,
    })),
    [
      'id',
      'name',
      'canonical',
      'parentUrl',
      'listedRetailPricePKR',
      'approvedRetailPricePKR',
      'state',
      'blockers',
      'keyword',
      'targetUrl',
      'keywordStatus',
      'title',
      'description',
      'sourceFingerprint',
      'contentFingerprint',
      'heuristicScore',
      'sources',
      'metrics',
      'priceAgeDays',
      'change',
      'technical',
      'commercialValidation',
      'contentSpecification',
    ]
  );
}
writeProductCsv();
write(
  'approval-blockers',
  model.products
    .filter((p) => p.publication.reasons.length)
    .map((p) => ({
      id: p.id,
      state: p.publication.state,
      reasons: p.publication.reasons,
      unresolvedTerms: Object.entries(p.quality.checks)
        .filter(([, ok]) => !ok)
        .map(([key]) => key),
    }))
);
const mapping = model.products.map((p) => ({
  id: p.id,
  query: p.keyword.primary,
  targetUrl: p.keyword.targetUrl,
  offerUrl: p.canonical,
  intent: p.keyword.intent,
  evidenceStatus: p.keyword.status,
  researchEvidenceIds: p.research.evidenceIds,
}));
write('keyword-to-url', mapping);
writeCsv('keyword-to-url', mapping, [
  'id',
  'query',
  'targetUrl',
  'offerUrl',
  'intent',
  'evidenceStatus',
  'researchEvidenceIds',
]);
write('search-intent-clusters', model.collections);
const observations =
  read(`${directory}/research-observations.json`, {}).observations || [];
writeCsv(
  'serp-opportunities',
  observations.map((o) => ({
    id: o.id,
    queries: o.queries,
    clusters: o.clusterSlugs,
    competitorUrl: o.competitorUrl,
    sourceUrl: o.sourceUrl,
    pageType: o.pageType,
    observedTopics: o.observedTopics,
    opportunity: o.opportunity,
    evidenceDate: o.evidenceDate,
    limitation:
      'Public web research; no controlled rank, volume, CPC, KD or traffic measured.',
  })),
  [
    'id',
    'queries',
    'clusters',
    'competitorUrl',
    'sourceUrl',
    'pageType',
    'observedTopics',
    'opportunity',
    'evidenceDate',
    'limitation',
  ]
);
write(
  'internal-link-recommendations',
  model.products.map((p) => ({
    id: p.id,
    sourceUrl: p.canonical,
    links: p.internalLinkRecommendations,
  }))
);
write(
  'content-refresh-priorities',
  model.products.map((p) => ({
    id: p.id,
    url: p.canonical,
    state: p.publication.state,
    priority: p.publicClaimFlag
      ? 'P0: resolve claim risk'
      : p.commercialApproval !== 'approved'
        ? 'P1: verify commercial terms before indexing'
        : p.freshness.refreshRequired
          ? 'P1: refresh listed price'
          : 'P2: editorial review',
    freshness: p.freshness,
    reasons: p.publication.reasons,
    evidenceIds: p.research.evidenceIds,
  }))
);
function writeQuality() {
  write('quality-checks', {
    generatedAt: model.generatedAt,
    method:
      'Observable editorial triage only; commercial approval remains mandatory.',
    products: model.products.map((p) => ({
      id: p.id,
      quality: p.quality,
      uniqueness: p.uniqueness,
    })),
    collections: model.collections.map((c) => ({
      slug: c.slug,
      url: c.url,
      quality: c.quality,
    })),
  });
}
writeQuality();

if (['report', 'audit', 'validate'].includes(mode)) {
  if (!existsSync('out/index.html'))
    throw new Error('Build the static export first: npm run build');
  const pages = await inspectExport('out', ORIGIN);
  const sitemap = [
    ...readFileSync('out/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g),
  ].map((m) => m[1]);
  const sitemapSet = new Set(sitemap);
  const pageMap = new Map(pages.map((p) => [p.url, p]));
  const incoming = new Map();
  for (const page of pages)
    for (const url of page.internalLinks) {
      if (!incoming.has(url)) incoming.set(url, new Set());
      if (url !== page.url) incoming.get(url).add(page.url);
    }
  const matrix = pages.map((p) => ({
    url: p.url,
    canonical: p.canonical,
    title: p.title,
    description: p.description,
    robots: p.robots,
    indexable: p.indexable,
    sitemapMember: sitemapSet.has(p.url),
    h1Count: p.h1.length,
    schemaTypes: p.schemaTypes,
    incomingLinks: incoming.get(p.url)?.size || 0,
    errorPage: p.errorPage,
  }));
  write('page-indexability-matrix', matrix);
  writeCsv('page-indexability-matrix', matrix, [
    'url',
    'canonical',
    'title',
    'description',
    'robots',
    'indexable',
    'sitemapMember',
    'h1Count',
    'schemaTypes',
    'incomingLinks',
    'errorPage',
  ]);
  const errors = [];
  const duplicateGroups = (key) => {
    const map = new Map();
    for (const p of pages.filter((p) => p.indexable && !p.errorPage)) {
      if (!map.has(p[key])) map.set(p[key], []);
      map.get(p[key]).push(p.url);
    }
    return [...map]
      .filter(([, urls]) => urls.length > 1)
      .map(([value, urls]) => ({ value, urls }));
  };
  for (const page of pages) {
    if (page.errors.length) errors.push(`${page.url}: invalid JSON-LD`);
    if (page.errorPage) {
      if (page.indexable)
        errors.push(`${page.url}: error page must be noindex`);
      continue;
    }
    if (
      page.canonicalCount !== 1 ||
      page.canonical !== page.url ||
      page.ogUrl !== page.url
    )
      errors.push(`${page.url}: canonical/OG mismatch`);
    if (!page.title || !page.description || page.h1.length !== 1)
      errors.push(`${page.url}: missing metadata or unique H1`);
    if (sitemapSet.has(page.url) !== page.indexable)
      errors.push(`${page.url}: indexability/sitemap disagreement`);
    if (!incoming.get(page.url)?.size && page.url !== `${ORIGIN}/`)
      errors.push(`${page.url}: orphan page`);
    if (
      page.schemaTypes.some((type) =>
        ['Review', 'AggregateRating', 'FAQPage'].includes(type)
      )
    )
      errors.push(`${page.url}: unsupported/unverified rich-result markup`);
  }
  for (const url of sitemap)
    if (!pageMap.has(url)) errors.push(`Sitemap route absent: ${url}`);
  for (const p of model.products) {
    const page = pageMap.get(p.canonical);
    if (p.publication.state === 'EXCLUDED') {
      if (page) errors.push(`${p.id}: excluded route emitted`);
      continue;
    }
    if (!page) {
      errors.push(`${p.id}: missing route`);
      continue;
    }
    p.technical.localIndexable = page.indexable;
    p.technical.inboundLinks = incoming.get(page.url)?.size || 0;
    p.technical.brokenInternalTargets = page.internalLinks.filter(
      (url) => !pageMap.has(url)
    );
    p.technical.localObservedAt = new Date().toISOString();
    if (page.indexable !== p.publication.indexable)
      errors.push(`${p.id}: publication gate mismatch`);
    if (
      page.schemaTypes.includes('Product') !==
        p.publication.productSchemaEligible ||
      page.schemaTypes.includes('Offer') !== p.publication.offerSchemaEligible
    )
      errors.push(`${p.id}: Product/Offer schema eligibility mismatch`);
    for (const link of p.internalLinkRecommendations)
      if (!pageMap.has(link.url))
        errors.push(`Recommendation target missing: ${link.url}`);
  }
  const duplicateTitles = duplicateGroups('title');
  const duplicateDescriptions = duplicateGroups('description');
  if (duplicateTitles.length) errors.push('Duplicate indexable titles');
  if (duplicateDescriptions.length)
    errors.push('Duplicate indexable descriptions');
  const report = {
    checkedAt: new Date().toISOString(),
    mode,
    source: 'fresh local static HTML, not public deployment',
    ...model.summary,
    exportedHtmlPages: pages.length,
    canonicalPages: pages.filter((p) => !p.errorPage).length,
    indexablePages: pages.filter((p) => !p.errorPage && p.indexable).length,
    sitemapUrls: sitemap.length,
    duplicateTitles,
    duplicateDescriptions,
    orphanPages: matrix
      .filter((p) => !p.errorPage && !p.incomingLinks && p.url !== `${ORIGIN}/`)
      .map((p) => p.url),
    errors,
    passed: errors.length === 0,
  };
  write('local-technical-audit', report);
  write('product-seo-master', model.products);
  for (const collection of model.collections) {
    const page = pageMap.get(collection.url);
    collection.quality.technicalValidation = page
      ? {
          selfCanonical: page.canonical === page.url,
          hasOneH1: page.h1.length === 1,
          validJsonLd: page.errors.length === 0,
          indexable: page.indexable,
          sitemapMember: sitemapSet.has(page.url),
          inboundLinks: incoming.get(page.url)?.size || 0,
          checkedAt: report.checkedAt,
        }
      : null;
  }
  write('collection-seo-master', model.collections);
  writeQuality();
  writeProductCsv();
  if (errors.length)
    throw new Error(
      `SEO validation failed (${errors.length}): ${errors.slice(0, 10).join('\n')}`
    );
}
console.log(JSON.stringify({ mode, ...model.summary }, null, 2));
