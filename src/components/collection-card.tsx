import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Braces, Layers3, ArrowRight } from 'lucide-react';
import type { PlanCollection } from '@/lib/collections';
import { categoryName } from '@/lib/categories';
import { money } from '@/lib/commerce.mjs';
import { logoThumbnail } from '@/lib/logo-thumbnail';

/**
 * The shape of the terms a collection actually lists.
 *
 * Cards used to repeat one sentence - "Find your fit. Compare durations,
 * access and warranty options." - under 27 headings at once. It was true on
 * every card and specific to none, so a reader learned nothing from the
 * twenty-seventh copy. This reads the parsed duration bands instead: a
 * collection with a 1-month and a 1-year listing says so, and a collection
 * where the seller never states a term says that instead of implying one.
 */
function termShape(c: PlanCollection): string {
  const { month, year } = c.bands;
  if (month && year) return 'Monthly and yearly terms';
  if (month) return 'Monthly terms';
  if (year) return 'Yearly terms';
  return 'Term stated per offer';
}

export function CollectionCard({
  collection: c,
  query = '',
}: {
  collection: PlanCollection;
  query?: string;
}) {
  return (
    <Link
      href={`/plans/${c.slug}/${query ? `?${query}` : ''}`}
      className={`collection-card${c.isApi ? ' api-collection-card' : ''}`}
      prefetch={false}
      data-collection={c.slug}
      // The whole card is the link, so without this the accessible name is
      // every word in the card - count, category, heading, blurb and price.
      // c.title already ends in "plans", so do not add the word again.
      aria-label={`${c.title} in Pakistan`}
    >
      <div className="collection-card-top">
        <span className="collection-count">
          <Layers3 size={14} aria-hidden="true" />
          {c.count} {c.count === 1 ? 'option' : 'options'}
        </span>
        <span className="collection-open" aria-hidden="true">
          <ArrowUpRight size={20} />
        </span>
        <div className="collection-logo">
          {c.isApi ? (
            <Braces size={48} aria-hidden="true" />
          ) : c.logo ? (
            <Image
              src={logoThumbnail(c.logo, 'card')}
              width={68}
              height={68}
              sizes="68px"
              alt={`${c.brand} logo`}
            />
          ) : (
            <span className="brand-wordmark">{c.brand}</span>
          )}
        </div>
      </div>
      <div className="collection-card-copy">
        <span className="collection-category">
          {c.isApi
            ? 'ONE API COLLECTION'
            : c.categories.length === 1
              ? categoryName(c.categories[0])
              : 'TOOLS & SUBSCRIPTIONS'}
        </span>
        <h3>{c.title}</h3>
        <p>
          {c.isApi
            ? 'Providers, credits and token limits. All your API options, together.'
            : termShape(c)}
        </p>
      </div>
      <div className="collection-card-bottom">
        <div>
          <span>Typical listed price</span>
          <strong>{money(c.medianPrice)}</strong>
          {c.maxPrice > c.minPrice && (
            <small className="collection-range">
              Range {money(c.minPrice)}–{money(c.maxPrice).replace('PKR ', '')}
            </small>
          )}
        </div>
        <span className="collection-cta">
          View prices <ArrowRight size={17} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
