/**
 * The seller quote round-trip.
 *
 * Every listed price is a dated seller quote, and 815 of them were captured on
 * 19–24 October with `approval: pending`. The site deliberately cannot publish
 * an offer it cannot stand behind, so those pages stay `noindex`. What was
 * missing was not a decision but a format: the seller had no way to return a
 * price, a warranty and an access method that the catalogue could ingest
 * without hand-editing JSON.
 *
 * `request` writes one row per pending listing with the facts that are missing
 * marked, so the seller fills a spreadsheet instead of answering free text.
 * `apply` validates the returned file before touching the catalogue, and never
 * invents a value: a blank cell changes nothing, and `approval` is not touched
 * at all because price is not authorization.
 */
import { collectionSlug } from '../../src/lib/catalog-identity.mjs';
import {
  contentFingerprint,
  publicationDecision,
  unspecified,
} from '../../src/lib/seo-publication.mjs';

export const REQUEST_COLUMNS = [
  'id',
  'collection',
  'plan',
  'duration',
  'listed_price_pkr',
  'quote_date',
  'needs_seller_input',
  'seller_price_pkr',
  'seller_confirms',
  'seller_warranty',
  'seller_access',
  'seller_renewal',
  'notes',
];

export const SELLER_COLUMNS = [
  'seller_price_pkr',
  'seller_confirms',
  'seller_warranty',
  'seller_access',
  'seller_renewal',
  'notes',
];

export const CONFIRM_VALUES = ['yes', 'no', 'withdrawn'];

export function missingFacts(product) {
  const missing = [];
  for (const key of ['warranty', 'access', 'renewal'])
    if (unspecified(product[key])) missing.push(key);
  if (!product.duration) missing.push('duration');
  return missing;
}

/**
 * One row per listing awaiting a quote. Sorted so a seller working down the
 * sheet sees one collection at a time.
 */
export function buildRequestRows(catalog, { collection = '' } = {}) {
  return catalog
    .filter((product) => product.approval === 'pending')
    .map((product) => ({
      product,
      slug: collectionSlug(product),
    }))
    .filter(({ slug }) => !collection || slug === collection)
    .sort(
      (a, b) =>
        a.slug.localeCompare(b.slug) ||
        a.product.price - b.product.price ||
        a.product.name.localeCompare(b.product.name)
    )
    .map(({ product, slug }) => ({
      id: product.id,
      collection: slug,
      plan: product.name,
      duration: product.duration,
      listed_price_pkr: product.price,
      quote_date: product.date,
      needs_seller_input: missingFacts(product).join(' '),
      seller_price_pkr: '',
      seller_confirms: '',
      seller_warranty: '',
      seller_access: '',
      seller_renewal: '',
      notes: '',
    }));
}

export function collectionSummary(rows) {
  const map = new Map();
  for (const row of rows) {
    const entry = map.get(row.collection) ?? {
      collection: row.collection,
      plans: 0,
      prices: [],
    };
    entry.plans += 1;
    entry.prices.push(Number(row.listed_price_pkr));
    map.set(row.collection, entry);
  }
  return [...map.values()]
    .map((entry) => ({
      collection: entry.collection,
      plans: entry.plans,
      cheapest: Math.min(...entry.prices),
      dearest: Math.max(...entry.prices),
    }))
    .sort(
      (a, b) => b.plans - a.plans || a.collection.localeCompare(b.collection)
    );
}

class QuoteError extends Error {
  constructor(problems) {
    super(
      `The response file has ${problems.length} problem(s):\n` +
        problems
          .map((problem) => `  line ${problem.line}: ${problem.message}`)
          .join('\n')
    );
    this.name = 'QuoteError';
    this.problems = problems;
  }
}

/**
 * Validates a returned file before anything is written. A row that is missing
 * a required answer fails the whole file, because silently skipping it would
 * leave a price that the seller may have meant to change.
 */
