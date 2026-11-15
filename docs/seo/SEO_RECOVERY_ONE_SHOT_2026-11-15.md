# One-shot SEO/GEO/AEO recovery — final implementation report — 15 November 2026

## Scope

Executed against draft PR #10 on seo/organic-growth-recovery. The contract file was read from the branch at commit eeb87b7. No merge or deployment occurred.

## Newly fixed

- Corrected the supplied regex-filtered GSC evidence and preserved the no-attribution limitation.
- Added build-time, catalog-derived navigation to the 32 largest current collections.
- Added exact responsive sizes to fixed logo assets across templates.
- Added the complete 108-collection implementation matrix, measured image/CWV evidence, and owner unblock checklist.
- Existing publication protection remains unchanged: 815 NEEDS_REVIEW, 2 EXCLUDED, 0 approved indexable offers.

## Already implemented and verified locally

- Static route export, self-canonicals, OG parity, sitemap/indexability agreement, robots policy, JSON-LD validation, internal-link and fragment checks, generated AI discovery assets, trust pages, factual collection guides, and conservative Product/Offer schema gating.
- The current export has 1,006 HTML pages, 1,003 canonical pages, 188 indexable sitemap URLs and no local SEO validator errors.

## Requirement status

| Workstream | Status | Proof/limitation |
| --- | --- | --- |
| A route/indexing recovery | FIXED & VERIFIED locally | Export matrix, sitemap, canonicals, robots and noindex parity pass; live indexing requires GSC |
| B CTR/query anomaly | FIXED & VERIFIED for evidence handling | Filtered group recorded; ranking/CTR outcome unmeasured |
| C collection/editorial quality | FIXED & VERIFIED locally / BLOCKED for offer facts | 108-row matrix; collection facts render; 788 offer duplicates need owner facts |
| D internal linking | FIXED & VERIFIED locally | 72,855 internal references, 0 broken, 1,499 fragments; dynamic top-32 links |
| E images | FIXED & VERIFIED locally | 365 assets and 6,506,544 bytes inventoried; cached WebP pipeline retained; no unsafe re-encode |
| F CWV/browser | BLOCKED — EXTERNAL | No field data; root Chromium sandbox blocks lab tests |
| G structured data | PASS ALREADY | Local schema/export validators pass; no fake reviews/ratings |
| H GEO/AEO | PASS ALREADY / UNMEASURED | Discovery files and answer passages exist; real AI citations unavailable |
| I trust/safety | PASS ALREADY | About/contact/order/refund/terms/privacy/editorial pages are present and linked |
| J security/deployment | BLOCKED — EXTERNAL | Production host/headers/redirects require live host access |
| K research/authority | OWNER ACTION | Official source fetches/network unavailable; PR plan exists; no outreach performed |
| L GSC/Bing | OWNER ACTION | Requires authenticated accounts and URL Inspection |
| M release validation | FIXED & VERIFIED except browser/live | Static, lint, type, SEO, export and repository checks pass |

## Fresh live crawl and audit — 15/16 November 2026

- Firecrawl sitemap/domain map discovered **196 URLs**.
- A full crawl then completed **220/220 discovered documents** (220 credits), all with HTTP **200**.
- The crawl parser found **0 duplicate title groups**, **2 documents without title/description fields**, **20 titles longer than 60 characters**, and **2 documents under 250 words**. The long-title set includes individual offer pages that are intentionally noindex; do not apply blanket title edits to those. The two metadata-empty documents have not yet been individually isolated and should not be treated as missing metadata on indexable HTML pages without checking content type.
- Mean extracted text was about **1,411 words/document**; this is a crawl statistic, not a content-quality score.
- The separate OpenSEO audit completed **50/50 pages** but stopped at its 50-page limit with **320 discovered URLs not crawled**. All 50 sampled pages returned HTTP 200, were indexable and had titles. Lighthouse completed **9/20** attempts and failed 11; no field CWV pass is inferred.

## Tests and measurements

- Node 24, `npm ci`, and `npm run launch:check` passed in GitHub Actions.
- A real Playwright Chromium run executed **87 tests: 85 passed, 2 failed** at commit `6037f560`. The two failures were assertions that still expected a stale approved-offer URL/label and a pending Gemini listing to use the old Buy Now behaviour. They were addressed by preserving the stable CTA label, separating WhatsApp intent from CTA label, and updating the assertions. The latest verification run after those fixes is tracked in PR #10; do not call it green until GitHub reports completion.
- Earlier notes attributing the browser failure to root Chromium sandbox are superseded: Chromium did launch and execute the suite. The current blockers are the specific test assertions above, plus the latest pending run.
- The live domain was reachable to Firecrawl during the 220-document crawl; the earlier Copilot-worker EAI_AGAIN was environment-specific and is not evidence that production DNS is down.

## No claims made

This report does not claim improved rankings, indexing, CTR, Core Web Vitals, backlinks, sales, WhatsApp conversions or AI citations.
