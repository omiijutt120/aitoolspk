import { products } from './catalog';
import { categories } from './categories';
import { collectionProducts, groupCollections } from './collections';
import { laterPages, pagePath } from './pagination';

export function directoryPageParams() {
  return laterPages(groupCollections(products).length).map((page) => ({
    page,
  }));
}
export function collectionPageParams() {
  return groupCollections(products).flatMap((c) =>
    laterPages(collectionProducts(products, c.slug).length).map((page) => ({
      slug: c.slug,
      page,
    }))
  );
}
export function categoryPageParams() {
  return categories.flatMap((c) =>
    laterPages(
      groupCollections(products.filter((p) => p.category === c.slug)).length
    ).map((page) => ({ slug: c.slug, page }))
  );
}
export function paginatedSitemapUrls() {
  return [
    ...directoryPageParams().map(({ page }) =>
      pagePath('/tools/', Number(page))
    ),
    ...collectionPageParams().map(({ slug, page }) =>
      pagePath(`/plans/${slug}/`, Number(page))
    ),
    ...categoryPageParams().map(({ slug, page }) =>
      pagePath(`/category/${slug}/`, Number(page))
    ),
  ];
}
