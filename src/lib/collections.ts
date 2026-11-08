import type { Product } from './types';
import { homeSelection, orderCatalog } from './catalog-order';
import { collectionSlug } from './catalog-identity.mjs';
export { collectionSlug } from './catalog-identity.mjs';

export type PlanCollection = {
  slug: string;
  title: string;
  brand: string;
  logo: string | null;
  count: number;
  minPrice: number;
  maxPrice: number;
  /**
   * Middle listed quote. Cards lead with this rather than the minimum, because
   * the cheapest row in a collection is often a one-day trial that would make
   * a whole collection look like it starts at that price.
   */
  medianPrice: number;
  categories: string[];
  isApi: boolean;
};

export function collectionProducts(input: Product[], slug: string): Product[] {
  return orderCatalog(
    input.filter((p) => p.approval !== 'excluded' && collectionSlug(p) === slug)
  );
}

/** Every eligible offer belongs to exactly one parent, including all API offers. */
export function groupCollections(input: Product[]): PlanCollection[] {
  const groups = new Map<string, PlanCollection>();
  const prices = new Map<string, number[]>();
  for (const p of orderCatalog(
    input.filter((p) => p.approval !== 'excluded')
  )) {
    const slug = collectionSlug(p);
    const existing = groups.get(slug);
    const bucket = prices.get(slug);
    if (bucket) bucket.push(p.price);
    else prices.set(slug, [p.price]);
    if (existing) {
      existing.count++;
      existing.minPrice = Math.min(existing.minPrice, p.price);
      existing.maxPrice = Math.max(existing.maxPrice, p.price);
      if (!existing.categories.includes(p.category))
        existing.categories.push(p.category);
      if (!existing.logo && p.logo) existing.logo = p.logo;
    } else {
      groups.set(slug, {
        slug,
        title: slug === 'api' ? 'API plans' : `${p.brand} plans`,
        brand: slug === 'api' ? 'APIs & developer tools' : p.brand,
        logo: slug === 'api' ? null : p.logo,
        count: 1,
        minPrice: p.price,
        maxPrice: p.price,
        medianPrice: p.price,
        categories: [p.category],
        isApi: slug === 'api',
      });
    }
  }
  for (const group of groups.values()) {
    const sorted = [...(prices.get(group.slug) ?? [])].sort((a, b) => a - b);
    const middle = Math.floor((sorted.length - 1) / 2);
    group.medianPrice =
      sorted.length % 2 === 0
        ? Math.round((sorted[middle] + sorted[middle + 1]) / 2)
        : sorted[middle];
  }
  const collections = [...groups.values()];
  return [
    ...collections.filter((g) => !g.isApi),
    ...collections.filter((g) => g.isApi),
  ];
}

export function homeCollections(input: Product[]): PlanCollection[] {
  const featured = new Set(homeSelection(input).map(collectionSlug));
  return groupCollections(input).filter((g) => featured.has(g.slug) || g.isApi);
}

/**
 * Sibling collections worth comparing against one specific collection.
 *
 * Every collection already sits two clicks from the homepage through
 * /categories/, so this is not about making the pages reachable. It is about
 * the link itself: a reader comparing security subscriptions should be able to
 * move sideways to another security subscription without going back to the hub,
 * and a crawler should see the 108 money pages linking to each other with
 * descriptive anchors instead of only receiving links from a single index page.
 *
 * Relevance is ranked in two passes — shared category first, then a similar
 * typical price — so a niche collection with no category peers still gets
 * genuinely comparable neighbours. Nothing is estimated: both the category and
 * the median price come from the same rows that the page lists.
 */
export type RelatedCollection = PlanCollection & {
  /** Why this collection is shown: it shares a category, or it is priced alike. */
  reason: 'category' | 'price';
};

export function relatedCollections(
  all: PlanCollection[],
  slug: string,
  limit = 6
): RelatedCollection[] {
  const self = all.find((c) => c.slug === slug);
  if (!self) return [];
  const others = all.filter((c) => c.slug !== slug);

  // Log ratio so a PKR 400 collection is not "close" to a PKR 40,000 one.
  const distance = (c: PlanCollection) =>
    Math.abs(
      Math.log(Math.max(c.medianPrice, 1) / Math.max(self.medianPrice, 1))
    );

  const picked: RelatedCollection[] = [];
  const taken = new Set<string>();

  const sameCategory = others
    .filter((c) =>
      c.categories.some((category) => self.categories.includes(category))
    )
    .sort((a, b) => distance(a) - distance(b) || b.count - a.count);
  for (const c of sameCategory) {
    if (picked.length >= limit) break;
    picked.push({ ...c, reason: 'category' });
    taken.add(c.slug);
  }

  if (picked.length < limit) {
    const byPrice = others
      .filter((c) => !taken.has(c.slug))
      .sort((a, b) => distance(a) - distance(b) || b.count - a.count);
    for (const c of byPrice) {
      if (picked.length >= limit) break;
      picked.push({ ...c, reason: 'price' });
      taken.add(c.slug);
    }
  }

  return picked;
}
