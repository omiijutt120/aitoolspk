/**
 * Sellers describe the same duration in dozens of different strings: the
 * catalogue currently contains 47, including "1 month", "1 months", "30 days",
 * "1 year", "1 years" and "12 months".
 *
 * Comparing those strings directly is what let a collection advertise a
 * "range" that spanned a Rs 14 gift slot and a Rs 20,928 fifty-seat admin
 * licence as if both were the same purchase. Banding them produces an answer
 * a buyer can actually use.
 *
 * Only the two durations people search for are banded. Everything else returns
 * null instead of being guessed at, so no listing is folded into a band it does
 * not clearly belong to.
 */
export type DurationBand = 'month' | 'year';

export function durationBand(
  label: string | null | undefined
): DurationBand | null {
  const value = String(label ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
  if (!value) return null;
  if (/^1 months?$/.test(value) || /^(28|29|30|31) days?$/.test(value))
    return 'month';
  if (
    /^1 years?$/.test(value) ||
    /^12 months?$/.test(value) ||
    /^365 days?$/.test(value)
  )
    return 'year';
  return null;
}

/**
 * A "1 month" band can hold very different products: a Rs 419 shared slot and a
 * Rs 23,853 enterprise credit pack both state one month. The middle listing only
 * describes a typical purchase while the listings are the same order of
 * magnitude, so past ten times the cheapest figure it stops being called
 * typical and the count is quoted instead.
 */
export function bandSpread(band: {
  minPrice: number;
  medianPrice: number;
}): 'narrow' | 'wide' {
  return band.medianPrice > band.minPrice * 10 ? 'wide' : 'narrow';
}
