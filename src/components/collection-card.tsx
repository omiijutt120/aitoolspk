import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Braces, Layers3 } from 'lucide-react';
import type { PlanCollection } from '@/lib/collections';
import { categoryName } from '@/lib/categories';
import { money } from '@/lib/commerce.mjs';

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
    >
      <div className="collection-card-top">
        <div className="collection-logo">
          {c.isApi ? (
            <Braces size={30} aria-hidden="true" />
          ) : c.logo ? (
            <Image
              src={c.logo.replace(/\.webp$/, '.small.webp')}
              width={38}
              height={38}
              alt={`${c.brand} logo`}
            />
          ) : (
            <span className="brand-wordmark">{c.brand}</span>
          )}
        </div>
        <span className="collection-count">
          <Layers3 size={12} aria-hidden="true" />
          {c.count} {c.count === 1 ? 'plan' : 'plans'}
        </span>
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
            ? 'All API offers in one place. Compare providers, credits and access.'
            : 'Compare listed durations, access types and warranty terms.'}
        </p>
      </div>
      <div className="collection-card-bottom">
        <div>
          <span>Listed from</span>
          <strong>{money(c.minPrice)}</strong>
        </div>
        <span className="collection-cta">
          View plans <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
