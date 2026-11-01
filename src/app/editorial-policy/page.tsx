import Link from 'next/link';
import { Document } from '@/components/document';
import { JsonLd, metadata as makeMetadata, origin } from '@/lib/seo';

export const metadata = makeMetadata(
  'How we compare plans — editorial policy',
  'Read AiToolsPk’s approach to vendor sources, exact plan comparisons, dated PKR quotes, seller warranties, corrections and independent editorial guidance.',
  '/editorial-policy/'
);
export default function EditorialPolicy() {
  return (
    <>
      <Document
        path="/editorial-policy/"
        eyebrow="SOURCES, SCOPE AND CORRECTIONS"
        title="How we compare plans"
        lead="A useful comparison separates a tool’s documented capabilities from the specific package a seller can supply."
      >
        <p className="policy-date">
          Reviewed <time dateTime="2026-10-24">24 October 2026</time> ·
          AiToolsPk
        </p>
        <h2>Which information comes from which source?</h2>
        <p>
          Official vendor documentation explains the service, plan structure or
          licensing questions a buyer should investigate. Seller-supplied
          listings establish the displayed package and PKR quote. A vendor
          feature is not automatically included in every seller listing. Sources
          and review dates appear with our buying guidance.
        </p>
        <h2>How are prices and different variants handled?</h2>
        <p>
          Compare the same duration, access method and usage allowance. We
          retain distinct variants and apply explicit owner-confirmed
          corrections when offers change. Quotes have their own confirmation
          dates and require reconfirmation after seven days. A page’s editorial
          review date does not mean every price on that page was refreshed that
          day.
        </p>
        <h2>What do missing or unverified terms mean?</h2>
        <p>
          Unknown access methods, source warranty labels and eligibility
          questions must be resolved before an order is accepted. We do not
          invent delivery methods or convert a listed label into a vendor
          warranty. An explicit AiToolsPk seller warranty is separate from any
          original software-company warranty and remains subject to the written
          order terms.
        </p>
        <h2>Are these independent product tests?</h2>
        <p>
          These are practical catalog comparisons and buying guides. We do not
          claim to have benchmarked every tool or independently verified every
          offer. AI assistance can support research and drafting; factual
          guidance should be checked against the linked sources. No unsupported
          customer totals, testimonials, rankings, savings percentages or vendor
          endorsements are presented as evidence.
        </p>
        <h2>How can you report a correction?</h2>
        <p>
          Send the page URL, product ID, disputed detail and a supporting source
          through our <Link href="/contact/">published WhatsApp contact</Link>.
          Do not include credentials or private account records. A correction
          should identify the exact package; a change to one variant does not
          automatically change all plans from that brand.
        </p>
        <div className="guide-links">
          <Link href="/about/">About AiToolsPk</Link>
          <Link href="/terms/#seller-warranty">Seller warranty terms</Link>
          <Link href="/refund-policy/">Refund policy</Link>
        </div>
      </Document>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${origin}/editorial-policy/#page`,
          url: `${origin}/editorial-policy/`,
          name: 'How we compare plans',
          about: { '@id': `${origin}/#organization` },
          isPartOf: { '@id': `${origin}/#website` },
          dateModified: '2026-10-24',
          inLanguage: 'en-PK',
        }}
      />
    </>
  );
}
