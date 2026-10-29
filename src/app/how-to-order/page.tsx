import Link from 'next/link';
import { Document } from '@/components/document';
import { Steps } from '@/components/steps';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'How to order',
  'Learn how to compare exact plans and order approved, in-stock digital tools on WhatsApp. No signup, cart or payment collection on the website.',
  '/how-to-order/'
);
export default function HowToOrder() {
  return (
    <Document
      path="/how-to-order/"
      eyebrow="A SIMPLE WAY TO ORDER"
      title="Clarity before commitment."
      lead="Find an exact offer, understand its terms, and confirm your order with a person on WhatsApp."
    >
      <Steps />
      <h2 id="before-you-order">Your before-you-order checklist</h2>
      <ul>
        <li>
          Check the product ID, exact edition, duration and any credits or usage
          limits.
        </li>
        <li>
          Confirm whether access is private, shared, a workspace invitation or a
          license. Confirm eligibility in your country.
        </li>
        <li>
          Ask for written warranty coverage, exclusions, start date and what
          remedy applies.
        </li>
        <li>
          Confirm the final PKR price, current stock, safe delivery method,
          delivery timing and renewal terms.
        </li>
        <li>
          Read the refund policy before payment. Do not assume an activated plan
          can be refunded.
        </li>
      </ul>
      <h2>1. Find the right plan</h2>
      <p>
        Use search and filters to compare duration, access type and warranty.
        Different plans have separate product IDs. A low price does not mean the
        access method or resale eligibility has been approved.
      </p>
      <h2>2. Open WhatsApp</h2>
      <p>
        Buy Now opens +92 371 4549245 in a new tab with the selected product,
        plan, warranty, price and public ID. Review the message before sending
        it. WhatsApp may ask you to open its app or sign in to WhatsApp Web.
        Unverified or stale offers ask for availability and eligibility
        confirmation first. Out-of-stock offers show Restock and open a restock
        enquiry.
      </p>
      <h2>3. Confirm, then decide</h2>
      <p>
        Discuss availability and exact terms with the seller before paying.
        Payment arrangements happen directly in WhatsApp; this website does not
        take payments or record completed orders. An enquiry is not a purchase
        or reservation.
      </p>
      <h2>When an offer is unavailable</h2>
      <p>
        Out-of-stock offers cannot be purchased. Pending or custom listings
        require licensing, safe delivery and stock checks. Use the enquiry link
        to ask a question. No waiting time or future availability is promised.
      </p>
      <h2>Keep your account safe</h2>
      <p>
        Never share passwords, recovery keys, browser cookies, security codes or
        two-factor authentication secrets. Use a verified invitation, authorized
        license or another safe delivery method. If an offer requires
        credentials or unapproved access, do not proceed.
      </p>
      <h2>Need a hand?</h2>
      <p>
        <Link href="/contact/">Contact AiToolsPk</Link> with the product ID. You
        can also read the <Link href="/faq/">FAQs</Link> and{' '}
        <Link href="/refund-policy/">refund policy</Link>.
      </p>
    </Document>
  );
}
