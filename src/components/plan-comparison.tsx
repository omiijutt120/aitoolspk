import Link from 'next/link';
import type { Product } from '@/lib/types';
import { money } from '@/lib/commerce.mjs';

export function PlanComparison({
  plans,
  brand,
  page,
}: {
  plans: Product[];
  brand: string;
  page: number;
}) {
  if (!plans.length) return null;
  return (
    <details className="plan-comparison">
      <summary>
        Compare {plans.length} listed {brand}{' '}
        {plans.length === 1 ? 'plan' : 'plans'} in a table
      </summary>
      <p className="muted">
        Reference list for catalog page {page}, before search or filters. Prices
        cover different durations and access arrangements; compare the exact
        package, not the number alone.
      </p>
      <div
        className="comparison-scroll"
        role="region"
        aria-label={`${brand} plan price comparison, scroll horizontally if needed`}
        tabIndex={0}
      >
        <table>
          <caption>{brand}: listed PKR prices, durations and terms</caption>
          <thead>
            <tr>
              <th scope="col">Exact plan</th>
              <th scope="col">Duration</th>
              <th scope="col">Listed price</th>
              <th scope="col">Access</th>
              <th scope="col">Warranty label</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <th scope="row">
                  <Link href={`/tool/${plan.slug}/`} prefetch={false}>
                    {plan.name}
                  </Link>
                  <span className="comparison-id">{plan.id}</span>
                </th>
                <td>
                  {plan.duration === 'Not specified'
                    ? 'Confirm duration'
                    : plan.duration}
                </td>
                <td className="comparison-price">{money(plan.price)}</td>
                <td>
                  {plan.access === 'Not specified'
                    ? 'Confirm before payment'
                    : plan.access}
                </td>
                <td>
                  {plan.warranty === 'Not specified'
                    ? 'Confirm warranty terms'
                    : plan.warranty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
