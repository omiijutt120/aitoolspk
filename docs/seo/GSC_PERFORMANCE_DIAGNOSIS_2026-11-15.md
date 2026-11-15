# GSC performance diagnosis — 15 November 2026

## Scope and evidence status

This is a repository and supplied-export diagnosis performed on the feature
branch `seo/organic-growth-recovery`. The supplied baseline is a Search
Console Web export for `https://aitoolspk.tech/`, last three months, with chart
rows dated 22 October–13 November 2026. No Search Console account, URL
Inspection API, manual-action report, security-issues report, CrUX field data
or production HTML was available in this environment. The production hostname also failed
DNS resolution (`curl: (6) Could not resolve host: aitoolspk.tech`), so live
HTTP and deployment verification are **BLOCKED**.

The complete `AiToolsPk_GitHub_Copilot_ONE_SHOT_SEO_GEO_AEO_RECOVERY.md` contract is now tracked on the feature branch and was read in full. Its 20 acceptance areas are mapped in the recovery report and PR #10.

## Baseline

| Finding | Evidence | Classification |
| --- | --- | --- |
| 1,511 impressions, 7 clicks, approximately 0.46% CTR | Supplied Chart.csv summary | VERIFIED PASS (baseline recorded) |
| Pakistan: 1,464 impressions, 6 clicks, average position 8.3 | Supplied baseline | VERIFIED PASS (baseline recorded) |
| `/price-index/`: 827 impressions, 0 clicks, average position 6.88 | Supplied Pages.csv | HIGH |
| `/plans/netflix/`: 434 impressions, 1 click, average position 11.44 | Supplied Pages.csv | HIGH |
| Desktop: 821 impressions, 0 clicks; mobile: 515/7; tablet: 175/0 | Supplied device summary | HIGH |
| 236 `ai` + digits query rows, 884 impressions, 0 clicks | Supplied Queries.csv summary | MEDIUM |

The query, page and chart exports have different aggregation scopes and are
not interchangeable totals.

### Filtered `^ai[0-9]+$` query group

The additional Search Console export is explicitly filtered to the regular
expression `^ai[0-9]+$`. It reports **236 queries, 884 impressions and 0
clicks**. This is a query-group total, not evidence that every query produced
the same landing page or intent.

Its filtered Pages report groups those impressions by landing page as follows:

| Landing-page group | Impressions |
| --- | ---: |
| `/price-index/` | 822 |
| Homepage | 64 |
| `/plans/chatgpt/page/3/?category=ai-chat` | 4 |

The filtered device breakdown is desktop **565**, tablet **173**, and mobile
**146**. The country breakdown is Pakistan **883** and United States **1**.
These filtered totals are the correct evidence for the anomaly's landing-page,
device and country groups. They do **not** provide individual
query-to-page attribution: separate query rows and filtered page rows cannot
be joined to claim that `ai27538`, for example, landed on `/price-index/`.

## Query anomaly investigation

The repository was rechecked with a source-tree search for `ai` followed by
four or more digits, and the current source contains no matching catalog,
route or editorial strings. The previous report's scan of 7,959 generated or
source files is consistent with this local finding. A fresh production-export
check is **BLOCKED** until the site can be reached and a current static export
is produced.

The supplied query rows do not establish which landing pages received those
impressions. Pages.csv and Queries.csv must not be joined to fabricate
query-to-page attribution. The filtered Pages report now establishes only the
three landing-page groups above. The next valid investigation is a Search
Console Performance query filtered by each page, then separately by device and
country, with a genuine combined table or URL Inspection evidence.
Check the manual-action and security-issues reports in the same property.
Do not add the codes to content, robots.txt or noindex rules.

**Owner action required:** export the page-filtered query tables for
`/price-index/`, the homepage and the ChatGPT page-3 URL; export the
manual-action and security-issues status; provide the date range and property
scope. The existing regex-filtered totals are sufficient to document the group
pattern, but not to attribute individual query strings to pages.

## Page and device diagnosis

