import { products } from '@/lib/catalog';
import { CatalogBrowser } from './catalog-browser';
export function Catalog({ category }: { category?: string }) {
  const subset = products.filter((p) => !category || p.category === category);
  const unique = (key: 'brand' | 'duration' | 'warranty' | 'access') =>
    [...new Set(subset.map((p) => p[key]))].sort();
  return (
    <CatalogBrowser
      initial={subset.slice(0, 24)}
      category={category}
      total={subset.length}
      options={{
        brands: unique('brand'),
        durations: unique('duration'),
        warranties: unique('warranty'),
        accesses: unique('access'),
      }}
    />
  );
}
