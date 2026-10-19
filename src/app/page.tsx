import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
  Banknote,
  Search,
} from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/catalog';
import { homeSelection } from '@/lib/catalog-order';
import { metadata as makeMetadata } from '@/lib/seo';

export const metadata = makeMetadata(
  'AI tools & subscriptions in Pakistan — selected plans',
  'Explore selected AiToolsPk plans, compare PKR prices and browse the complete catalog with search and filters.',
  '/'
);

export default function Home() {
  const selected = homeSelection(products);
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
            <br className="desktop-break" /> Start with our featured selection
            or browse the complete catalog.
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
                href={`/tools/?brand=${encodeURIComponent(p.brand)}`}
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
              Showing {selected.length} of{' '}
              <strong>{products.length} offers</strong>
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
              <span className="catalog-total">{products.length}</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <p className="home-verification-note">
          Plans marked “Pending verification” need confirmation before ordering.
          Buy Now opens WhatsApp with your selected plan so you can confirm
          availability, price and exact terms.
        </p>
        <div className="product-grid home-product-grid">
          {selected.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="home-catalog-end">
          <p>
            These are {selected.length} featured plans from our{' '}
            {products.length}-offer catalog.
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
