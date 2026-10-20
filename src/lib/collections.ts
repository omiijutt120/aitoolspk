import type { Product } from './types';
import { homeSelection, isApiProduct, orderCatalog } from './catalog-order';

export type PlanCollection = {
  slug: string;
  title: string;
  brand: string;
  logo: string | null;
  count: number;
  minPrice: number;
  maxPrice: number;
  categories: string[];
  isApi: boolean;
};

export const collectionSlug = (product: Product) =>
  isApiProduct(product) ? 'api' : product.brandSlug;

export function collectionProducts(input: Product[], slug: string): Product[] {
  return orderCatalog(
    input.filter((p) => p.approval !== 'excluded' && collectionSlug(p) === slug)
  );
}

/** Every eligible offer belongs to exactly one parent, including all API offers. */
export function groupCollections(input: Product[]): PlanCollection[] {
  const groups = new Map<string, PlanCollection>();
  for (const p of orderCatalog(
    input.filter((p) => p.approval !== 'excluded')
  )) {
    const slug = collectionSlug(p);
    const existing = groups.get(slug);
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
        categories: [p.category],
        isApi: slug === 'api',
      });
    }
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
