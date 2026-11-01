# AiToolsPk full website, SEO, GEO and AEO audit

Client date: 29 October 2026, Asia/Karachi. This continues the existing implementation and indexing recovery; it does not replace earlier owner restrictions. Raw capture timestamps use the execution machine's clock and are retained as recorded rather than relabelled as client time.

## Plan and scope

1. Resolve outstanding browser failures and distinguish test synchronization errors from actual application defects.
2. Crawl the live canonical host from its sitemap and every discovered native internal HTML link, respecting robots rules, with a 1,500-page ceiling. Record failures and coverage. Review live assets, redirects, ownership files and the supplied Search Console examples separately.
3. Reconcile the complete local static export with intended indexability, canonicals, metadata, sitemap, internal links, fragments and structured data. Preserve intentionally held offer pages.
4. Apply SEO-pro, GEO technical, AI SEO and programmatic-content workflows to the actual page families. Verify official search guidance; distinguish readable source content from measured AI citations or Google indexing.
5. Review representative mobile performance, accessibility and enquiry flows. Implement only evidenced defects. Never refresh price or review dates to make old data appear current.
6. Execute release checks, record outcomes and prepare a concrete release handoff. Production publication still requires the owner's explicit authorization under the earlier master brief.

## Plugin and skill coverage

| Capability | Workflow used | Evidence expected |
| --- | --- | --- |
| Overall coordination | SEO Growth Master | Existing owner context, constraints, current source and previous audits |
| Technical and page audit | SEO-pro / ai-marketing-hub-seo audit and page workflows | Live source crawl plus local export and browser checks |
| Canonicals and discovery | SEO-pro sitemap workflow | Native XML validator joined to independently checked URLs |
| Structured data | SEO-pro schema workflow | JSON syntax, types and explicit visible-fact comparisons; no claim of official rich-result approval |
| GEO crawl/readability | GEO technical workflow | Robots rules, HTML content without JavaScript, internal navigation, mobile checks |
| AEO and answer accuracy | Marketing Skills AI SEO workflow | Specific visible answers, sourced facts, current quotes and publication limits |
| Programmatic page quality | Marketing Skills programmatic SEO workflow | Collection grouping, duplicate offer controls, distinct guide intent and no generated doorway pages |
| Performance/accessibility | Existing TLC web-quality workflow and Playwright/Lighthouse | Representative lab measurements, responsive layouts, automated accessibility |

The installed ChatGPT SEO adapter and SEO-pro share upstream workflows; equivalent checks are not counted twice. Unrelated advertising, outreach, CRM and email skills are outside this website audit. Installing skills does not connect Search Console, analytics, paid keyword tools or AI citation tracking. No unsupported overall SEO/AI visibility score will be reported.

## Existing indexing evidence

Owner supplied 384 noindex exclusions, six canonical alternatives and 37 crawled-but-not-indexed URLs. Ten examples have been inspected in [the indexing recovery report](INDEXING_RECOVERY_2026-10-27.md). Those ten pages returned 200 without an observed noindex directive; the four category-filter copies nominate the clean collection URL. No authenticated Google URL Inspection results or subsequent Performance export are available.

Confirmed improvements already prepared: clean links for redundant category filters; eight additional affected collection guides (33 total); meaningful sitemap modification dates; reliable catalog fetch failures/retry/timeout; campaign parameters excluded from filter state; responsive comparison tables, sourced guides and smaller logos. They are local source changes until a production release is authorized.

## Evidence ledger and completion

