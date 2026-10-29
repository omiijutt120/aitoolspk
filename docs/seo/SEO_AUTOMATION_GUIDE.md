# Operating the SEO engine

Use the repository's Node 24 runtime and `npm ci`. No additional service, secret, global Python package or paid SEO account is required for deterministic builds. All generated intelligence stays in ignored `reports/seo/`; deploy only `out/`.

| Command                       | Actual behavior                                                                                                                                                   |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run seo:products`        | Analyze every sanitized offer; write full master JSON/CSV, coverage, blockers, quality, refresh and internal-link recommendations                                 |
| `npm run seo:keywords`        | Rebuild complete keyword-to-parent map, intent clusters and sourced opportunity CSV; no external request                                                          |
| `npm run seo:audit`           | Rebuild intelligence and inspect every **existing local** exported HTML page; fails inconsistent metadata/indexing/schema/navigation                              |
| `npm run seo:audit -- --live` | Explicit sequential owner-site HTML crawl, then local audit; 600ms request spacing, 15s timeout, 1,500-URL cap, generic robots rules, same origin, no query crawl |
| `npm run seo:validate`        | Same deterministic whole-export publication gate; run after fresh static build                                                                                    |
| `npm run seo:report`          | Refresh report artifacts from sanitized facts, selected evidence and existing local HTML                                                                          |
| `npm run seo:build-check`     | Run the complete `launch:check` release gate, including a new build and the SEO postbuild gate                                                                    |
| `npm run test:browser`        | Production-export Playwright/axe tests on local server; never publishes                                                                                           |

`seo:audit --live` does not reproduce browser, external-link, asset, security-header, redirect or field-performance testing. The initial comprehensive audit separately checked all 165 assets, redirects and 17 browser cases. A repeated live HTML audit overwrites its crawl artifact with an explicitly scoped new result; retain dated evidence copies outside the public repository when comparing runs. Never claim those unrun checks from the narrower crawler.

## Product update and review process

1. Update original source/inventory through the existing documented private import process. Keep supplier data/evidence in `private/`. Owner-authored premium plans live separately in `data/premium-products.json`; exact selling prices and existing IDs/URLs must be preserved unless an explicit real update is authorized.
2. Run import and `seo:products`. Compare `sourceFingerprint`, change status and removed IDs with the prior ignored snapshot. Review all changed public claims and quote dates; dates represent actual confirmation, not an automatic freshness reset.
3. Resolve authorization, delivery, exact description, duration, access, warranty, renewal and stock-review evidence through the existing private approval workflow. An available flag, verbal promise or checklist score cannot bypass commercial approval. Reviewed premium terms are sanitized on import. Clean CI preserves committed reviewed terms/exclusions; edited approved authored facts fail until locally re-reviewed.
4. Read the per-ID content specification, source observations and duplicate/intent flags. Improve verified useful content in the maintained public data/component model. Prefer the existing parent for shared intent. No automatic free-text content generation invents missing features.
5. For a commercially approved, useful and genuinely distinct individual page, add its **public ID** to `data/seo/editorial.json`, with `reviewedAt` (actual `YYYY-MM-DD`), `contentFingerprint` from the current report, `distinctIntent: true`, `usefulContent: true`, and `publication: "ready"`. These are accountable editorial assertions; inspect the page before setting them. Use `publication: "hold"` to keep otherwise reviewed material noindex. Never put evidence, names, tokens or confidential notes in this file.
6. Run `seo:build-check` and `test:browser`. Final HTML metadata, sitemap and Product/Offer must agree with the shared gate. A changed public price/term/content fingerprint invalidates the previous editorial review. Excluded offers remain in intelligence but disappear from public catalog/routes.
7. Inspect the concrete diff, then obtain the separate release authorization. No command above deploys. After an authorized manual Pages workflow, repeat the live crawl and browser checks, submit/inspect only eligible canonical URLs through the owner's GSC account and record actual results.

Current editorial map is empty and every offer is pending: no individual product indexing was enabled. Useful parent pages remain indexable. Product markup is only considered after both gates; Offer additionally requires current price/stock/order readiness. A quote ageing out does not fabricate an in-stock offer or silently rewrite price dates.

An explicit `ready` or `hold` decision and a real calendar review date are required; missing/invalid decisions fail closed. Updating only a quote-confirmation date does not invalidate a matching distinct-content review. Changed prices or substantive terms do. Premium approvals reject URL-only, blank or unspecified public terms after sanitization; narrower reviewed warranty terms cannot inherit the full-duration badge or promise.

## Research and performance imports

Optional local `research-observations.json` contains `checkedAt`, `method`, `limitations`, and observations with unique `id`, `queries`, valid `clusterSlugs`, `sourceUrl`, `competitorUrl`, `pageType`, `observedTopics`, `opportunity`, `evidenceDate`. Keep it ignored. A CI run without it truthfully labels candidates as hypotheses; evidence is not invented or required to build.

An authorized, unmodified **GSC Pages CSV** may be selected explicitly:

```text
npm run seo:products -- --gsc private/gsc/Pages.csv --scope private/gsc/scope.json
```

The scope JSON requires `site: "https://aitoolspk.tech"`, `startDate`, `endDate`, `searchType` and should record country/device/filter selections. Required CSV headers are `Top pages,Clicks,Impressions,CTR,Position`; CTR keeps its percent sign. The importer rejects foreign/filtered/duplicate URLs and invalid metrics. Only exact canonical offer matches enrich offer metrics. Parent data stays in the separate imported Pages dataset; it is never copied onto child offers. Do not join independent Pages and Queries exports into invented query-page rows.

No current owner export is installed. GSC indexing status, query coverage, traffic, conversion trend, AI citations, volume/CPC/difficulty, backlink counts and field CWV remain null. Do not count null as zero. Keep dates/search type/country/device comparable and retain privacy thresholds/export limits. See [GSC setup](GOOGLE_SEARCH_CONSOLE_SETUP.md).

## Cadence and rollback

Run source coverage on changes; validate every release; refresh quotes/stock at least weekly and before confirming an order; review research monthly or on material vendor changes. These are operational recommendations, **not installed scheduled jobs**. No paid request, account connection, outreach or unattended publication has been enabled.

For rollback, revert the specific public catalog/editorial/source changes in a reviewed branch, rebuild and run both gates. Do not remove publication restrictions, edit private evidence to force eligibility, restore the retired basePath workflow or deploy raw reports. Preserve previous evidence snapshots for before/after comparison. Consult [implementation evidence](IMPLEMENTATION_SUMMARY.md) and [30/60/90-day plan](SEO_30_60_90_DAY_ROADMAP.md).
