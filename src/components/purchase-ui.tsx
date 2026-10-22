import { MessageCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { isStale, whatsappUrl } from '@/lib/commerce.mjs';

export function PurchaseLink({
  product,
  intent,
}: {
  product: Product;
  intent: 'order' | 'confirm' | 'restock';
}) {
  const restock = intent === 'restock';
  return (
    <a
      className="button buy-button"
      data-catalog-event={restock ? 'out_of_stock_interest' : 'whatsapp_click'}
      data-product-id={product.id}
      href={whatsappUrl(product, intent)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${restock ? 'Ask about restock' : 'Buy Now'}: ${product.name}`}
      title={
        restock
          ? 'Ask when this out-of-stock plan may be available'
          : intent === 'confirm'
            ? 'Open WhatsApp to confirm availability, price and terms'
            : 'Continue your order on WhatsApp'
      }
    >
      <MessageCircle size={16} aria-hidden="true" />
      <span>{restock ? 'Restock' : 'Buy Now'}</span>
    </a>
  );
}

export function StatusBadge({ product, now }: { product: Product; now: Date }) {
  const text =
    product.stock === 'out-of-stock'
      ? 'Out of stock'
      : product.stock === 'unconfirmed'
        ? 'Stock unconfirmed'
        : product.approval === 'approved' && isStale(product, now)
          ? 'Quote needs refresh'
          : 'Available';
  return (
    <span className={`stock-badge ${text === 'Available' ? 'available' : ''}`}>
      <span />
      {text}
    </span>
  );
}
