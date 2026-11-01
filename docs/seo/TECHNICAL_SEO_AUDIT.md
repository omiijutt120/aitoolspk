# Technical SEO audit and release controls

Evidence date: 23 October 2026. Public and local release evidence are kept separate; the local implementation is not deployed by this task.

| Check                       | Verified live baseline                                                 | Local implementation / verification                                                                                       |
| --------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| HTTPS and canonical host    | HTTP and www redirect to HTTPS apex; apex 200                          | Canonical origin guarded as `https://aitoolspk.tech`; no DNS changes                                                      |
| Assets / repository prefix  | 165/165 assets 200; no `/aitoolspk/` defect                            | Root-relative export and RSC path repair retained; browser/export checks enforce                                          |
| HTML coverage               | 949 pages, all 200                                                     | Complete generated catalog checked in final release gates                                                                 |
| Sitemap / robots            | 138 sitemap URLs, no mismatches; 811 intentional noindex offers        | Shared publication decision controls metadata, sitemap, Product and Offer; noindex stays crawlable                        |
| Canonicals / H1             | All 949 self canonical, one H1                                         | Exactly one head canonical; canonical/OG/self URL agreement and one H1 enforced                                           |
| Metadata                    | No duplicate titles; eight duplicate-description groups /24 URLs       | Existing pagination-specific descriptions retained; duplicate indexable titles **and descriptions** now fail the SEO gate |
| Structured data             | Valid JSON-LD; no unapproved Product/Offer; older FAQPage remains live | Retired FAQPage removed in unpublished source; truthful collection/list/Article/Breadcrumb; no fabricated review/rating   |
| Internal navigation         | No orphans/unfetched internal HTML targets                             | Whole-export incoming-link graph, stable parent mapping, guide links and orphan gate                                      |
| Mobile / behavior           | 17/17 live emulated-browser checks, zero console/resource errors       | Complete local Playwright/axe suite and lab performance evidence in final summary                                         |
| Field CWV / Google indexing | Unknown                                                                | No fake pass; GSC/CrUX evidence requires eligible real data                                                               |
| Security headers            | Selected HTTP headers absent on GitHub Pages; HTML meta CSP separate   | Hosting limitation documented; `_headers`/Vercel config are not claimed effective on Pages                                |

## Changes that protect future releases

1. `src/lib/seo-publication.mjs` centralizes commercial and editorial indexing decisions. A public-content fingerprint prevents a price/term/content change from silently inheriting an old editorial review. An unapproved commercial offer cannot be promoted through SEO flags.
2. `data/seo/editorial.json` holds only safe public flags and hashes. Current map is empty; approvals remain unchanged. Metadata and sitemap consume the same function as the intelligence engine and HTML validator.
3. `scripts/seo/run.mjs` checks all final HTML, metadata, robots, sitemap, nested JSON-LD types, incoming links and per-offer publication decisions. It refuses orphan routes, contradictory Product/Offer markup and duplicate indexable metadata.
4. Existing `check-export.mjs` retains whole-export asset/link/privacy protection and now also applies editorial publication gating. It is not replaced by a sample crawler.
5. Premium imports use sanitized exact reviewed public terms. Clean CI preserves committed approval/exclusion rather than regenerating pending entries blindly; a changed reviewed price/authored offer requires explicit local review.
6. The build generates intelligence privately and validates exported HTML after static-path repair. Manual release still requires the existing browser/repository/dependency checks. No external audit runs implicitly during builds.

## Remaining constraints

All 817 commercial offers are pending and individual pages intentionally noindex. A better SEO score cannot resolve that. Existing useful parent collections remain the comparison/search targets. Missing official usable logos use text fallback, not invented assets. No public FAQ claim, vendor entitlement or warranty right is inferred from a software brand.

Duplicate description flags concern the older public pagination release; final local measurements are in [implementation summary](IMPLEMENTATION_SUMMARY.md). Google may recrawl slowly after an eventual authorized release; no indexing/rank change is claimed. GitHub Pages cannot supply arbitrary server redirects/headers or backend analytics without another service. Preserve current hosting until a separate change is warranted.

The existing dependency gate narrowly documents one unpatched build-tool-only braces advisory chain; production audit is zero vulnerabilities at the recorded check. Any new advisory, critical finding or runtime dependency issue fails the gate. Do not run `audit fix --force` or broaden the exception to force a pass.

Raw evidence is ignored: `production-findings.json`, `production-browser.json`, `local-technical-audit.json`, `page-indexability-matrix.csv`, `reports/export-check.json` and `reports/launch-check.json`. The final summary records actual completed tests rather than treating planned checks as passed.

## Performance work and measurement limits

Plain catalog browsing now uses its server-rendered inventory without downloading/re-indexing all 817 offers. A full-catalog fetch occurs when enhanced search/filtering needs it, and the fuzzy index waits for a nonempty query. Browser coverage verifies zero initial catalog requests and a working complete search after one request. In the comparable local sample, this removes approximately 48 KB from directory, collection and category initial transfers.

Next's documented CSS-inlining option was tested in a separate build. It removed the stylesheet request but duplicated styles into HTML/RSC and added approximately 16–17 KB per sampled page. Some LCP samples improved while other templates did not; CPU warnings and large TBT variation prevent a clean causal score comparison. The final configuration retains independently cached stylesheets for this multi-page catalog. Raw experiment reports are preserved privately in `performance-inline-experiment/`; they are not presented as final deployed results.

Lighthouse is a lab measurement, with host-relative CPU throttling; its own [CPU throttling guidance](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md#cpu-throttling) explains why different device/load conditions affect comparisons. Keep default settings and reported warnings visible. Do not substitute earlier higher scores, lower the slowdown just to improve a score, or assign lab TBT as field INP. Final measured values and remaining P1 performance work are in the implementation summary; no field CWV pass is claimed.
