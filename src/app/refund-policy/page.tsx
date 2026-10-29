import { Document } from '@/components/document';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'Refund & resolution policy',
  'Read how AiToolsPk handles undelivered orders, activated digital plans, warranty issues, cancellations and refund requests.',
  '/refund-policy/'
);
export default function Refund() {
  return (
    <Document
      path="/refund-policy/"
      policy
      eyebrow="CLEAR TERMS BEFORE PAYMENT"
      title="Refund & resolution policy"
      lead="Digital products differ. Confirm the exact plan, safe delivery method and written resolution terms before you pay."
    >
      <h2>Orders that cannot be delivered</h2>
      <p>
        If the seller accepts an order but cannot deliver the agreed product,
        you may cancel that undelivered order and receive a full refund of the
        amount paid for it. You do not have to accept a substitute. If part of
        an order was separately priced and delivered, the refund applies to the
        undelivered part.
      </p>
      <h2>Before activation or delivery</h2>
      <p>
        Ask to cancel in the original WhatsApp conversation as soon as possible.
        If fulfilment has not started and no non-reversible digital entitlement
        has been issued, the seller will cancel and refund the order. The seller
        must explain before payment if a particular delivery step makes a
        cancellation non-reversible.
      </p>
      <h2>Activated subscriptions, invitations and license keys</h2>
      <p>
        A change-of-mind refund is not promised after a correct license has been
        issued, an invitation redeemed or a subscription activated. Before
        payment, confirm compatibility, regional requirements, plan duration and
        access type. This does not remove a remedy for a product that was not
        delivered as agreed, an invalid key or any rights that apply under law.
      </p>
      <h2>Incorrect or non-working delivery</h2>
      <p>
        Contact us in the original conversation with the product ID, the agreed
        terms, when the issue started and a screenshot with sensitive
        information removed. Do not send passwords, recovery information or
        security codes. We will compare the issue with the accepted order and
        attempt a safe correction. If the agreed product cannot be supplied, a
        refund or another remedy appropriate to the undelivered or defective
        portion will be discussed.
      </p>
      <h2>Warranty claims</h2>
      <p>
        Warranty remedies apply only within the written coverage agreed for that
        exact order. A source catalog label is not evidence of an accepted
        warranty. Confirm coverage, exclusions, duration, start date and whether
        the remedy is repair, replacement or refund before payment. No universal
        full-duration replacement guarantee is made.
      </p>
      <h2>Requesting a refund</h2>
      <p>
        Message +92 371 4549245 in the original WhatsApp thread. Include the
        public product ID, order reference, payment date, amount and the reason
        for your request. Redact account numbers and other sensitive details
        from payment evidence. We do not ask for passwords, full card numbers or
        security codes.
      </p>
      <h2>Refund method and timing</h2>
      <p>
        Approved refunds use the original payment route where possible, or
        another method you agree to. The seller will confirm the amount and
        expected processing time in writing. Banking or payment-provider
        processing can vary; this website does not promise an unverified
        turnaround time. Do not make another payment to “unlock” a refund.
      </p>
      <h2>Disagreements and statutory rights</h2>
      <p>
        Contact AiToolsPk first so the agreed order terms can be reviewed. This
        policy does not limit rights or remedies that cannot legally be
        excluded.
      </p>
    </Document>
  );
}
