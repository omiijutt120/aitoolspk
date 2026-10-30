# Search Console exports and recovery release — 30 October 2026

## What the 427 count means

The owner supplied three Coverage Drilldown ZIPs dated 30 October. Their metadata says **All known pages**; their Chart.csv files each contain one point dated **23 October 2026**. URL rows have separate last-crawl dates. These files contain indexing exclusions, not a four-day Search Performance or sales export. The screenshot reports **zero indexed**; no successful Google recovery is claimed.

| Export reason | Rows | Action |
| --- | ---: | --- |
| Excluded by noindex | 384 | Match every offer to its actual review decision. Preserve pending-offer holds and index useful parent collections. |
| Alternative page with proper canonical | 6 | Preserve clean parent canonicals. Remove redundant category parameters from internal navigation where they cannot change results. |
| Crawled — currently not indexed | 37 | Check every URL, including homepage and ChatGPT. Publish useful, tested source improvements and inspect Google's chosen canonical after recrawl. |

The objective is indexing useful canonical landing pages, not forcing all variant/filter URLs into Google. Google explicitly says expected duplicates and deliberate exclusions need not be indexed. A successful HTTP fetch only establishes accessibility; it does not establish Google's indexing decision. [Page indexing guidance](https://support.google.com/webmasters/answer/7440203).

## Changes included in the authorized release

- The previously unpublished audit batch: clean category links, server-rendered comparison tables, useful buying guidance, accurate structured data and discovery files, fast catalog handling and verified ownership assets.
- Five more source-checked collection guides for Suno, Runway, Coursera, Spotify and iCloud, targeting pages in the supplied crawled-not-indexed export. Total collection guides: 38. These improve purchase information; they are not evidence of why Google excluded a URL.
- Sixteen additional duration corrections: preserve ranges such as 5–7 days; do not present account age as subscription access; leave ambiguous unseparated terms unspecified. Retail amounts, IDs, slugs, stock, quote dates and approval states are unchanged. The earlier 65 duration/warranty corrections remain included.
- Preserve newer remote changes through `fa73f60`: buyer clarity, native category navigation, API/ElevenLabs checklists, pagination descriptions and the exact-commit deployment guard. No force push or replacement of the remote history.
- Normalize source text line endings for repeatable Windows/Linux checks. No private catalog inputs or Search Console exports are committed.

Owner explicitly authorized pushing and publishing the tested batch in this conversation on 30 October. Earlier documents describing it as unpublished are historical snapshots. Publication is complete only after the guarded Pages workflow succeeds and the live output is verified.

## Evidence and verification

Private working evidence is under ignored `reports/seo/`:

- `gsc-exports-2026-10-30.json`: all three ZIP contents normalized without changing their metadata/date scope.
- `gsc-reconciliation-2026-10-30.json` and `.csv`: row-level HTTP, robots, canonical, sitemap and local review decisions for every supplied URL.
- `range-fixes-2026-10-30.json`: sixteen exact before/after duration changes.
- `merged-unit-2026-10-30.log`: 43 unit tests passed before final release validation.

Final workflow and live results are recorded below once measured. Earlier Lighthouse measurements are lab diagnostics, not evidence of traffic, leads or Google indexing.

### Measured pre-release results

All **427 exported URLs returned HTTP 200**, with no fetch failures. All six alternate URLs nominate their clean collection path. All 37 crawled-not-indexed URLs are currently accessible without a noindex directive and nominate their clean paths; 15 include category parameters and the set covers 36 distinct clean pages. All 384 excluded offer URLs still emit noindex. This confirms the distinction between actual review holds and Google's selection decisions; it does not change their GSC status.

The merged local release gate passed: repository confidentiality scan, ESLint, TypeScript, 43 unit tests, both dependency audits with zero advisories, production build and full export checks. The export contains 159 indexable sitemap URLs, 974 canonical pages and 815 individual offers. All 64,526 internal references resolve to valid targets; 1,040 fragment references have no missing anchors or duplicate IDs. Browser and production workflow results follow after completion.

## After the release

1. In the verified `https://aitoolspk.tech/` property, submit or recheck `https://aitoolspk.tech/sitemap.xml` and confirm that Google reads it successfully.
2. Inspect the homepage, `/plans/chatgpt/`, `/plans/gemini/`, `/plans/canva/`, `/plans/suno/`, `/plans/runway/` and `/plans/coursera/`. Compare the indexed result with Test Live URL, Google-selected canonical, crawl date and indexability. Request indexing for these canonical URLs after confirming the deployed improvements.
3. Do not request indexing for held `/tool/` offers or category-filter copies. To release an offer from its hold, supply its actual authorized delivery and complete reviewed public terms through the existing catalog-review process; stock confirmation alone is insufficient.
4. Compare fresh coverage exports after recrawl, keeping report dates separate from last-crawl dates. Watch important canonical URLs rather than treating a falling exclusion total as the only success measure.
5. Export Search Performance for equal windows with dates, search type and filters. Compare impressions first, then clicks and relevant enquiries. No traffic, attribution or customer acquisition outcome can be calculated from these coverage ZIPs alone.

Google says recrawling can take days to weeks and does not guarantee inclusion. Repeated requests do not accelerate it. There is no four-day click or customer guarantee. [Google recrawl documentation](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

If the homepage's Google-selected canonical points to another domain, investigate that specific evidence before changing ownership, redirects or the other domain. The supplied coverage files do not report Google's chosen canonical.
