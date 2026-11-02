# AiToolsPk SEO/GEO/AEO audit and fixes — 2 November 2026

Site: https://aitoolspk.tech/ · Repository: `omiijutt120/aitoolspk`

## Scope and evidence

- Reviewed the live homepage and the OpenSEO robots-aware audit of **50 URLs**, completed 2 November 2026 (audit ID `cd4a5d64-2313-4d91-8b25-d14b225c609d`). The audit also completed 20 Lighthouse tasks; scores and field Core Web Vitals were not available in the returned results, so no performance grade is asserted.
- Inspected the current Next.js 16 static-export source and built **978 HTML files**, including 815 offer routes. The complete local export validation checks all generated HTML, canonical/index controls, structured data and internal links.
- Reviewed the four supplied image-only PDFs by OCR: *30 Day SEO and GEO Blueprint* (19 pages), *The 30-Day SEO Sprint* (15), *The 800 Hour SEO Blueprint* (16), and *The AI Search Blueprint* (19). Used their practical ideas on topical targeting, immediate answers, evidence, linking and measurement. Advertising claims about guaranteed rankings, click-through uplifts, AI citations or arbitrary freshness rules are not independently verified facts.
- Used OpenSEO's backlink database for the apex domain, keyword ideas for Pakistan/English, and a separate check of unique outbound links in the generated site. Vendor link status is a point-in-time observation, not a warranty.
- The owner reported **1 click and 15 impressions over 7 days**. This is owner-supplied, not an authenticated Search Console export. OpenSEO did not have a Google Search Console account linked to this project, so queries, actual Google-selected canonicals, indexed URLs and precise period comparison remain **unknown**.

## Verified findings and actions

| Priority | Evidence | Action / status | Success check |
| --- | --- | --- | --- |
| P2 | The old Envato license reference on `/plans/envato/` returned **404 to HEAD**, but a normal GET followed its redirect to a working page. This was a HEAD-only false alarm, not a confirmed broken destination. | **Improved**: replaced the redirecting URL with the current direct Envato Elements license at `https://help.elements.envato.com/hc/en-us/articles/360000628966-Envato-Elements-License`, independently checked HTTP 200. Updated this guide's genuine vendor-check date. | Re-run `npm run seo:check-outbound`; the new checker retries failed HEAD with GET. |
| P2 | OpenSEO found 19 verbose or repetitive titles in 50 sampled pages, including `Amazon FBA & E-commerce Tools tools...`. | **Fixed in source**: simplified category, guide, About, paginated Tools and collection titles; kept original helpful on-page guide headings. Added explicit, meaningful `seoTitle` overrides for longer guides and a browser regression test. | Build and test the affected exported URLs, including page-two titles, for clear non-repetitive titles. A 60-character length is a helpful display heuristic, **not** Google's ranking threshold. |
| P2 | `/how-to-order/` skipped H2 and began its steps with H3. | **Fixed**: added a descriptive H2 before the reusable steps component, preserving H3 semantics on the homepage. | Heading hierarchy browser test. |
| P2 | Pakistan keyword provider estimates `canva pro price in pakistan` at **480 monthly searches**, difficulty **1**; commercial intent. | **Improved** the Canva collection title and H1 for the relevant query while keeping Canva Pro versus Education/team eligibility and seller-price caveats visible. This is a prioritization hypothesis; keyword metrics are not guaranteed rankings or sales. | Compare Google Search Console query/page impressions after recrawl; do not infer a traffic gain from the metadata change alone. |
| P2 | There was no repeatable outgoing-source verification command; 8,515 external references are repeated across many exported pages. | **Added** optional `npm run seo:check-outbound`: deduplicates outbound links, follows redirects, retries uncertain HEAD responses using GET and reports definite 404/410 separately from bot blocks or 5xx. Kept off the build gate because third-party servers are unreliable. | Manual periodic audit; fix a target only after confirming a real moved/deleted destination. |
| P3 | OpenSEO's first 50-page crawl found no missing title, canonical conflict, blocked page or broken internal link; 20 issues were informational (19 title lengths, 1 heading hierarchy). | Repaired the evidenced issues; no blanket robots/indexing changes. | Run another crawl **after** deployment and compare the same page sample. |
| P2 | The final security gate found the newly published minimatch denial-of-service advisory in development tools, including minimatch 10.2.6. | **Patched the TypeScript ESLint 10.2.6 transitive copy** to resolved 11.0.4 via a parent-specific `^11.0.3` override. Reviewed legacy 3.1.5, which lacks the advisory's described preprocessing function, and documented an exact-advisory, dev-only release-gate exception rather than applying incompatible major tool downgrades. | Fresh `npm ci`, lint, TypeScript, unit/browser tests and `npm audit --omit=dev`; see [launch advisory policy](../../LAUNCH_CHECKLIST.md#build-tool-advisory-exceptions). |

### Full internal-link and indexability verification

The clean static export's built-in validator checked **64,526 internal references** across **977 ordinary HTML pages**, finding **0 broken targets**, **0 confidentiality leaks**, **0 duplicate indexable titles/descriptions** and **0 orphan pages**. It identified **974 canonical pages** and **159 indexable sitemap URLs**. The fragment audit inspected **1,040 in-page anchors** with **0 missing targets or duplicate IDs**.

These are comprehensive for the **local generated HTML graph**, not evidence that Google has indexed the pages. The separate live plugin crawl was a 50-page sample; neither is a guarantee about unobserved historical URLs or outside websites.

The publication engine currently labels **815 offers NEEDS_REVIEW** and **2 excluded**. Those 815 offers intentionally remain `noindex`; they are not 815 accidental indexing defects. Their collection pages, categories and guides can remain discoverable while commercial and editorial review is pending. Do not index every offer merely to inflate sitemap size.

