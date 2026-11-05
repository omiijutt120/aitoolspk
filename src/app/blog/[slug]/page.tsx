import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { BlogCard } from '@/components/blog-card';
import {
  blogPosts,
  blogPostBySlug,
  blogCollections,
  blogDate,
  readingMinutes,
} from '@/lib/blog';
import { products } from '@/lib/catalog';
import { collectionProducts } from '@/lib/collections';
import { logoThumbnail } from '@/lib/logo-thumbnail';
import { JsonLd, metadata as makeMetadata, origin } from '@/lib/seo';

export const dynamicParams = false;
export function generateStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const post = blogPostBySlug((await params).slug);
  if (!post) return {};
  const result = makeMetadata(
    post.title,
    post.description,
    `/blog/${post.slug}/`,
    `/og/collections/${post.collection}.png`
  );
  return {
    ...result,
    authors: [{ name: 'AiToolsPk', url: `${origin}/about/` }],
    openGraph: {
      ...result.openGraph,
      type: 'article' as const,
      publishedTime: post.published,
      modifiedTime: post.checked,
      authors: ['AiToolsPk'],
    },
  };
}
export default async function BlogArticle({ params }: Props) {
  const post = blogPostBySlug((await params).slug);
  if (!post) notFound();
  const collection = blogCollections.find((c) => c.slug === post.collection)!;
  const plans = collectionProducts(products, post.collection);
  const related = blogPosts
    .filter((p) => p.slug !== post.slug)
    .sort(
      (a, b) => Number(b.topic === post.topic) - Number(a.topic === post.topic)
    )
    .slice(0, 3);
  const url = `${origin}/blog/${post.slug}/`;
  return (
    <div className="blog-page">
      <div className="container">
        <nav className="blog-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog/">Blog</Link>
          <span aria-hidden="true">/</span>
          <span>{collection.brand}</span>
        </nav>
        <article>
          <header className="blog-article-hero">
            <div className="blog-article-label">
              {collection.logo && (
                <Image
                  src={logoThumbnail(collection.logo)}
                  alt=""
                  width={40}
                  height={40}
                />
              )}
              <span>{post.topic}</span>
            </div>
            <h1>{post.title}</h1>
            <p className="blog-article-deck">{post.description}</p>
            <p className="blog-meta">
              By <Link href="/about/">AiToolsPk</Link> · Published{' '}
              <time dateTime={post.published}>{blogDate(post.published)}</time>{' '}
              · Reviewed{' '}
              <time dateTime={post.checked}>{blogDate(post.checked)}</time> ·{' '}
              {readingMinutes(post)} min read
            </p>
          </header>
          <div className="blog-article-layout">
            <aside className="blog-toc">
              <nav aria-label="In this article">
                <p className="store-eyebrow">IN THIS ARTICLE</p>
                <a href="#quick-answer">The short answer</a>
                {post.sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`}>
                    {s.heading}
                  </a>
                ))}
                <a href="#plans">Plans & PKR details</a>
                <a href="#questions">Common questions</a>
                <a href="#sources">Sources & review</a>
              </nav>
              <Link
                className="button"
                href={`/plans/${post.collection}/`}
                prefetch={false}
              >
                Compare {collection.brand} plans{' '}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </aside>
            <div className="blog-prose">
              <section id="quick-answer" className="blog-answer">
                <p className="store-eyebrow">THE SHORT ANSWER</p>
                <h2>{collection.brand}: a practical starting point</h2>
                <p>{post.answer}</p>
              </section>
              {post.sections.map((section) => (
                <section id={section.id} key={section.id}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets && (
                    <ul>
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              <section id="plans">
                <h2>{collection.brand} plans and listed PKR prices</h2>
                <p>
                  The catalog contains {plans.length}{' '}
                  {plans.length === 1 ? 'variant' : 'variants'} in this
                  collection. These are seller-listed package details, separate
                  from the vendor capabilities described above. Confirm the
                  current quote, legitimate delivery method and required
                  features before ordering.
                </p>
                <div className="blog-plan-samples">
                  {plans.slice(0, 3).map((plan) => (
                    <div className="blog-plan-sample" key={plan.id}>
                      <h3>
                        <Link href={`/tool/${plan.slug}/`} prefetch={false}>
                          {plan.name}
                        </Link>
                      </h3>
                      <strong>
                        Listed PKR {plan.price.toLocaleString('en-PK')}
                      </strong>
                      <dl>
                        <div>
                          <dt>Duration</dt>
                          <dd>{plan.duration}</dd>
                        </div>
                        <div>
                          <dt>Seller warranty</dt>
                          <dd>{plan.warranty}</dd>
                        </div>
                        <div>
                          <dt>Product ID</dt>
                          <dd>{plan.id}</dd>
                        </div>
                      </dl>
                      <Link
                        className="text-link"
                        href={`/tool/${plan.slug}/`}
                        prefetch={false}
                      >
                        View exact details{' '}
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  ))}
                </div>
                <p className="blog-plan-note">
                  Showing {Math.min(plans.length, 3)} sample listings. A listed
                  warranty is a seller term; it does not establish vendor
                  coverage or an automatic refund.
                </p>
                <Link
                  className="button"
                  href={`/plans/${post.collection}/`}
                  prefetch={false}
                >
                  Compare all {plans.length} {collection.brand} plans{' '}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
                <p>
                  <Link href="/how-to-order/">How WhatsApp ordering works</Link>{' '}
                  ·{' '}
                  <Link href="/guides/choosing-ai-subscriptions-pakistan/">
                    Plan buying checklist
                  </Link>
                </p>
              </section>
              <section id="questions">
                <h2>Common questions</h2>
                {post.questions.map((question) => (
                  <div className="blog-question" key={question.question}>
                    <h3>{question.question}</h3>
                    <p>{question.answer}</p>
                  </div>
                ))}
              </section>
              <section id="sources" className="blog-sources">
                <h2>Sources and editorial review</h2>
                <p>
                  Official product documentation reviewed on{' '}
                  {blogDate(post.checked)}. Features and limits may change.
                  Workflows and examples are editorial suggestions, not
                  independent performance tests or promises about a seller
                  package.
                </p>
                <ul>
                  {post.sources.map((source) => (
                    <li key={source.href}>
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
                <p>
                  <Link href="/editorial-policy/">
                    How we review information
                  </Link>{' '}
                  · <Link href="/contact/">Report a correction</Link>
                </p>
              </section>
            </div>
          </div>
        </article>
        <section className="blog-section" aria-labelledby="related-heading">
          <div className="blog-section-heading">
            <h2 id="related-heading">Keep exploring.</h2>
            <Link className="text-link" href="/blog/">
              All articles <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="blog-grid blog-grid-related">
            {related.map((item) => (
              <BlogCard key={item.slug} post={item} />
            ))}
          </div>
        </section>
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          '@id': `${url}#article`,
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
          url,
          headline: post.title,
          description: post.description,
          image: [`${origin}/og/collections/${post.collection}.png`],
          datePublished: `${post.published}T00:00:00+05:00`,
          dateModified: `${post.checked}T00:00:00+05:00`,
          author: {
            '@type': 'Organization',
            name: 'AiToolsPk',
            url: `${origin}/about/`,
          },
          publisher: {
            '@type': 'Organization',
            name: 'AiToolsPk',
            url: origin,
            logo: { '@type': 'ImageObject', url: `${origin}/brand/logo.png` },
          },
          inLanguage: 'en-PK',
          articleSection: post.topic,
          isPartOf: { '@type': 'Blog', '@id': `${origin}/blog/#blog` },
          citation: post.sources.map((source) => source.href),
        }}
      />
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
              name: 'Blog',
              item: `${origin}/blog/`,
            },
            { '@type': 'ListItem', position: 3, name: post.title, item: url },
          ],
        }}
      />
    </div>
  );
}
