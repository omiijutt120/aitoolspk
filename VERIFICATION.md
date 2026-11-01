# Storefront verification

Latest follow-up: [30 October Search Console exports and authorized release](docs/seo/GSC_EXPORT_RECONCILIATION_2026-10-30.md). It supersedes the earlier unpublished status below; use its measured deployment result, not these historical snapshots, to determine what is live.

## Latest audit handoff — 2026-10-30

The [29 October full audit](docs/seo/FULL_AUDIT_2026-10-29.md), finalized 30 October, supersedes older counts and conclusions below. It records 947 live HTML URLs with zero fetch errors; 51 sampled assets/verification resources passing; 159 local sitemap URLs; 65 corrected duration/warranty records; 36 passing unit tests; and 56 browser cases verified across the full run and successful corrected-test retest. Final source build, lint, TypeScript, dependency and export checks passed. Mobile lab performance was 96/98/99 for homepage/collection/guide; homepage lab LCP was 2.69 seconds, so field CWV is not claimed as passed. The source batch is still local and needs explicit release authorization. Google indexing/traffic and AI citations are not verified outcomes.

## Enterprise SEO engine — 2026-10-23

The newest catalog-wide audit and release evidence is [docs/seo/IMPLEMENTATION_SUMMARY.md](docs/seo/IMPLEMENTATION_SUMMARY.md). It covers 817/817 local offers, 108 primary collections, the shared commercial/editorial publication gate, full rendered export checks, live 949-page/165-asset evidence, current browser/unit checks and actual lab measurements. Older dated sections below are historical. Production DNS/HTTPS work; this local batch is not published. Private reports and research remain ignored.

## Current SEO / premium-products audit — 2026-10-23

The existing **public** release was verified separately: important routes and assets load over HTTPS, HTTP/www redirect to the apex, and no `/aitoolspk/` prefix was reproduced. DNS now returns GitHub's four correct addresses; the earlier loopback/DNS observations below are historical and resolved. This batch's local source changes have **not** been published. Current executed-check evidence, performance measurements and limitations are maintained in [docs/SEO_IMPLEMENTATION_SUMMARY.md](docs/SEO_IMPLEMENTATION_SUMMARY.md) and [docs/SEO_AUDIT_REPORT.md](docs/SEO_AUDIT_REPORT.md). The older evidence below describes earlier exports, not current test counts or performance.

## Historical pre-GitHub audit — 2026-10-23

The final production export passed all **26 Playwright cases**, including nine viewport widths from 320 to 1440px, keyboard dialogs, touch/restock popups, native purchase links without JavaScript, grouped search/filter behavior, exact ChatGPT variants and API partitioning. The sampled home, directory, collections, policy and detail pages passed automated WCAG AA checks. No console errors were observed in the covered navigation flow. This is Chrome emulation, not physical-device or Safari certification.

All **10 local data/commerce tests** passed with the private CSV, including an exact comparison of all 811 retail prices and identities. The release gate also builds with that CSV absent: public checks still run, and only the private-source comparison is intentionally skipped. GitHub now uses platform-independent Playwright configuration. Private approval evidence lives in ignored `private/approvals.json`, outside the public source and web projection.

The dependency refresh fixes the csv-parse, sharp and compression advisories. Production dependency audit is clean. One unpatched braces advisory remains in the dev-only Next.js lint chain; its exact exception and upstream source are documented in [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md). The current-file and reachable-history privacy scan found no issues. Mobile Lighthouse also found a sort label hidden by responsive CSS and a skipped heading level in results; the dropdown now has an accessible name at every width, and results have an H2 before their H3 cards. The 390px browser case includes both rules to prevent a regression.

Fresh Lighthouse 13.5.0 simulated-mobile measurements of the final local export: homepage **97 performance**, LCP **2.5s**, TBT **30ms**, CLS **0**; catalog **97 performance**, LCP **2.6s**, TBT **50ms**, CLS **0**. Both scored **100 accessibility, 100 best practices and 100 SEO**. These meet the PRD's Lighthouse score target; the catalog's single local LCP is above the 2.5s field target. Neither is a field measurement. Final reports and screenshots are in ignored `reports/launch-*` files.

The attached canonical guide exposed two SEO gaps: blocked query copies and page-two canonicals pointing at page one. Both were fixed with crawlable query copies and 16 real static pagination routes. The sitemap now has **138 indexable canonical URLs**. Browser checks verified every sitemap target returns HTTP 200 without redirects locally; source-head, query-copy and no-JavaScript pagination cases passed. A provider-search regression from the last API page was also fixed: changing filters/search resets to the actual first-page route, preserving correct Next.js metadata. See [SEO_CANONICAL_CHECKLIST.md](SEO_CANONICAL_CHECKLIST.md) for the full PDF-based audit and live-domain limits.

The public repository is [omiijutt120/aitoolspk](https://github.com/omiijutt120/aitoolspk). The owner will connect the domain; its public A record returned `127.0.0.1` at audit time. No public-domain launch is claimed. The manual custom-domain Pages workflow is separate from verification CI and is not triggered by a push.

## Storefront redesign — 2026-10-20

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
