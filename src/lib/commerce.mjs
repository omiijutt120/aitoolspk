export const PHONE = '923714549245';
export const STALE_DAYS = 7;
const pkrFormatter = new Intl.NumberFormat('en-PK');
export function isStale(product, now = new Date()) {
  const date = Date.parse(`${product.date}T00:00:00+05:00`);
  return (
    !Number.isFinite(date) ||
    date > now.getTime() ||
    now.getTime() - date > STALE_DAYS * 86400000
  );
}
export function canBuy(product, now = new Date()) {
  return (
    product.approval === 'approved' &&
    product.stock === 'in-stock' &&
    product.purchasable &&
    !isStale(product, now)
  );
}
// The CTA always starts a conversation; readiness controls the message intent.
export function whatsappIntent(product, now = new Date()) {
  if (product.stock === 'out-of-stock') return 'restock';
  return canBuy(product, now) ? 'order' : 'confirm';
}
export function whatsappUrl(product, intent = 'order') {
  const message = `${intent === 'order' ? 'Hi AiToolsPk, I want to order:' : intent === 'restock' ? 'Hi AiToolsPk, please let me know about restock:' : 'Hi AiToolsPk, please confirm availability and eligibility:'}\nProduct: ${product.name}\nPlan: ${product.duration} / ${product.warranty} / ${product.access}${product.credits ? ' / ' + product.credits : ''}\nPrice: PKR ${pkrFormatter.format(product.price)}\nProduct ID: ${product.id}${product.sellerWarranty ? `\nDuration: ${product.duration}\nWarranty provider: AI Tools PK (seller warranty)\nPlease share setup, availability and warranty details.` : ''}\nPage: https://aitoolspk.tech/tool/${product.slug}/\nPlease confirm availability and payment details. Please do not request passwords or security codes.`;
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}
export function money(price) {
  return `PKR ${pkrFormatter.format(price)}`;
}
