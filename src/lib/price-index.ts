import type { Product } from './types';
import { products } from './catalog';
import {
  collectionProducts,
  groupCollections,
  type PlanCollection,
} from './collections';

export type PriceIndexEntry = PlanCollection & {
  /** Cheapest listed seller quote for this tool. */
  from: number;
  /** Highest listed seller quote for this tool. */
  to: number;
  /** Distinct duration labels, shortest-sounding first is not guaranteed. */
  durations: string[];
  /** Distinct warranty labels exactly as the seller listed them. */
  warranties: string[];
  /** Most recent quote date in the collection. */
  newestQuote: string;
};

const IGNORED = new Set(['', 'not specified']);

/** Owner-listed warranty text without the review disclaimer suffix. */
export function warrantyText(value: string) {
  return value
    .replace(/\s*\(listed;\s*unverified\)/i, '')
    .trim()
    .toLowerCase();
}

export function priceIndex(input: Product[] = products): PriceIndexEntry[] {
  const eligible = input.filter((p) => p.approval !== 'excluded');
  return groupCollections(eligible).map((group) => {
    const plans = collectionProducts(eligible, group.slug);
    const durations = [
      ...new Set(
        plans
          .map((p) => p.duration.trim())
          .filter((d) => !IGNORED.has(d.toLowerCase()))
      ),
    ];
    const warranties = [
      ...new Set(
        plans
          .map((p) => p.warranty.trim())
          .filter((w) => !IGNORED.has(w.toLowerCase()))
      ),
    ];
    return {
      ...group,
      from: group.minPrice,
      to: group.maxPrice,
      durations,
      warranties,
      newestQuote: plans
        .map((p) => p.date)
        .sort()
        .at(-1) as string,
    };
  });
}

export type PriceIndexStats = {
  tools: number;
  offers: number;
  cheapest: number;
  mostExpensive: number;
  oldestQuote: string;
  newestQuote: string;
};

export function priceIndexStats(
  input: Product[] = products
): PriceIndexStats {
  const eligible = input.filter((p) => p.approval !== 'excluded');
  const prices = eligible.map((p) => p.price);
  const dates = eligible.map((p) => p.date).sort();
  return {
    tools: groupCollections(eligible).length,
    offers: eligible.length,
    cheapest: Math.min(...prices),
    mostExpensive: Math.max(...prices),
    oldestQuote: dates[0],
    newestQuote: dates.at(-1) as string,
  };
}

/** `1 month, 7 days +3 more` — bounded so a table cell stays readable. */
export function summarise(values: string[], limit = 2) {
  if (!values.length) return 'Confirm with seller';
  const shown = values.slice(0, limit).join(', ');
  const rest = values.length - limit;
  return rest > 0 ? `${shown} +${rest} more` : shown;
}

export function displayedWarranty(entry: PriceIndexEntry) {
  return summarise(entry.warranties.map(warrantyText), 2);
}
