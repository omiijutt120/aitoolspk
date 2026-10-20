import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
  Banknote,
  Search,
} from 'lucide-react';
import { CollectionCard } from '@/components/collection-card';
import { products } from '@/lib/catalog';
import { homeCollections, groupCollections } from '@/lib/collections';
import { metadata as makeMetadata } from '@/lib/seo';

export const metadata = makeMetadata(
  'AI tools & subscriptions in Pakistan — selected plans',
  'Explore selected AiToolsPk plans, compare PKR prices and browse the complete catalog with search and filters.',
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
            <span /> AI TOOLS & DIGITAL SUBSCRIPTIONS
          </p>
          <h1 id="store-title">
            All your tools. <span>One place.</span>
          </h1>
          <p>
            Explore {products.length} plans. Compare prices in PKR.
            <br className="desktop-break" /> Choose a tool. Find all its plans
            in one place.
          </p>
          <div className="hero-facts">
            <span>
              <ShieldCheck size={15} />
              Clear plan details
            </span>
            <span>
              <Banknote size={15} />
              PKR pricing
            </span>
            <span>
              <MessageCircle size={15} />
              No sign-up
            </span>
          </div>
        </div>
        <div className="tool-wall">
          <div className="tool-wall-top">
            <span>YOUR NEXT WORKFLOW</span>
            <ArrowUpRight size={19} />
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
                  <Image src={p.logo} width={36} height={36} alt="" />
                ) : (
                  <span>{p.brand}</span>
                )}
              </Link>
            ))}
          </div>
          <div className="tool-wall-bottom">
            <p>
              One place.
              <br />
              <strong>A better toolkit starts here.</strong>
            </p>
            <span className="tool-wall-stamp">
              AiToolsPk<span>EST. PAKISTAN</span>
            </span>
          </div>
        </div>
      </section>
      <section
        id="featured-tools"
        className="container home-selection"
        aria-labelledby="featured-heading"
      >
        <div className="store-catalog-title featured-catalog-heading">
          <div>
            <p className="store-eyebrow">YOUR SHORTLIST</p>
            <h2 id="featured-heading">
              Featured tools<span>{selected.length}</span>
            </h2>
            <p className="featured-catalog-count">
              {selected.length} featured collections ·{' '}
              <strong>{products.length} plans</strong> across {collectionCount}{' '}
              collections
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
          Open a tool to compare all its plans, durations and warranty options.
          All API offers are together in the API plans collection.
        </p>
        <div className="collection-grid home-collection-grid">
          {selected.map((collection) => (
            <CollectionCard key={collection.slug} collection={collection} />
          ))}
        </div>
        <div className="home-catalog-end">
          <p>
            {products.length} individual plans, organised into {collectionCount}{' '}
            collections.
          </p>
          <Link className="text-link" href="/tools/" prefetch={false}>
            Browse the complete catalog
            <ArrowUpRight size={16} />
          </Link>
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
