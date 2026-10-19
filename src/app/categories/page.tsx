import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { categories } from '@/lib/categories';
import { products } from '@/lib/catalog';
import { CategoryIcon } from '@/components/icon';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'Explore categories',
  'Find tools for AI chat, video, design, writing, coding, productivity, security, entertainment and software. Compare plans in PKR.',
  '/categories/'
);
export default function Categories() {
  return (
    <div className="container">
      <div className="page-intro">
        <p className="eyebrow">A TOOL FOR EVERY AMBITION</p>
        <h1>Start with what you do.</h1>
        <p>
          A focused way to find tools for your next project, workflow or
          creative idea.
        </p>
      </div>
      <div className="category-grid">
        {categories.map((c) => (
          <Link
            className="category-tile"
            key={c.slug}
            href={`/category/${c.slug}/`}
          >
            <CategoryIcon name={c.icon} size={27} />
            <h2>{c.name}</h2>
            <p>{c.description}</p>
            <span className="text-link">
              {products.filter((p) => p.category === c.slug).length} offers{' '}
              <ArrowUpRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
