import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Braces } from 'lucide-react';
import { Catalog } from '@/components/catalog';
import { products } from '@/lib/catalog';
import { collectionProducts, groupCollections } from '@/lib/collections';
import { pageCount, pageNumber, pagePath } from '@/lib/pagination';
import { metadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PlanComparison } from '@/components/plan-comparison';
import { money } from '@/lib/commerce.mjs';
import { CollectionGuide } from '@/components/collection-guide';
import { CollectionSchema } from '@/components/collection-schema';
import { PAGE_SIZE } from '@/lib/pagination';
import { logoThumbnail } from '@/lib/logo-thumbnail';

const collections = groupCollections(products);
export const dynamicParams = false;
export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; page?: string }>;
}) {
  const { slug, page: value } = await params;
  const page = pageNumber(value);
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return {};
  return metadata(
    `${collection.title} & PKR prices in Pakistan${page > 1 ? ` — Page ${page}` : ''}`,
    `Compare ${collection.count} listed ${collection.brand} plans by PKR price, duration, access and seller warranty. Confirm your exact package on WhatsApp.${page > 1 ? ` Page ${page}.` : ''}`,
    pagePath(`/plans/${slug}/`, page),
    `/og/collections/${slug}.png`
  );
}
export default async function PlansPage({
  params,
}: {
  params: Promise<{ slug: string; page?: string }>;
}) {
  const { slug, page: value } = await params;
  const page = pageNumber(value);
  const c = collections.find((collection) => collection.slug === slug);
  if (!c) notFound();
  if (
    !Number.isSafeInteger(page) ||
    page > pageCount(collectionProducts(products, slug).length)
  )
    notFound();
  const plans = collectionProducts(products, slug);
  const pagePlans = plans.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const quoteDates = [...new Set(plans.map((p) => p.date))].sort();
  return (
    <div className="container">
      <div className="page-intro collection-intro">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Tools', href: '/tools/' },
            { name: c.title, href: `/plans/${slug}/` },
            ...(page > 1
              ? [
                  {
                    name: `Page ${page}`,
                    href: pagePath(`/plans/${slug}/`, page),
                  },
                ]
              : []),
          ]}
        />
        <div className="collection-intro-heading">
          <div className="collection-logo">
            {c.isApi ? (
              <Braces size={30} />
            ) : c.logo ? (
              <Image
                src={logoThumbnail(c.logo)}
                width={40}
                height={40}
                alt={`${c.brand} logo`}
              />
            ) : (
              <span className="brand-wordmark">{c.brand}</span>
            )}
          </div>
          <div>
            <p className="store-eyebrow">
              {c.count} {c.count === 1 ? 'PLAN' : 'PLANS'} · ONE COLLECTION
            </p>
            <h1>
              {c.title} & prices in Pakistan
              {page > 1 ? ` — Page ${page}` : ''}
            </h1>
          </div>
        </div>
        <p>
          {c.isApi
            ? 'Every API offer, together. Search providers and compare credits, durations and access before choosing a plan.'
            : `All ${c.brand} subscriptions and variants, together. Compare the exact duration, access and warranty before choosing your plan.`}
        </p>
        <p className="collection-price-context">
          Listed range:{' '}
          <strong>
            {money(c.minPrice)}–{money(c.maxPrice)}
          </strong>{' '}
          across different packages. Quote dates:{' '}
          <time dateTime={quoteDates[0]}>{quoteDates[0]}</time>
          {quoteDates.length > 1 && (
            <>
              –<time dateTime={quoteDates.at(-1)}>{quoteDates.at(-1)}</time>
            </>
          )}
          . A shorter duration or different allowance can explain a lower price;
          confirm the selected plan before payment.
        </p>
      </div>
      <Catalog collection={slug} initialPage={page} />
      <PlanComparison plans={pagePlans} brand={c.brand} page={page} />
      {page === 1 && <CollectionGuide slug={slug} plans={plans} />}
      <CollectionSchema
        name={`${c.title}${page > 1 ? ` — Page ${page}` : ''}`}
        description={`Compare exact ${c.brand} offer variants and terms.`}
        path={pagePath(`/plans/${slug}/`, page)}
        items={pagePlans.map((p) => ({
          name: `${p.name} — ${p.duration}`,
          path: `/tool/${p.slug}/`,
        }))}
      />
    </div>
  );
}
