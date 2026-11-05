import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { BlogCard } from '@/components/blog-card';
import { BlogLibrary } from '@/components/blog-library';
import { blogPosts, blogCollections, blogPostForCollection } from '@/lib/blog';
import { categoryName } from '@/lib/categories';
import {
  PAGE_SIZE,
  pageCount,
  pageDescription,
  pageNumber,
  pagePath,
} from '@/lib/pagination';
import { JsonLd, metadata as makeMetadata, origin } from '@/lib/seo';

type Props = { params: Promise<{ page?: string }> };
export async function generateMetadata({ params }: Props) {
  const page = pageNumber((await params).page);
  if (!Number.isInteger(page) || page > pageCount(blogCollections.length))
    return {};
  return makeMetadata(
    page === 1
      ? 'AI tools blog & product library for Pakistan'
      : `Product library, page ${page} | AiToolsPk blog`,
    pageDescription(
      'Practical AI tool workflows, sourced product guides and a complete library of subscriptions with PKR plan details for Pakistan.',
      page
    ),
    pagePath('/blog/', page)
  );
}

export default async function Blog({ params }: Props) {
  const page = pageNumber((await params).page);
  if (!Number.isInteger(page) || page > pageCount(blogCollections.length))
    notFound();
  const path = pagePath('/blog/', page);
  const shown = blogCollections.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return (
    <div className="blog-page">
      <div className="container">
        <nav className="blog-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          {page > 1 ? (
            <>
              <Link href="/blog/">Blog</Link>
              <span aria-hidden="true">/</span>
              <span>Page {page}</span>
            </>
          ) : (
            <span>Blog</span>
          )}
        </nav>
        <header className="blog-hero">
          <div>
            <p className="store-eyebrow">THE AITOOLSPK JOURNAL</p>
            <h1>
              {page === 1 ? (
                <>
                  Better tools.
                  <br />
                  <span>Better informed.</span>
                </>
              ) : (
                <>
                  The product library.
                  <br />
                  <span>Page {page}.</span>
                </>
              )}
            </h1>
            <p className="blog-hero-lead">
              Practical ways to work with AI, design and productivity tools.
              Understand the capabilities, compare the details and choose with a
              clearer brief.
            </p>
          </div>
          <aside className="blog-hero-note">
            <BookOpen size={28} aria-hidden="true" />
            <strong>
              From understanding
              <br />
              to a useful workflow.
            </strong>
            <p>
              Source-backed articles. Original examples. Clear links to every
              catalog plan.
            </p>
            <a className="text-link" href="#product-library">
              Explore {blogCollections.length} tool collections{' '}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </aside>
        </header>
        {page === 1 && (
          <section className="blog-section" aria-labelledby="articles-heading">
            <div className="blog-section-heading">
              <div>
                <p className="store-eyebrow">START WITH SOMETHING USEFUL</p>
                <h2 id="articles-heading">Tools in practice.</h2>
              </div>
              <Link className="text-link" href="/guides/">
                Subscription buying guides{' '}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="blog-grid">
              {blogPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}
        <section
          id="product-library"
          className="blog-section blog-library"
          aria-labelledby="library-heading"
        >
          <div className="blog-section-heading">
            <div>
              <p className="store-eyebrow">EVERY TOOL. EVERY PLAN.</p>
              <h2 id="library-heading">The complete product library.</h2>
            </div>
            <span className="blog-library-total">
              {blogCollections.reduce((sum, c) => sum + c.count, 0)} plans
              across {blogCollections.length} collections
            </span>
          </div>
          <p className="blog-section-intro">
            Find each product family, its exact variants, listed PKR prices,
            access and warranty details. Listed amounts need a fresh quote;
            product features and seller package entitlements are separate.
            Dedicated articles are available for selected tools.
          </p>
          <BlogLibrary
            page={page}
            collections={blogCollections.map((c) => {
              const article = blogPostForCollection(c.slug);
              return {
                slug: c.slug,
                brand: c.brand,
                logo: c.logo,
                count: c.count,
                minPrice: c.minPrice,
                category: c.categories.map(categoryName).join(' · '),
                ...(article
                  ? { article: { slug: article.slug, title: article.title } }
                  : {}),
              };
            })}
          />
        </section>
        <aside className="blog-editorial-note">
          <p>
            Written by AiToolsPk using the official sources linked in each
            article. Examples are illustrative; no vendor affiliation or
            independent performance testing is claimed.
          </p>
          <Link href="/editorial-policy/">Read our editorial policy →</Link>
        </aside>
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${origin}${path}#page`,
          url: `${origin}${path}`,
          name:
            page === 1
              ? 'AiToolsPk blog and product library'
              : `AiToolsPk product library, page ${page}`,
          isPartOf: { '@id': `${origin}/#website` },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: shown.map((c, i) => ({
              '@type': 'ListItem',
              position: (page - 1) * PAGE_SIZE + i + 1,
              name: c.brand,
              url: `${origin}/plans/${c.slug}/`,
            })),
          },
        }}
      />
      {page === 1 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Blog',
            '@id': `${origin}/blog/#blog`,
            name: 'AiToolsPk Journal',
            url: `${origin}/blog/`,
            publisher: {
              '@type': 'Organization',
              name: 'AiToolsPk',
              url: origin,
            },
            blogPost: blogPosts.map((post) => ({
              '@type': 'BlogPosting',
              headline: post.title,
              url: `${origin}/blog/${post.slug}/`,
              datePublished: post.published,
              dateModified: post.checked,
            })),
          }}
        />
      )}
    </div>
  );
}
