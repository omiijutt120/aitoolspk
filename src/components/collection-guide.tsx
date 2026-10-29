import Link from 'next/link';
import type { Product } from '@/lib/types';
import { collectionGuides } from '@/lib/collection-guides';
import { money } from '@/lib/commerce.mjs';

export function CollectionGuide({
  slug,
  plans,
}: {
  slug: string;
  plans: Product[];
}) {
  const guide = collectionGuides[slug];
  if (!guide) return null;
  const durations = [...new Set(plans.map((p) => p.duration))].filter(
    (v) => v !== 'Not specified'
  );
  const brand = slug === 'api' ? 'API' : plans[0]?.brand || slug;
  const checked = guide.checked || '2026-10-23';
  return (
    <section
      className="collection-buying-guide document"
      aria-label={`${slug} buying guide`}
    >
      <h2>How much do {brand} plans cost in Pakistan?</h2>
      <p>
        This collection lists {plans.length} exact offer variants priced from{' '}
        {money(Math.min(...plans.map((p) => p.price)))} to{' '}
        {money(Math.max(...plans.map((p) => p.price)))}. These are seller-listed
        quotes for different packages, not one standard monthly vendor price.
        Confirm your selected product ID, duration, current amount and delivery
        terms before paying.
      </p>
      <h2>{guide.heading}</h2>
      <p>{guide.intro}</p>
      {durations.length > 0 && (
        <p>
          Duration labels in this catalog include{' '}
          {durations.slice(0, 5).join(', ')}
          {durations.length > 5 ? ' and other variants' : ''}. These labels
          describe the listings, not independently verified vendor entitlements.
        </p>
      )}
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
      <h3>How do I enquire about a {brand} plan?</h3>
      <p>
        Open View Details for the exact plan, then use Buy Now to open WhatsApp
        with its product ID, duration, listed warranty and PKR quote. Ask the
        seller to confirm eligibility, access, final payment amount and delivery
        terms in writing. No account or payment details are collected on this
        website.
      </p>
      <h3>Does full seller warranty mean official vendor warranty?</h3>
      <p>
        No. An explicit AiToolsPk seller warranty is separate from the software
        company’s own terms. Check the actual coverage period, exclusions, start
        date and agreed remedy. A source label on a pending offer does not
        establish verified coverage or unlimited service.
      </p>
      <h3 lang="ur-Latn">
        {brand} ka plan lene se pehle kya confirm karna chahiye?
      </h3>
      <p lang="ur-Latn">
        Exact plan ka product ID, muddat, PKR price, access ka tareeqa aur
        warranty likhwa kar confirm karein. Sirf brand name ya Available label
        se tamam features confirm nahi hote. Password, OTP ya recovery code
        share na karein.
      </p>
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
        . The WhatsApp enquiry includes the selected ID and terms; no order
        forms until the seller and buyer agree in writing.
      </p>
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
