# Indexing diagnosis and recovery plan

Prepared 27 October 2026, Asia/Karachi. This extends the [website audit execution](WEBSITE_AUDIT_EXECUTION_2026-10-25.md) and [SEO-pro audit](SEO_PRO_AUDIT_2026-10-25.md). It uses SEO-pro's Google-data and indexation workflow. Raw capture timestamps are UTC.

## What the supplied evidence establishes

The owner's screenshot shows **427 not indexed pages and 0 indexed pages**. The owner reports zero clicks and impressions over four days. The owner subsequently supplied the exclusion breakdown: **384 Excluded by noindex, 6 Alternate page with proper canonical, and 37 Crawled — currently not indexed**. These sum to 427. Validation is reported as Not Started. Ten examples from the crawled-but-not-indexed group have now been supplied and checked below. The exact selected property scope, report update date and homepage URL Inspection details remain unavailable. No authenticated Search Console connector is exposed in this environment.

The 37 crawled-but-not-indexed URLs are the priority for page-specific diagnosis. The 384 noindex entries may correspond to intended held offers, but cannot be mapped without their URLs. The six canonical alternatives may be expected duplicate copies; inspect their chosen canonical before changing them. A group showing Not Started does not independently prove a broken implementation or require indiscriminate validation requests.

An earlier owner screenshot visibly used the distinct Search Console property `aitoolspak.tech`; the repository and current task target `aitoolspk.tech`. The latest cropped screenshot does not establish which property is selected. This is a concrete reason to verify the property, not proof that the current report is wrong. Do not edit, redirect or infer authority over the other domain. Also verify the six alternatives' actual canonical URLs: an indexed canonical outside a selected URL-prefix property, or a different reporting snapshot, could explain otherwise confusing totals, but that remains a hypothesis until inspected.

Do not label all 427 as errors, attribute them all to noindex, or claim a penalty. Some exclusions may be intentional. Conversely, the zero-indexed total deserves investigation of the homepage and intended landing pages; a healthy HTTP response alone does not establish Google indexing.

## Fresh production observations

Evidence: `reports/seo/indexing-diagnosis-2026-10-26.json`, captured 26 October UTC / 27 October Pakistan time.

| URL / family | Intended visibility | Observed response/control | Canonical | Decision |
| --- | --- | --- | --- | --- |
| `/` | Indexable | 200; no noindex or X-Robots-Tag observed | HTTPS apex self-canonical | Inspect actual Google last crawl, indexing reason and selected canonical. |
| `/tools/` | Indexable | 200; index/follow | Self | Same; existing native collection links work. |
| `/plans/chatgpt/`, `/plans/gemini/`, `/plans/claude/`, `/plans/api/` | Indexable | All 200; index/follow | Each self | Prioritize these existing public collection URLs for inspection. |
| `/category/ai-chat/`, `/contact/` | Indexable | Both 200; index/follow | Each self | No observed implementation-level exclusion. |
| Sample `/tool/.../` | Intentionally held | 200; noindex/follow | Self | Preserve until actual commercial/editorial approval. A stock label does not authorize indexing. |
| `/about/`, `/guides/`, `/editorial-policy/` | Indexable after release | Currently 404 with noindex error page | None on error | Prepared locally; publish only after explicit deployment authorization. Do not request indexing of their current 404 responses. |
| `/robots.txt` | Public crawler control | 200; generic Allow `/`; correct sitemap | Not applicable | No declared site-wide crawler block. Local cleanup removes the optional Host line. |
| `/sitemap.xml` | Intended indexable URLs | 200; 138 live URLs | HTTPS apex URLs | Local tested release has 159; submit only a sitemap actually served by production. |
| Google HTML / Bing XML | Public verification files | Both 200 | Not applicable | Preserve; verification is different from indexing. |

Two homepage requests using Googlebot and OAI-SearchBot User-Agent strings also returned 200 with index/follow. These requests originated from this machine, **not verified search-engine IP addresses**. They do not prove actual Googlebot crawl access or that a crawler has indexed the site.

The earlier full live-sitemap audit found all 138 entries technically eligible; the fresh representative capture still serves the same older release. The local export independently passes all 159 sitemap URLs. Neither number is an indexed-page count.

