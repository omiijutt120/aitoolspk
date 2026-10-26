import { Catalog } from '@/components/catalog';
import { metadata as makeMetadata } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { products } from '@/lib/catalog';
import { groupCollections } from '@/lib/collections';
import { pageCount, pageDescription, pageNumber, pagePath } from '@/lib/pagination';
type Props = { params: Promise<{ page?: string }> };
export async function generateMetadata({ params }: Props) {
  const page = pageNumber((await params).page);
  return makeMetadata(
    `Explore all tools & subscriptions in Pakistan${page > 1 ? ` — Page ${page}` : ''}`,
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
        <h1>One tool. All its plans.</h1>
        <p>
          Browse by tool, then compare its subscriptions, durations and warranty
          options. All API offers live in one collection.
        </p>
      </div>
      <Catalog initialPage={page} />
    </div>
  );
}
