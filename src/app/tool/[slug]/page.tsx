import { notFound } from 'next/navigation';
import Link from 'next/link';
import { products, productBySlug } from '@/lib/catalog';
import { categoryName } from '@/lib/categories';
import {
  BrandLogo,
  StockBadge,
  BuyButton,
  InquiryLink,
  ProductCard,
} from '@/components/product-card';
import { metadata, JsonLd, origin } from '@/lib/seo';
import { canBuy, money, isStale } from '@/lib/commerce.mjs';
export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) return {};
  return {
    ...metadata(
      `${p.name} — ${money(p.price)}`,
      `${p.name}. Listed price ${money(p.price)}. Duration: ${p.duration}. ${p.approval === 'approved' ? 'Read exact access and warranty terms.' : 'Pending verification; purchasing disabled.'}`,
      `/tool/${slug}/`
    ),
    robots:
      p.approval === 'approved'
        ? { index: true, follow: true }
        : { index: false, follow: true },
  };
}
export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) notFound();
  const variants = products
    .filter((v) => v.brandSlug === p.brandSlug && v.id !== p.id)
    .slice(0, 6);
  const related = products
    .filter((v) => v.category === p.category && v.brandSlug !== p.brandSlug)
    .slice(0, 4);
  return (
    <>
      <div className="container">
        <div className="page-intro">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/tools/">Tools</Link>
            <span>/</span>
            <Link href={`/category/${p.category}/`}>
              {categoryName(p.category)}
            </Link>
            <span>/</span>
            <span>{p.brand}</span>
          </nav>
        </div>
        <div className="detail-layout">
          <div>
            <div className="detail-art">
              <BrandLogo product={p} large />
              <span>
                {p.brand} · {categoryName(p.category)}
              </span>
            </div>
            <div className="detail-info">
              <h2>About this offer</h2>
              <p>{p.description}</p>
              <h2>Before you decide</h2>
              <ul>
                <li>
                  AiToolsPk is independent. No official vendor partnership is
                  claimed.
                </li>
                <li>
                  Prices and stock are snapshots, last checked {p.date}.{' '}
                  {isStale(p)
                    ? 'This quote is stale; request an updated price and stock check.'
                    : 'Confirm the current price and availability before payment.'}
                </li>
                <li>
                  {p.approval === 'approved'
                    ? 'The listed terms apply to this exact offer. Confirm the delivery method in writing.'
                    : 'Resale eligibility, features, delivery method and source warranty claims have not been verified. This entry cannot currently be ordered.'}
                </li>
                <li>
                  Never provide passwords, recovery keys, cookies or two-factor
                  authentication codes. Use an approved license or invitation
                  method.
                </li>
                <li>{p.renewal}</li>
              </ul>
              <h2>Warranty & refunds</h2>
              <p>
                {p.warranty}.{' '}
                {p.approval === 'approved'
                  ? 'Ask for the start date and agreed remedy in writing before paying.'
                  : 'This is a source label, not a warranty promise from AiToolsPk. Exact coverage, exclusions and remedy must be verified.'}{' '}
                Read the{' '}
                <Link className="underline" href="/refund-policy/">
                  refund policy
                </Link>
                .
              </p>
              <h2>How delivery works</h2>
              <p>
                Once an offer is approved and in stock, Buy Now opens WhatsApp
                with the exact product and terms. The seller confirms
                eligibility, current pricing, payment details and a safe
                delivery method before accepting an order. No delivery time is
                guaranteed on this website.
              </p>
            </div>
          </div>
          <div>
            <div className="detail-summary">
              <p className="eyebrow">
                {p.brand} / {categoryName(p.category)}
              </p>
              <h1>{p.name}</h1>
              <StockBadge product={p} />
              <p className="detail-price">{money(p.price)}</p>
              <p className="detail-price-note">
                Indicative retail price · Confirm before payment
              </p>
              <dl className="detail-specs">
                <div>
                  <dt>Plan duration</dt>
                  <dd>{p.duration}</dd>
                </div>
                <div>
                  <dt>Access type</dt>
                  <dd>{p.access}</dd>
                </div>
                <div>
                  <dt>Warranty</dt>
                  <dd>{p.warranty}</dd>
                </div>
                <div>
                  <dt>Product ID</dt>
                  <dd>{p.id}</dd>
                </div>
                {p.credits && (
                  <div>
                    <dt>Listed credits / tokens</dt>
                    <dd>
                      {p.credits} {p.approval !== 'approved' && '(unverified)'}
                    </dd>
                  </div>
                )}
                <div>
                  <dt>Review status</dt>
                  <dd>
                    {p.approval === 'approved'
                      ? 'Approved for sale'
                      : 'Pending verification'}
                  </dd>
                </div>
              </dl>
              <div className="detail-action">
                <BuyButton product={p} />
                <InquiryLink product={p} />
              </div>
              {!canBuy(p) && (
                <p className="catalog-notice mt-4">
                  {p.stock === 'out-of-stock'
                    ? 'This offer is out of stock. Ask about restock; no order can be placed.'
                    : p.approval !== 'approved'
                      ? 'This offer requires resale and fulfilment review. An enquiry does not reserve or purchase this product.'
                      : 'Availability or price needs reconfirmation before ordering.'}
                </p>
              )}
            </div>
            {variants.length > 0 && (
              <div className="detail-info">
                <h2>Other {p.brand} offers</h2>
                <p>Each offer has its own ID, duration, price and terms.</p>
                <div className="variant-links">
                  {variants.map((v) => (
                    <Link href={`/tool/${v.slug}/`} prefetch={false} key={v.id}>
                      <span>{v.name}</span>
                      <strong className="whitespace-nowrap">
                        {money(v.price)}
                      </strong>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/tools/?brand=${encodeURIComponent(p.brand)}`}
                  className="text-link"
                >
                  See all {p.brand} offers →
                </Link>
              </div>
            )}
          </div>
        </div>
        {related.length > 0 && (
          <section className="section border-t border-line">
            <div className="section-heading">
              <h2>Also in {categoryName(p.category)}</h2>
              <Link className="text-link" href={`/category/${p.category}/`}>
                Explore category →
              </Link>
            </div>
            <div className="product-grid">
              {related.map((v) => (
                <ProductCard product={v} key={v.id} />
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="mobile-purchase">
        <span>{money(p.price)}</span>
        <BuyButton product={p} />
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: origin },
            {
              '@type': 'ListItem',
              position: 2,
              name: categoryName(p.category),
              item: `${origin}/category/${p.category}/`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: p.name,
              item: `${origin}/tool/${p.slug}/`,
            },
          ],
        }}
      />
      {p.approval === 'approved' && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: p.name,
            description: p.description,
            sku: p.id,
            brand: { '@type': 'Brand', name: p.brand },
            ...(p.logo ? { image: `${origin}${p.logo}` } : {}),
            ...(canBuy(p)
              ? {
                  offers: {
                    '@type': 'Offer',
                    url: `${origin}/tool/${p.slug}/`,
                    priceCurrency: 'PKR',
                    price: p.price,
                    availability: 'https://schema.org/InStock',
                    seller: { '@type': 'Organization', name: 'AiToolsPk' },
                  },
                }
              : {}),
          }}
        />
      )}
    </>
  );
}
