import type { MetadataRoute } from 'next';
import { origin } from '@/lib/seo';
import { categories } from '@/lib/categories';
import { products } from '@/lib/catalog';
import { groupCollections } from '@/lib/collections';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...[
      '',
      '/tools',
      '/categories',
      '/how-to-order',
      '/faq',
      '/contact',
      '/terms',
      '/refund-policy',
      '/privacy-policy',
    ].map((path) => ({ url: `${origin}${path}/` })),
    ...categories.map((c) => ({ url: `${origin}/category/${c.slug}/` })),
    ...groupCollections(products).map((c) => ({
      url: `${origin}/plans/${c.slug}/`,
    })),
    ...products
      .filter((p) => p.approval === 'approved')
      .map((p) => ({
        url: `${origin}/tool/${p.slug}/`,
        lastModified: new Date(p.date),
      })),
  ];
}
