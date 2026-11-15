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
  // Keep the established CTA stable; the WhatsApp message carries the
  // correct order, confirmation or restock intent.
  const label = restock ? 'Restock' : 'Buy Now';
  return (
    <a
      className="button buy-button"
      data-catalog-event={restock ? 'out_of_stock_interest' : 'whatsapp_click'}
      data-product-id={product.id}
      href={whatsappUrl(product, intent)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}: ${product.name}`}
      title={
        restock
          ? 'Ask when this out-of-stock plan may be available'
          : intent === 'confirm'
            ? 'Open WhatsApp to confirm availability, price and terms'
            : 'Continue your order on WhatsApp'
      }
    >
      <MessageCircle size={16} aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}

export function StatusBadge({ product, now }: { product: Product; now: Date }) {
  const text =
    product.stock === 'out-of-stock'
      ? 'Out of stock'
      : product.stock === 'unconfirmed'
        ? 'Stock unconfirmed'
        : product.approval !== 'approved'
          ? 'Pending verification'
          : !product.purchasable
            ? 'Enquiry only'
            : now.getTime() > 0 && isStale(product, now)
              ? 'Quote needs refresh'
              : 'Available';
  return (
    <span className={`stock-badge${text === 'Available' ? ' available' : ''}`}>
      <span />
      {text}
    </span>
  );
}
