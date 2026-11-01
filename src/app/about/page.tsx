import Link from 'next/link';
import { Document } from '@/components/document';
import { JsonLd, metadata as makeMetadata, origin } from '@/lib/seo';

export const metadata = makeMetadata(
  'About AiToolsPk — AI subscription comparisons in Pakistan',
  'Learn how AiToolsPk compares AI tools and digital subscriptions using listed PKR prices, exact variants, clear limitations and WhatsApp enquiries.',
  '/about/'
);

export default function About() {
  return (
    <>
      <Document
        path="/about/"
        eyebrow="KNOW THE CATALOG"
        title="About AiToolsPk"
        lead="AiToolsPk is an independent digital-tools catalog for people comparing AI subscriptions, creative software and everyday digital plans in Pakistan."
      >
        <h2>What can you compare here?</h2>
        <p>
          Our collections bring a tool’s listed plans together so you can
          compare the exact duration, PKR quote, access label, usage allowance
          and warranty. API packages have their own collection because an app
          subscription and developer API access serve different needs.
        </p>
        <p>
          A low starting price may describe a short duration, limited credit
          balance or different access arrangement. Open the exact plan before
          comparing it with a monthly or annual subscription.
        </p>
        <h2>How does an enquiry become an order?</h2>
        <p>
          Buy Now opens WhatsApp with your selected product ID, duration,
          warranty and price. Ask for the final quote, eligibility, delivery
          method and written terms before paying. An enquiry does not reserve
          access or complete a sale. This website has no customer account,
          checkout or payment collection.
        </p>
        <h2>How do we describe products honestly?</h2>
        <p>
          Vendor names and logos identify the tools being compared. They do not
          establish a partnership or authorization for a particular offer. Stock
          confirmation, commercial eligibility, quote freshness and warranty are
          separate checks. An available label does not turn an unreviewed
          package into a verified vendor entitlement.
        </p>
        <p>
          Our buying guides combine linked official documentation, the catalog’s
          public facts and our published store terms. They explain selection
          checks; they are not hands-on performance reviews or promises of
          better grades, earnings, rankings or business results.
        </p>
        <h2>Who should you contact?</h2>
        <p>
          Contact AiToolsPk on{' '}
          <a
            href="https://wa.me/923714549245"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp at +92 371 4549245
          </a>
          . For an existing order, reply in the original conversation with the
          product ID and order reference. Do not send passwords, recovery keys,
          payment-card details or security codes.
        </p>
        <div className="guide-links">
          <Link href="/editorial-policy/">
            Our comparison and correction policy
          </Link>
          <Link href="/guides/">Practical buying guides</Link>
          <Link href="/contact/">Contact and order support</Link>
        </div>
      </Document>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          '@id': `${origin}/about/#page`,
          url: `${origin}/about/`,
          name: 'About AiToolsPk',
          about: { '@id': `${origin}/#organization` },
          isPartOf: { '@id': `${origin}/#website` },
          inLanguage: 'en-PK',
        }}
      />
    </>
  );
}
