/** Shared by the storefront and offline SEO analysis; no catalog is bundled here. */
export function isApiProduct(product) {
  return (
    product.brandSlug === 'apigpt' ||
    /\b(?:z?api)(?:\b|(?=key|token|credit))/i.test(
      `${product.name} ${product.access}`
    )
  );
}

export const collectionSlug = (product) =>
  isApiProduct(product) ? 'api' : product.brandSlug;
