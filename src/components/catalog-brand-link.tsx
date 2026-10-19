'use client';
import type { ReactNode } from 'react';
import { emitCatalogEvent } from '@/lib/events';

export function CatalogBrandLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      onClick={(event) => {
        if (
          event.button !== 0 ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        window.history.replaceState(null, '', href);
        window.dispatchEvent(new Event('catalog-query'));
        emitCatalogEvent('filter_apply');
        document
          .getElementById('all-tools')
          ?.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
              .matches
              ? 'instant'
              : 'smooth',
            block: 'start',
          });
      }}
    >
      {children}
    </a>
  );
}
