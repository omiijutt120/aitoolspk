import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Braces } from 'lucide-react';
import { Catalog } from '@/components/catalog';
import { products } from '@/lib/catalog';
import { categoryName } from '@/lib/categories';
import { collectionProducts, groupCollections } from '@/lib/collections';
import {
  pageCount,
  pageDescription,
  pageNumber,
  pagePath,
} from '@/lib/pagination';
import { metadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PlanComparison } from '@/components/plan-comparison';
import { money } from '@/lib/commerce.mjs';
import { CollectionGuide } from '@/components/collection-guide';
import { CollectionSchema } from '@/components/collection-schema';
import { PAGE_SIZE } from '@/lib/pagination';
import { logoThumbnail } from '@/lib/logo-thumbnail';

const collections = groupCollections(products);
export const dynamicParams = false;
export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; page?: string }>;
}) {
  const { slug, page: value } = await params;
  const page = pageNumber(value);
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return {};
  return metadata(
    `${collection.title} & PKR prices in Pakistan${page > 1 ? ` — Page ${page}` : ''}`,
    pageDescription(
      `Compare ${collection.count} listed ${collection.brand} plans by PKR price, duration, access and seller warranty. Confirm your exact package on WhatsApp.`,
      page
    ),
    pagePath(`/plans/${slug}/`, page),
    `/og/collections/${slug}.png`
  );
}
export default async function PlansPage({
  params,
}: {
  params: Promise<{ slug: string; page?: string }>;
}) {
  const { slug, page: value } = await params;
  const page = pageNumber(value);
  const c = collections.find((collection) => collection.slug === slug);
  if (!c) notFound();
  if (
    !Number.isSafeInteger(page) ||
    page > pageCount(collectionProducts(products, slug).length)
  )
    notFound();
  const plans = collectionProducts(products, slug);
  const pagePlans = plans.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const quoteDates = [...new Set(plans.map((p) => p.date))].sort();
  return (
    <div className="container">
      <div className="page-intro collection-intro">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Tools', href: '/tools/' },
            { name: c.title, href: `/plans/${slug}/` },
            ...(page > 1
              ? [
                  {
                    name: `Page ${page}`,
                    href: pagePath(`/plans/${slug}/`, page),
                  },
                ]
              : []),
          ]}
        />
        <div className="collection-intro-heading">
          <div className="collection-logo">
            {c.isApi ? (
              <Braces size={30} />
            ) : c.logo ? (
              <Image
                src={logoThumbnail(c.logo)}
                width={40}
                height={40}
                alt={`${c.brand} logo`}
              />
            ) : (
              <span className="brand-wordmark">{c.brand}</span>
            )}
          </div>
          <div>
            <p className="store-eyebrow">
              {c.count} {c.count === 1 ? 'PLAN' : 'PLANS'} · ONE COLLECTION
            </p>
            <h1>
              {c.title} & prices in Pakistan
              {page > 1 ? ` — Page ${page}` : ''}
            </h1>
          </div>
        </div>
        <p>
          {c.isApi
            ? 'Every API offer, together. Search providers and compare credits, durations and access before choosing a plan.'
            : `All ${c.brand} subscriptions and variants, together. Compare the exact duration, access and warranty before choosing your plan.`}
        </p>
        <p className="collection-price-context">
          Listed range:{' '}
          <strong>
            {money(c.minPrice)}–{money(c.maxPrice)}
          </strong>{' '}
          across different packages. Quote dates:{' '}
          <time dateTime={quoteDates[0]}>{quoteDates[0]}</time>
          {quoteDates.length > 1 && (
            <>
              –<time dateTime={quoteDates.at(-1)}>{quoteDates.at(-1)}</time>
            </>
          )}
          . A shorter duration or different allowance can explain a lower price;
          confirm the selected plan before payment.
        </p>
        <nav aria-label="Related categories" className="mt-6">
          <p>Explore related categories</p>
          <ul className="flex flex-wrap gap-x-6">
            {c.categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/category/${category}/`}
                  className="text-link"
                  prefetch={false}
                >
                  {categoryName(category)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {slug === 'chatgpt' && page === 1 && (
        <section className="page-intro" aria-labelledby="chatgpt-buyer-clarity">
          <h2 id="chatgpt-buyer-clarity">Before comparing ChatGPT plans</h2>
          <p>
            Compare the exact edition, duration, access method and warranty
            separately. Subscription duration is not the warranty period. If
            access or warranty details are unspecified or unverified, ask for
            written clarification before paying.
          </p>
          <p>
            Stock availability does not confirm access approval or resale
            eligibility. Check the individual offer&apos;s review status.
            Pending offers require availability and eligibility confirmation
            first; an enquiry is not a purchase or reservation.
          </p>
          <p>
            Use the product ID to confirm the final PKR price, safe delivery
            method, renewal terms and written warranty coverage. Never share
            passwords, cookies, recovery keys or security codes. Read the{' '}
            <Link href="/how-to-order/">ordering checklist</Link> and{' '}
            <Link href="/refund-policy/">refund policy</Link> before deciding.
          </p>
        </section>
      )}
      {slug === 'elevenlabs' && page === 1 && (
        <section
          className="page-intro"
          aria-labelledby="elevenlabs-credit-checklist"
        >
          <h2 id="elevenlabs-credit-checklist">
            Compare ElevenLabs credits before choosing
          </h2>
          <p>
            Credits are not a fixed number of audio minutes. ElevenLabs says
            consumption varies by plan, model, product and whether you use its
            website or API. For a voiceover budget, note your intended model,
            script length and displayed credit estimate before comparing totals.
          </p>
          <ul>
            <li>
              Check the exact credit quantity and unit. A short label is not
              enough to establish the balance you will receive.
            </li>
            <li>
              Separate subscription quota from prepaid credits. ElevenLabs
              documents monthly resets for self-serve subscription credits;
              rollover has conditions, and cancellation or downgrade affects it.
              Ask which credit type and expiry apply to the selected offer.
            </li>
            <li>
              Match the plan and product to your task, not just the duration.
              Vendor documentation does not verify any listed offer. Confirm
              unresolved details using the{' '}
              <Link href="/how-to-order/">ordering checklist</Link>.
            </li>
          </ul>
          <p>
            Source checked <time dateTime="2026-10-27">27 October 2026</time>:{' '}
            <a href="https://elevenlabs.io/docs/overview/administration/billing">
              ElevenLabs billing documentation
            </a>
            . Vendor rules can change; recheck before deciding.
          </p>
        </section>
      )}
      {slug === 'api' && page === 1 && (
        <section className="page-intro" aria-labelledby="api-credit-guide">
          <h2 id="api-credit-guide">Compare API providers, units and expiry</h2>
          <p>
            An app subscription, a provider API balance and a gateway allowance
            are different things. Before comparing these listings, identify the
            provider or gateway, the billing account and the exact model
            endpoint. A familiar model name alone does not establish who
            supplies access.
          </p>
          <ul>
            <li>
              <strong>Check what the unit means.</strong> Labels such as
              &quot;10M Credit&quot; and &quot;15M Token&quot; are not directly
              comparable without a documented conversion and usage rules. Ask
              whether input, output and cached usage draw from the same balance,
              and which model and rate limits apply.
            </li>
            <li>
              <strong>Separate duration from balance expiry.</strong> A listed
              access period does not establish when credits reset or expire.
              Confirm the balance type, expiry, rollover and what happens when
              the allowance runs out before deciding.
            </li>
            <li>
              <strong>Check provider-specific exceptions.</strong> Claude
              documents API credits for eligible Max and Team plans after
              linking a Console organization; Pro is not eligible. Those
              included credits expire each billing cycle, or monthly for annual
              plans, without rollover. This does not establish eligibility for
              any local offer.
            </li>
            <li>
              <strong>Match credits to the correct service.</strong> Google
              documents separate Gemini API Prepay and Postpay billing. Its
              purchased Prepay credits expire after 12 months and apply to
              Gemini API usage, not other Google Cloud services. Do not treat
              that provider rule as the expiry of a listed gateway allowance.
            </li>
          </ul>
          <p>
            Vendor documentation does not verify any listed offer. Request the
            exact product ID, unit definition, provider or gateway and written
            limits using the{' '}
            <Link href="/how-to-order/">ordering checklist</Link>. Never send
            API keys or account credentials in an enquiry.
          </p>
          <p>
            Sources checked <time dateTime="2026-10-28">28 October 2026</time>:{' '}
            <a href="https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers">
              Claude API credit eligibility
            </a>{' '}
            and{' '}
            <a href="https://ai.google.dev/gemini-api/docs/billing">
              Gemini API billing documentation
            </a>
            . Provider rules can change; recheck before deciding.
          </p>
        </section>
      )}
      <Catalog collection={slug} initialPage={page} />
      <PlanComparison plans={pagePlans} brand={c.brand} page={page} />
      {page === 1 && <CollectionGuide slug={slug} plans={plans} />}
      <CollectionSchema
        name={`${c.title}${page > 1 ? ` — Page ${page}` : ''}`}
        description={`Compare exact ${c.brand} offer variants and terms.`}
        path={pagePath(`/plans/${slug}/`, page)}
        items={pagePlans.map((p) => ({
          name: `${p.name} — ${p.duration}`,
          path: `/tool/${p.slug}/`,
        }))}
      />
    </div>
  );
}
