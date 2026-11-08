import { Catalog } from '@/components/catalog';
import { metadata as makeMetadata } from '@/lib/seo';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/lib/catalog';
import { groupCollections } from '@/lib/collections';
import {
  pageCount,
  pageDescription,
  pageNumber,
  pagePath,
} from '@/lib/pagination';
import { PAGE_SIZE } from '@/lib/pagination';
import { CollectionSchema } from '@/components/collection-schema';
type Props = { params: Promise<{ page?: string }> };
export async function generateMetadata({ params }: Props) {
  const page = pageNumber((await params).page);
  return makeMetadata(
    `AI Tools & Subscriptions in Pakistan${page > 1 ? ` — Page ${page}` : ''}`,
    pageDescription(
      'Search AI tools, compare exact subscriptions and retail PKR prices, and filter by brand, duration, warranty, access and availability.',
      page
    ),
    pagePath('/tools/', page)
  );
}
export default async function Tools({ params }: Props) {
  const page = pageNumber((await params).page);
  if (
    !Number.isSafeInteger(page) ||
    page > pageCount(groupCollections(products).length)
  )
    notFound();
  return (
    <div className="container">
      <div className="page-intro">
        <p className="eyebrow">YOUR TOOLKIT, RECONSIDERED</p>
        <h1>One tool. All its plans.{page > 1 ? ` Page ${page}.` : ''}</h1>
        <p>
          Browse by tool, then compare its subscriptions, durations and warranty
          options. All API offers live in one collection. Prefer a price-first
          view? Open the{' '}
          <Link href="/price-index/" prefetch={false}>
            price index
          </Link>{' '}
          to see every tool&apos;s listed starting price on one page.
        </p>
      </div>
      <Catalog initialPage={page} />
      <CollectionSchema
        name={`All tool collections${page > 1 ? ` — Page ${page}` : ''}`}
        description="Compare AI tools and digital subscription collections in Pakistan."
        path={pagePath('/tools/', page)}
        items={groupCollections(products)
          .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
          .map((item) => ({ name: item.title, path: `/plans/${item.slug}/` }))}
      />
    </div>
  );
}
