import { createHash } from 'node:crypto';
import { canBuy, money } from './commerce.mjs';

export const PUBLICATION_STATES = Object.freeze([
  'APPROVED_INDEXABLE',
  'INFORMATIONAL_NOINDEX',
  'NEEDS_REVIEW',
  'EXCLUDED',
]);

export const unspecified = (value) =>
  typeof value !== 'string' ||
  !value.trim() ||
  /not specified|unverified|confirm delivery|not confirmed|requires? (?:seller )?verification/i.test(
    value
  );

/** Public customer-facing facts only. Approval evidence never enters this hash. */
export function contentFingerprint(product) {
  const fields = [
    'id',
    'slug',
    'name',
    'brand',
    'brandSlug',
    'category',
    'price',
    'duration',
    'warranty',
    'access',
    'credits',
    'description',
    'renewal',
    'summary',
    'features',
    'exclusions',
    'fairUsage',
    'sellerWarranty',
  ];
  return createHash('sha256')
    .update(JSON.stringify(fields.map((key) => [key, product[key] ?? null])))
    .digest('hex');
}

/** Commercial approval cannot be earned by an editorial score or SEO override. */
export function publicationDecision(product, review = {}, now = new Date()) {
  const fingerprint = contentFingerprint(product);
  const reasons = [];
  let state;
  if (product.approval === 'excluded') {
    state = 'EXCLUDED';
    reasons.push('commercial-exclusion');
  } else if (product.approval !== 'approved') {
    state = 'NEEDS_REVIEW';
    reasons.push('commercial-authorization-and-delivery-review-required');
  } else {
    for (const key of [
      'description',
      'duration',
      'warranty',
      'access',
      'renewal',
    ])
      if (unspecified(product[key])) reasons.push(`verified-${key}-required`);
    if (product.risk) reasons.push('flagged-public-claim-needs-resolution');
    const reviewedDate = Date.parse(`${review.reviewedAt}T00:00:00+05:00`);
    const exactReviewDate =
      /^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt || '') &&
      Number.isFinite(reviewedDate) &&
      new Date(`${review.reviewedAt}T00:00:00Z`).toISOString().slice(0, 10) ===
        review.reviewedAt;
    if (!exactReviewDate || reviewedDate > now.getTime())
      reasons.push('valid-editorial-review-date-required');
    if (!['ready', 'hold'].includes(review.publication))
      reasons.push('explicit-editorial-publication-decision-required');
    if (review.contentFingerprint !== fingerprint)
      reasons.push('current-content-review-required');
    if (review.distinctIntent !== true || review.usefulContent !== true)
      reasons.push('distinct-intent-and-useful-content-review-required');
    state = reasons.length
      ? 'NEEDS_REVIEW'
      : review.publication === 'hold'
        ? 'INFORMATIONAL_NOINDEX'
        : 'APPROVED_INDEXABLE';
    if (state === 'INFORMATIONAL_NOINDEX') reasons.push('editorial-hold');
  }
  const indexable = state === 'APPROVED_INDEXABLE';
  return {
    state,
    indexable,
    robots: indexable ? 'index, follow' : 'noindex, follow',
    sitemapEligible: indexable,
    productSchemaEligible: indexable && product.approval === 'approved',
    offerSchemaEligible: indexable && canBuy(product, now),
    contentFingerprint: fingerprint,
    reasons,
  };
}

/** Draft metadata never changes price, approval, plan terms or canonical identity. */
export function productSearchCopy(product) {
  return {
    title: product.sellerWarranty
      ? `${product.name.split(' – ')[0]} in Pakistan — ${product.duration}`
      : `${product.name} — ${money(product.price)}`,
    description: product.summary
      ? `${product.name.split(' – ')[0]} subscription in Pakistan: ${money(product.price)} for ${product.duration}. Seller warranty for the purchased duration. Confirm on WhatsApp.`
      : `${product.name}. Listed price ${money(product.price)}. Duration: ${product.duration}. ${product.approval === 'approved' ? 'Read exact access and warranty terms.' : 'Pending verification; confirm availability on WhatsApp.'}`,
    h1: product.name,
  };
}
