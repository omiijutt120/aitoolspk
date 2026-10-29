import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { DurationSelector } from '@/components/duration-selector';
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
import { collectionSlug } from '@/lib/collections';
import inventory from '../../../../data/inventory.json';
import { productPublication } from '@/lib/seo-editorial';
import { productSearchCopy } from '@/lib/seo-publication.mjs';
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
  const copy = productSearchCopy(p);
  const publication = productPublication(p);
  return {
    ...metadata(copy.title, copy.description, `/tool/${slug}/`),
    robots: publication.indexable
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
  const publication = productPublication(p);
  const stockCheck = (
    inventory as Record<string, { stock: string; checkedAt: string }>
  )[p.id];
  const variants = products
    .filter((v) => v.brandSlug === p.brandSlug && v.id !== p.id)
    .slice(0, 6);
  const related = products
    .filter((v) => v.category === p.category && v.brandSlug !== p.brandSlug)
    .slice(0, 4);
  const durationVariants = p.variantGroup
    ? products
        .filter((v) => v.variantGroup === p.variantGroup)
        .sort((a, b) => (a.durationMonths || 0) - (b.durationMonths || 0))
    : [];
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
            <Link href={`/plans/${collectionSlug(p)}/`} prefetch={false}>
              {collectionSlug(p) === 'api' ? 'API plans' : `${p.brand} plans`}
            </Link>
          </nav>
        </div>
        <div
          className={`detail-layout${p.sellerWarranty ? ' premium-detail-layout' : ''}`}
        >
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
              {!!p.features?.length && (
                <>
                  <h2>Included features</h2>
                  <ul>
                    {p.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </>
              )}
              {!!p.exclusions?.length && (
                <>
                  <h2>Package exclusions</h2>
                  <ul>
                    {p.exclusions.map((exclusion) => (
                      <li key={exclusion}>{exclusion}</li>
                    ))}
                  </ul>
                </>
              )}
              {p.fairUsage && (
                <>
                  <h2>Fair usage & package limits</h2>
                  <p>{p.fairUsage}</p>
                  <p>
                    <Link className="underline" href="/terms/#fair-usage">
                      Read the fair usage policy
                    </Link>
                    .
                  </p>
                </>
              )}
              {p.notes?.map((note) => (
                <p key={note}>{note}</p>
              ))}
              <h2>Before you decide</h2>
              <ul>
                <li>
                  AiToolsPk is independent. No official vendor partnership is
                  claimed.
                </li>
                <li>
                  {p.sellerWarranty
                    ? 'Seller-listed price confirmed '
                    : 'Price snapshot dated '}
                  {p.date}.{' '}
                  {isStale(p)
                    ? 'This quote is stale; request an updated price and stock check.'
                    : 'Confirm the current price and availability before payment.'}
                </li>
                <li>
                  {stockCheck
                    ? `Stock last confirmed ${stockCheck.checkedAt}. `
                    : 'Current stock needs confirmation. '}
                  Availability is separate from commercial eligibility and must
                  be reconfirmed before payment.
                </li>
                <li>
                  {p.sellerWarranty && p.approval !== 'approved'
                    ? 'This package and seller warranty were supplied by the seller. Resale eligibility and the delivery method require confirmation before an order can be accepted.'
                    : p.approval === 'approved'
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
              {p.sellerWarranty ? (
                <>
                  <p>
                    Your subscription includes AI Tools PK&apos;s
                    seller-provided warranty covering the purchased subscription
                    duration, subject to the published warranty terms and fair
                    usage policy.
                  </p>
                  <p>
                    This warranty is provided by AI Tools PK, independently of
                    the original software company. Read the{' '}
                    <Link className="underline" href="/terms/#seller-warranty">
                      seller warranty terms
                    </Link>
                    ,{' '}
                    <Link className="underline" href="/terms/#fair-usage">
                      fair usage policy
                    </Link>{' '}
                    and{' '}
                    <Link className="underline" href="/refund-policy/">
                      refund policy
                    </Link>{' '}
                    before payment. Confirm the agreed dates and package in
                    WhatsApp.
                  </p>
                </>
              ) : (
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
              )}
              <h2>How delivery works</h2>
              <p>
                Buy Now opens WhatsApp with the exact product and terms.
                Unverified offers request availability confirmation first;
                out-of-stock offers open a restock enquiry. The seller confirms
                eligibility, current pricing, payment details and a safe
                delivery method before accepting an order. No delivery time is
                guaranteed on this website.
              </p>
              <h2>Compare before enquiring</h2>
              <p>
                <Link
                  className="underline"
                  href="/guides/choosing-ai-subscriptions-pakistan/"
                  prefetch={false}
                >
                  Choose a subscription for your workload
                </Link>{' '}
                or read how{' '}
                <Link
                  className="underline"
                  href="/guides/understanding-credits-and-plan-duration/"
                  prefetch={false}
                >
                  credits, usage limits and duration differ
                </Link>
                . Keep this product ID with your enquiry so the seller can
                confirm the exact variant.
              </p>
            </div>
          </div>
          <div className="detail-purchase-column">
            <div className="detail-summary">
              <p className="eyebrow">
                {p.brand} / {categoryName(p.category)}
              </p>
              <h1>{p.name}</h1>
              <StockBadge product={p} />
              {p.sellerWarranty && (
                <span className="seller-warranty-badge detail-warranty-badge">
                  <ShieldCheck size={14} aria-hidden="true" /> Full Duration
                  Warranty
                </span>
              )}
              {p.summary && (
                <p className="detail-product-summary">{p.summary}</p>
              )}
              {durationVariants.length > 1 && (
                <DurationSelector product={p} variants={durationVariants} />
              )}
              <p className="detail-price">{money(p.price)}</p>
              <p className="detail-price-note">
                Indicative retail price · Confirm before payment
              </p>
              {p.referencePrice && (
                <div className="official-price-reference">
                  <a
                    href={p.referencePrice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Official monthly list price: {p.referencePrice.currency}{' '}
                    {p.referencePrice.amount}/month
                  </a>
                  <p>
                    Vendor-direct reference, checked{' '}
                    {p.referencePrice.checkedAt}. Our supplied package has its
                    own features and terms; packages differ.
                  </p>
                </div>
              )}
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
                    {p.sellerWarranty
                      ? p.approval === 'approved'
                        ? 'Seller-listed package; terms reviewed'
                        : 'Commercial verification pending'
                      : p.approval === 'approved'
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
                  href={`/plans/${collectionSlug(p)}/`}
                  className="text-link"
                >
                  See all {collectionSlug(p) === 'api' ? 'API' : p.brand} plans
                  →
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
      {publication.productSchemaEligible && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: p.name,
            description: p.description,
            sku: p.id,
            brand: { '@type': 'Brand', name: p.brand },
            ...(p.sellerWarranty
              ? {
                  additionalProperty: [
                    {
                      '@type': 'PropertyValue',
                      name: 'Subscription duration',
                      value: p.duration,
                    },
                    {
                      '@type': 'PropertyValue',
                      name: 'Seller warranty',
                      value:
                        'AI Tools PK seller-provided warranty for the purchased subscription duration; subject to seller warranty terms and fair usage policy.',
                    },
                  ],
                }
              : {}),
            ...(p.logo ? { image: `${origin}${p.logo}` } : {}),
            ...(publication.offerSchemaEligible
              ? {
                  offers: {
                    '@type': 'Offer',
                    url: `${origin}/tool/${p.slug}/`,
                    priceCurrency: 'PKR',
                    price: p.price,
                    priceValidUntil: new Date(Date.parse(p.date) + 7 * 86400000)
                      .toISOString()
                      .slice(0, 10),
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
