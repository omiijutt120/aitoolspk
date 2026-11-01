import type { MetadataRoute } from 'next';
import { origin } from '@/lib/seo';
import { categories } from '@/lib/categories';
import { products } from '@/lib/catalog';
import { groupCollections } from '@/lib/collections';
import { paginatedSitemapUrls } from '@/lib/catalog-pagination';
import { guides } from '@/lib/guides';
import { productPublication } from '@/lib/seo-editorial';
import { collectionGuides } from '@/lib/collection-guides';
import collectionModified from '../../data/seo/collection-modified.json';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...paginatedSitemapUrls().map((path) => ({
      url: `${origin}${path}`,
      lastModified: '2026-10-24',
    })),
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
      '/guides',
      '/about',
      '/editorial-policy',
    ].map((path) => ({
      url: `${origin}${path}/`,
      ...(['', '/tools', '/guides', '/about', '/editorial-policy'].includes(
        path
      )
        ? { lastModified: '2026-10-24' }
        : {}),
    })),
    ...categories.map((c) => ({
      url: `${origin}/category/${c.slug}/`,
      lastModified: '2026-10-24',
    })),
    ...guides.map((g) => ({
      url: `${origin}/guides/${g.slug}/`,
      lastModified: g.checked,
    })),
    ...groupCollections(products).map((c) => ({
      url: `${origin}/plans/${c.slug}/`,
      lastModified: [
        '2026-10-24',
        collectionGuides[c.slug]?.checked || '',
        (collectionModified as Record<string, string>)[c.slug] || '',
      ]
        .sort()
        .at(-1),
    })),
    ...products
      .filter((p) => productPublication(p).sitemapEligible)
      .map((p) => ({
        url: `${origin}/tool/${p.slug}/`,
      })),
  ];
}
