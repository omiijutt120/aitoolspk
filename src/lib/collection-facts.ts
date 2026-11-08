import type { Product } from './types';

/**
 * Numbers that are true for one collection and false for every other.
 *
 * A buying guide that says "confirm the product ID and warranty before paying"
 * on 108 pages is boilerplate: the sentence is right, but it carries no
 * information about the page it sits on, so it adds nothing a reader or an
 * answer engine can use. These helpers turn the catalogue's own rows into
 * collection-specific statements — the cheapest and dearest listing by name, how
 * many rows state a term, and what a month actually costs at the bottom of the
 * range — so the guide has something to say that only applies here.
 *
 * Nothing is estimated. Every figure is read from the listings being rendered,
 * and a statement is omitted entirely when the data cannot support it.
 */

const UNIT_MONTHS: Record<string, number> = {
  hour: 1 / 720,
  day: 1 / 30,
  week: 7 / 30,
  month: 1,
  year: 12,
};

/** Months implied by a listing's duration label, or null when it states none. */
export function durationMonths(duration: string): number | null {
  const text = (duration ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
  if (!text || /not specified|unknown|n\/a|^-$/.test(text)) return null;
  const match = text.match(/(\d+(?:\.\d+)?)\s*(hour|day|week|month|year)s?/);
  if (!match) return null;
  const value = Number(match[1]);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value * UNIT_MONTHS[match[2]];
}

export type ListingBand = {
  plan: Product;
  months: number | null;
  /** Price normalised to 30 days, rounded. Null when the term is unknown. */
  perMonth: number | null;
};

const band = (plan: Product): ListingBand => {
  const months = durationMonths(plan.duration);
  return {
    plan,
    months,
    perMonth: months ? Math.round(plan.price / months) : null,
  };
};

export type CollectionFacts = {
  count: number;
  cheapest: ListingBand;
  dearest: ListingBand;
  /** Cheapest listing whose stated term is roughly one month. */
  monthly: ListingBand | null;
  /** Cheapest listing whose stated term is roughly a year or longer. */
  yearly: ListingBand | null;
  stated: number;
  unstated: number;
  shortest: ListingBand | null;
  longest: ListingBand | null;
  warrantyStated: number;
  warrantyNone: number;
};

const NONE = /^no warranty/i;

export function collectionFacts(plans: Product[]): CollectionFacts | null {
  if (plans.length === 0) return null;

  const byPrice = [...plans].sort((a, b) => a.price - b.price);
  const bands = byPrice.map(band);
  const withTerm = bands.filter((b) => b.months !== null);

  const monthly =
    withTerm
      .filter(
        (b) => (b.months as number) >= 0.75 && (b.months as number) <= 1.6
      )
      .sort((a, b) => (a.perMonth as number) - (b.perMonth as number))[0] ??
    null;
  const yearly =
    withTerm
      .filter((b) => (b.months as number) >= 11.5)
      .sort((a, b) => (a.perMonth as number) - (b.perMonth as number))[0] ??
    null;

  const byTerm = [...withTerm].sort(
    (a, b) => (a.months as number) - (b.months as number)
  );

  return {
    count: plans.length,
    cheapest: bands[0],
    dearest: bands[bands.length - 1],
    monthly,
    yearly,
    stated: withTerm.length,
    unstated: plans.length - withTerm.length,
    shortest: byTerm[0] ?? null,
    longest: byTerm[byTerm.length - 1] ?? null,
    warrantyStated: plans.filter((p) => p.warranty && !NONE.test(p.warranty))
      .length,
    warrantyNone: plans.filter((p) => NONE.test(p.warranty ?? '')).length,
  };
}