| ID | Finding and scope | Evidence / confidence | Action and verification |
| --- | --- | --- | --- |
| A01 | Hyphenated plan/warranty terms were missed in 65 catalog records. Example: Galaxy Play and Youku `30-day` terms; Apple Music `1-day warranty`. | Importer reproduction and complete before/after field comparison; high confidence. `reports/seo/term-parser-changes.json`. | Fixed extraction and explicit unit formatting. Only duration/warranty fields changed; prices, IDs, slugs, quote dates, approval and stock preserved. Ambiguous limits/contradictory terms stay unconfirmed. Added importer and real product/WhatsApp regressions. |
| A02 | Category links unnecessarily generated duplicate filtered URLs for collections wholly inside one category. | Source and browser evidence; high confidence. | Remove only redundant category state using full-catalog membership. Retain meaningful Gemini category and price filters. Existing shared URLs stay usable with clean canonicals. |
| A03 | Eight supplied affected collections had no local product-specific buying guide; all nine supplied live collections lack the prepared guides. | Source and live HTML evidence; high confidence. | Added eight sourced guides, retained the Netflix guide; now 33 collection guides. Clarified specific credits, usage charges, redemption and streaming eligibility without promising entitlements. |
| A04 | Two regression tests observed navigation before it settled; one expected an old heading. A new purchase-link test initially used the wrong accessible name. | Reproduced browser failures; high confidence. | Correct test synchronization/heading/selectors. Repeated navigation tests 12/12 passed. Final parser build: 55 tests passed in full run, remaining new test passed after selector correction. No unresolved test failure is being hidden by retry configuration. |
| A05 | Production still serves the older release; local improvements cannot influence its crawls yet. | Live 138-entry sitemap versus local 159; high confidence. | Explicit release authorization required. No production push, DNS change or Search Console submission performed. |
| A06 | Intentional held offer exclusions: 809 discovered live offers; 815 active local offers. | HTTP HTML and publication model; high confidence for controls, not Google's index. | Preserve noindex, sitemap exclusion and absence of purchase-rich schema under the owner's existing commercial-review requirements. Stock confirmation alone does not clear this gate. |
| A07 | Older price snapshots require seller reconfirmation. | Catalog dates and seven-day quote policy. | Keep dates truthful and WhatsApp confirmation flow. No fabricated price refresh. Approval/price evidence is an owner dependency, not a technical repair. |
| A08 | Zero impressions/indexed pages cannot be causally explained by the supplied totals alone. | Owner-provided GSC counts/examples; authenticated data unavailable. | Prioritize homepage and main collection URL Inspection after release. No claim that Google indexing or rankings are fixed. |

### Live technical coverage

`reports/seo/production-crawl.json` and `full-production-findings-2026-10-29.json` record a complete crawl of the sitemap and discovered native HTML graph on 29 October:

- **947 HTML URLs**, 949 requests including robots and sitemap; ceiling not reached; no discovered internal HTML destination left unvisited.
- **Zero fetch/HTML parsing errors**, missing titles, missing descriptions or missing canonicals.
- **138 sitemap URLs**; all 200, self-canonical and technically indexable. No duplicate indexable titles/descriptions observed.
- **809 noindex pages**; no held page exposed Product, Offer or AggregateRating markup in the crawl.
- Separate `full-resources-2026-10-29.json`: **51** CSS, JavaScript, image/font and verification resources returned 200. HTTP and www each 301 to the HTTPS apex. A deliberately absent URL returned a real 404.

This is complete for the discovered HTML graph, not every possible query string, undiscovered URL, device or external provider. The ten owner-supplied examples and four clean query equivalents are separately captured in the indexing recovery evidence. No actual Googlebot IP or authenticated URL Inspection test was performed.

### Local export and plugin validation

The final parser build passed `npm run launch:check`: repository/public-data checks, full lint, TypeScript, **36 unit tests**, full and production dependency audits (zero reported vulnerabilities), production build, export checks and fragment checks.

- 978 HTML documents including error pages and the Google verification asset; 815 active offer routes.
- **974 canonical non-error pages**, **159 indexable sitemap URLs**, 16 independently canonical paginated routes.
- **64,357 internal references**, 1,152 unique targets: zero broken targets or confidential-field findings.
- **1,035 fragment links**: zero missing anchors or duplicate IDs.
- SEO-pro's supplied-crawl analysis: 974 local pages, no duplicate titles, no pages without observed inlinks, no unobserved internal targets. Its 815 `index_intent_review` findings correspond to the intentional offer holds, not 815 automatic defects.
- Native sitemap validator: 159 entries; no invalid locations, namespace/date syntax or duplicates. Browser checks separately reconcile every sitemap destination with status, canonical and index controls.
- Native structured-data validator: **3,071 parsed JSON-LD blocks** and **11 explicit visible-fact checks** (article headings and supplied phone number), all agreeing. This is not an official Google rich-result eligibility result and does not independently validate every field.
- Final browser coverage comprises 56 cases: 55 passed in the full updated-export run; the additional hyphenated-term case passed separately after correcting its test locator. Earlier filter/touch regressions also passed three consecutive repetitions. Reports retain the initial selector failure and successful retest rather than overwriting the evidence.

