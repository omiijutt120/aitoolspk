import type { BandSummary, PlanCollection } from '@/lib/collections';
import { bandSpread } from '@/lib/duration-band';
import { money } from '@/lib/commerce.mjs';

/**
 * The question a searcher arrives with is "how much does it cost in Pakistan?",
 * and the honest per-duration answer is small enough to fit in a table. The
 * single "range" this replaces compared a three-year gift slot with a
 * fifty-seat admin licence, which is not a price anyone is paying for one
 * subscription.
 *
 * Both figures are shown because they answer different questions: the cheapest
 * listing is what the collection starts at, the middle one is what a buyer is
 * most likely to pay, and the gap between them is usually a shared slot.
 */
export function CollectionCostAnswer({
  collection: c,
}: {
  collection: PlanCollection;
}) {
  const rows: { label: string; band: BandSummary }[] = [];
  if (c.bands.month) rows.push({ label: '1 month', band: c.bands.month });
  if (c.bands.year) rows.push({ label: '1 year', band: c.bands.year });
  if (rows.length === 0) return null;
  // "Typical" is only an honest column heading while the listings inside a band
  // are comparable products. When they are not, the same number is still a
  // median, so the heading says so and the note explains the spread.
  const mixed = rows.some((row) => bandSpread(row.band) === 'wide');
  return (
    <div className="collection-cost-answer">
      <h2>What {c.brand} costs in Pakistan</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Listed duration</th>
            <th scope="col">Cheapest</th>
            <th scope="col">{mixed ? 'Median' : 'Typical'}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">
                {row.label}
                <span className="collection-cost-count">
                  {row.band.count} {row.band.count === 1 ? 'listing' : 'listings'}
                </span>
              </th>
              <td>{money(row.band.minPrice)}</td>
              <td>{money(row.band.medianPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Seller quotes, not the vendor&rsquo;s own price. The cheapest listing in
        a duration is usually a shared slot or an education plan, so compare the
        access and warranty columns on the plans below.
        {mixed
          ? ' Where the middle figure sits far above the cheapest, the listings in that duration are different products (credit packs or team seats) rather than one plan at different prices.'
          : ''}
      </p>
    </div>
  );
}
