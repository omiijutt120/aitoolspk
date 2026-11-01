'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import type { Product } from '@/lib/types';
import { money } from '@/lib/commerce.mjs';

// Each option has a canonical page and its own product ID. Navigating atomically
// updates price, terms, mobile CTA, metadata and WhatsApp intent together.
export function DurationSelector({
  product,
  variants,
}: {
  product: Product;
  variants: Product[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const monthly = variants.find((p) => p.durationMonths === 1);
  const saving =
    monthly && product.durationMonths
      ? monthly.price * product.durationMonths - product.price
      : 0;
  const discounted =
    monthly &&
    variants.find(
      (p) => p.durationMonths && monthly.price * p.durationMonths > p.price
    );
  return (
    <div className="duration-selector" aria-busy={pending}>
      <label htmlFor="subscription-duration">Subscription duration</label>
      <select
        id="subscription-duration"
        value={product.slug}
        disabled={pending}
        onChange={(event) => {
          const selected = variants.find((p) => p.slug === event.target.value);
          if (selected)
            startTransition(() =>
              router.push(`/tool/${selected.slug}/`, { scroll: false })
            );
        }}
      >
        {variants.map((p) => {
          const discount =
            monthly && p.durationMonths
              ? monthly.price * p.durationMonths - p.price
              : 0;
          return (
            <option key={p.id} value={p.slug}>
              {p.duration} — {money(p.price)}
              {discount > 0 ? ` · Save ${money(discount)}` : ''}
            </option>
          );
        })}
      </select>
      <p className="duration-saving" aria-live="polite">
        {pending
          ? 'Updating selected plan…'
          : saving > 0
            ? `Save ${money(saving)} compared with ${product.durationMonths} separate monthly packages.`
            : discounted?.durationMonths && monthly
              ? `Choose ${discounted.duration} to save ${money(monthly.price * discounted.durationMonths - discounted.price)}.`
              : 'Compare the available subscription durations.'}
      </p>
      <noscript>
        <p>Choose your plan:</p>
        {variants.map((p) => (
          <Link key={p.id} href={`/tool/${p.slug}/`}>
            {p.duration}: {money(p.price)}{' '}
          </Link>
        ))}
      </noscript>
    </div>
  );
}