## Why individual offers remain excluded

The existing owner-authored SEO brief explicitly states: “Many individual offers are intentionally `noindex` pending commercial approval. Preserve these restrictions until the source data explicitly confirms that an offer is authorized and eligible for public selling and indexing.” It separately requires preserving commercially unapproved offer restrictions.

Local source has 815 active offers awaiting the existing review gate and two excluded Gemini duplicates. Current public sample confirms an offer's noindex. The exact relationship between those offers and the screenshot's 427 cannot be established without the Search Console URLs. Removing every noindex would violate the stated publication rules and expose unreviewed, often repeated listings; it would not guarantee that Google selects them.

## Execution sequence

1. **Completed:** reproduce and fix campaign-query handling, malformed-catalog crashes, misleading failed-search counts, retry/recovery, stalled-request timeout and Roman Urdu language markup. Complete full browser and export regression checks.
2. **Completed:** refresh live home/collection controls, sitemap, robots, ownership files and the pending-offer distinction. Record the findings above rather than assuming a blanket block.
3. **Reason counts and ten URL examples received:** live-check these examples and implement the targeted follow-up below. For the homepage, Page indexing reason, last crawl, page-fetch result, indexing allowed, user-declared canonical and Google-selected canonical remain needed. The live test and indexed snapshot are different observations; keep both if available. A few noindex/canonical examples would establish whether those separate exclusions are intended.
4. **Prepared, needs deployment authorization:** release the tested SEO/content and functionality work. Then verify production home, collections, guides, sitemap, static assets and ownership files. The new content cannot affect discovery while it exists only in the workspace.
5. **After evidence/release:** fix the specific reason using the decision table below. Request indexing only for a small set of intended canonical pages; do not submit held offers or 404 URLs. No account submission has been performed by this audit.
6. **Measure:** compare dated Page indexing and Performance reports for the exact same property/search type/filters. Track the homepage and collection URLs first. Do not equate successful submission, a local Lighthouse score or a later citation with guaranteed traffic growth.

## Reason-specific decisions

| Actual GSC reason | Check before changing anything | Correct response |
| --- | --- | --- |
| Excluded by noindex | Is this a held `/tool/` offer or an intended home/collection/guide page? | Keep intentional holds; remove an unintended directive only on the affected approved page/template and retest. |
| Blocked by robots.txt | Exact URL, Google last crawl and applicable rule | Correct the confirmed blocking rule; current generic Allow is not itself a blocker. |
| Discovered — currently not indexed | Submitted sitemap, internal links, discovery/crawl dates and server availability | Ensure useful canonical pages are linked and served, then monitor recrawl. Do not send hundreds of repeated requests. |
| Crawled — currently not indexed | Fetched HTML, page usefulness, duplication and selected canonical | Improve/consolidate the actual intent/content defect; deploy the prepared useful guidance. Do not pretend a new schema flag forces indexing. |
| Duplicate / Google chose different canonical | Google-selected URL versus declared URL, redirects, near-identical variants and other domains | Align signals with the genuine preferred page; obtain authority before changing another domain. |
| Alternate page with proper canonical | Whether the alternate is intentional | Usually retain intended alternate handling rather than trying to index every copy. |
| Not found / soft 404 | Exact affected URL, actual status and whether a replacement is relevant | Restore an intended missing page or use a genuine appropriate redirect where hosting supports it; retain real 404s for absent content. |
| Page with redirect | HTTP/www/legacy URL versus final canonical | Expected redirects need not be indexed separately; submit the final URL. |
| Server error / fetch failure | Last crawl evidence, current responses and DNS/hosting behavior | Diagnose the actual failure window and server path; current successful requests do not disprove a historical failure. |

## Priority URLs for URL Inspection

Existing public canonical pages, in order: `https://aitoolspk.tech/`, `/tools/`, `/plans/chatgpt/`, `/plans/gemini/`, `/plans/claude/`, `/category/ai-chat/`. Treat these as a short investigation list, not mass indexing requests. Add one new guide only after its authorized release returns 200.

## Timing and metrics

