import { products } from '@/lib/catalog';
import { CatalogBrowser } from './catalog-browser';
import { orderCatalog } from '@/lib/catalog-order';
import { collectionProducts, groupCollections } from '@/lib/collections';
import { PAGE_SIZE } from '@/lib/pagination';
export function Catalog({
  category,
  continuous = false,
  collection,
  initialPage = 1,
}: {
  category?: string;
  continuous?: boolean;
  collection?: string;
  initialPage?: number;
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
      initial={
        continuous
          ? subset.slice(0, 32)
          : subset.slice((initialPage - 1) * PAGE_SIZE, initialPage * PAGE_SIZE)
      }
      initialPage={initialPage}
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
