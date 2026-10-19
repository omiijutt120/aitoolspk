import Image from 'next/image';
import {
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
  Banknote,
} from 'lucide-react';
import { Catalog } from '@/components/catalog';
import { CatalogBrandLink } from '@/components/catalog-brand-link';
import { products } from '@/lib/catalog';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'AI tools & subscriptions in Pakistan — browse all plans',
  'Browse the complete AItoolsPK catalog on one page. Search real brands, compare exact plans and PKR prices, and confirm approved orders on WhatsApp.',
  '/'
);
export default function Home() {
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
            <br className="desktop-break" /> Order approved offers directly on
            WhatsApp.
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
              <CatalogBrandLink
                key={p.id}
                href={`/?brand=${encodeURIComponent(p.brand)}#all-tools`}
                label={`Browse ${p.brand} plans`}
              >
                {p.logo ? (
                  <Image src={p.logo} width={36} height={36} alt="" />
                ) : (
                  <span>{p.brand}</span>
                )}
              </CatalogBrandLink>
            ))}
          </div>
          <div className="tool-wall-bottom">
            <p>
              One place.
              <br />
              <strong>{products.length} ways to get started.</strong>
            </p>
            <span className="tool-wall-stamp">
              AItoolsPK<span>EST. PAKISTAN</span>
            </span>
          </div>
        </div>
      </section>
      <section
        id="all-tools"
        className="container storefront-catalog"
        aria-labelledby="catalog-heading"
      >
        <Catalog continuous />
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
          Talk to us on WhatsApp <ArrowUpRight size={16} />
        </a>
      </section>
    </div>
  );
}