The Price Index is the highest-confidence CTR opportunity because it has
substantial impressions and no clicks. Its page already explains that figures
are seller-listed quotes, includes quote dates, links each tool to a collection,
and shows durations and warranty labels. The safe code change in this branch
clarifies the search snippet around “AI tool prices in Pakistan” and PKR while
retaining the seller-quote disclosure. It does not change commercial data.

No desktop-specific rendering defect can be concluded from aggregate device
data. Desktop snippets, page-filtered queries, rendered screenshots and
interaction traces are unavailable until production access is restored.

## Fresh live crawl (15/16 November 2026)

Firecrawl mapped 196 URLs and completed a 220-document crawl. All 220 returned HTTP 200. The crawl found no duplicate title groups; two documents lacked title/description fields, 20 titles exceeded 60 characters, and two documents contained under 250 extracted words. The long-title sample includes intentionally noindex offer pages, so it is not a reason to bulk-edit all titles. The two metadata-empty documents have not yet been isolated by content type. A separate OpenSEO audit remained limited to 50 pages and reported 320 discovered URLs not crawled; its sample was all HTTP 200 and indexable. Lighthouse completed 9 of 20 attempts and failed 11. These are crawler/lab observations, not GSC index or field CWV evidence.

## Technical audit

The repository already has:

- one shared canonical/OG metadata helper;
- static `robots.txt` rules allowing normal and named answer-engine crawlers;
- a generated sitemap with source-derived `lastmod`;
- an editorial publication gate keeping unapproved offers `noindex` and out of
  the sitemap;
- local checks for canonical/OG parity, unique indexable metadata, orphan
  pages, sitemap membership, JSON-LD validity, internal targets and
  Product/Offer eligibility;
- generated `llms.txt`/`llms-full.txt` discovery assets during the build.

Current local SEO scripts report 108 collections, 817 offers, 815
`NEEDS_REVIEW`, 2 `EXCLUDED`, 788 exact normalized-description duplicates and
no authorized GSC/GA4/Ahrefs/Similarweb/CrUX import. These are editorial and
commercial review queues, not reasons to bulk-index offers. The production
status, redirects, headers, canonical selection and Google-selected
canonical remain **OWNER ACTION REQUIRED / BLOCKED**.

## Product and collection SEO

The existing publication gate is correctly conservative: the local SEO run
found zero approved indexable offers and 815 needing review. Preserve that
gate. The 788 repeated descriptions require product-fact review, not
programmatic synonym replacement. Collection pages remain the proper
commercial destinations; individual offers should only become indexable after
commercial approval, current terms, useful distinct content and editorial
review.

Priority collections for owner-led evidence gathering are ChatGPT, Gemini,
Claude, Canva, Adobe, ElevenLabs, Cursor, Gamma, CapCut, Grok, Notion,
Kling, TikTok, YouTube and Microsoft. For each, obtain page-filtered GSC
queries and URL Inspection results before changing publication or creating
content.

### Gap analysis against the requested recovery scope

