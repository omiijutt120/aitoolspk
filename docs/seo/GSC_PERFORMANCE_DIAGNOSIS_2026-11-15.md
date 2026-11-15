# GSC performance diagnosis — 15 November 2026

## Scope and evidence status

This is a repository and supplied-export diagnosis performed on the feature
branch `seo/organic-growth-recovery`. The supplied baseline is a Search
Console Web export for `https://aitoolspk.tech/`, last three months, with chart
rows dated 22 October–13 November 2026. No Search Console account, URL
Inspection API, device-filtered query export, page-filtered query export,
manual-action report, security-issues report, CrUX field data or production
HTML was available in this environment. The production hostname also failed
DNS resolution (`curl: (6) Could not resolve host: aitoolspk.tech`), so live
HTTP and deployment verification are **BLOCKED**.

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

## Query anomaly investigation

The repository was rechecked with a source-tree search for `ai` followed by
four or more digits, and the current source contains no matching catalog,
route or editorial strings. The previous report's scan of 7,959 generated or
source files is consistent with this local finding. A fresh production-export
check is **BLOCKED** until the site can be reached and a current static export
is produced.

The supplied query rows do not establish which landing pages received those
impressions. Pages.csv and Queries.csv must not be joined to fabricate
query-to-page attribution. The next valid investigation is a Search Console
Performance query filtered by page, then separately by device and country.
Check the manual-action and security-issues reports in the same property.
Do not add the codes to content, robots.txt or noindex rules.

**Owner action required:** export the filtered query tables for `/price-index/`,
desktop, mobile, tablet and Pakistan; export the manual-action and security
issues status; provide the date range and property scope.

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
| `docs/seo/SEO_30_60_90_DAY_ROADMAP.md` | Roadmap predates the 15 November baseline | Added dated evidence and measurement constraints | Documentation-only |
| `docs/seo/GSC_PERFORMANCE_DIAGNOSIS_2026-11-15.md` | No dated diagnosis for this baseline | Added evidence, findings, implementation record, blockers and owner actions | Documentation-only |

## Test results

The following local checks ran after dependencies were installed with
`npm ci`: `npm run seo:products` and `npm run seo:keywords` completed;
`npm run lint`, `npm run typecheck`, `npm test` and `npm run check:repo` were
started. Lint and typecheck passed; the unit suite had 93 passing, 2 failing
browser-sandbox tests and 1 skipped test because Chromium refuses to launch
as root without its sandbox. The repository check passed with 0 issues.

The build, export, fragment, launch and browser suites remain to be run after
the metadata change. `npm run seo:audit -- --live` is blocked by DNS
resolution and must not be represented as passed.

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
