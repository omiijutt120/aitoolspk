# Owner unblock checklist — 15 November 2026

## 19 November update

The current recovery branch includes [the dated master audit](SEO_MASTER_AUDIT_2026-11-19.md), [815-row product verification queue](PRODUCT_VERIFICATION_QUEUE.csv) and [817-row price freshness report](PRODUCT_PRICE_FRESHNESS_REPORT.csv). The first 30 queue ranks are requests for verification, not publishable offers. `npm run catalog:quote-request` produces the seller response sheet. Do not update a quote date unless the exact price was confirmed.

The attached October–November Search Console ZIP was analyzed directly; see [the numerical-query investigation](GSC_NUMERICAL_QUERY_INVESTIGATION_2026-11-19.md). For a **current** read, use `npm run gsc:sites` to identify the property after adding a read-only service account, then run `npm run gsc:export -- --days 7 --out reports/gsc/7d`, repeating for 28 and 90 days. The new `query-pages.csv` is the paired evidence needed to attribute numerical queries to landing pages. With manual exports, put the original `Queries.csv` and `Chart.csv` in one folder and run `npm run gsc:analyze -- --dir <folder>`. Apply the UI filter `(?i)^ai[0-9]+$` as **Doesn't match regex** to see non-numerical queries, and separately retain the matching report. Do not treat hidden queries as commercial.

The site currently passes the 188-URL live sitemap crawl. The observed `www` DNS lookup failed in one separate request; verify it from another network before changing DNS. The observed GitHub Pages response lacks the reviewed security headers, which requires a host/CDN decision rather than a repository-only edit. No production deployment or DNS action is included in this branch.

1. **Production/deployment:** Firecrawl reached the live domain and crawled 220 documents successfully. Confirm which commit is deployed, then verify HTTP/HTTPS and www redirects, security headers and CDN configuration; do not change DNS or host settings in this PR.
2. **Search Console:** for ChatGPT, Gemini, Claude, Canva, Grok, Cursor, ElevenLabs, Adobe, Notion, CapCut, Kling, YouTube, TikTok, Gamma, Microsoft, Figma, Lovable, Runway and Leonardo (where present), record sitemap submission, last crawl, live test, indexing state, Google-selected canonical, referring URLs and rendered screenshot.
3. **GSC query evidence:** run page-filtered Performance reports for /price-index/, homepage and /plans/chatgpt/page/3/; repeat for desktop/mobile/tablet and Pakistan using matched date windows. Keep the ^ai[0-9]+$ group separate; never join standalone Queries and Pages exports.
4. **GSC health:** export Manual actions, Security issues, Page indexing and Core Web Vitals.
5. **Product facts:** approve seller/editorial evidence before changing any offer description, warranty, access, duration, price or publication state.
6. **Bing/Copilot:** verify Bing Webmaster ownership, sitemap status and IndexNow configuration; record Copilot/answer-engine observations with dates and exact prompts. No submission was performed here.
7. **Performance:** run PageSpeed Insights/CrUX and browser QA from a non-root runner; attach mobile/desktop metrics.
8. **Authority:** approve a small ethical outreach batch based on the existing PR strategy; no emails, submissions or paid links were sent.
9. **Measurement:** approve a privacy-safe WhatsApp enquiry measurement method before adding analytics or external scripts; organic clicks are not sales.
10. **Full crawl coverage:** the 220-document crawl and 50-page OpenSEO audit are useful but not a complete sitemap audit. Finish checking the remaining discovered URLs and isolate the two non-metadata crawl results before declaring whole-site coverage.