| Area | Current repository evidence | Safe implementation status | Classification |
| --- | --- | --- | --- |
| 32 priority listings and collections | 108 collection pages render from the public catalog; collection pages already expose factual price, duration, warranty and related-collection sections. All 817 individual offers remain gated. | Added evidence-based 32-collection internal-link scope on the Price Index; no offer was promoted. | HIGH |
| Unique product metadata and descriptions | Collection metadata is unique by slug and current quote facts. 788 offers have exact normalized-description duplicates and 815 need review. | Not safe to rewrite offers without product-fact approval; collection-level differentiation is implemented from catalog facts. | OWNER ACTION REQUIRED |
| Duplicate-description remediation | Repeated descriptions are triage evidence, not permission to bulk-edit or index. | Preserve the gate; review product IDs individually with seller terms and editorial approval. | BLOCKED |
| Technical SEO and indexing | Local export validates 1,006 HTML pages, 1,003 canonical pages, 188 indexable sitemap URLs, zero orphans and zero errors. | Repository checks pass; live status, Google-selected canonicals and URL Inspection remain unavailable. | VERIFIED PASS / OWNER ACTION REQUIRED |
| Sitemap, robots, canonicals and structured data | Generated sitemap/robots/discovery files, shared metadata helper and schema validators are present. | No conflicting local signals found; no live response verification. | VERIFIED PASS / BLOCKED |
| Speed and Core Web Vitals | Static-first build and generated thumbnails exist; no CrUX or field CWV data is available. | Added responsive `sizes` hints to fixed logo images to avoid oversized responsive candidates. | MEDIUM |
| Image optimization and responsive layout | WebP thumbnails are generated for small/card slots; browser rendering is not executable in the root environment. | Kept generated assets and improved image selection hints without changing layout. | VERIFIED PASS / BLOCKED |
| GEO/AEO and AI crawler access | Explicit crawler rules, `llms.txt`, `llms-full.txt`, `ai.txt`, entity/schema and visible answer passages exist. | No fabricated schema or citations added; live crawler access remains unverified. | VERIFIED PASS / BLOCKED |
| Internal linking and authority | Collection pages link to price index, guides, categories, related collections and relevant articles. | Added 32 evidence-based priority links from the high-impression Price Index. | HIGH |
| Trust and safety pages | About, contact, policies, editorial policy and ordering guidance are present and linked from collection guidance. | No unsupported business claims added. | VERIFIED PASS |
| Ethical backlink strategy | Existing strategy and backlink files document owner-reviewed opportunities. | No outreach or submissions performed. | OWNER ACTION REQUIRED |
| GSC monitoring and conversion tracking | No authorized GSC/GA4/CrUX import; WhatsApp is the conversion path. | Measurement plan remains documented; no tracker added without approval. | OWNER ACTION REQUIRED |

### Twenty-item implementation acceptance matrix

| # | Acceptance item | Result | Evidence or blocker |
| ---: | --- | --- | --- |
| 1 | GSC regex-group totals are recorded accurately | VERIFIED PASS | 236 queries, 884 impressions, 0 clicks |
| 2 | Filtered landing-page groups are recorded accurately | VERIFIED PASS | Price Index 822, homepage 64, ChatGPT page 3 4 |
| 3 | Query-to-page attribution is not fabricated | VERIFIED PASS | Separate query/page aggregates are explicitly separated |
| 4 | Filtered device and country totals are recorded | VERIFIED PASS | Desktop 565, tablet 173, mobile 146; Pakistan 883, US 1 |
| 5 | Priority collection destinations are crawlable | NEWLY FIXED | 32 existing `/plans/<slug>/` links now derive at build time from current offer counts, preventing a stale priority list |
| 6 | Product IDs, prices, variants and warranties are preserved | VERIFIED PASS | No catalog or commercial files changed; export gate passes |
| 7 | Unapproved offers remain protected | VERIFIED PASS | 815 `NEEDS_REVIEW`, 2 `EXCLUDED`, 0 approved indexable offers |
| 8 | Duplicate offer descriptions are investigated without bulk rewriting | VERIFIED PASS | 788 duplicates documented; individual review remains required |
| 9 | Collection metadata and factual guide content remain unique/useful | VERIFIED PASS | 108 collection routes, per-collection facts and quote references |
| 10 | Canonicals and OG URLs remain self-consistent locally | VERIFIED PASS | SEO validator found no canonical/OG errors |
| 11 | Sitemap membership matches local indexability | VERIFIED PASS | 188 indexable sitemap URLs; validator passed |
| 12 | Robots and AI crawler policy remains explicit | VERIFIED PASS | `robots.ts` names approved public crawlers; no private paths exposed |
| 13 | Structured data remains validated and claim-safe | VERIFIED PASS | Export validator passed; no Review/AggregateRating/FAQPage markup |
| 14 | Internal links and fragment targets remain valid | VERIFIED PASS | 72,855 internal references; 1,499 fragments; zero issues |
| 15 | Fixed logo images have responsive size hints | NEWLY FIXED | Collection, product, catalog, article, header and footer logo components now declare exact rendered sizes |
| 16 | Static export and public-field safety pass | VERIFIED PASS | 1,006 pages, 0 broken, 0 confidential fields |
| 17 | Core Web Vitals are measured honestly | BLOCKED | No CrUX/GSC field data; browser lab cannot launch as root |
| 18 | Production HTTP, redirects and Google-selected canonicals are verified | BLOCKED | `aitoolspk.tech` DNS returns `EAI_AGAIN` in this environment |
| 19 | Ethical authority work is prepared without outreach | OWNER ACTION REQUIRED | Strategy/backlink evidence exists; owner must approve and send outreach |
| 20 | GSC monitoring and WhatsApp conversion measurement are enabled | OWNER ACTION REQUIRED | No authorized GSC/analytics access; no tracker added without approval |

