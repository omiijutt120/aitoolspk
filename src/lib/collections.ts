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
