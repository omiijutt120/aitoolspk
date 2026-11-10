import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
  Banknote,
  Search,
  ArrowRight,
  Layers3,
  Braces,
} from 'lucide-react';
import { CollectionCard } from '@/components/collection-card';
import { products } from '@/lib/catalog';
import { homeCollections, groupCollections } from '@/lib/collections';
import type { Metadata } from 'next';
import { metadata as makeMetadata, origin } from '@/lib/seo';
import { categories } from '@/lib/categories';
import { CategoryIcon } from '@/components/icon';
import { Steps } from '@/components/steps';
import { SiteVideo } from '@/components/site-video';
import { FaqList } from '@/components/faq';
import { logoThumbnail } from '@/lib/logo-thumbnail';
import { BlogCard } from '@/components/blog-card';
import { blogPosts } from '@/lib/blog';

const collectionTotal = groupCollections(products).length;

export const metadata: Metadata = {
  ...makeMetadata(
    'AI tool prices in Pakistan 2026 | AiToolsPk',
    `Compare ${products.length} AI tool and subscription plans in Pakistan: listed PKR quotes, exact durations and seller warranty. Browse ${collectionTotal} collections, then confirm on WhatsApp.`,
    '/'
  ),
  // The homepage advertises the plain-text site summary beside its canonical
  // URL, so a crawler or an answer engine does not have to guess that it
  // exists. Kept on this route only: every other page already points at it
  // through /llms.txt and the sitemap.
  alternates: {
    canonical: `${origin}/`,
    types: { 'text/plain': `${origin}/llms.txt` },
  },
};

