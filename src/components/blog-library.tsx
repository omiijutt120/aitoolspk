'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Search, Layers } from 'lucide-react';
import type { PlanCollection } from '@/lib/collections';
import { logoThumbnail } from '@/lib/logo-thumbnail';
import { PAGE_SIZE, pageCount, pagePath } from '@/lib/pagination';

type LibraryCollection = Pick<
  PlanCollection,
  'slug' | 'brand' | 'logo' | 'count'
> & {
  category: string;
  article?: { slug: string; title: string };
};

export function BlogLibrary({
  collections,
  page,
}: {
  collections: LibraryCollection[];
  page: number;
}) {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const search = query.trim().toLowerCase();
  const matches = collections.filter((c) =>
    `${c.brand} ${c.category}`.toLowerCase().includes(search)
  );
  const shown = search
    ? matches.slice(0, limit)
    : collections.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pages = pageCount(collections.length);
  return (
    <>
      <div
        className="blog-library-search"
        role="search"
        aria-label="Product library"
      >
        <Search size={20} aria-hidden="true" />
        <label htmlFor="blog-library-search" className="sr-only">
          Search product library
        </label>
        <input
          id="blog-library-search"
          type="search"
          value={query}
          placeholder="Search a tool or category…"
          onChange={(event) => {
            setQuery(event.target.value);
            setLimit(PAGE_SIZE);
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setLimit(PAGE_SIZE);
            }}
          >
            Clear
          </button>
        )}
      </div>
      <p className="blog-library-count" role="status">
        {search
          ? `${matches.length} matching tool collections`
          : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, collections.length)} of ${collections.length} tool collections`}
      </p>
      <div className="blog-library-grid">
        {shown.map((collection) => (
          <article className="blog-library-card" key={collection.slug}>
            <div className="blog-library-card-head">
              {collection.logo ? (
                <Image
                  src={logoThumbnail(collection.logo)}
                  alt={`${collection.brand} logo`}
                  width={36}
                  height={36}
                />
              ) : (
                <Layers size={32} aria-hidden="true" />
              )}
              <div>
                <h3>
                  <Link href={`/plans/${collection.slug}/`} prefetch={false}>
                    {collection.brand}
                  </Link>
                </h3>
                <span>{collection.category}</span>
              </div>
            </div>
            <p>
              {collection.count} {collection.count === 1 ? 'plan' : 'plans'} ·
              Compare listed PKR prices
            </p>
            <Link
              className="text-link"
              href={`/plans/${collection.slug}/`}
              prefetch={false}
            >
              View plans & details <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            {collection.article && (
              <Link
                className="blog-library-article"
                href={`/blog/${collection.article.slug}/`}
                prefetch={false}
              >
                Guide: {collection.article.title}
              </Link>
            )}
          </article>
        ))}
      </div>
      {search && matches.length === 0 && (
        <div className="blog-empty">
          <h3>No matching tools</h3>
          <p>Try a brand name or a broader category.</p>
          <button className="button" onClick={() => setQuery('')}>
            Show all collections
          </button>
        </div>
      )}
      {search && matches.length > limit && (
        <button
          className="button secondary blog-load-more"
          onClick={() => setLimit((value) => value + PAGE_SIZE)}
        >
          Show more matching tools
        </button>
      )}
      {!search && pages > 1 && (
        <nav className="blog-pagination" aria-label="Product library pages">
          {page > 1 && (
            <Link
              href={`${pagePath('/blog/', page - 1)}#product-library`}
              prefetch={false}
            >
              ← Previous
            </Link>
          )}
          {Array.from({ length: pages }, (_, index) => index + 1).map(
            (number) => (
              <Link
                key={number}
                href={`${pagePath('/blog/', number)}#product-library`}
                prefetch={false}
                aria-current={number === page ? 'page' : undefined}
                aria-label={`Product library page ${number}`}
              >
                {number}
              </Link>
            )
          )}
          {page < pages && (
            <Link
              href={`${pagePath('/blog/', page + 1)}#product-library`}
              prefetch={false}
            >
              Next →
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
