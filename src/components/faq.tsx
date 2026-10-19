export const faqs = [
  [
    'How do I place an order?',
    'Choose an exact plan and read its duration, access and warranty terms. Approved, in-stock offers have an active Buy Now button that opens WhatsApp with those details. The seller confirms the current price and availability before you decide to pay.',
  ],
  [
    'Why are some Buy Now buttons unavailable?',
    'Purchasing is enabled only after an offer’s resale eligibility, delivery method and terms are reviewed and stock is confirmed. Pending offers, stale quotes and out-of-stock listings cannot be ordered from the website. You can ask about availability without committing to an order.',
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
