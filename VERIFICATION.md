# Storefront verification - 2026-10-19

The local static production export passed lint, TypeScript checking, 8 catalog/commerce tests and 22 Playwright tests in Chrome.

- Homepage: exactly 24 offers, the owner's 19 IDs first with their original PKR prices, no API offers, no full-catalog request, and 24 authentic product logos.
- Catalog: all 811 offers, API offers last in default order, working search, category/brand/advanced filters, numeric price limits, sorting and pagination.
- Navigation: both discovery buttons, focused search, logo shortcuts, header search, product details, mobile navigation and filter drawer.
- Every featured detail link returned HTTP 200. WhatsApp link destinations and exact product, plan, warranty, price and product ID were checked; opening a popup was tested with the external destination intercepted.
- Responsive layouts: 320, 375, 390, 600, 768, 820, 1024, 1280 and 1440px. A separate phone context tested touch actions at 390x844, DPR 2.
- No browser console errors in the homepage-to-detail flow. Automated WCAG AA checks passed on the homepage, full catalog, policy and product detail.
- Buy Now remains disabled for unapproved, unavailable or expired offers as required by the PRD. Functional availability/restock enquiry links are present on every card.

## Mobile performance measurement

Lighthouse 13.5.0, local production server, simulated mobile throttling:

| Metric | Result |
| --- | --- |
| Performance | 98/100 |
| Accessibility | 100/100 |
| Best practices | 100/100 |
| SEO | 100/100 |
| First contentful paint | 0.9 seconds |
| Largest contentful paint | 2.3 seconds |
| Total blocking time | 30 ms |
| Cumulative layout shift | 0 |
| Transferred page size | 234 KiB |

The earlier measurement before the final font/image optimizations was 93/100 and 345 KiB. The final page uses system fonts and small local WebP logo thumbnails; it does not load the catalog search engine on the homepage. Full Lighthouse reports and screenshots are in the ignored local reports directory.

These are browser emulation and local lab results. Physical devices, Safari and real-user network performance were not measured. The purchased aitoolspk.tech domain has not been configured by this change.
