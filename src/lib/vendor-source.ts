import brands from '../../data/brands.json';

type BrandRecord = { official_domain?: string };

/**
 * The brand's own site, from data/brands.json — the same record that supplies
 * each logo. Nothing is guessed: a brand with no recorded domain returns null
 * and renders no link at all.
 *
 * This exists because every price on the site is a seller quote in PKR, not a
 * vendor list price. A reader comparing two numbers has no way to see what the
 * maker itself charges, so each listed amount carries a link to the maker's own
 * site. The link is labelled as the vendor's site, never as the source of the
 * PKR figure beside it.
 */
const records = brands as Record<string, BrandRecord>;

export function vendorHomepage(brandSlug: string | null | undefined) {
  if (!brandSlug) return null;
  const domain = records[brandSlug]?.official_domain;
  return domain ? `https://${domain}/` : null;
}

/** The wording used on every surface, so a link never claims more than it is. */
export function vendorLinkTitle(brand: string) {
  return `${brand}: the maker's own site. The amount shown here is a seller quote, not the maker's list price.`;
}
