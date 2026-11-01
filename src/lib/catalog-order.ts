import type { Product } from './types';
import selection from '../../data/storefront.json';
import { isApiProduct } from './catalog-identity.mjs';
export { isApiProduct } from './catalog-identity.mjs';

function compareOffers(a: Product, b: Product): number {
  return (
    Number(b.approval === 'approved') - Number(a.approval === 'approved') ||
    Number(b.stock === 'in-stock') - Number(a.stock === 'in-stock') ||
    Number(a.risk) - Number(b.risk) ||
    a.name.length - b.name.length ||
    a.id.localeCompare(b.id)
  );
}

export function homeSelection(input: Product[]): Product[] {
  const eligible = input.filter(
    (p) => p.approval !== 'excluded' && !isApiProduct(p)
  );
  const selected = selection.featuredProductIds.flatMap(
    (id) => eligible.find((p) => p.id === id) || []
  );
  for (const brand of selection.additionalBrands) {
    const candidate = eligible
      .filter(
        (p) => p.brandSlug === brand && !selected.some((s) => s.id === p.id)
      )
      .sort(compareOffers)[0];
    if (candidate) selected.push(candidate);
  }
  return selected;
}

export function orderCatalog(input: Product[]): Product[] {
  const first = homeSelection(input);
  const picked = new Set(first.map((p) => p.id));
  const remaining = input.filter((p) => !picked.has(p.id));
  return [
    ...first,
    ...remaining.filter((p) => !isApiProduct(p)),
    ...remaining.filter(isApiProduct),
  ];
}