The catalog engine also reports **788 exact boilerplate product descriptions**, **215 missing product logos**, and **817 stale source price snapshots** under its existing seven-day quote policy. These are real merchandising/editorial backlogs, but changing them without current supplier evidence would manufacture information. No approval flag, price, review date, license right, or indexability gate was silently changed.

### Inbound backlink profile versus outbound links

OpenSEO found **1 referring domain and 1 backlink** for the apex host, from `hub.rankvance.com/2026-10-21/6/` to the homepage. Its snapshot classified that link as live, with **0 broken backlinks** and **0 broken linked target pages**. This database may not contain every web mention; it is not a complete Google link index. There is no basis for a disavow or claim that hundreds of backlinks are broken.

For outbound links *from this website*, the initial spot-check covered **59 unique URL variants**: 55 successful with HEAD, one Envato **HEAD 404 / GET 200 via redirect** (normalized to its direct official URL), and 3 ambiguous HEAD responses. GET confirmed Netflix and Spotify at HTTP 200; Prime Video Help transiently returned 503. The improved, fragment-normalizing checker subsequently tested **58 unique destinations**, retrying unsuccessful HEAD requests using GET, and reported **58 accessible, 0 broken, 0 uncertain**. This is one observation window, not permanent vendor uptime.

## Why impressions and clicks may still be low

1. **New-domain discovery and index selection.** The domain/repository launched in late October 2026. HTTP 200, a sitemap and a self-canonical do not establish that Google indexed the URL or selected it for relevant queries. Check URL Inspection, not merely a `site:` operator.
2. **Limited independent authority.** Only one backlink appears in the checked provider dataset. Earn contextual editorial coverage and legitimate community mentions; avoid purchased bulk links, spammy forum drops and automated guest-post schemes.
3. **Search-demand/intent matching.** The site has 108 collections but the current query-to-page impression data is unavailable. Prioritize a small number of important, helpful collection pages and their related practical guides, starting with Canva, ChatGPT, Gemini, Claude and API distinctions. Avoid creating near-duplicate landing pages for every spelling variant.
4. **Commercial trust and freshness.** Most offer variants require authorization, accurate limits, safe delivery terms and current quotes. Keep those holds until actual owner/supplier evidence exists. Add real buyer questions, original comparisons and clearly attributed official references; never fake review dates, testimonials, prices or usage tests.
5. **Query performance is unmeasured.** Fifteen impressions are too few to diagnose CTR or cannibalization reliably. The next meaningful metric is which canonical pages are actually indexed and which relevant queries begin accruing impressions, then eligible enquiry conversions.

## Four-week evidence-led follow-up

| Timing | Owner action | Metric/evidence |
| --- | --- | --- |
| Immediately after GitHub Pages deployment | Confirm the exact deployed commit; HTTP 200, robots/sitemap, 159 expected eligible URLs, new title and Envato link. | Live fetches and a repeat OpenSEO crawl. |
| Days 1–7 | Connect the verified `aitoolspk.tech` Google Search Console property to OpenSEO; inspect the homepage and `/plans/canva/`, `/plans/chatgpt/`, `/plans/gemini/`, `/guides/`; submit sitemap if not already submitted. | Google-selected canonical, last crawl, URL Inspection verdict and the latest complete performance dates. |
| Days 8–14 | Improve 3–5 priority collections with verified plan terms, distinct comparison criteria, direct answers and owner-supplied examples. Use current supplier evidence; keep pending variants noindexed. | Content/source change log; first eligible query/page impression trend. |
| Days 15–21 | Add two or three truly useful, non-duplicative supporting guides only where a distinct question is demonstrated. Link each guide to its relevant collection and vice versa; test mobile readability. | Relevant internal paths, actual guide content, rendering and QA tests. |
| Days 22–30 | Seek relevant independent mentions via partnerships, honest product resources and useful answers in real communities. No paid or manipulated links. Review GSC and correct pages based on observed queries. | Verified referring pages/domains and 7/28-day complete GSC performance windows; do not promise a particular result. |

Google documents that [recrawling can take days or weeks and does not guarantee indexing](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl); repeat indexing requests do not accelerate an unchanged URL. It also recommends [clear, concise, non-repetitive titles](https://developers.google.com/search/docs/appearance/title-link) without a fixed character limit.

## Release validation

The patched source passed TypeScript, ESLint, the production Next.js export, **42 unit tests passed / 1 intentionally skipped**, full local export link/canonical/schema checks, the 1,040-fragment check, and an offline smoke check of **20 affected titles**, the ordering-page heading sequence and the updated Envato link. The full `npm run launch:check` release gate **passed** after the narrowly reviewed development-tool advisory exception; the production dependency audit reported **zero vulnerabilities**. The new Playwright test definitions load and list correctly. Local execution of the browser tests is **not yet verified** because Playwright's Chromium download returned an invalid/truncated ZIP in this workspace; the GitHub Actions CI browser job must run before merging. Retain failures and limitations honestly.

## Outstanding dependencies

- No authenticated GSC/GA4 connection is available to OpenSEO; the owner must connect or supply an export before a ranking/indexation explanation can become specific.
- Product approvals, commercial license eligibility, stock, and quote refreshes require current business evidence from the owner. Code cannot safely infer them.
- Inbound links from other websites cannot be repaired by editing this repo. A confirmed broken inbound URL can be redirected to a relevant live destination where GitHub Pages permits a correct implementation; a broken referring page requires the linking publisher to change it.
- Actual traffic growth, AI citations and high search rankings cannot be established immediately after a code deployment.