export default function Home() {
  const selected = homeCollections(products);
  const collectionCount = groupCollections(products).length;
  const brands = ['chatgpt', 'claude', 'canva', 'figma', 'notion', 'elevenlabs']
    .map((slug) => products.find((p) => p.brandSlug === slug))
    .filter((p) => p !== undefined);
  return (
    <div className="storefront">
      <section className="store-hero container" aria-labelledby="store-title">
        <div className="store-hero-copy">
          <p className="store-eyebrow">
            <span /> YOUR NEXT TOOLKIT STARTS HERE
          </p>
          <h1 id="store-title">
            AI tool prices in Pakistan. <span>Compare every plan.</span>
          </h1>
          <p>
            AiToolsPk is an independent catalog of AI tools, creative software
            and digital subscriptions for Pakistan. Compare listed PKR prices,
            plan durations and seller warranty, then confirm your exact offer on
            WhatsApp.
          </p>
          <div className="store-hero-actions">
            <Link className="button" href="#featured-tools">
              Explore the tools <ArrowRight size={19} />
            </Link>
            <Link className="text-link" href="#ordering">
              How it works <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="hero-facts">
            <span>
              <ShieldCheck size={15} />
              Compare every plan
            </span>
            <span>
              <Banknote size={15} />
              PKR pricing
            </span>
            <span>
              <MessageCircle size={15} />
              Order on WhatsApp
            </span>
          </div>
        </div>
        <div className="tool-wall">
          <div className="tool-wall-top">
            <span>MAKE ROOM FOR BETTER WORK.</span>
            <Layers3 size={20} />
          </div>
          <div className="tool-wall-icons">
            {brands.map((p) => (
              <Link
                key={p.id}
                href={`/plans/${p.brandSlug}/`}
                aria-label={`Browse ${p.brand} plans`}
                prefetch={false}
              >
                {p.logo ? (
                  <Image
                    src={logoThumbnail(p.logo)}
                    width={44}
                    height={44}
                    alt={`${p.brand} logo`}
                  />
                ) : (
                  <span className="tool-wall-text-logo" aria-hidden="true">
                    {p.brand}
                  </span>
                )}
                <span>{p.brand}</span>
              </Link>
            ))}
          </div>
          <div className="tool-wall-bottom">
            <p>
              Create. Build. Get things done.
              <strong>Find the tools for your next big thing.</strong>
            </p>
            <span className="tool-wall-stamp">
              {collectionCount}
              <span>TOOL COLLECTIONS</span>
            </span>
          </div>
        </div>
      </section>
      <div className="store-proof-strip">
        <div className="container">
          <p>
            <strong>{products.length}</strong>
            <span>plans to compare</span>
          </p>
          <p>
            <strong>{collectionCount}</strong>
            <span>tool collections</span>
          </p>
          <p>
            <strong>PKR</strong>
            <span>clear local pricing</span>
          </p>
          <p>
            <MessageCircle size={23} />
            <span>
              One conversation.
              <br />
              <strong>Your exact plan.</strong>
            </span>
          </p>
        </div>
      </div>
      <section
        className="container home-categories"
        aria-labelledby="category-heading"
      >
        <div className="home-section-heading">
          <div>
            <p className="store-eyebrow">A TOOL FOR EVERY IDEA</p>
            <h2 id="category-heading">What are you working on?</h2>
          </div>
          <Link className="text-link" href="/categories/">
            Explore categories <ArrowUpRight size={17} />
          </Link>
        </div>
        <nav
          className="home-category-links"
          aria-label="Browse tool categories"
        >
          {categories.map((category) => (
            <Link
              href={`/category/${category.slug}/`}
              key={category.slug}
              prefetch={false}
            >
              <CategoryIcon name={category.icon} size={21} />
              <span>{category.name}</span>
              <ArrowUpRight size={15} />
            </Link>
          ))}
        </nav>
      </section>
      <div className="home-selection-wrap">
        <section
          id="featured-tools"
          className="container home-selection"
          aria-labelledby="featured-heading"
        >
          <div className="store-catalog-title featured-catalog-heading">
            <div>
              <p className="store-eyebrow">CURATED FOR YOUR NEXT CHAPTER</p>
              <h2 id="featured-heading">
                Featured tools<span>{selected.length}</span>
              </h2>
              <p className="featured-catalog-count">
                {selected.length} featured collections ·{' '}
                <strong>{products.length} plans</strong> across{' '}
                {collectionCount} collections
              </p>
            </div>
            <div className="catalog-entry-actions">
              <Link
                className="button outline"
                href="/tools/?focus=search"
                prefetch={false}
              >
                <Search size={16} />
                Find your next tool
              </Link>
              <Link className="button" href="/tools/" prefetch={false}>
                Show all tools{' '}
                <span className="catalog-total">{collectionCount}</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          <p className="home-verification-note">
            One tool. Every option. Open a collection to find the plan that
            fits.
          </p>
          <div className="collection-grid home-collection-grid">
            {selected.map((collection) => (
              <CollectionCard key={collection.slug} collection={collection} />
            ))}
          </div>
          <div className="home-catalog-end">
            <p>
              {products.length} individual plans, organised into{' '}
              {collectionCount} collections.
            </p>
            <Link className="text-link" href="/tools/" prefetch={false}>
              Browse the complete catalog
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
      </div>
      <section className="api-spotlight-wrap">
        <div className="container">
          <div className="api-spotlight">
            <div className="api-spotlight-art" aria-hidden="true">
              <Braces size={100} />
              <span>API</span>
            </div>
            <div>
              <p className="store-eyebrow">FOR THE THINGS YOU’RE BUILDING</p>
              <h2>
                Big on APIs.
                <br />
                Easy to explore.
              </h2>
              <p>
                Skip the scattered listings. Find every API offer in one place,
                with credits, token limits and exact plan details to compare.
              </p>
              <Link className="button" href="/plans/api/" prefetch={false}>
                Explore API plans <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section
        id="pricing-method"
        className="container home-method"
        aria-labelledby="method-heading"
      >
        <div className="home-section-heading">
          <div>
            <p className="store-eyebrow">NO INVENTED PRICES</p>
            <h2 id="method-heading">How these PKR prices are collected</h2>
          </div>
          <Link className="text-link" href="/price-index/" prefetch={false}>
            Open the price index <ArrowUpRight size={17} />
          </Link>
        </div>
        <p>
          Every figure is a seller quote taken from the current list, with the
          date it was recorded. Cards show the typical (median) quote, so a
          single one-day trial does not stand in for a whole collection. No
          figure here is a vendor list price or a promise of today&apos;s
          amount: confirm the exact product ID and the current price in WhatsApp
          before paying.
        </p>
        <ul>
          <li>
            <strong>Quote date on every page.</strong> A quote dated last month
            is still shown as dated, not quietly refreshed.
          </li>
          <li>
            <strong>Range, not a bait price.</strong> Each collection lists the
            typical quote and the lowest to highest quote, because a cheaper row
            usually means a shorter duration or a smaller allowance.
          </li>
          <li>
            <strong>Unverified means unverified.</strong> Listings that the
            seller has not confirmed carry a pending label, and those detail
            pages stay out of search results on purpose.
          </li>
        </ul>
      </section>
      <section
        id="ordering"
        className="container home-ordering"
        aria-labelledby="ordering-heading"
      >
        <div className="home-section-heading">
          <div>
            <p className="store-eyebrow">FROM BROWSING TO YOUR NEXT TOOL</p>
            <h2 id="ordering-heading">Three steps. One conversation.</h2>
          </div>
          <Link className="text-link" href="/how-to-order/">
            The ordering guide <ArrowUpRight size={17} />
          </Link>
        </div>
        <Steps />
      </section>
      <SiteVideo />
      <section className="container home-faq" aria-labelledby="faq-heading">
        <div>
          <p className="store-eyebrow">GOOD QUESTIONS. CLEAR ANSWERS.</p>
          <h2 id="faq-heading">
            A little clarity
            <br />
            before you choose.
          </h2>
          <p>
            Understand the details, then decide. We’re here to help you find
            your fit.
          </p>
          <Link className="text-link" href="/faq/">
            Read all FAQs <ArrowUpRight size={17} />
          </Link>
        </div>
        <FaqList limit={4} headingLevel={3} />
      </section>
      <section
        className="container blog-section"
        aria-labelledby="home-blog-heading"
      >
        <div className="blog-section-heading">
          <div>
            <p className="store-eyebrow">FROM THE JOURNAL</p>
            <h2 id="home-blog-heading">Put your tools to work.</h2>
          </div>
          <Link className="text-link" href="/blog/">
            Explore the blog <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="blog-grid blog-grid-related">
          {blogPosts
            .filter((post) =>
              ['chatgpt', 'canva', 'elevenlabs'].includes(post.collection)
            )
            .map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
        </div>
      </section>
      <section className="container store-support">
        <div>
          <MessageCircle size={25} />
          <div>
            <h2>Need a hand choosing?</h2>
            <p>Send us the product ID. We’ll help you understand the plan.</p>
          </div>
        </div>
        <a
          className="button"
          href="https://wa.me/923714549245"
          target="_blank"
          rel="noopener noreferrer"
        >
          Talk to us on WhatsApp
          <ArrowUpRight size={16} />
        </a>
      </section>
    </div>
  );
}
