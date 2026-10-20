import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Braces, Layers3, ArrowRight } from 'lucide-react';
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
        <span className="collection-count">
          <Layers3 size={14} aria-hidden="true" />
          {c.count} {c.count === 1 ? 'plan' : 'plans'}
        </span>
        <span className="collection-open" aria-hidden="true">
          <ArrowUpRight size={20} />
        </span>
        <div className="collection-logo">
          {c.isApi ? (
            <Braces size={48} aria-hidden="true" />
          ) : c.logo ? (
            <Image
              src={c.logo}
              width={68}
              height={68}
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
            : 'Find your fit. Compare durations, access and warranty options.'}
        </p>
      </div>
      <div className="collection-card-bottom">
        <div>
          <span>Listed from</span>
          <strong>{money(c.minPrice)}</strong>
        </div>
        <span className="collection-cta">
          Explore plans <ArrowRight size={17} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
