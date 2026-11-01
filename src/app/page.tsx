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
import { metadata as makeMetadata } from '@/lib/seo';
import { categories } from '@/lib/categories';
import { CategoryIcon } from '@/components/icon';
import { Steps } from '@/components/steps';
import { FaqList } from '@/components/faq';
import { logoThumbnail } from '@/lib/logo-thumbnail';

export const metadata = makeMetadata(
  'AI tools & subscriptions in Pakistan — PKR prices',
  'Discover and compare AI tools and digital subscriptions in Pakistan. Explore exact plans, transparent PKR prices and warranty terms, then enquire on WhatsApp.',
  '/'
);

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
            AI tools & subscriptions. <span>In Pakistan.</span>
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
                    alt=""
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
