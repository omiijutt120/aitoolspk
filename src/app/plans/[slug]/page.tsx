import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Braces, ArrowLeft } from 'lucide-react';
import { Catalog } from '@/components/catalog';
import { products } from '@/lib/catalog';
import { groupCollections } from '@/lib/collections';
import { metadata, JsonLd, origin } from '@/lib/seo';

const collections = groupCollections(products);
export const dynamicParams = false;
export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return {};
  return metadata(
    `${collection.title} in Pakistan — compare ${collection.count} options`,
    `Browse ${collection.count} ${collection.title}. Compare listed PKR prices, durations, access and warranty terms. Confirm your selected offer on WhatsApp.`,
    `/plans/${slug}/`
  );
}
export default async function PlansPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = collections.find((collection) => collection.slug === slug);
  if (!c) notFound();
  return (
    <div className="container">
      <div className="page-intro collection-intro">
        <Link href="/tools/" className="text-link" prefetch={false}>
          <ArrowLeft size={15} />
          All tools & collections
        </Link>
        <div className="collection-intro-heading">
          <div className="collection-logo">
            {c.isApi ? (
              <Braces size={30} />
            ) : c.logo ? (
              <Image
                src={c.logo}
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
            <h1>{c.title}</h1>
          </div>
        </div>
        <p>
          {c.isApi
            ? 'Every API offer, together. Search providers and compare credits, durations and access before choosing a plan.'
            : `All ${c.brand} subscriptions and variants, together. Compare the exact duration, access and warranty before choosing your plan.`}
        </p>
      </div>
      <Catalog collection={slug} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${origin}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Tools',
              item: `${origin}/tools/`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: c.title,
              item: `${origin}/plans/${slug}/`,
            },
          ],
        }}
      />
    </div>
  );
}