## GEO/AEO and trust

The codebase exposes explicit crawler rules, organization/website identity,
author/editorial references, collection and breadcrumb JSON-LD, and public
discovery assets. Local validators reject unsupported Review, AggregateRating
and FAQPage rich-result markup. No evidence proves third-party AI citations.
Keep visible claims aligned with seller quotes, quote dates, access limits,
warranty labels and independent-business disclosures.

## Authority, conversion and measurement

The repository contains an ethical digital-PR strategy and backlink evidence
but no authorization to contact publishers or submit listings. Outreach is
**OWNER ACTION REQUIRED**. The conversion path is WhatsApp enquiry; do not
install analytics or claim sales from clicks. Measure organic clicks,
relevant queries, landing pages, desktop CTR, priority-page indexing,
WhatsApp enquiry clicks and qualified enquiries in separate reports.

## Changes in this branch

| File | Problem/evidence | Exact fix | Regression risk and check |
| --- | --- | --- | --- |
| `src/app/price-index/page.tsx` | 827 impressions and 0 clicks in supplied Pages.csv; existing title did not state “AI tool prices” or PKR | Rewrote only the title and description to match the page's actual comparison intent and seller-quote disclosure | Low; metadata-only change. Covered by build/export SEO checks |
| `src/app/price-index/page.tsx` | A high-impression comparison page made readers scan the full index before reaching priority collections | Added a concise, factual priority-tools link block using existing collection rows, prices and plan counts; aligned CollectionPage schema naming with the visible title | Low; derived links only, no new URLs or commercial claims. Covered by build/export/browser checks |
| `src/app/price-index/page.tsx` | The recovery scope needed a concrete, crawlable destination map for the 32 largest current catalog collections | Added 32 links selected from current offer-count evidence, explicitly labelled as catalog size rather than popularity or search demand | Low; links resolve to existing collection pages and do not alter indexability |
| `src/app/price-index/page.tsx` | A manually maintained priority slug list could drift from catalog changes | Derive the 32 links from current collection counts and a stable title tie-breaker at build time | Low; only existing collection routes are emitted |
| Collection/logo components | Fixed-size thumbnails lacked `sizes`, so responsive candidates could be selected as if they were viewport-width images | Added exact rendered-size hints to collection, product, catalog, article, header and footer logo images | Low; image URL, dimensions and generated WebP assets are unchanged |
| `docs/seo/SEO_30_60_90_DAY_ROADMAP.md` | Roadmap predates the 15 November baseline | Added dated evidence and measurement constraints | Documentation-only |
| `docs/seo/GSC_PERFORMANCE_DIAGNOSIS_2026-11-15.md` | No dated diagnosis for this baseline | Added evidence, findings, implementation record, blockers and owner actions | Documentation-only |
| `docs/seo/SEO_RECOVERY_ONE_SHOT_2026-11-15.md` | The one-shot contract had no durable requirement-by-requirement implementation report | Added the final workstream status, evidence boundaries and explicit non-claims | Documentation-only |
| `docs/seo/SEO_COLLECTION_IMPLEMENTATION_MATRIX.csv` | Collection coverage was not available as a complete, reviewable artifact | Added all 108 current collection routes with priority, local validation, change and remaining-reason fields | Generated from current SEO report; no commercial data changed |
| `docs/seo/IMAGE_AND_CWV_EVIDENCE.md` | Image and performance claims lacked a measured asset baseline | Added public asset byte/dimension inventory and separated local image evidence from blocked field/lab metrics | No asset was re-encoded without a measured performance target |
| `docs/seo/OWNER_UNBLOCK_CHECKLIST.md` | GSC, DNS, CWV, Bing and product-fact dependencies were scattered across notes | Added exact owner-side evidence and approval actions required to close external blockers | Owner action required; no external account or deployment was changed |

