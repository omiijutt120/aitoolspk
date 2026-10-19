import { ArrowUpRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Document } from '@/components/document';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'Contact AiToolsPk',
  'Contact AiToolsPk on WhatsApp at +92 371 4549245 for plan questions, current availability, order support or refund requests.',
  '/contact/'
);
export default function Contact() {
  return (
    <Document
      eyebrow="A PERSON ON THE OTHER SIDE"
      title="Let’s find your fit."
      lead="Ask about a plan, check availability or get help with an existing order."
    >
      <div className="contact-card">
        <MessageCircle size={28} />
        <h2 className="!m-0">AiToolsPk · Pakistan</h2>
        <p>
          WhatsApp: +92 371 4549245
          <br />
          Website: AiToolsPk.tech
        </p>
        <a
          className="button"
          href="https://wa.me/923714549245?text=Hi%20AiToolsPk%2C%20I%20have%20a%20question%20about%20a%20digital%20tool."
          target="_blank"
          rel="noopener noreferrer"
        >
          Message us on WhatsApp <ArrowUpRight size={16} />
        </a>
        <p>
          Include the product ID and your question. For order support, include
          the order reference from your conversation. Do not send passwords,
          payment card details, recovery keys or security codes.
        </p>
      </div>
      <h2>Before you send a message</h2>
      <p>
        AiToolsPk is an independent catalog and seller contact. We do not claim
        official vendor partnerships. Availability, licensing and plan terms
        must be confirmed before an order is accepted. We do not publish
        guaranteed support hours or response times.
      </p>
      <h2>Support & refunds</h2>
      <p>
        For a delivery or access issue, reply in your original WhatsApp order
        conversation so the agreed terms can be checked. Read the{' '}
        <Link href="/refund-policy/">refund policy</Link> for what to include in
        a request. For privacy requests, use the same WhatsApp number with the
        subject “Privacy request”.
      </p>
    </Document>
  );
}
