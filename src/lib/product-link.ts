import type { Product } from './types';

/**
 * A product detail page is served `noindex` until its seller terms clear
 * review, and those pages are deliberately kept out of the sitemap.
 *
 * A followed link to a page Google will never index still has to be crawled,
 * and it moves internal link equity away from the collection and article pages
 * that can rank. While every product is unreviewed that is 815 noindex pages
 * receiving thousands of followed links, which is most of this site's internal
 * link graph.
 *
 * `approval === 'approved'` is a necessary condition for the page to be
 * indexable (see publicationDecision in seo-publication.mjs), so it is the safe
 * gate to use here. Deliberately dependency-free: this runs inside client
 * components, and seo-publication.mjs pulls in node:crypto.
 */
export const productLinkRel = (product: Product) =>
  product.approval === 'approved' ? undefined : 'nofollow';
