import Link from 'next/link';
import type { Product } from '@/lib/types';
import { collectionGuides } from '@/lib/collection-guides';
import { money } from '@/lib/commerce.mjs';
import { author, authorPath } from '@/lib/author';
import { PriceSource } from './price-source';

const DEFAULT_CHECKED = '2026-10-23';

/**
 * Buying guide for a plan collection.
 *
 * Every collection gets one, including the 70+ brands with no hand-written
 * guide. Headings are phrased as the questions buyers actually ask, because
 * both readers and answer engines extract a heading→paragraph pair far more
 * reliably than a wall of prose.
 *
 * No FAQPage markup is emitted here on purpose: `scripts/seo/run.mjs` rejects
 * FAQPage as deprecated rich-result markup, and Google has retired FAQ rich
 * results for commercial sites. The visible Q&A still carries the substance.
 */
export function CollectionGuide({
  slug,
  plans,
}: {
  slug: string;
  plans: Product[];
}) {
  if (plans.length === 0) return null;

  const guide = collectionGuides[slug];
  const durations = [...new Set(plans.map((p) => p.duration))].filter(
    (v) => v !== 'Not specified'
  );
  const brand = slug === 'api' ? 'API' : plans[0]?.brand || slug;
  const checked = guide?.checked || DEFAULT_CHECKED;

  const prices = [...plans.map((p) => p.price)].sort((a, b) => a - b);
  const minPrice = prices[0];
  const maxPrice = prices.at(-1) as number;
  const middle = Math.floor((prices.length - 1) / 2);
  const medianPrice =
    prices.length % 2 === 0
      ? Math.round((prices[middle] + prices[middle + 1]) / 2)
      : prices[middle];
  const priceQuestion = `How much do ${brand} plans cost in Pakistan?`;
  // First sentence is the extractable answer: a direct number, then the range.
  const priceAnswer = (
    <>
      A typical listed {brand} quote is {money(medianPrice)}, across{' '}
      {plans.length} variants priced from {money(minPrice)} to{' '}
      {money(maxPrice)}.{' '}
      <PriceSource brand={plans[0]?.brand || brand} brandSlug={slug} /> These
      are seller quotes for different packages, not one standard vendor price.
      A low figure usually means a shorter duration or a smaller allowance;
      confirm your product ID and current amount before paying.
    </>
  );
  const byline = (
    <p className="guide-byline">
      By{' '}
      <Link href={authorPath} prefetch={false}>
        {author.name}
      </Link>
      , {author.role.toLowerCase()}. Reviewed{' '}
      <time dateTime={checked}>{checked}</time>.
    </p>
  );

  const durationQuestion =
    durations.length > 0 ? `What durations are listed for ${brand} plans?` : null;
  const durationAnswer =
    durations.length > 0
      ? `Duration labels in this catalog include ${durations.slice(0, 5).join(', ')}${durations.length > 5 ? ' and other variants' : ''}. These labels describe the listings, not independently verified vendor entitlements.`
      : null;

  const confirmQuestion = `What should I confirm before paying for ${brand} plans?`;
  const confirmAnswer =
    'Check the exact product ID, duration, access method, listed warranty and the current PKR amount before paying. Confirm whether the offer is still pending review or verified, and ask for the delivery method in writing. Never share passwords, recovery keys, browser cookies or two-factor codes.';

  const orderQuestion = `How do I enquire about ${brand} plans?`;
  const orderAnswer =
    'Open View Details for the exact plan, then use Buy Now to open WhatsApp with its product ID, duration, listed warranty and PKR quote. Ask the seller to confirm eligibility, access, final payment amount and delivery terms in writing. No account or payment details are collected on this website.';

  // Definition pair: the two terms buyers ask about most, phrased so an answer
  // engine can lift one sentence without the surrounding page.
  const definitionQuestion = 'What is a shared slot, and what is seller warranty?';
  const definitionAnswer =
    'A shared slot is one seat on a plan the seller administers, so other people hold the same subscription; your access can end if the seller removes you. Seller warranty is a promise the seller makes, not the software vendor’s warranty. It covers a stated period and remedy only, and it does not make the offer an official vendor subscription.';

  const romanUrduQuestion = `${brand} ka plan Pakistan mein kitne ka hai?`;
  const romanUrduPrice = `Is collection mein ${brand} ke ${plans.length} plans listed hain. Typical quote ${money(medianPrice)} hai, aur range ${money(minPrice)} se ${money(maxPrice)} tak hai. Har plan ki duration, access aur warranty alag hoti hai, is liye sirf sab se kam price dekh kar decide na karein.`;

  const warrantyQuestion = 'Does full seller warranty mean official vendor warranty?';
  const warrantyAnswer =
    'No. An explicit AiToolsPk seller warranty is separate from the software company’s own terms. Check the actual coverage period, exclusions, start date and agreed remedy. A source label on a pending offer does not establish verified coverage or unlimited service.';

  const disclaimer = (
    <p>
      AiToolsPk is independent. A product logo, source warranty label or stock
      status does not establish vendor authorization.{' '}
      <Link href="/terms/#seller-warranty" prefetch={false}>
        Read warranty terms
      </Link>{' '}
      and the{' '}
      <Link href="/refund-policy/" prefetch={false}>
        refund policy
      </Link>
      . The WhatsApp enquiry includes the selected ID and terms; no order forms
      until the seller and buyer agree in writing.
    </p>
  );

  if (!guide) {
    return (
      <section
        className="collection-buying-guide document"
        aria-label={`${slug} buying guide`}
      >
        <h2>{priceQuestion}</h2>
        <p>{priceAnswer}</p>
        {byline}
        {durationQuestion && durationAnswer && (
          <>
            <h2>{durationQuestion}</h2>
            <p>{durationAnswer}</p>
          </>
        )}
        <h2>{confirmQuestion}</h2>
        <p>{confirmAnswer}</p>
        <h2>{definitionQuestion}</h2>
        <p>{definitionAnswer}</p>
        <h2>{orderQuestion}</h2>
        <p>{orderAnswer}</p>
        <h2>{warrantyQuestion}</h2>
        <p>{warrantyAnswer}</p>
        <h2 lang="ur-Latn">{romanUrduQuestion}</h2>
        <p lang="ur-Latn">{romanUrduPrice}</p>
        <h2 lang="ur-Latn">
          {brand} ka plan lene se pehle kya confirm karna chahiye?
        </h2>
        <p lang="ur-Latn">
          Exact plan ka product ID, muddat, PKR price, access ka tareeqa aur
          warranty likhwa kar confirm karein. Sirf brand name ya Available label
          se tamam features confirm nahi hote. Password, OTP ya recovery code
          share na karein.
        </p>
        {disclaimer}
        <p className="policy-date">
          Vendor context checked <time dateTime={checked}>{checked}</time>.
          These sources explain the tools; supplied-package entitlements still
          require verification.
        </p>
      </section>
    );
  }

  return (
    <section
      className="collection-buying-guide document"
      aria-label={`${slug} buying guide`}
    >
      <h2>{priceQuestion}</h2>
      <p>{priceAnswer}</p>
      {byline}
      <h2>{guide.heading}</h2>
      <p>{guide.intro}</p>
      {durationAnswer && <p>{durationAnswer}</p>}
      <h3>Before choosing a plan</h3>
      <ul>
        {guide.choose.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {guide.questions.map((item) => (
        <div key={item.question}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}
      <h3>{definitionQuestion}</h3>
      <p>{definitionAnswer}</p>
      <h3>{orderQuestion}</h3>
      <p>{orderAnswer}</p>
      <h3>{warrantyQuestion}</h3>
      <p>{warrantyAnswer}</p>
      <h3 lang="ur-Latn">{romanUrduQuestion}</h3>
      <p lang="ur-Latn">{romanUrduPrice}</p>
      <h3 lang="ur-Latn">
        {brand} ka plan lene se pehle kya confirm karna chahiye?
      </h3>
      <p lang="ur-Latn">
        Exact plan ka product ID, muddat, PKR price, access ka tareeqa aur
        warranty likhwa kar confirm karein. Sirf brand name ya Available label
        se tamam features confirm nahi hote. Password, OTP ya recovery code
        share na karein.
      </p>
      {disclaimer}
      <div className="guide-links">
        {guide.related.map((link) => (
          <Link key={link.href} href={link.href} prefetch={false}>
            {link.label} →
          </Link>
        ))}
      </div>
      <p className="policy-date">
        Vendor context checked <time dateTime={checked}>{checked}</time>. These
        sources explain the tools; supplied-package entitlements still require
        verification.
      </p>
      <div className="guide-links">
        {guide.sources.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
