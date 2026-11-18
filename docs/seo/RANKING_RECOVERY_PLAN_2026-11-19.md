# Organic search recovery plan — 19 November 2026

## Evidence and limits

- The recovery code is on `codex/organic-recovery-20261119` in draft PR #11. The GitHub Pages workflow is manually dispatched for an exact reviewed `main` commit; neither pushing the branch nor merging alone publishes it.
- The supplied Search Console export covers 22 October–13 November. Its visible query rows are dominated by numeric `ai…` and entertainment queries, with almost no evidence of relevant AI tool demand. This is a historical sample, not a current ranking measurement.
- Public search checks did not surface `aitoolspk.tech` for brand or sampled product terms. Search result samples cannot establish which URLs Google has indexed; Search Console URL Inspection is required.
- All 817 product quotes are beyond the seven-day freshness window. No product offer is approved for indexing. Therefore individual product URLs deliberately carry `noindex`; they cannot rank for exact product names. Indexing them without verified terms would misrepresent the listings.
- `aitoolspak.tech` is a separate site according to the owner. It displays the same WhatsApp number and overlaps this catalog. Do not redirect, claim ownership of, or add `sameAs` for that domain. The owner should investigate the displayed contact separately.

## Execution order

1. **Release readiness and crawlability.** Verify that the branch builds, its sitemap URLs are canonical and indexable, and no global `noindex` or robots block applies. Pages requires a separate manual dispatch for an exact reviewed `main` commit. Record live-versus-branch status without calling a build result a ranking result.
2. **Make the brand and useful landing pages clear.** Give the home page a unique AiToolsPk identity in its title, H1 and WebSite data. Remove the ambiguous generic site-name alias that overlaps other domains. Check indexable collections for misleading freshness claims, weak or broken vendor citations, and correct only evidence-backed issues.
3. **Keep product publication gated by facts.** Preserve `noindex` for pending and stale offers. Prepare a prioritized verification queue from the real catalog and identify exactly what seller evidence is required before an offer can become indexable. Never fabricate prices, availability, access or vendor authorization.
4. **Measure after release.** In the verified Search Console property, inspect the home page and a small set of collection URLs for indexed state and selected canonical. Submit the deployed sitemap, then compare branded and product-intent query/page data after Google has had time to crawl. Success means observed indexed URLs and relevant query impressions/clicks, not just a passing CI check.

## Release and owner dependencies

- Push implementation and test evidence to draft PR #11. The previously supplied recovery protocol explicitly requires authorization before merging or deploying; leave that final action for owner approval.
- Owner: provide current Search Console URL Inspection results for `/`, `/plans/chatgpt/`, `/plans/canva/`, and `/price-index/`, plus the latest query/page exports. This distinguishes discovery, canonical selection, quality, and ranking problems.
- Owner: verify current product ID, seller, stock, duration, access method, final PKR price, warranty wording, date, and resale eligibility for priority AI products. Only reviewed records can leave `noindex`.
- Owner: investigate why unrelated `aitoolspak.tech` shows the same WhatsApp number; keep evidence of the page and contact the site/host if it is unauthorised.

## Implementation and verification

- The homepage now begins its title and H1 with `AiToolsPk`; WebSite `alternateName` uses the exact domain rather than the generic "AI Tools PK" phrase.
- Collection cost tables identify the amounts as recorded seller quotes, show the latest quote date, and avoid implying that the displayed median is a current vendor price.
- The static build generated 1,007 pages. The export SEO validator completed successfully. TypeScript, ESLint, 132 unit tests, and 11 targeted browser tests passed. The browser suite verified every sitemap URL as indexable and self-canonical and sampled pending products as `noindex`.
- The exported-page link audit checked 152 distinct external links: 130 responded successfully, none returned 404/410, 15 returned bot-blocking 403, and 7 could not be reached from the audit environment. A 403 or timeout is not evidence that a link is dead.
- These checks verify the release artifact. Current Google indexing and ranking remain unverified until Search Console URL Inspection and post-deployment query data are available.
