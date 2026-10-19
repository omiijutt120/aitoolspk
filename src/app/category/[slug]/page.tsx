import { notFound } from 'next/navigation';
import Link from 'next/link';
import { categories } from '@/lib/categories';
import { Catalog } from '@/components/catalog';
import { metadata, JsonLd, origin } from '@/lib/seo';
export const dynamicParams = false;
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = categories.find((c) => c.slug === slug);
  return c
    ? metadata(
        `${c.name} tools & subscriptions in Pakistan`,
        c.description + ' Compare exact plans and PKR prices.',
        `/category/${slug}/`
      )
    : {};
}
export default async function Category({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = categories.find((c) => c.slug === slug);
  if (!c) notFound();
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
      <Catalog category={slug} />
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
