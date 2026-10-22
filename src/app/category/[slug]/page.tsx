import { notFound } from 'next/navigation';
import Link from 'next/link';
import { categories } from '@/lib/categories';
import { Catalog } from '@/components/catalog';
import { metadata, JsonLd, origin } from '@/lib/seo';
import { products } from '@/lib/catalog';
import { groupCollections } from '@/lib/collections';
import { pageCount, pageNumber, pagePath } from '@/lib/pagination';
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
        c.description + ' Compare exact plans and PKR prices.',
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
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/categories/">Categories</Link>
          <span>/</span>
          <span>{c.name}</span>
        </nav>
        <p className="eyebrow">FIND YOUR FIT</p>
        <h1>{c.name} tools, in PKR.</h1>
        <p>
          {c.description} Read each offer’s access method, duration and warranty
          before choosing a plan.
        </p>
      </div>
      <Catalog category={slug} initialPage={page} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: origin },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Categories',
              item: `${origin}/categories/`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: c.name,
              item: `${origin}/category/${slug}/`,
            },
          ],
        }}
      />
    </div>
  );
}
