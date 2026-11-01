import { BuyButton, StockBadge } from './purchase-actions';
export { BuyButton, StockBadge } from './purchase-actions';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock3, ShieldCheck, MessageCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { money, whatsappUrl } from '@/lib/commerce.mjs';
import { categoryName } from '@/lib/categories';
import { logoThumbnail } from '@/lib/logo-thumbnail';
export function BrandLogo({
  product,
  large = false,
}: {
  product: Product;
  large?: boolean;
}) {
  return (
    <div className={`product-logo ${large ? 'large' : ''}`}>
      {product.logo ? (
        <Image
          src={logoThumbnail(product.logo, large ? 'card' : 'small')}
          alt={`${product.brand} logo`}
          width={large ? 58 : 34}
          height={large ? 58 : 34}
        />
      ) : (
        <span className="brand-wordmark">{product.brand}</span>
      )}
    </div>
  );
}
export function ProductCard({ product }: { product: Product }) {
  return (
    <article
      className={`product-card${product.sellerWarranty ? ' premium-product' : ''}`}
    >
      <div className="product-card-top">
        <div className="product-identity">
          <BrandLogo product={product} />
          <span>{product.brand}</span>
        </div>
        <span className="category-mini">{categoryName(product.category)}</span>
      </div>
      <h3>
        <Link
          href={`/tool/${product.slug}/`}
          prefetch={false}
          data-catalog-event="product_open"
          data-product-id={product.id}
        >
          {product.name}
        </Link>
      </h3>
      {product.summary && <p className="product-summary">{product.summary}</p>}
      <div className="product-terms">
        <span>
          <Clock3 size={13} />
          <span>
            {product.duration === 'Not specified'
              ? 'Confirm duration'
              : product.duration}
          </span>
          {product.access !== 'Not specified' && (
            <>
              <span className="term-divider">·</span>
              <span>{product.access}</span>
            </>
          )}
        </span>
        <span
          className={
            product.sellerWarranty ? 'seller-warranty-badge' : undefined
          }
        >
          <ShieldCheck size={13} />
          {product.warranty === 'Not specified'
            ? 'Confirm warranty terms'
            : product.warranty}
        </span>
      </div>
      <div className="product-card-price">
        <strong>{money(product.price)}</strong>
        <StockBadge product={product} />
      </div>
      <div className="product-buttons">
        <Link
          className="button outline"
          href={`/tool/${product.slug}/`}
          prefetch={false}
          data-catalog-event="product_open"
          data-product-id={product.id}
        >
          View Details
        </Link>
        <BuyButton product={product} />
      </div>
    </article>
  );
}
export function InquiryLink({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  return (
    <a
      className="text-link"
      data-catalog-event={
        product.stock === 'out-of-stock'
          ? 'out_of_stock_interest'
          : 'whatsapp_click'
      }
      data-product-id={product.id}
      href={whatsappUrl(
        product,
        product.stock === 'out-of-stock' ? 'restock' : 'confirm'
      )}
      target="_blank"
      rel="noopener noreferrer"
    >
      <MessageCircle size={16} />
      <span>
        {product.stock === 'out-of-stock'
          ? 'Ask about restock'
          : compact
            ? 'Check availability'
            : 'Confirm availability on WhatsApp'}
      </span>
      <ArrowUpRight size={14} />
    </a>
  );
}
