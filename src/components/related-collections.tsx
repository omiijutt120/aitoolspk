import Link from 'next/link';
import { money } from '@/lib/commerce.mjs';
import type { RelatedCollection } from '@/lib/collections';

/**
 * Sideways links between collections.
 *
 * The site already exposes every collection through /categories/, so this is
 * not a navigation requirement. It exists because a reader who lands on one
 * collection is usually still choosing between two or three tools, and because
 * a descriptive anchor from a topically related page is a better crawl signal
 * than the same generic "browse all tools" link on every page.
 *
 * Each row shows that collection's own median quote and plan count, so the
 * block carries real numbers instead of repeating one shared sentence.
 */
export function RelatedCollections({
  slug,
  brand,
  items,
}: {
  slug: string;
  brand: string;
  items: RelatedCollection[];
}) {
  if (items.length === 0) return null;

  const shared = items.some((item) => item.reason === 'category');

  return (
    <section
      className="related-collections"
      aria-labelledby={`related-${slug}`}
    >
      <h2 id={`related-${slug}`}>Other collections to compare with {brand}</h2>
      <p className="muted">
        {shared
          ? 'These collections share a category or a similar typical quote, so the same questions about duration, access and warranty apply to each.'
          : 'This collection has no close category peers, so these are the collections closest to it on typical quote and therefore closest in what a buyer is weighing up.'}
      </p>
      <ul>
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={`/plans/${item.slug}/`} prefetch={false}>
              {item.isApi ? 'API plans' : `${item.brand} plans`}
            </Link>{' '}
            <span className="related-collections-meta">
              — typical {money(item.medianPrice)}, {item.count}{' '}
              {item.count === 1 ? 'plan' : 'plans'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
