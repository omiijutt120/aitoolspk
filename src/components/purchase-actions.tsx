'use client';
import { useSyncExternalStore } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { canBuy, isStale, whatsappUrl } from '@/lib/commerce.mjs';
const subscribe = (notify: () => void) => {
  const timer = window.setInterval(notify, 60000);
  window.addEventListener('focus', notify);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener('focus', notify);
  };
};
const currentMinute = () => Math.floor(Date.now() / 60000) * 60000;
const serverTime = () => 0;
const noSubscription = () => () => {};
function useQuoteClock(product: Product) {
  const needsClock = product.approval === 'approved';
  return new Date(
    useSyncExternalStore(
      needsClock ? subscribe : noSubscription,
      needsClock ? currentMinute : serverTime,
      serverTime
    )
  );
}
export function StockBadge({ product }: { product: Product }) {
  const now = useQuoteClock(product);
  const text =
    product.stock === 'out-of-stock'
      ? 'Out of stock'
      : product.approval !== 'approved'
        ? 'Pending verification'
        : isStale(product, now)
          ? 'Quote needs refresh'
          : product.stock === 'in-stock'
            ? 'In stock'
            : 'Stock unconfirmed';
  return (
    <span className={`stock-badge ${canBuy(product, now) ? 'available' : ''}`}>
      <span />
      {text}
    </span>
  );
}
export function BuyButton({ product }: { product: Product }) {
  const now = useQuoteClock(product);
  return canBuy(product, now) ? (
    <a
      className="button buy-button"
      data-catalog-event="whatsapp_click"
      data-product-id={product.id}
      href={whatsappUrl(product)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Buy Now: ${product.name}`}
    >
      Buy Now <ArrowUpRight size={15} />
    </a>
  ) : (
    <button
      className="button buy-button"
      disabled
      aria-label={`Buy Now unavailable: ${product.name}`}
    >
      Buy Now <ArrowUpRight size={15} />
    </button>
  );
}
