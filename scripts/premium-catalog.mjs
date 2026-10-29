import { createHash } from 'node:crypto';
import { unspecified } from '../src/lib/seo-publication.mjs';

const publicText = (value) =>
  String(value)
    .normalize('NFKC')
    .replace(/<[^>]*>/g, '')
    .replace(/(?:https?:\/\/|www\.)\S+/gi, '')
    .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Owner-authored offers are separate from the original private supplier CSV.
// Reimporting that CSV must neither erase these offers nor rewrite legacy rows.
export function premiumProducts(
  document,
  brands,
  inventory = {},
  approvals = {}
) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(document.updatedAt) ||
    !Number.isFinite(Date.parse(document.updatedAt))
  )
    throw new Error(
      'Premium catalog requires its actual price confirmation date'
    );
  return document.products.flatMap((entry) => {
    const asset = brands[entry.brandSlug];
    if (!asset?.source_verified && asset?.license_review_status !== 'approved')
      throw new Error(`Official logo provenance required for ${entry.key}`);
    if (!entry.summary || !entry.description || !entry.features?.length)
      throw new Error(`Incomplete premium product ${entry.key}`);
    return entry.plans.map((plan) => {
      if (
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(plan.slug) ||
        !Number.isSafeInteger(plan.price) ||
        plan.price <= 0 ||
        !Number.isSafeInteger(plan.months) ||
        plan.months <= 0
      )
        throw new Error(`Invalid premium plan ${entry.key}`);
      const id =
        'PK-' +
        createHash('sha256')
          .update(`aitoolspk:${plan.slug}`)
          .digest('hex')
          .slice(0, 12)
          .toUpperCase();
      const review = approvals[id] || {};
      const approval = review.status || 'pending';
      if (!['pending', 'approved', 'excluded'].includes(approval))
        throw new Error(`Invalid premium approval ${id}`);
      if (
        approval === 'approved' &&
        [
          'authorizationEvidence',
          'deliveryEvidence',
          'reviewedAt',
          'stockCheckedAt',
          'description',
          'warranty',
          'duration',
          'access',
          'renewal',
        ].some((key) => !review[key])
      )
        throw new Error(
          `Approval evidence and exact public terms required for ${id}`
        );
      for (const field of ['reviewedAt', 'stockCheckedAt']) {
        if (
          review[field] &&
          (!/^\d{4}-\d{2}-\d{2}$/.test(review[field]) ||
            !Number.isFinite(Date.parse(review[field])))
        )
          throw new Error(`Invalid premium review date ${id}`);
      }
      if (
        approval === 'approved' &&
        ['description', 'duration', 'warranty', 'access', 'renewal'].some(
          (key) =>
            typeof review[key] !== 'string' ||
            unspecified(publicText(review[key]))
        )
      )
        throw new Error(
          `Specific sanitized public terms required for premium approval ${id}`
        );
      const update = inventory[id];
      if (
        update &&
        (!/^\d{4}-\d{2}-\d{2}$/.test(update.checkedAt) ||
          !Number.isFinite(Date.parse(update.checkedAt)))
      )
        throw new Error(`Invalid inventory confirmation date for ${id}`);
      const stock =
        update &&
        update.checkedAt >= (review.stockCheckedAt || document.updatedAt)
          ? update.stock
          : review.stockStatus || entry.stock || 'unconfirmed';
      if (!['in-stock', 'out-of-stock', 'unconfirmed'].includes(stock))
        throw new Error(`Invalid premium stock ${id}`);
      return {
        id,
        slug: plan.slug,
        name: entry.name,
        brand: entry.brand,
        brandSlug: entry.brandSlug,
        category: entry.category,
        price: plan.price,
        duration: review.duration
          ? publicText(review.duration)
          : `${plan.months} ${plan.months === 1 ? 'month' : 'months'}`,
        warranty: review.warranty
          ? publicText(review.warranty)
          : 'Full Duration Warranty',
        access: review.access
          ? publicText(review.access)
          : 'Confirm delivery method on WhatsApp',
        credits: '',
        stock,
        // Seller-supplied descriptions/warranty do not establish resale rights.
        // Preserve the same evidence gate used for legacy supplier offers.
        approval,
        description: review.description
          ? publicText(review.description)
          : entry.description,
        date: document.updatedAt,
        logo: asset.asset_path,
        purchasable: approval === 'approved' && stock === 'in-stock',
        risk: false,
        renewal: review.renewal
          ? publicText(review.renewal)
          : 'This listing does not confirm automatic renewal. Confirm renewal pricing and terms on WhatsApp before the subscription ends.',
        sourceType: 'seller-listed',
        // The full-duration badge/copy must follow the actual reviewed terms.
        sellerWarranty: /^full duration warranty$/i.test(
          publicText(review.warranty || 'Full Duration Warranty')
        ),
        summary: entry.summary,
        features: entry.features,
        exclusions: entry.exclusions,
        fairUsage: entry.fairUsage,
        notes: entry.notes,
        variantGroup: entry.key,
        durationMonths: plan.months,
        ...(entry.referencePrice
          ? { referencePrice: entry.referencePrice }
          : {}),
      };
    });
  });
}

/** Clean CI has no private evidence file. Preserve committed reviewed terms;
 * never silently revoke an exclusion or change the price of an approved offer.
 * Commercial/term changes are authored and reviewed locally before committing.
 */
export function preserveCommittedReviews(
  previous,
  generated,
  explicitApprovals = {}
) {
  const byId = new Map(previous.map((p) => [p.id, p]));
  const authored = [
    'slug',
    'name',
    'brand',
    'brandSlug',
    'category',
    'price',
    'date',
    'summary',
    'features',
    'exclusions',
    'fairUsage',
    'notes',
    'variantGroup',
    'durationMonths',
    'referencePrice',
  ];
  return generated.map((p) => {
    const old = byId.get(p.id);
    if (!old || explicitApprovals[p.id] || old.approval === 'pending') return p;
    if (
      authored.some(
        (key) => JSON.stringify(old[key]) !== JSON.stringify(p[key])
      )
    )
      throw new Error(
        `Reviewed premium offer ${p.id} changed. Reimport locally with explicit commercial review before CI.`
      );
    return {
      ...old,
      stock: p.stock,
      purchasable: old.approval === 'approved' && p.stock === 'in-stock',
    };
  });
}

export function mergePremiumProducts(original, additions) {
  const merged = [...original, ...additions];
  if (new Set(merged.map((p) => p.id)).size !== merged.length)
    throw new Error('Duplicate product identity');
  if (new Set(merged.map((p) => p.slug)).size !== merged.length)
    throw new Error('Duplicate product URL');
  const signatures = merged.map(
    (p) => `${p.brandSlug}|${p.name}|${p.duration}|${p.warranty}|${p.access}`
  );
  const originalSignatures = new Set(signatures.slice(0, original.length));
  for (const signature of signatures.slice(original.length)) {
    if (originalSignatures.has(signature))
      throw new Error('Premium offer duplicates an existing variant');
    originalSignatures.add(signature);
  }
  return merged;
}
