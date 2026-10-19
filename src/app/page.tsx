import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MessageCircle,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { SearchForm } from '@/components/search';
import { CategoryIcon } from '@/components/icon';
import { categories } from '@/lib/categories';
import { featured } from '@/lib/catalog';
import { ProductCard } from '@/components/product-card';
import { Steps } from '@/components/steps';
import { FaqList } from '@/components/faq';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'AItoolsPK — Digital tools, clearer choices.',
  'Find AI tools and subscriptions in Pakistan. Compare exact plans, PKR prices and warranty details. Order approved offers directly on WhatsApp.',
  '/'
);
export default function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" />
            DIGITAL TOOLS IN PAKISTAN
          </p>
          <h1>
            Find the right AI tools and subscriptions <span>in Pakistan.</span>
          </h1>
          <p className="hero-description">
            Compare plans, prices and warranty details in PKR.
            <br className="desktop-break" /> Order directly on WhatsApp.
          </p>
          <div className="hero-buttons">
            <Link className="button" href="/tools/">
              Browse tools <ArrowUpRight size={18} />
            </Link>
            <Link className="button ghost" href="/how-to-order/">
              How ordering works <ArrowRight size={17} />
            </Link>
          </div>
          <SearchForm />
          <div className="hero-notes">
            <span>
              <Check size={14} />
              Clear PKR pricing
            </span>
            <span>
              <Check size={14} />
              No sign-up needed
            </span>
            <span>
              <Check size={14} />
              Human support
            </span>
          </div>
        </div>
        <div
          className="hero-art"
          aria-label="Discover tools for your next idea"
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="art-cross cross-one">+</div>
          <div className="art-cross cross-two">+</div>
          <div className="center-brand">
            <Image
              src="/brand/symbol.webp"
              alt="AItoolsPK symbol"
              width={104}
              height={104}
              priority
            />
          </div>
          <div className="floating-tool float-one">
            <span className="tool-word">Claude</span>
            <span>Think bigger.</span>
          </div>
          <div className="floating-tool float-two">
            <span className="tool-word">ChatGPT</span>
            <span>Start with a question.</span>
          </div>
          <div className="floating-tool float-three">
            <span className="tool-word">Canva</span>
            <span>Make it yours.</span>
          </div>
          <div className="floating-tool float-four">
            <span className="tool-word">Notion</span>
            <span>Bring it all together.</span>
          </div>
          <div className="art-caption">
            <span />
            YOUR NEXT IDEA STARTS HERE
          </div>
        </div>
      </section>
      <div className="value-strip">
        <div className="container">
          <span>
            <SlidersHorizontal size={17} />
            The exact plan. All the details.
          </span>
          <span>
            <ShieldCheck size={17} />
            Warranty terms, clearly explained.
          </span>
          <span>
            <MessageCircle size={17} />A conversation before a commitment.
          </span>
        </div>
      </div>
      <section className="container section category-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A TOOL FOR EVERY AMBITION</p>
            <h2>What are you working on?</h2>
          </div>
          <Link className="text-link" href="/categories/">
            All categories <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="category-chips">
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}/`}>
              <CategoryIcon name={c.icon} />
              {c.name}
              <ArrowUpRight size={13} />
            </Link>
          ))}
        </div>
      </section>
      <section className="section catalog-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE SHORTLIST</p>
              <h2>
                Tools worth a closer look<span className="heading-dot">.</span>
              </h2>
              <p className="section-description">
                A selection for your everyday work. Explore the exact offer
                before ordering.
              </p>
            </div>
            <Link className="button outline" href="/tools/">
              Explore all tools <ArrowUpRight size={16} />
            </Link>
          </div>
          <p className="catalog-notice">
            <ShieldCheck size={16} />
            <span>
              Catalog preview: resale eligibility and delivery are under review.
              Purchasing stays disabled until each offer is approved.
            </span>
          </p>
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="center-action">
            <Link href="/tools/" className="button outline">
              Find your next tool <ArrowRight size={17} />
            </Link>
            <span>Exact variants. Transparent prices. No surprises.</span>
          </div>
        </div>
      </section>
      <section className="container section how-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LESS FRICTION. MORE CLARITY.</p>
            <h2>From discovery to a conversation.</h2>
          </div>
          <span className="section-aside">
            No account. No cart.
            <br />
            Just a few clear steps.
          </span>
        </div>
        <Steps />
      </section>
      <section className="container">
        <div className="guide-banner">
          <div>
            <span className="eyebrow">A LITTLE CLARITY GOES A LONG WAY</span>
            <h2>
              The right tool starts
              <br />
              with the right questions.
            </h2>
            <p>
              Private or shared? One month or one year?
              <br />
              Understand the details before you choose.
            </p>
            <Link className="text-link" href="/how-to-order/#before-you-order">
              Read the buying checklist <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="checklist-preview">
            {[
              'Check the exact plan and duration',
              'Understand access and renewal',
              'Read the warranty and refund terms',
              'Confirm availability before payment',
            ].map((t, i) => (
              <div key={t}>
                <span>0{i + 1}</span>
                <p>{t}</p>
                <Check size={17} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container section faq-section">
        <div>
          <p className="eyebrow">GOOD QUESTIONS. CLEAR ANSWERS.</p>
          <h2>
            A few things
            <br />
            you might be wondering.
          </h2>
          <p className="muted">Still have a question? We’re a message away.</p>
          <Link className="text-link" href="/contact/">
            Let’s talk <ArrowUpRight size={16} />
          </Link>
        </div>
        <FaqList limit={4} />
      </section>
      <section className="container prefooter">
        <div>
          <p className="eyebrow">LET’S FIND YOUR FIT</p>
          <h2>Better tools. Your next chapter.</h2>
        </div>
        <Link href="/tools/" className="button">
          Explore the catalog <ArrowUpRight size={18} />
        </Link>
      </section>
    </>
  );
}