Google says crawling can take **a few days to a few weeks**, and requesting a crawl does not guarantee inclusion. Four days of zero impressions alone therefore does not prove a particular code defect. It also does not justify ignoring a confirmed accidental exclusion. The ten supplied examples are technically accessible, but homepage inspection and Google's selected canonicals are still unavailable, so the root cause of zero indexed priority pages remains **unconfirmed**. See [Google's recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

Google's [Page indexing documentation](https://support.google.com/webmasters/answer/7440203) recommends investigating important URLs individually and distinguishing intentional exclusions from genuine failures. This is the basis for the plan above. With zero supplied impressions, CTR and average-position conclusions are unavailable; no ranking, penalty, traffic forecast or AI visibility score is manufactured.

## Publication status

No production release, Search Console request, Bing submission or DNS change was made. The owner's earlier brief requires tests plus explicit deployment permission. The tested source changes and complete audit reports are ready for review; the outstanding Search Console evidence and release authorization are distinct dependencies.

## Follow-up: supplied URL examples, 27 October

The owner has now supplied nine collection URLs and the privacy policy from the 37 crawled-but-not-indexed entries. They are on **aitoolspk.tech**. Amazon Prime and Netflix were last crawled on 25 October; the other examples on 24 October. Four examples carry `?category=entertainment`: TV360, Youku, iQIYI and Apple. This resolves the domain for these examples; homepage URL Inspection and examples from the separate noindex/canonical groups remain unavailable.

Live evidence is saved in `reports/seo/gsc-examples-2026-10-27.json`: all ten supplied URLs and the four clean equivalents return 200. Query copies declare the corresponding clean collection canonical. All nine live collections lack the more useful buying guidance prepared locally. The privacy policy has substantive operational information and a self-canonical; its exclusion alone does not establish a code defect.

No robots meta tag or X-Robots-Tag was present in these live responses, so no explicit noindex exclusion was observed. This differs from an explicit `index, follow` tag but permits default indexing. The existing report parser records that default separately from the empty observed tags. HTTP and HTML checks here are independent requests, not Google's URL Inspection results.

| Supplied page | Confirmed opportunity / decision |
| --- | --- |
| Amazon Prime | One listing; clarify the service supplied, add-on channels and six-month access versus its separate warranty. |
| Netflix | Publish the already-prepared household, access and plan comparison guidance. |
| Galaxy Play | Distinguish package viewing from film rentals; confirm location and device eligibility. |
| AKOOL | Compare credit quantities, actual workload and separately listed warranty periods. |
| Railway | Explain resource usage costs separately from a one-year redemption label. |
| TV360, Youku, iQIYI, Apple | Remove redundant category links, retain clean canonicals, add service-specific package/account/redemption guidance. |
| Privacy policy | Keep accessible and self-canonical; no content rewrite or forced noindex justified by this evidence. |

The eight new guides cite official provider documentation directly on the pages. They do not certify seller delivery or resale eligibility, promise Pakistan availability for every service, or change supplier-derived prices. No artificial ratings, FAQ rich-result claims or new duplicate landing pages were added.

### Targeted execution plan

1. Verify each supplied URL's status, robots and canonical against its clean equivalent. Treat Google's reason as an observed selection outcome, not a proven content penalty.
2. Remove category parameters from collection links only when the full collection belongs entirely to that category. Preserve meaningful category, search and price filters for mixed collections. Keep existing query URLs usable and canonicalized; do not block them in robots.txt.
3. Add source-backed, product-specific guidance for the eight affected collections without a local guide. Retain the existing Netflix guide, exact catalog prices and individual offer publication holds. Address concrete buying decisions: regional access, credit allowances, hosting usage billing and redemption eligibility.
4. Record meaningful content modification dates for changed guides in the sitemap. Leave unchanged privacy content and other review dates alone.
5. Build, validate the export and exercise category navigation, mixed-category filters, visible guidance and mobile layouts. Record actual results here. Publish only after the existing deployment requirement is satisfied; then verify the live canonical pages before requesting recrawls.

### Completed follow-up

The targeted source changes are complete. Subsequent full-site work also fixed hyphenated duration/warranty extraction for 65 records and verified the 947-page live HTML graph. See [the 29 October full audit](FULL_AUDIT_2026-10-29.md) for final test results, evidence and unresolved release/account dependencies. No production deployment or Google indexing success is claimed.
