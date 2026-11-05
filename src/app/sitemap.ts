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
import { blogDirectoryPaths, blogPosts, blogReviewed } from '@/lib/blog';
import { latest, modified } from '@/lib/content-freshness';

export const dynamic = 'force-static';

/**
 * Each static route names the files that render it, so `lastmod` follows the
 * real edit history. Previously these routes either carried a hand-written
 * date or none at all, which let the sitemap claim freshness that the page did
 * not have — and left eight URLs without a `lastmod` entirely.
 */
const staticRoutes: { path: string; sources: string[] }[] = [
  { path: '', sources: ['src/app/page.tsx'] },
  { path: '/tools', sources: ['src/app/tools/page.tsx', 'data/catalog.json'] },
  {
    path: '/categories',
    sources: [
      'src/app/categories/page.tsx',
      'src/lib/categories.ts',
      'data/catalog.json',
    ],
  },
  { path: '/how-to-order', sources: ['src/app/how-to-order/page.tsx'] },
  { path: '/faq', sources: ['src/app/faq/page.tsx'] },
  { path: '/contact', sources: ['src/app/contact/page.tsx'] },
  { path: '/terms', sources: ['src/app/terms/page.tsx'] },
  { path: '/refund-policy', sources: ['src/app/refund-policy/page.tsx'] },
  { path: '/privacy-policy', sources: ['src/app/privacy-policy/page.tsx'] },
  { path: '/guides', sources: ['src/app/guides/page.tsx', 'src/lib/guides.ts'] },
  { path: '/about', sources: ['src/app/about/page.tsx'] },
  {
    path: '/editorial-policy',
    sources: ['src/app/editorial-policy/page.tsx'],
  },
  {
    path: '/author/muhammad-umar',
    sources: ['src/app/author/[slug]/page.tsx', 'src/lib/author.ts'],
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...blogDirectoryPaths().map((path) => ({
      url: `${origin}${path}`,
      lastModified: latest(
        blogReviewed,
        modified('data/blog/posts.json', 'src/lib/blog.ts')
      ),
    })),
    ...blogPosts.map((post) => ({
      url: `${origin}/blog/${post.slug}/`,
      lastModified: latest(post.checked, modified('data/blog/posts.json')),
    })),
    ...paginatedSitemapUrls().map((path) => ({
      url: `${origin}${path}`,
      lastModified: modified('src/app/tools/page.tsx', 'data/catalog.json'),
    })),
    ...staticRoutes.map(({ path, sources }) => ({
      url: `${origin}${path}/`,
      lastModified: modified(...sources),
    })),
    ...categories.map((c) => ({
      url: `${origin}/category/${c.slug}/`,
      lastModified: latest(
        '2026-10-24',
        modified('src/lib/categories.ts', 'data/catalog.json')
      ),
    })),
    ...guides.map((g) => ({
      url: `${origin}/guides/${g.slug}/`,
      lastModified: latest(g.checked, modified('src/lib/guides.ts')),
    })),
    ...groupCollections(products).map((c) => ({
      url: `${origin}/plans/${c.slug}/`,
      lastModified: latest(
        '2026-10-24',
        collectionGuides[c.slug]?.checked,
        (collectionModified as Record<string, string>)[c.slug]
      ),
    })),
    ...products
      .filter((p) => productPublication(p).sitemapEligible)
      .map((p) => ({
        url: `${origin}/tool/${p.slug}/`,
        lastModified: modified('data/catalog.json'),
      })),
  ];
}
