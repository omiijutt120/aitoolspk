import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { CategoryGuidance } from '@/components/category-guidance';
import { categories } from '@/lib/categories';
import { Catalog } from '@/components/catalog';
import { metadata } from '@/lib/seo';
import { products } from '@/lib/catalog';
import { groupCollections } from '@/lib/collections';
import { pageCount, pageNumber, pagePath } from '@/lib/pagination';
import { PAGE_SIZE } from '@/lib/pagination';
import { CollectionSchema } from '@/components/collection-schema';
export const dynamicParams = false;
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; page?: string }>;
}) {
  const { slug, page: value } = await params;
  const page = pageNumber(value);
  const c = categories.find((c) => c.slug === slug);
  return c
    ? metadata(
        `${c.name} tools & subscriptions in Pakistan${page > 1 ? ` — Page ${page}` : ''}`,
        c.description +
          ` Compare exact plans and PKR prices.${page > 1 ? ` Page ${page}.` : ''}`,
        pagePath(`/category/${slug}/`, page)
      )
    : {};
}
export default async function Category({
  params,
}: {
  params: Promise<{ slug: string; page?: string }>;
}) {
  const { slug, page: value } = await params;
  const page = pageNumber(value);
  const c = categories.find((c) => c.slug === slug);
  if (!c) notFound();
  if (
    !Number.isSafeInteger(page) ||
    page >
      pageCount(
        groupCollections(products.filter((p) => p.category === slug)).length
      )
  )
    notFound();
  return (
    <div className="container">
      <div className="page-intro">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Categories', href: '/categories/' },
            { name: c.name, href: `/category/${slug}/` },
            ...(page > 1
              ? [
                  {
                    name: `Page ${page}`,
                    href: pagePath(`/category/${slug}/`, page),
                  },
                ]
              : []),
          ]}
        />
        <p className="eyebrow">FIND YOUR FIT</p>
        <h1>
          {c.name} tools, in PKR.{page > 1 ? ` Page ${page}.` : ''}
        </h1>
        <p>
          {c.description} Read each offer’s access method, duration and warranty
          before choosing a plan.
        </p>
      </div>
      <Catalog category={slug} initialPage={page} />
      {page === 1 && <CategoryGuidance slug={slug} />}
      <CollectionSchema
        name={`${c.name}${page > 1 ? ` — Page ${page}` : ''}`}
        description={c.description}
        path={pagePath(`/category/${slug}/`, page)}
        items={groupCollections(products.filter((p) => p.category === slug))
          .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
          .map((item) => ({ name: item.title, path: `/plans/${item.slug}/` }))}
      />
    </div>
  );
}