Raw results: `reports/launch-check.json`, `full-release-2026-10-29.log`, `full-local-analysis-2026-10-29.json`, `full-schema-analysis-2026-10-29.json`, `full-sitemap-analysis-2026-10-29.json`, `full-browser-results-2026-10-29.json`, `final-term-browser-2026-10-29.json`.

### GEO, AEO and programmatic-content review

The collection/page text, comparison tables, FAQs and links are in source HTML and remain readable without JavaScript. JSON-LD identifies actual organization, website, collection, breadcrumb and article entities; unsupported reviews, vendor relationships and purchase offers were not invented. The phone-only contact policy remains intact. Roman Urdu passages carry their own language annotation.

The 33 differentiated collection guides, 13 category checklists and ten buying guides provide answer-oriented information and official supporting sources. Remaining collections still require case-by-case editorial research if expanded; generating repeated filler or keyword/city permutations is not an appropriate fix. Specific unconfirmed entitlements cannot be resolved by SEO copy. Optional `llms.txt` is only navigation; no API-catalog, MCP endpoint or public transactional API was fabricated for this storefront.

Robots permits crawling in general. This does not prove retrieval by a particular AI provider, inclusion in AI answers, or training behavior. [Google's AI-search guidance](https://developers.google.com/search/docs/appearance/ai-features) says ordinary SEO fundamentals remain relevant and no special AI markup is required. [Google's indexing guidance](https://support.google.com/webmasters/answer/7440203) distinguishes legitimate exclusions from important pages that need investigation. [Canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) supports consistent preferred URLs; canonical hints are not a promise of Google's selection.

No authenticated GSC/Bing performance data, field CWV, backlink database, keyword-volume data or measured AI citation sample was available. These remain unknown, not zero or a fabricated score.

### Representative mobile lab performance

Measured on 29 October with Lighthouse 13.5.0 against the local production export, using its simulated mobile/CPU settings and no concurrent build/browser suite:

| Template | Performance | Accessibility | Best practices | Lighthouse SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Homepage | 96 | 100 | 100 | 100 | 2.69 s | 63 ms | 0 |
| ChatGPT collection | 98 | 100 | 100 | 100 | 2.47 s | 30 ms | 0 |
| Subscription/API guide | 99 | 100 | 100 | 100 | 2.00 s | 26.5 ms | 0 |

No Lighthouse runtime warnings. Evidence: `reports/seo/seo-pro-performance-summary.json` and the three corresponding raw reports. These are lab diagnostics, not field CWV, measured INP or Google ranking scores. The homepage LCP remains slightly above the 2.5-second target in this single simulated run. Inspection identified text rendering and a 15 KB render-blocking stylesheet, not a missing image or stalled server. No unsupported framework-polyfill removal or content hiding was applied to inflate the score. Validate production field data after release before attributing a remaining real-user bottleneck.

### Release and measurement handoff

1. Review and explicitly authorize publishing this tested source batch. The earlier brief requires explicit deployment permission; no push has been made by this audit.
2. After release, verify the served sitemap, key collections, guides, assets and ownership files against the built export. Confirm the same exact domain/property in Search Console.
3. Inspect the homepage and priority canonical collections; compare Google's crawled snapshot and selected canonical with its live test. Request recrawls for a small set of materially improved canonical pages, not held offers or query copies.
4. Review same-property indexing and Performance exports at 7/14/30 days after release. Separately review quote freshness and outstanding delivery/authorization facts. Expand collection guidance according to actual customer needs and query evidence.

Expected outcomes are cleaner navigation, accurate displayed terms, useful source content and verifiable technical eligibility. Indexing, impressions, rankings and AI recommendations remain search-engine decisions, not guaranteed deliverables.

Audit handoff finalized 30 October 2026. Measurements retain their actual 29 October capture dates. No application changes were made after the final validated parser build; subsequent changes corrected test locators/synchronization and completed this documentation.
