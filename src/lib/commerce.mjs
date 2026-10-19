export const PHONE = '923714549245';
export const STALE_DAYS = 7;
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
export function whatsappUrl(product, intent = 'order') {
  const message = `${intent === 'order' ? 'Hi AItoolsPK, I want to order:' : intent === 'restock' ? 'Hi AItoolsPK, please let me know about restock:' : 'Hi AItoolsPK, please confirm availability and eligibility:'}\nProduct: ${product.name}\nPlan: ${product.duration} / ${product.warranty} / ${product.access}${product.credits ? ' / ' + product.credits : ''}\nPrice: PKR ${product.price.toLocaleString('en-PK')}\nProduct ID: ${product.id}\nPage: https://aitoolspk.tech/tool/${product.slug}/\nPlease confirm availability and payment details. Please do not request passwords or security codes.`;
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}
export function money(price) {
  return `PKR ${price.toLocaleString('en-PK')}`;
}
