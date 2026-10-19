import { products } from '@/lib/catalog';
import { CatalogBrowser } from './catalog-browser';
import { orderCatalog } from '@/lib/catalog-order';
export function Catalog({
  category,
  continuous = false,
}: {
  category?: string;
  continuous?: boolean;
}) {
  const subset = orderCatalog(
    products.filter((p) => !category || p.category === category)
  );
  const unique = (key: 'brand' | 'duration' | 'warranty' | 'access') =>
    [...new Set(subset.map((p) => p[key]))].sort();
  return (
    <CatalogBrowser
      initial={subset.slice(0, continuous ? 32 : 24)}
      continuous={continuous}
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
