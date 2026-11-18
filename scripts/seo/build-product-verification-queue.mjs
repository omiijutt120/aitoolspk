#!/usr/bin/env node
/** Deterministic review sheet. This ranks verification work, never approval. */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { toSafeCsv } from '../lib/csv.mjs';
import { missingFacts } from '../catalog/quotes.mjs';
import { collectionSlug } from '../../src/lib/catalog-identity.mjs';

const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8'));
const brands = [
  'chatgpt',
  'gemini',
  'claude',
  'canva',
  'grok',
  'capcut',
  'elevenlabs',
  'notion',
  'adobe',
  'figma',
  'cursor',
  'lovable',
];
const targetPlan = {
  chatgpt: /chatgpt plus/i,
  gemini: /gemini (?:ai )?pro|google ai pro/i,
  claude: /claude pro/i,
  canva: /canva pro/i,
  grok: /grok super|super grok/i,
  capcut: /capcut pro/i,
  elevenlabs: /elevenlabs? creator/i,
  notion: /notion plus/i,
  adobe: /adobe all apps|creative cloud/i,
  figma: /figma pro/i,
  cursor: /cursor pro/i,
  lovable: /lovable pro/i,
};
const riskyLabel =
  /\b(?:otp|bypass|admin|family|fam|shared|edu|education|code|redeem|inapp|link|free|old|lite|api|slot|crack)\b/i;
const selectionScore = (p) =>
  (targetPlan[p.brandSlug]?.test(p.name) ? 100 : 0) -
  (riskyLabel.test(p.name) ? 50 : 0) +
  (/\b(?:1 month|30 days|30d)\b/i.test(p.name) ? 10 : 0);
const pending = catalog.filter((p) => p.approval === 'pending');
const descriptionCounts = new Map();
for (const product of catalog)
  descriptionCounts.set(
    product.description,
    (descriptionCounts.get(product.description) ?? 0) + 1
  );
const groups = new Map(
  brands.map((brand) => [
    brand,
    pending
      .filter((p) => p.brandSlug === brand)
      .sort(
        (a, b) =>
          selectionScore(b) - selectionScore(a) || a.name.localeCompare(b.name)
      ),
  ])
);
const first = [];
while (first.length < 30) {
  let added = false;
  for (const brand of brands) {
    const product = groups.get(brand)?.shift();
    if (!product) continue;
    first.push(product);
    added = true;
    if (first.length === 30) break;
  }
  if (!added) break;
}
const rank = new Map(first.map((p, index) => [p.id, index + 1]));
// This store serves Pakistan; report dates should match the owner's local day.
const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Karachi',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());
const rows = pending
  .map((p) => ({
    priority_rank: rank.get(p.id) ?? '',
    id: p.id,
    brand: p.brand,
    exact_plan_name: p.name,
    subscription_tier: '',
    product_path: `/tool/${p.slug}/`,
    collection_path: `/plans/${collectionSlug(p)}/`,
    listed_price_pkr: p.price,
    previous_price_pkr: '',
    price_source: 'seller catalog; not independently verified',
    quote_date: p.date,
    quote_expires_after_7_days: new Date(
      Date.parse(`${p.date}T00:00:00Z`) + 7 * 86400000
    )
      .toISOString()
      .slice(0, 10),
    last_verified_date: '',
    duration: p.duration,
    account_ownership: '',
    access_method_as_listed: p.access,
    delivery_method: '',
    usage_limits_as_listed: p.credits,
    renewal_as_listed: p.renewal,
    warranty_as_listed: p.warranty,
    refund_conditions: '',
    stock_as_listed: p.stock,
    commercial_authorization_evidence: '',
    editorial_review_status: 'pending',
    exact_description_repeated:
      (descriptionCounts.get(p.description) ?? 0) > 1 ? 'yes' : 'no',
    missing_facts: missingFacts(p).join('; '),
    indexability: 'noindex',
    product_offer_schema_eligible: 'no',
    next_action: rank.has(p.id)
      ? 'First batch: obtain current seller quote, exact terms, authorization and distinct editorial copy'
      : 'Await seller and editorial verification',
  }))
  .sort(
    (a, b) =>
      (Number(a.priority_rank) || Infinity) -
        (Number(b.priority_rank) || Infinity) ||
      a.brand.localeCompare(b.brand) ||
      a.exact_plan_name.localeCompare(b.exact_plan_name)
  );

const prices = catalog.map((p) => ({
  id: p.id,
  brand: p.brand,
  exact_plan_name: p.name,
  listed_price_pkr: p.price,
  previous_price_pkr: '',
  price_source: 'seller catalog; not independently verified',
  quote_date: p.date,
  last_verified_date: '',
  stock_as_listed: p.stock,
  checked_at: today,
  days_since_quote: Math.floor(
    (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${p.date}T00:00:00Z`)) /
      86400000
  ),
  quote_window_days: 7,
  stale:
    Date.parse(`${today}T00:00:00Z`) - Date.parse(`${p.date}T00:00:00Z`) >
    7 * 86400000
      ? 'yes'
      : 'no',
  approval: p.approval,
  required_action:
    p.approval === 'excluded'
      ? 'Keep excluded; review only if owner reopens'
      : 'Reconfirm exact seller quote; never refresh date alone',
}));
mkdirSync('docs/seo', { recursive: true });
writeFileSync(
  'docs/seo/PRODUCT_VERIFICATION_QUEUE.csv',
  toSafeCsv(rows, Object.keys(rows[0]))
);
writeFileSync(
  'docs/seo/PRODUCT_PRICE_FRESHNESS_REPORT.csv',
  toSafeCsv(prices, Object.keys(prices[0]))
);
console.log(
  `Wrote ${rows.length} pending offers, ${first.length} first-batch ranks, and ${prices.length} price freshness rows.`
);
