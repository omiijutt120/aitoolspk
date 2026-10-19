export const faqs = [
  [
    'How do I place an order?',
    'Choose an exact plan and read its duration, access and warranty terms. Buy Now opens WhatsApp with the selected product, plan, warranty, PKR price and ID. For unverified or stale offers, the message asks for confirmation first. The seller confirms availability and exact terms before you decide to pay.',
  ],
  [
    'What happens when a plan is unverified or out of stock?',
    'The WhatsApp button stays usable. Unverified or stale plans open an availability enquiry; out-of-stock plans show Restock and ask about future availability. An enquiry does not reserve a plan, confirm eligibility or create a purchase.',
  ],
  [
    'Are these official vendor subscriptions?',
    'AiToolsPk is an independent catalog and reseller contact, with no vendor partnership claimed. Eligibility and access methods vary by offer. A product logo identifies its brand; it does not imply authorization or endorsement.',
  ],
  [
    'What does the warranty cover?',
    'Warranty terms differ by offer. Source warranty labels on pending listings are unverified and do not create a guarantee. Before payment, ask for written coverage, exclusions, start date, duration and the remedy if the plan stops working.',
  ],
  [
    'Will you ask for my account password?',
    'No. Do not send passwords, recovery keys, browser cookies or two-factor authentication codes. If a plan cannot be delivered through an approved invite, license or other safe method, it must not be fulfilled.',
  ],
  [
    'Can I get a refund?',
    'If an accepted order cannot be delivered, you may cancel for a full refund of the amount paid for that undelivered order. Activated subscriptions and license keys have product-specific limits. Read the refund policy and confirm the exact terms before paying.',
  ],
];
export function FaqList({ limit = 6 }: { limit?: number }) {
  return (
    <div className="faq-list">
      {faqs.slice(0, limit).map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