export function validateResponse(rows, catalog) {
  const byId = new Map(catalog.map((product) => [product.id, product]));
  const problems = [];
  const seen = new Set();
  for (const row of rows) {
    const line = row.__line ?? 0;
    const id = row.id;
    if (!id) {
      problems.push({ line, message: 'id is empty' });
      continue;
    }
    if (!byId.has(id)) {
      problems.push({ line, message: `id ${id} is not in the catalogue` });
      continue;
    }
    if (seen.has(id)) {
      problems.push({ line, message: `id ${id} appears more than once` });
      continue;
    }
    seen.add(id);
    const confirm = (row.seller_confirms ?? '').toLowerCase();
    if (!CONFIRM_VALUES.includes(confirm)) {
      problems.push({
        line,
        message: `seller_confirms must be one of ${CONFIRM_VALUES.join('/')}, got "${row.seller_confirms ?? ''}"`,
      });
      continue;
    }
    if (confirm === 'yes') {
      const price = Number(row.seller_price_pkr);
      if (!Number.isInteger(price) || price <= 0)
        problems.push({
          line,
          message:
            'a confirmed row needs a whole-number seller_price_pkr above 0',
        });
    }
  }
  if (problems.length) throw new QuoteError(problems);
  return rows.map((row) => ({
    ...row,
    seller_confirms: row.seller_confirms.toLowerCase(),
  }));
}

const cleanText = (value) => (unspecified(value) ? '' : String(value).trim());

/**
 * Returns a new catalogue array plus a receipt. `approval` is never modified:
 * a price is not resale authorization, and the publication gate still requires
 * both that authorization and a current editorial review.
 */
export function applyResponse(catalog, rows, { quoteDate, reviews = {} } = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(quoteDate ?? ''))
    throw new Error(
      'A real confirmation date is required: --quote-date YYYY-MM-DD'
    );
  const validated = validateResponse(rows, catalog);
  const byId = new Map(catalog.map((product) => [product.id, product]));
  const changes = [];
  const warnings = [];
  for (const row of validated) {
    const product = byId.get(row.id);
    const before = {
      price: product.price,
      date: product.date,
      warranty: product.warranty,
      access: product.access,
      renewal: product.renewal,
      stock: product.stock,
    };
    const next = { ...product };
    if (row.seller_confirms === 'yes') {
      const price = Number(row.seller_price_pkr);
      if (
        price !== product.price &&
        Math.abs(price - product.price) / product.price > 0.5
      )
        warnings.push(
          `${product.id}: price moves ${product.price} → ${price} (more than 50%); confirm this is not a different plan`
        );
      next.price = price;
      next.date = quoteDate;
      const warranty = cleanText(row.seller_warranty);
      const access = cleanText(row.seller_access);
      const renewal = cleanText(row.seller_renewal);
      if (warranty) next.warranty = warranty;
      if (access) next.access = access;
      if (renewal) next.renewal = renewal;
    } else if (row.seller_confirms === 'withdrawn') {
      next.stock = 'out-of-stock';
    }
    const decision = publicationDecision(next, reviews[next.id]);
    changes.push({
      id: next.id,
      name: next.name,
      confirmed: row.seller_confirms,
      before,
      after: {
        price: next.price,
        date: next.date,
        warranty: next.warranty,
        access: next.access,
        renewal: next.renewal,
        stock: next.stock,
      },
      unchanged:
        before.price === next.price &&
        before.date === next.date &&
        before.warranty === next.warranty &&
        before.access === next.access &&
        before.renewal === next.renewal &&
        before.stock === next.stock,
      publication: {
        state: decision.state,
        reasons: decision.reasons,
      },
    });
    byId.set(next.id, next);
  }
  const next = catalog.map((product) => byId.get(product.id) ?? product);
  return { catalog: next, changes, warnings };
}

export function publicationReadiness(catalog, reviews = {}) {
  const counts = {};
  for (const product of catalog) {
    const decision = publicationDecision(product, reviews[product.id]);
    counts[decision.state] = (counts[decision.state] ?? 0) + 1;
  }
  return counts;
}

export { contentFingerprint, QuoteError };
