import Link from 'next/link';
import type { Product } from '@/lib/types';
import { collectionGuides } from '@/lib/collection-guides';
import { money } from '@/lib/commerce.mjs';
import { author, authorPath } from '@/lib/author';
import { displayName } from '@/lib/product-name';
import { collectionFacts } from '@/lib/collection-facts';
import { PriceSource } from './price-source';

const DEFAULT_CHECKED = '2026-10-23';

/** "listed as 1 month" / "with no stated term" — never "a not specified term". */
const durationPhrase = (duration: string) => {
  const text = (duration ?? '').trim();
  if (!text || /not specified/i.test(text)) return 'with no stated term';
  return `listed as ${text.toLowerCase()}`;
};

/**
 * Provenance for a figure.
 *
 * A price in a sentence is only checkable if the reader can reach the record
 * that holds it, so the listing name is the link and the capture date sits
 * beside the amount. The linked page is the seller record itself - not an
 * endorsement, and deliberately not indexable.
 */
function ListingRef({ plan, brand }: { plan: Product; brand: string }) {
  return (
    <Link href={`/tool/${plan.slug}/`} prefetch={false}>
      {displayName(plan.name, plan.warranty, brand)}
    </Link>
  );
}

/**
 * Buying guide for a plan collection.
 *
 * Every collection gets one, including the 70+ brands with no hand-written
 * guide. Headings are phrased as the questions buyers actually ask, because
 * both readers and answer engines extract a heading→paragraph pair far more
 * reliably than a wall of prose.
 *
 * The generic explanations (what a shared slot is, what seller warranty covers,
 * how an enquiry works) live once in /guides/ and are linked from here. They
 * used to be repeated verbatim on all 108 collection pages, which made the
 * majority of each page identical to every other page and gave a crawler no
 * reason to treat them as separate documents. The paragraph space they occupied
 * is now filled with figures derived from this collection's own rows.
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
  // plans.length is checked above, so the facts object always exists here.
  const facts = collectionFacts(plans)!;

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
      {plans.length} variants priced from {money(minPrice)} to {money(maxPrice)}
      . <PriceSource brand={plans[0]?.brand || brand} brandSlug={slug} /> These
      are seller quotes for different packages, not one standard vendor price. A
      low figure usually means a shorter duration or a smaller allowance;
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
  const definitionQuestion =
    'What is a shared slot, and what is seller warranty?';
  const definitionAnswer =
    'A shared slot is one seat on a plan the seller administers, so other people hold the same subscription; your access can end if the seller removes you. Seller warranty is a promise the seller makes, not the software vendor’s warranty. It covers a stated period and remedy only, and it does not make the offer an official vendor subscription.';

  const romanUrduQuestion = `${brand} ka plan Pakistan mein kitne ka hai?`;
  const romanUrduPrice = `Is collection mein ${brand} ke ${plans.length} plans listed hain. Typical quote ${money(medianPrice)} hai, aur range ${money(minPrice)} se ${money(maxPrice)} tak hai. Duration, access aur warranty har product ID ke liye confirm karein. Sirf sab se kam price dekh kar decide na karein.`;

  const warrantyQuestion =
    'Does full seller warranty mean official vendor warranty?';
  const warrantyAnswer =
    'No. An explicit AiToolsPk seller warranty is separate from the software company’s own terms. Check the actual coverage period, exclusions, start date and agreed remedy. A source label on a pending offer does not establish verified coverage or unlimited service.';

  const disclaimers = (
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

  /* Figures that are true only for this collection. Every clause is skipped
     when the rows cannot support it, so nothing is asserted from thin data. */
  const nameOf = (plan: Product) =>
    displayName(plan.name, plan.warranty, brand);
  /* A listing name usually repeats its own term ("Grok Super 6-7 days"). Adding
     "listed as 6–7 days" after it reads like a machine wrote it, so the phrase
     is only appended when the name does not already carry a unit. */
  const statesTerm = (name: string) =>
    /\b(?:hours?|days?|weeks?|months?|years?)\b/i.test(name);
  /*
   * `quoted` is a render helper rather than a component: it returns a text
   * fragment plus a <time>, so it stays a plain function on purpose.
   */
  const quoted = (plan: Product) => (
    <>
      quoted <time dateTime={plan.date}>{plan.date}</time>
    </>
  );
  const listingSentence = (label: string, plan: Product) => {
    const name = nameOf(plan);
    return (
      <>
        {label} {money(plan.price)} for <ListingRef plan={plan} brand={brand} />
        {statesTerm(name) ? '' : `, ${durationPhrase(plan.duration)}`},{' '}
        {quoted(plan)}.
      </>
    );
  };

  const openField = facts.count - facts.warrantyStated - facts.warrantyNone;
  const durationSentence =
    `${facts.stated} of ${facts.count} rows state a term` +
    (facts.unstated > 0
      ? `, and ${facts.unstated} ${
          facts.unstated === 1 ? 'does' : 'do'
        } not, so ${facts.unstated === 1 ? 'its' : 'their'} price cannot be read as a monthly rate.`
      : '.') +
    (facts.shortest &&
    facts.longest &&
    facts.stated > 1 &&
    facts.shortest.plan.duration !== facts.longest.plan.duration
      ? ` Stated terms run from ${facts.shortest.plan.duration.toLowerCase()} to ${facts.longest.plan.duration.toLowerCase()}.`
      : '');
  const warrantySentence =
    [
      `${facts.warrantyStated} of ${facts.count} rows carry a seller warranty label`,
      facts.warrantyNone > 0
        ? `${facts.warrantyNone} ${
            facts.warrantyNone === 1 ? 'states' : 'state'
          } none`
        : null,
      openField > 0
        ? `${openField} ${openField === 1 ? 'has' : 'have'} no specified warranty label`
        : null,
    ]
      .filter(Boolean)
      .join(', ') + '.';
  const monthlySaving =
    facts.monthly?.perMonth && facts.yearly?.perMonth
      ? Math.round((1 - facts.yearly.perMonth / facts.monthly.perMonth) * 100)
      : 0;

  const dataFacts = (
    <>
      <h2>Which {brand} listing is cheapest, and which is dearest?</h2>
      <p>
        {listingSentence(
          'The lowest quote in this collection is',
          facts.cheapest.plan
        )}{' '}
        {facts.count > 1 && (
          <>{listingSentence('The highest is', facts.dearest.plan)} </>
        )}
        A shared brand label does not establish identical or different
        entitlements. Compare the stated terms for each product ID.{' '}
        <PriceSource brand={plans[0]?.brand || brand} brandSlug={slug} />
      </p>

      <h2>How many {brand} listings state a duration?</h2>
      <p>
        {durationSentence} A label describes the listing, not an independently
        verified vendor entitlement, so ask for the exact start and end dates
        before paying.
      </p>

      {facts.monthly && facts.yearly && (
        <>
          <h2>What does a month of {brand} cost here?</h2>
          <p>
            The cheapest one-month row is{' '}
            <ListingRef plan={facts.monthly.plan} brand={brand} /> at{' '}
            {money(facts.monthly.plan.price)}, {quoted(facts.monthly.plan)},
            about {money(facts.monthly.perMonth as number)} per 30 days. The
            cheapest twelve-month row is{' '}
            <ListingRef plan={facts.yearly.plan} brand={brand} /> at{' '}
            {money(facts.yearly.plan.price)}, {quoted(facts.yearly.plan)}, about{' '}
            {money(facts.yearly.perMonth as number)} per 30 days.
            {monthlySaving > 0 &&
              ` That is roughly ${monthlySaving}% less per 30 days; most of that gap comes from the term length rather than from a better package.`}{' '}
            When the monthly equivalent is close, the shorter term is usually
            the safer first purchase.
          </p>
        </>
      )}

      {facts.count > 0 && (
        <>
          <h2>What warranty labels do {brand} listings carry?</h2>
          <p>
            {warrantySentence} A label alone does not establish a coverage period
            or verified remedy. These are seller labels, not the software
            company’s warranty; confirm coverage, exclusions, start date and
            remedy for the exact product ID.
          </p>
        </>
      )}

      <p className="policy-date">
        Every figure above is counted from the {facts.count} listed rows on this
        page. Each named amount links to the record that carries its product ID
        and quote date. The same numbers, with the date of the cheapest quote,
        sit in the{' '}
        <Link href={`/price-index/#tool-${slug}`} prefetch={false}>
          {brand} row of the price index
        </Link>
        , and the{' '}
        <Link href="/editorial-policy/" prefetch={false}>
          editorial policy
        </Link>{' '}
        explains what is verified before a listing appears.
      </p>
    </>
  );

  /* The one shared paragraph the collection pages keep. Everything longer than
     this belongs on a guide page where it can be maintained once. */
  const checkBeforePaying = (
    <>
      <h2>{confirmQuestion}</h2>
      <p>
        {confirmAnswer} The <Link href="/guides/">buying guides</Link> explain{' '}
        <Link href="/guides/private-shared-workspace-access/" prefetch={false}>
          shared versus private access
        </Link>
        ,{' '}
        <Link
          href="/guides/understanding-credits-and-plan-duration/"
          prefetch={false}
        >
          credits and plan duration
        </Link>{' '}
        and{' '}
        <Link
          href="/guides/seller-warranty-vs-vendor-warranty/"
          prefetch={false}
        >
          what a seller warranty covers
        </Link>
        .
      </p>
    </>
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
        {dataFacts}
        {checkBeforePaying}
        <h2>{orderQuestion}</h2>
        <p>{orderAnswer}</p>
        <h2 lang="ur-Latn">{romanUrduQuestion}</h2>
        <p lang="ur-Latn">{romanUrduPrice}</p>
        {disclaimers}
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
      {dataFacts}
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
      {disclaimers}
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
