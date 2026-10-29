import Link from 'next/link';
import { Document } from '@/components/document';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'Terms of service',
  'AiToolsPk catalog terms covering indicative PKR prices, independent seller status, eligibility, safe delivery, warranties and WhatsApp order confirmation.',
  '/terms/'
);
export default function Terms() {
  return (
    <Document
      path="/terms/"
      policy
      effectiveDate="23 October 2026"
      eyebrow="KNOW WHAT TO EXPECT"
      title="Terms of service"
      lead="These terms explain how the AiToolsPk catalog and WhatsApp enquiry process work."
    >
      <h2>Catalog and seller contact</h2>
      <p>
        AiToolsPk.tech is an independent digital tools catalog serving customers
        in Pakistan. Our contact is +92 371 4549245 on WhatsApp. Vendor names
        and logos identify products; they do not indicate a partnership,
        endorsement or reseller authorization.
      </p>
      <h2>Listings and eligibility</h2>
      <p>
        Listings describe distinct offers, rather than guaranteed entitlements
        to vendor services. Pending and custom offers require review of resale
        rights, regional eligibility, delivery methods and terms. An unverified
        listing is informational and cannot be ordered through Buy Now.
        Out-of-stock items cannot be purchased. We may correct or withdraw a
        listing if it cannot be fulfilled lawfully or safely.
      </p>
      <h2>Prices and stock</h2>
      <p>
        Prices are retail quotes in Pakistani rupees. Displayed prices and stock
        come from dated snapshots and are not live inventory. Quotes expire
        after seven days unless refreshed. The seller must confirm the exact
        product, current stock, final price, access method and applicable terms
        before you pay. There is no price guarantee until an order is accepted
        in writing.
      </p>
      <h2>Order formation and payment</h2>
      <p>
        A website click or WhatsApp enquiry does not form a completed order or
        reserve stock. An order is accepted only when the seller confirms the
        product ID, price and fulfilment terms in WhatsApp and you agree. Any
        delivery charges or other fees must be disclosed before payment. The
        website has no payment gateway, wallet, checkout or order account.
      </p>
      <h2>Access, delivery and renewal</h2>
      <p>
        The delivery method must respect vendor terms and eligibility rules. Use
        approved invitations, legitimate licenses or another verified method. Do
        not provide passwords, recovery keys, cookies or two-factor
        authentication codes. Orders requiring unsafe credential handover must
        not proceed. Delivery times, usage limits and renewal prices are
        specific to the agreed offer; the site makes no universal
        instant-delivery or renewal promise.
      </p>
      <h2>Warranty</h2>
      <p>
        Source labels such as “full warranty”, “24H warranty” or “no warranty”
        on pending entries are unverified labels and do not create a warranty
        promise. An accepted order must specify coverage, duration, start date,
        exclusions and available remedies in writing. A warranty for one offer
        does not extend to another. We do not promise lifetime or unlimited
        access without verified terms.
      </p>
      <h2 id="seller-warranty">Full-duration seller warranty</h2>
      <p>
        Offers explicitly marked “Full Duration Warranty” include AI Tools
        PK&apos;s seller-provided warranty for the purchased subscription
        duration. This warranty is provided by AI Tools PK, independently of the
        original software company. It applies to the specific package and
        included features agreed before payment, subject to these terms and the
        fair usage policy below. Confirm the activation/start date, end date,
        access method and any package-specific exclusions in WhatsApp before
        paying. This section does not convert unverified source warranty labels
        into seller warranty offers.
      </p>
      <p>
        Report an access or supplied-feature issue on WhatsApp with your product
        ID and order reference. Do not send passwords or security codes. We will
        assess the issue against your agreed package and duration. Any remedy is
        subject to the written order terms and our refund policy; this warranty
        does not add a universal replacement or refund promise, instant
        activation commitment or guarantee of uninterrupted third-party
        services.
      </p>
      <h2 id="fair-usage">Fair usage policy</h2>
      <p>
        Use subscriptions within the supplied package&apos;s agreed limits and
        the vendor&apos;s applicable terms. Do not automate abusive requests,
        bypass limits, redistribute access or assume account sharing is
        permitted. Helium 10 supports normal, practical research within the
        package limits; unlimited searches are not offered. Cerebro and Magnet
        are excluded from our Helium 10 Platinum package. Midjourney generation
        allowances, Envato downloads/AI credits/licensing and vidIQ AI
        allowances/channel eligibility must be confirmed for the actual access
        supplied. No unspecified numeric allowance or unrestricted
        commercial-use right is promised.
      </p>
      <h2>Refunds and issues</h2>
      <p>
        Read our <Link href="/refund-policy/">refund policy</Link> before
        payment. If an accepted order cannot be delivered, you may cancel for a
        full refund of the amount paid for the undelivered order. Rights that
        cannot lawfully be excluded remain unaffected by these terms.
      </p>
      <h2>Responsible use and accuracy</h2>
      <p>
        Do not use a product to violate law, third-party rights or vendor terms.
        Product capabilities and availability can change. We aim to correct
        errors when reported. No guarantee is made about search rankings,
        business results, compatibility beyond the agreed description, or
        uninterrupted third-party services.
      </p>
      <h2>Changes and contact</h2>
      <p>
        Updated terms apply to new use and new orders from their effective date.
        Changes do not rewrite terms already agreed for an accepted order.
        Contact us on WhatsApp about an error, dispute or question before
        proceeding.
      </p>
    </Document>
  );
}
