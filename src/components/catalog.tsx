import { products } from '@/lib/catalog';
import { CatalogBrowser } from './catalog-browser';
import { orderCatalog } from '@/lib/catalog-order';
import { collectionProducts, groupCollections } from '@/lib/collections';
export function Catalog({
  category,
  continuous = false,
  collection,
}: {
  category?: string;
  continuous?: boolean;
  collection?: string;
}) {
  const eligible = collection
    ? collectionProducts(products, collection)
    : products;
  const subset = orderCatalog(
    eligible.filter((p) => !category || p.category === category)
  );
  const unique = (key: 'brand' | 'duration' | 'warranty' | 'access') =>
    [...new Set(subset.map((p) => p[key]))].sort();
  return (
    <CatalogBrowser
      initial={subset.slice(0, continuous ? 32 : 24)}
      initialCollections={groupCollections(subset)}
      collection={collection}
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
