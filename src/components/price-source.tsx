import { ArrowUpRight } from 'lucide-react';
import { vendorHomepage, vendorLinkTitle } from '@/lib/vendor-source';

/**
 * A link from a listed price to the maker's own site.
 *
 * Rendered only where data/brands.json records a verified official domain, so
 * a listing never sends a reader to a guessed address. The label says what the
 * link is — the vendor's site — because the PKR amount beside it is the
 * seller's quote and nothing on the vendor's site confirms it.
 */
export function PriceSource({
  brand,
  brandSlug,
}: {
  brand: string;
  brandSlug: string;
}) {
  const href = vendorHomepage(brandSlug);
  if (!href) return null;
  return (
    <a
      className="price-source"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={vendorLinkTitle(brand)}
    >
      Vendor site
      <ArrowUpRight size={11} aria-hidden="true" />
    </a>
  );
}
