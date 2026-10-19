'use client';
import { useEffect } from 'react';
// Local integration hook only. No collector, cookies, query text or message text.
export function EventBridge() {
  useEffect(() => {
    const listen = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>('[data-catalog-event]')
          : null;
      const name = target?.dataset.catalogEvent;
      if (
        !name ||
        !['product_open', 'whatsapp_click', 'out_of_stock_interest'].includes(
          name
        )
      )
        return;
      const id = target?.dataset.productId;
      window.dispatchEvent(
        new CustomEvent('aitoolspk:analytics', {
          detail: {
            name,
            ...(id && /^PK-[A-F0-9]{12}$/.test(id) ? { productId: id } : {}),
          },
        })
      );
    };
    document.addEventListener('click', listen);
    return () => document.removeEventListener('click', listen);
  }, []);
  return null;
}
