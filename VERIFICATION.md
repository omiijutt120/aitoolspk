# Storefront verification — 2026-10-20

The larger storefront redesign passed lint, TypeScript checking, a production build and all 23 Playwright tests in local Chrome. The 9 catalog/commerce tests from the parent-collection revision remain applicable; their inputs and commerce rules are unchanged.

The visual system now uses larger type, a three-column featured grid on desktop, larger official brand logos, brand display panels, prominent Explore plans actions, readable individual plan cards and a more spacious navigation/footer. The homepage also includes category navigation, an API showcase, ordering steps and native FAQ accordions. The existing collection structure and all original prices and variant terms remain intact.

A separate phone touch check verified both hero anchors (headings remain visible below the sticky header), FAQ expansion, the API showcase link and category navigation. Screenshots of the current design are `reports/premium-*.png`. The Browse tools navigation link disables prefetch so opening the homepage does not eagerly request the full catalog route.

- All 811 exact-price plan records belong to exactly one of 104 parent collections. No record or variant was merged or discarded.
- Homepage: 23 distinct featured parent cards, ordered from the owner's selections, with full counts, calculated starting prices and official logos where available. No full-catalog request or search engine loads on the homepage.
- ChatGPT: all 52 non-API variants across pagination, with exact titles and PKR prices. Every detail link returned HTTP 200; every WhatsApp message included the correct product, plan, warranty, access, price and public ID.
- APIs: all 122 API offers in one collection, including APIGPT/ZAPI offers. No API offer appears in a subscription parent. API collection is last in default order and has a direct catalog shortcut.
- Search, fuzzy matching, categories, brand/price filters, sorting, query persistence and pagination work with grouped results. Applied filters survive opening a collection, and reset remains scoped to that collection.
- Mobile navigation points to the full tools directory. Parent-card navigation, the filter drawer and a restock popup were verified using phone touch emulation. Native parent and Buy Now links also work with JavaScript disabled.
- Responsive layouts: homepage, directory and ChatGPT plans at 320, 375, 390, 600, 768, 820, 1024, 1280 and 1440px. No horizontal overflow was observed. Buy Now retains its black primary styling and minimum 48px height; detail targets retain usable size.
- No console errors in the home → collection → detail flow or the separate homepage/catalog/ChatGPT/API screenshot pass. Automated WCAG AA checks passed on the homepage, directory, both sampled collections, privacy policy and product details.
- Approval, stock, quote-expiry and confidential-field protections remain covered by the data/commerce tests. Pending, unconfirmed or expired quotes open confirmation enquiries; out-of-stock plans open restock enquiries. Only eligible, approved, fresh in-stock plans use order intent.

Screenshots are in ignored `reports/collections-*-desktop.png`, `reports/collections-home-mobile.png` and `reports/home-*.png`. Browser tests use real local Chrome with emulated screen sizes, not physical devices or Safari. Automated accessibility checks do not replace screen-reader testing.

## Earlier performance baseline

Before the parent-collection change, Lighthouse 13.5.0 measured the previous production export on simulated mobile: homepage performance 98, accessibility/best practices/SEO 100, LCP 2.3s, TBT 30ms, CLS 0 and 238 KiB transferred. The previous full catalog scored 95 performance, LCP 2.9s, TBT 40ms and CLS 0.

Those measurements are historical, not a new performance claim for this revision. System fonts, generated small local WebP thumbnails, static exports, low-priority catalog loading and server-rendered pending purchase links remain in use. The homepage now renders parent cards; collection pages paginate 24 plans at a time.

The purchased aitoolspk.tech domain is not configured by this change. Sites hosting is a separate owner-private deployment; local preview does not require that hosting login.
