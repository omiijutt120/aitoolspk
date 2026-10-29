import type { Product } from './types';

/** Reject an error document or damaged response before it reaches the UI. */
export function parseCatalogResponse(value: unknown): Product[] {
  const strings = [
    'id',
    'slug',
    'name',
    'brand',
    'brandSlug',
    'category',
    'duration',
    'warranty',
    'access',
    'credits',
    'description',
    'date',
    'renewal',
  ];
  if (
    !Array.isArray(value) ||
    !value.every((item: unknown) => {
      if (!item || typeof item !== 'object') return false;
      const p = item as Record<string, unknown>;
      return (
        strings.every((key) => typeof p[key] === 'string') &&
        typeof p.price === 'number' &&
        Number.isSafeInteger(p.price) &&
        p.price >= 0 &&
        ['in-stock', 'out-of-stock', 'unconfirmed'].includes(String(p.stock)) &&
        ['pending', 'approved', 'excluded'].includes(String(p.approval)) &&
        typeof p.purchasable === 'boolean' &&
        typeof p.risk === 'boolean' &&
        (p.logo === null || typeof p.logo === 'string') &&
        (p.summary === undefined || typeof p.summary === 'string') &&
        (p.sellerWarranty === undefined ||
          typeof p.sellerWarranty === 'boolean')
      );
    })
  )
    throw new Error('Invalid catalog response');
  return value as Product[];
}
