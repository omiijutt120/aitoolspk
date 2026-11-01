import { Document } from '@/components/document';
import { FaqList } from '@/components/faq';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'Frequently asked questions',
  'Answers about PKR pricing, WhatsApp orders, product approval, warranty terms, account safety and refunds at AiToolsPk.',
  '/faq/'
);
export default function Faq() {
  return (
    <Document
      path="/faq/"
      eyebrow="GOOD QUESTIONS. CLEAR ANSWERS."
      title="The details, explained."
      lead="Read these answers before placing an order. Exact product terms always matter."
    >
      <FaqList />
    </Document>
  );
}
