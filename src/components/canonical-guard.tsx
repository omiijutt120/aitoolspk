'use client';

import { useEffect } from 'react';

/**
 * Keeps exactly one canonical URL in the document head after a client-side
 * navigation.
 *
 * Every exported page ships its own `<link rel="canonical">` in the static HTML.
 * When Next.js moves between two of those pages on the client it appends the
 * new route's canonical but leaves the server-rendered one in place, because
 * that node belongs to the HTML itself and not to the React tree. Two
 * canonicals make the preferred URL ambiguous for a crawler, so the stale one
 * is dropped as soon as the head changes.
 *
 * The rule only fires when more than one canonical is present, and it keeps the
 * link whose path matches the current document. A page that deliberately
 * canonicalises to a different URL still has a single link, so it is untouched.
 */
export function CanonicalGuard() {
  useEffect(() => {
    const prune = () => {
      const links = Array.from(
        document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')
      );
      if (links.length < 2) return;
      const here = window.location.pathname;
      const matches = links.filter((link) => {
        try {
          return new URL(link.href, window.location.href).pathname === here;
        } catch {
          return false;
        }
      });
      const keep = matches.at(-1) ?? links.at(-1);
      for (const link of links) {
        if (link !== keep) link.remove();
      }
    };

    prune();
    const observer = new MutationObserver(prune);
    observer.observe(document.head, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
