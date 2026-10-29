import { createHash } from 'node:crypto';
import { parse } from 'csv-parse/sync';
import { collectionSlug } from '../../src/lib/catalog-identity.mjs';
import {
  publicationDecision,
  productSearchCopy,
  unspecified,
} from '../../src/lib/seo-publication.mjs';

export const ORIGIN = 'https://aitoolspk.tech';
export const digest = (value) =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');
const unknownMetrics = () => ({
  impressions: null,
  clicks: null,
  ctr: null,
  averagePosition: null,
  searchVolume: null,
  keywordDifficulty: null,
  cpc: null,
  organicTraffic: null,
  queryCoverage: null,
  googleIndexedStatus: null,
  whatsappEnquiries: null,
  conversionTrend: null,
  referringDomains: null,
  aiCitations: null,
  fieldLcp: null,
  fieldInp: null,
  fieldCls: null,
});
const normalize = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
const shingles = (s) => {
  const words = normalize(s).split(' ');
  return new Set(
    words.length < 5
      ? [words.join(' ')]
      : words.slice(0, -4).map((_, i) => words.slice(i, i + 5).join(' '))
  );
};
export function similarity(a, b) {
  const x = shingles(a),
    y = shingles(b);
  const intersection = [...x].filter((v) => y.has(v)).length;
  return intersection / new Set([...x, ...y]).size;
}
// These are transparent editorial triage checks, never Google's ranking scores.
function quality(product, decision, evidence) {
  const checks = {
    exactIdentity: Boolean(product.id && product.slug && product.name),
    validRetailPrice: Number.isSafeInteger(product.price) && product.price > 0,
    descriptionPresent: !unspecified(product.description),
    durationPresent: !unspecified(product.duration),
    warrantyPresent: !unspecified(product.warranty),
    deliveryPresent: !unspecified(product.access),
    renewalPresent: !unspecified(product.renewal),
    officialLocalAsset: Boolean(product.logo),
    researchedCluster: evidence.length > 0,
    commercialApproved: product.approval === 'approved',
    currentEditorialReview: decision.indexable,
  };
  return {
    heuristicScore: Math.round(
      (100 * Object.values(checks).filter(Boolean).length) /
        Object.keys(checks).length
    ),
    method:
      'Equal-weight observable checklist; not a search ranking, factual certification or commercial approval.',
    checks,
    unmeasured: [
      'field performance',
      'real search demand',
      'ranking',
      'AI citations',
      'customer satisfaction',
    ],
  };
}
export function buildIntelligence(
  catalog,
  editorial = {},
  research = {},
  previous = [],
  now = new Date()
) {
  const ids = new Set(),
    slugs = new Set();
  for (const p of catalog) {
    if (!p.id || !p.slug || ids.has(p.id) || slugs.has(p.slug))
      throw new Error('Missing or duplicate catalog identity');
    if (!Number.isSafeInteger(p.price) || p.price <= 0)
      throw new Error(`Invalid retail price ${p.id}`);
    ids.add(p.id);
    slugs.add(p.slug);
  }
  for (const id of Object.keys(editorial))
    if (!ids.has(id)) throw new Error(`Unknown editorial ID ${id}`);
  const prior = new Map(previous.map((p) => [p.id, p]));
  const observations = research.observations || [];
  const groups = new Map();
  for (const p of catalog.filter((p) => p.approval !== 'excluded')) {
    const slug = collectionSlug(p);
    if (!groups.has(slug)) groups.set(slug, []);
    groups.get(slug).push(p);
  }
  const evidenceIds = new Set();
  for (const observation of observations) {
    if (
      !observation.id ||
      evidenceIds.has(observation.id) ||
      !Array.isArray(observation.clusterSlugs) ||
      observation.clusterSlugs.some((slug) => !groups.has(slug)) ||
      !observation.queries?.length ||
      !/^https:\/\//.test(observation.sourceUrl || '') ||
      !/^\d{4}-\d{2}-\d{2}$/.test(observation.evidenceDate || '')
    )
      throw new Error(
        'Research evidence requires unique IDs, real sources/dates and existing collection mappings'
      );
    evidenceIds.add(observation.id);
  }
  const products = catalog.map((p) => {
    const parent = collectionSlug(p);
    const evidence = observations.filter((o) =>
      o.clusterSlugs?.includes(parent)
    );
    const decision = publicationDecision(p, editorial[p.id], now);
    const keyword =
      parent === 'api'
        ? 'API plans price in Pakistan'
        : `${p.brand} plans price in Pakistan`;
    const sourceFingerprint = digest(p);
    const peers = (groups.get(parent) || []).filter((q) => q.id !== p.id);
    const duplicates = peers
      .filter((q) => normalize(q.description) === normalize(p.description))
      .map((q) => q.id);
    const nearDuplicates = peers
      .filter(
        (q) =>
          !duplicates.includes(q.id) &&
          similarity(q.description, p.description) >= 0.85
      )
      .map((q) => q.id);
    const previousRecord = prior.get(p.id);
    const date = Date.parse(`${p.date}T00:00:00+05:00`);
    const ageDays = Number.isFinite(date)
      ? Math.floor((now - date) / 86400000)
      : null;
    const reviewDate = Date.parse(
      `${editorial[p.id]?.reviewedAt}T00:00:00+05:00`
    );
    const reviewAgeDays = Number.isFinite(reviewDate)
      ? Math.floor((now - reviewDate) / 86400000)
      : null;
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      productType:
        parent === 'api'
          ? 'API access offer'
          : p.sourceType === 'seller-listed'
            ? 'Seller-listed subscription'
            : 'Digital subscription or license offer',
      currency: 'PKR',
      canonical: `${ORIGIN}/tool/${p.slug}/`,
      parentCollection: parent,
      parentUrl: `${ORIGIN}/plans/${parent}/`,
      listedRetailPricePKR: p.price,
      approvedRetailPricePKR: p.approval === 'approved' ? p.price : null,
      listedTerms: {
        duration: p.duration,
        warranty: p.warranty,
        access: p.access,
        credits: p.credits,
        renewal: p.renewal,
      },
      commercialApproval: p.approval,
      stock: p.stock,
      publicClaimFlag: p.risk,
      commercialValidation: {
        authorization: p.approval,
        stockStatus: p.stock,
        priceStatus:
          p.approval === 'approved'
            ? 'approved listed retail quote; date applies'
            : 'listed quote; commercial review pending',
        deliveryVerified: p.approval === 'approved' && !unspecified(p.access),
        planTermsVerified:
          p.approval === 'approved' && !unspecified(p.duration),
        warrantyVerified: p.approval === 'approved' && !unspecified(p.warranty),
        claimsApproved: p.approval === 'approved' && !p.risk,
        evidenceCategoriesRequired:
          p.approval === 'approved'
            ? []
            : [
                'authorization',
                'delivery',
                'exact terms',
                'warranty',
                'review dates',
              ],
      },
      publication: decision,
      proposedMetadata: productSearchCopy(p),
      keyword: {
        primary: keyword,
        secondary: [`${p.name} ${p.duration} price Pakistan`],
        intent: 'commercial-comparison',
        targetUrl: `${ORIGIN}/plans/${parent}/`,
        status: evidence.length
          ? 'public-research-supported-cluster; exact-query demand unmeasured'
          : 'hypothesis; research required',
        variantIntent:
          'Consolidate shared comparison intent on parent; separate indexing requires a current distinct-intent review.',
      },
      research: {
        evidenceIds: evidence.map((o) => o.id),
        sources: [...new Set(evidence.map((o) => o.sourceUrl))],
        checkedAt: evidence.length ? research.checkedAt : null,
        observations: evidence.map((o) => ({
          id: o.id,
          competitorUrl: o.competitorUrl,
          pageType: o.pageType,
          observedTopics: o.observedTopics,
          opportunity: o.opportunity,
          evidenceDate: o.evidenceDate,
        })),
      },
      contentSpecification: {
        status: 'review specification, not automatically published claims',
        entities: [
          p.brand,
          'Pakistan',
          'PKR',
          parent === 'api' ? 'API access' : 'Digital subscriptions',
        ],
        h2Topics: [
          'Included access and allowances',
          'Duration and renewal',
          'Seller warranty and exclusions',
          'Compare available plans',
          'How to enquire',
        ],
        differentiation: {
          duration: p.duration,
          access: p.access,
          warranty: p.warranty,
          credits: p.credits || null,
        },
        verifiedEntitlements:
          p.approval === 'approved' ? p.features || [] : null,
        contentGaps: [
          'Verify plan-specific capabilities and limits',
          'Resolve exact access and warranty terms',
          'Demonstrate distinct buyer intent before indexing',
        ],
        comparisonUrl: `${ORIGIN}/plans/${parent}/`,
      },
      technical: {
        proposedIndexability: decision.state,
        canonicalTarget: `${ORIGIN}/tool/${p.slug}/`,
        robots: decision.robots,
        sitemapEligible: decision.sitemapEligible,
        imageStatus: p.logo
          ? 'Local official-source asset mapped; usage review remains applicable'
          : 'Honest text fallback; official usable asset required',
        productionIndexable: null,
        productionStatus: null,
        localIndexable: null,
        inboundLinks: null,
        brokenInternalTargets: null,
        mobileRendering: null,
      },
      metrics: unknownMetrics(),
      quality: quality(p, decision, evidence),
      uniqueness: {
        exactDescriptionPeerIds: duplicates,
        nearDescriptionPeerIds: nearDuplicates,
        method:
          'Same-parent normalized equality / five-word shingle Jaccard >=0.85; triage only.',
      },
      freshness: {
        priceCheckedAt: p.date,
        priceAgeDays: ageDays,
        refreshRequired: ageDays === null || ageDays < 0 || ageDays >= 7,
        editorialReviewedAt: editorial[p.id]?.reviewedAt || null,
        editorialReviewAgeDays: reviewAgeDays,
        editorialRefreshRequired:
          reviewAgeDays === null || reviewAgeDays < 0 || reviewAgeDays >= 90,
      },
      change: !previousRecord
        ? 'added'
        : previousRecord.sourceFingerprint === sourceFingerprint
          ? 'unchanged'
          : 'changed',
      sourceFingerprint,
      internalLinkRecommendations: [
        {
          url: `${ORIGIN}/plans/${parent}/`,
          anchor: `Compare ${parent === 'api' ? 'API' : p.brand} plans`,
          reason: 'Parent comparison intent',
        },
        {
          url: `${ORIGIN}/guides/choosing-ai-subscriptions-pakistan/`,
          anchor: 'How to choose an AI subscription',
          reason: 'Buyer decision support',
        },
        {
          url: `${ORIGIN}/guides/understanding-credits-and-plan-duration/`,
          anchor: 'Understand credits and plan duration',
          reason: 'Resolve material purchase questions',
        },
      ],
      contentQuestions: [
        'What access method is included?',
        'What does this seller warranty cover and exclude?',
        'What are the renewal and usage limits?',
      ],
    };
  });
  const collections = [...groups].map(([slug, offers]) => {
    const rows = products.filter((p) => p.parentCollection === slug);
    return {
      slug,
      url: `${ORIGIN}/plans/${slug}/`,
      offerIds: offers.map((p) => p.id),
      offerCount: offers.length,
      primaryKeyword: rows[0].keyword.primary,
      keywordStatus: rows[0].keyword.status,
      minListedPricePKR: Math.min(...offers.map((p) => p.price)),
      maxListedPricePKR: Math.max(...offers.map((p) => p.price)),
      approvedOffers: rows.filter((r) => r.commercialApproval === 'approved')
        .length,
      researched: rows.some((r) => r.research.evidenceIds.length),
      quality: {
        heuristicScore: Math.round(
          (100 *
            [
              offers.length > 0,
              offers.every((p) => p.price > 0),
              rows.some((r) => r.research.evidenceIds.length),
            ].filter(Boolean).length) /
            3
        ),
        method:
          'Three observable collection checks: mapped offers, valid price range, sourced cluster research; not a ranking score.',
        technicalValidation: null,
        mobileRendering: null,
        completionStatus: rows.some((r) => r.research.evidenceIds.length)
          ? 'research mapped; offer evidence and editorial work pending'
          : 'cluster research required',
      },
      indexingRationale:
        'Useful multi-plan comparison; no individual unverified Offer schema or entitlement claims.',
      potentialCannibalization: {
        sharedIntentOfferCount: offers.length,
        actualSearchCannibalization: null,
        action:
          'Keep one parent keyword target; validate competing search performance only with query/page evidence.',
      },
    };
  });
  return {
    generatedAt: now.toISOString(),
    origin: ORIGIN,
    products,
    collections,
    summary: {
      sourceProducts: catalog.length,
      records: products.length,
      collections: collections.length,
      categories: new Set(
        catalog.filter((p) => p.approval !== 'excluded').map((p) => p.category)
      ).size,
      states: Object.fromEntries(
        [
          'APPROVED_INDEXABLE',
          'INFORMATIONAL_NOINDEX',
          'NEEDS_REVIEW',
          'EXCLUDED',
        ].map((s) => [
          s,
          products.filter((p) => p.publication.state === s).length,
        ])
      ),
      researchedProducts: products.filter((p) => p.research.evidenceIds.length)
        .length,
      researchedCollections: collections.filter((c) => c.researched).length,
      exactDescriptionDuplicateProducts: products.filter(
        (p) => p.uniqueness.exactDescriptionPeerIds.length
      ).length,
      nearDescriptionDuplicateProducts: products.filter(
        (p) => p.uniqueness.nearDescriptionPeerIds.length
      ).length,
      missingLogos: catalog.filter((p) => !p.logo).length,
      stalePriceProducts: products.filter((p) => p.freshness.refreshRequired)
        .length,
      changes: Object.fromEntries(
        ['added', 'changed', 'unchanged'].map((s) => [
          s,
          products.filter((p) => p.change === s).length,
        ])
      ),
      removedIds: previous.filter((p) => !ids.has(p.id)).map((p) => p.id),
      metricsAvailability:
        'No authorized GSC/GA4/Ahrefs/Similarweb/CrUX import. Null is unknown, not zero.',
    },
  };
}
/** Explicitly selected, site-scoped GSC Pages export; never invent query/page joins. */
export function importGscPages(csv, scope) {
  const validDate = (value) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value || '') &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value;
  if (
    !scope ||
    scope.site !== ORIGIN ||
    !validDate(scope.startDate) ||
    !validDate(scope.endDate) ||
    scope.startDate > scope.endDate ||
    !scope.searchType
  )
    throw new Error(
      'GSC import requires canonical site, date range and search type'
    );
  const rows = parse(csv, { columns: true, skip_empty_lines: true, bom: true });
  if (
    !rows.length ||
    !['Top pages', 'Clicks', 'Impressions', 'CTR', 'Position'].every(
      (key) => key in rows[0]
    )
  )
    throw new Error('Expected unmodified GSC Pages CSV headers');
  const seen = new Set();
  return rows.map((row) => {
    const url = new URL(row['Top pages']);
    if (url.origin !== ORIGIN || url.search || url.hash || seen.has(url.href))
      throw new Error('Foreign, filtered or duplicate GSC page');
    seen.add(url.href);
    const clicks = Number(row.Clicks),
      impressions = Number(row.Impressions),
      position = Number(row.Position);
    if (
      !/^\d+$/.test(row.Clicks) ||
      !/^\d+$/.test(row.Impressions) ||
      !/^\d+(?:\.\d+)?$/.test(row.Position)
    )
      throw new Error('Missing or invalid GSC metrics');
    if (!/^\d+(?:\.\d+)?%$/.test(row.CTR))
      throw new Error('GSC CTR must retain its percent sign');
    const ctr = Number(row.CTR.slice(0, -1)) / 100;
    if (
      ![clicks, impressions].every((n) => Number.isSafeInteger(n) && n >= 0) ||
      clicks > impressions ||
      !Number.isFinite(position) ||
      position < 0 ||
      ctr > 1
    )
      throw new Error('Invalid GSC metrics');
    return {
      url: url.href,
      clicks,
      impressions,
      ctr,
      averagePosition: position,
      scope,
      source: 'owner-supplied GSC Pages export',
    };
  });
}
export function csv(rows, columns) {
  const cell = (value) => {
    const s =
      typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
    // Avoid spreadsheet formula execution in review exports.
    return (
      '"' + (/^[=+@\-\t\r]/.test(s) ? "'" + s : s).replaceAll('"', '""') + '"'
    );
  };
  return (
    [columns, ...rows.map((row) => columns.map((key) => row[key]))]
      .map((row) => row.map(cell).join(','))
      .join('\r\n') + '\r\n'
  );
}