## Test results

The following local checks ran after dependencies were installed with
`npm ci`: `npm run seo:products`, `npm run seo:keywords`, `npm run lint`,
`npm run typecheck`, `npm run build`, `npm run check:export` and
`npm run check:fragments` completed successfully. The export contains 1,006
HTML pages, 815 product routes, 72,855 checked internal references, zero
broken targets, zero confidential fields, zero duplicate indexable
descriptions and 1,499 valid fragment links. The SEO publication gate remains
815 `NEEDS_REVIEW`, 2 `EXCLUDED`, and 0 approved indexable offers.

`npm test` still has 93 passing, 2 failing browser-sandbox tests and 1 skipped
test because Chromium refuses to launch as root without its sandbox. The
Playwright Chromium was installed and the tests were retried; the same
sandbox failure remains. The failure is environmental and no test was
weakened. `npm run launch:check` and `npm run test:browser` have the same root
Chromium limitation.
`npm run seo:audit -- --live` remains blocked by
`getaddrinfo EAI_AGAIN aitoolspk.tech` and is not represented as passed.

The official Google guidance URLs required by the one-shot contract were
recorded as references, but direct retrieval from this environment failed at
DNS lookup (`WebFetchBlockedUrlError: No address associated with hostname`).
Accordingly, no current Google policy claim is presented as externally
verified here. The local Next.js App Router and accessibility guidance was
read from the installed package before reviewing the route implementation.

## 30/60/90-day owner plan

### Days 0–30 — establish reliable evidence

1. Restore production DNS/access and confirm the exact Pages deployment commit.
2. Export Search Console page-filtered and device-filtered queries for the
   Price Index and priority collections.
3. Check manual actions, security issues and URL Inspection status.
4. Compare desktop and mobile snippets and record WhatsApp enquiry clicks
   without adding unapproved trackers.
5. Re-run the local release gates and verify the static production export.

### Days 31–60 — test focused improvements

1. Review the Price Index CTR change against a comparable Search Console
   window; keep or revert based on relevant clicks, not impressions alone.
2. Improve only priority collections with verified product facts and distinct
   intent ownership.
3. Review repeated offer descriptions individually; do not bulk-index them.
4. Recheck internal links, canonical selection, indexing and Core Web Vitals.

### Days 61–90 — scale what evidence supports

1. Retain pages that gain relevant Pakistani clicks or qualified enquiries;
   revise pages that do not.
2. Request indexing only for approved, useful URLs after URL Inspection.
3. Execute owner-approved ethical PR contributions and record outcomes.
4. Review Bing Webmaster Tools/Copilot visibility and any genuine AI
   citations separately from Google rankings.

No ranking, traffic, backlink, indexing or AI-citation outcome is guaranteed.

## Owner action checklist and blockers

- **BLOCKED:** restore DNS/production reachability and provide a live
  deployment URL/commit confirmation.
- **OWNER ACTION REQUIRED:** provide genuine combined or filtered Search
  Console query/page/device exports; do not join separate exports.
- **OWNER ACTION REQUIRED:** review manual actions, security issues and URL
  Inspection for priority collections.
- **OWNER ACTION REQUIRED:** approve any product-fact, warranty, price,
  outreach, analytics or publication-state decision.
- **OWNER ACTION REQUIRED:** verify Bing Webmaster Tools and inspect Copilot
  results.

## Rollback

Revert the single metadata hunk in `src/app/price-index/page.tsx`; the
publication gate, catalog and commercial records are unchanged. Do not merge
or deploy this branch without the owner-side evidence above.
