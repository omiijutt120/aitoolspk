'use client';
import { useSyncExternalStore } from 'react';
import type { Product } from '@/lib/types';
import { whatsappIntent } from '@/lib/commerce.mjs';
import { PurchaseLink, StatusBadge } from './purchase-ui';

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
function useQuoteClock() {
  return new Date(useSyncExternalStore(subscribe, currentMinute, serverTime));
}

export function LiveBuyButton({ product }: { product: Product }) {
  const now = useQuoteClock();
  return (
    <PurchaseLink product={product} intent={whatsappIntent(product, now)} />
  );
}
export function LiveStockBadge({ product }: { product: Product }) {
  const now = useQuoteClock();
  return <StatusBadge product={product} now={now} />;
}
