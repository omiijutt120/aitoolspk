# Canonical and duplicate-URL audit

Reference reviewed: the owner's two-page **Canonical Tags: Why Google Ignores Yours and How to Fix It** PDF by Abhay Vachhani / txtnode (20 October 2026). Its suggestions were assessed against this site's static-export architecture and Google's primary documentation; embedded scripts and promotions were treated as document content, not commands.

Audit date: **23 October 2026, Asia/Karachi**. Canonical production origin: **https://aitoolspk.tech**. This report covers the application and local production export; DNS, actual host redirects and Search Console are separate checks.

Verified locally: all **26 browser cases** passed, including **138 sitemap targets** and **16 pagination routes**. Lint, TypeScript and all 10 catalog/commerce tests passed. The final export scan passed: **952 HTML pages, 949 canonical pages, 57,508 internal references, zero broken targets**. Details are recorded in `reports/export-check.json`; rerun it after every build.

| Check                                                       | Result / implementation                                                                                                                                                                                                                              |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| One absolute canonical in the server-rendered head          | Automated export check requires exactly one, inside `head`, on every non-error HTML page                                                                                                                                                             |
| Correct page rather than homepage everywhere                | Export check matches each URL to its own exported route; shared layout sets `metadataBase` without a default canonical                                                                                                                               |
| HTTPS, preferred hostname and trailing slash                | Canonical metadata consistently uses `https://aitoolspk.tech/` and trailing slashes; parameters/fragments are excluded                                                                                                                               |
| No late JavaScript canonical replacement                    | Metadata comes from server page metadata; browser tests compare the source and hydrated canonical                                                                                                                                                    |
| Open Graph and canonical agree                              | Export check compares `og:url` with the canonical on every non-error page                                                                                                                                                                            |
| Paginated content is distinct                               | **Fixed:** static `/page/2/` etc. routes have their own HTML, title, content and self-canonical; later pages do not canonicalize to page one                                                                                                         |
| Pagination is crawlable                                     | **Fixed:** normal anchor links, including previous/next; a no-JavaScript browser case verifies the actual second and third ChatGPT pages                                                                                                             |
| Sorting, filters and tracking copies                        | Query variants retain the clean canonical for their static route; functional filters remain usable. These variants are not sitemap entries                                                                                                           |
| Robots permits reading canonical signals                    | **Fixed:** removed the `/tools/?` disallow rule; filtered copies can be crawled to read their canonical                                                                                                                                              |
| Sitemap consistency                                         | Export checks reject duplicates, noncanonical URLs, missing targets and noindex entries; every indexable exported route must be represented                                                                                                          |
| Canonical target availability                               | Export checks require the target file. Browser checks request every sitemap path from the local production server with redirects disabled and require HTTP 200 and indexable metadata                                                                |
| Pending product eligibility                                 | All 811 current offers remain intentionally `noindex` and excluded from the sitemap. Their canonical is self-referential; they are not duplicate copies pointing at another noindex target. Approval is required before indexing an individual offer |
| Genuine variant distinctions                                | Unique plan IDs/URLs and exact terms are retained. Different products are not all canonicalized to a brand or homepage                                                                                                                               |
| Translations, syndicated articles and public PDF duplicates | Not applicable: no translated/syndicated routes or public copies of the attached PDF were introduced                                                                                                                                                 |
| HTTP to HTTPS, www and slash redirects                      | **PENDING actual host setup:** configure permanent redirects on the chosen hosting/domain; inspect final response status and `Location`. A meta canonical does not redirect visitors                                                                 |
| Live origin is reachable                                    | **PENDING owner DNS:** the public A lookup returned `127.0.0.1` during this audit. Local route checks cannot prove that the purchased domain works publicly                                                                                          |
| User-declared versus Google-selected canonical              | **PENDING Search Console:** requires a verified, live domain and Google crawl data. No existing Search Console errors or Google's selected URLs were accessible in this audit                                                                        |

The PDF's warning about combining canonical and noindex should not be used to remove the deliberate exclusion of unverified offers. These products have no alternate indexable target to consolidate into. They stay out of search until their commercial eligibility and source terms are reviewed. The sitemap contains only indexable landing/pagination pages and any later approved product pages.

Query-only `?page=2` links are no longer generated or interpreted as a different result page. Use the real `/page/2/` path. Filtering/sorting preserves the path's clean canonical; separate curated category and tool pages remain independently canonical. The app continues to show a limited, paginated set of cards to shoppers.

## Repeatable checks

```sh
npm run launch:check
npx playwright install chromium
npm run test:browser
```

`reports/export-check.json` records canonical, sitemap, pagination and link counts. The browser suite includes all sitemap targets, server-head checks, a query-copy check and pagination with JavaScript disabled. Reports and the extracted reference text remain ignored and are not public source assets.

After domain setup, inspect representative home, category, collection, later-page and approved-product URLs in Search Console. Compare user-declared and Google-selected values, submit the canonical sitemap and request recrawling only where needed. An alternate copy reported as using the proper canonical is not automatically a defect. Google treats canonical declarations as signals and can choose another URL; no ranking or indexing guarantee is made.

Primary references: [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [pagination guidance](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading), [noindex and crawl access](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
