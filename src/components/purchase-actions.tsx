import type { Product } from '@/lib/types';
import { whatsappIntent } from '@/lib/commerce.mjs';
import { LiveBuyButton, LiveStockBadge } from './live-purchase-status';
import { PurchaseLink, StatusBadge } from './purchase-ui';

// Pending offers cannot expire into readiness. Render their complete links and
// labels on the server; only approved offers need a client-side expiry clock.
export function BuyButton({ product }: { product: Product }) {
  return product.approval === 'approved' ? (
    <LiveBuyButton product={product} />
  ) : (
    <PurchaseLink product={product} intent={whatsappIntent(product)} />
  );
}
export function StockBadge({ product }: { product: Product }) {
  return product.approval === 'approved' ? (
    <LiveStockBadge product={product} />
  ) : (
    <StatusBadge product={product} now={new Date(0)} />
  );
}
