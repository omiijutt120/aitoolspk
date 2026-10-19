import { Document } from '@/components/document';
import { FaqList, faqs } from '@/components/faq';
import { metadata as makeMetadata, JsonLd } from '@/lib/seo';
export const metadata = makeMetadata(
  'Frequently asked questions',
  'Answers about PKR pricing, WhatsApp orders, product approval, warranty terms, account safety and refunds at AiToolsPk.',
  '/faq/'
);
export default function Faq() {
  return (
    <Document
      eyebrow="GOOD QUESTIONS. CLEAR ANSWERS."
      title="The details, explained."
      lead="Read these answers before placing an order. Exact product terms always matter."
    >
      <FaqList />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(([name, text]) => ({
            '@type': 'Question',
            name,
            acceptedAnswer: { '@type': 'Answer', text },
          })),
        }}
      />
    </Document>
  );
}
