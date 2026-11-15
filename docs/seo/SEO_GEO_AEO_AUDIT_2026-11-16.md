# AiToolsPk SEO / GEO / AEO audit — 16 November 2026

## Executive summary

The site has a sound static-export foundation. The supplied Search Console export is dominated by opaque `ai#####` query strings, but the strings are not emitted by the repository or live HTML. They are historical Google query rows with 884 impressions and zero clicks. They cannot be deleted from Search Console. The safe engineering objective is to keep the export free of those tokens, make real product pages own real buyer intent, and measure page-filtered Search Console data separately.

Current source branch: `seo/organic-growth-recovery` at `e4e96b421b96b98ac5e60e9b6c09b2ae99e05b74`.

## Findings and fixes

| Area | Finding | Status / evidence |
| --- | --- | --- |
| Crawlability | Robots, sitemap, clean canonicals and static routes are present. | `FIXED_VERIFIED`: live robots/sitemap return 200; local export has 188 indexable sitemap URLs and 0 broken targets. |
| Opaque query anomaly | `ai#####` appears in supplied query rows, not site output. | `FIXED_VERIFIED`: source/live scan found 0 emitted tokens; `check-export` now fails if HTML emits one. |
| Real buyer intent | Homepage and Price Index previously competed for broad price intent. | `FIXED_VERIFIED`: homepage owns catalogue intent; Price Index owns AI-tool price intent; collection titles use product + Pakistan + price/plan wording. |
| Collection discovery | Google had not indexed several high-value collection pages in the supplied site probe. | `FIXED_VERIFIED` locally: collection links, sitemap, metadata and self-canonicals are present. Recrawl/indexing remains an external Google state. |
| Offers | 815 offers require review; 2 are excluded; 0 are approved indexable offers. | `BLOCKED_MISSING_FACTS`: no offer was promoted or given Product/Offer schema. |
| Duplicate descriptions | 788 offers share exact normalized descriptions. | `BLOCKED_MISSING_FACTS`: requires seller terms and individual review; no synonym spinning was applied. |
| Canonicals / pagination | Canonical and pagination checks cover page 2+ and query copies. | `FIXED_VERIFIED`: 1,003 canonical pages; 20 paginated canonical pages; self-canonical export checks pass. |
| Schema | JSON-LD is server-rendered and validated against visible facts. | `FIXED_VERIFIED`: 3,303 local structured-data blocks; no fabricated ratings/reviews/offers. |
| GEO/AEO | Discovery assets and answer-first content exist; no special Google AI schema is required. | `FIXED_VERIFIED` for crawl readiness; citations and recommendations are unmeasured. |
| Performance / UX | Responsive, accessibility and table regressions are covered. | `FIXED_VERIFIED`: full browser suite and launch gate pass; field CWV remains unavailable. |
| Security headers | GitHub Pages does not provide configurable HSTS/security headers from this repository. | `BLOCKED_EXTERNAL`: requires CDN/hosting configuration. |
| Search measurement | No authenticated GSC URL Inspection, CrUX or conversion dataset is connected. | `BLOCKED_EXTERNAL`: page-filtered query and indexing evidence must come from the owner account. |

## Verification

Using the repository's pinned Node 24 runtime:

- `npm run launch:check` — passed.
- `npm run build` — passed; 1,007 generated documents.
- `npm run check:export` — passed: 1,006 HTML pages, 72,885 internal references, 0 broken, 0 confidential fields, 0 duplicate indexable descriptions, `opaqueQueryTokenPages: 0`.
- `npm test` — 99 passed, 0 failed.
- Live `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, and `ai.txt` — HTTP 200.
- Live `/price-index/` and `/plans/chatgpt/` — HTTP 200 with self-canonicals and product-intent titles.

## GSC evidence boundaries

The attached export contains 310 query rows totaling 1,283 impressions and 1 click. The `^ai[0-9]+$` group contains 884 impressions and 0 clicks. The Pages table reports 827 impressions and 0 clicks for `/price-index/`, 434 impressions and 1 click for `/plans/netflix/`, and 120 impressions and 3 clicks for the homepage. Query rows and page rows have different aggregation dimensions; they must not be joined to claim that a particular `ai#####` query landed on a particular page.

## Remaining owner actions

1. In Search Console, export page-filtered queries for `/price-index/`, `/`, `/plans/netflix/`, `/plans/chatgpt/`, `/plans/gemini/`, `/plans/claude/`, and `/plans/canva/`.
2. Inspect those URLs and request recrawling where Google has not selected the declared canonical.
3. Review supplier evidence for pending offers before any publication-state change.
4. Configure security headers at an authorized CDN if HSTS and response headers are required.
5. Track clicks and qualified WhatsApp enquiries separately; no conversion claims are inferred from impressions.

No ranking, indexing, traffic, AI-citation, or conversion guarantee is made by this audit.
