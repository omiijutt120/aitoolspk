# SEO and premium-products implementation evidence

Completed locally on **23 October 2026, Asia/Karachi**. Repository: [omiijutt120/aitoolspk](https://github.com/omiijutt120/aitoolspk). Canonical origin: **https://aitoolspk.tech**. **No commit, push, deployment, DNS change, Search Console submission or older-domain modification was performed in this batch.** The existing public release was checked independently; it does not yet contain this unpublished batch.

## What changed and why

The reported production base-path problem was not reproduced on the current public release: all important routes/assets worked. The obsolete disabled Node 20 Next deployment template was still tracked locally and could reintroduce automatic `/aitoolspk/` injection. It is removed. The existing manual Node 24 release workflow and correct static root export are preserved and regression-tested.

Added five requested premium subscriptions with six exact prices, official-source logos, seller warranty, accurate exclusions and active WhatsApp enquiries. Midjourney's duration selector navigates between real static canonical routes; price, duration, product ID, warranty context and desktop/mobile WhatsApp links change together. Three months saves PKR 4,000 against three individual monthly purchases. Native alternative links work without JavaScript.

| Product             | Duration | Numeric retail price | Route                                 |
| ------------------- | -------- | -------------------- | ------------------------------------- |
| Helium 10 Platinum  | 1 month  | PKR 2,500            | `/tool/helium-10-platinum/`           |
| Helium 10 Diamond   | 1 month  | PKR 4,800            | `/tool/helium-10-diamond/`            |
| Midjourney Standard | 1 month  | PKR 4,000            | `/tool/midjourney-standard/`          |
| Midjourney Standard | 3 months | PKR 8,000            | `/tool/midjourney-standard-3-months/` |
| Envato Elements     | 1 month  | PKR 2,000            | `/tool/envato-elements/`              |
| vidIQ Max           | 1 month  | PKR 3,000            | `/tool/vidiq-max/`                    |

The original **811 records, prices, IDs, slugs and variant terms are unchanged**; the regression suite hashes their complete parsed JSON. The local catalog now contains **817 offers / 108 collections / 13 categories**, with 27 featured parent collections. APIs remain in one parent, last in the default directory. There are 602 offers with mapped official logos; the other 215 retain honest text identities.

SEO improvements use the existing architecture: homepage metadata/value proposition, distinct sourced guidance for ChatGPT, Gemini, Claude, Canva, Figma, ElevenLabs, Adobe, CapCut, Notion, Lovable, n8n and API collections; two original buying guides; relevant internal links; CollectionPage/ItemList and Article markup; stable Organization/WebSite identifiers; page-specific pagination descriptions; and stronger static-export regression checks. Retired FAQ rich-result markup was removed while visible buyer FAQs remain. Price dates no longer masquerade as sitemap modification dates.

Preserved: design/theme, primary navigation, original catalog, brand assets and fallbacks, native WhatsApp destination **+923714549245**, no cart/login/payment/credential collection, server-rendered content, self-canonicals, Open Graph/Twitter metadata, real pagination, query canonicalization, robots crawl access, private-field allowlist, stock/approval/quote gates, security protections and existing tests. No new project dependency or analytics collector was added.

## Executed commands and outcomes

The installed Next 16.4.2 local documentation and repository prerequisites were read. Node 24.22.0 was used on Windows. The following were actually executed; no result below substitutes a proposed command for a completed check.

| Command / check                               | Outcome                                                                                                                                                                                                                                                                             |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                                      | Passed: 436 packages installed, 437 audited. Existing dev-tool advisory disclosed below; no lockfile change.                                                                                                                                                                        |
| `npm run catalog:import`                      | Passed: original 811 imported, six premium variants merged, sanitized public index regenerated; no private fields exported.                                                                                                                                                         |
| `node scripts/optimize-assets.mjs`            | Passed: 72 local thumbnails prepared; four new official brand identities added.                                                                                                                                                                                                     |
| `npm run launch:check`                        | Passed under the existing narrowly documented dev-tool advisory exception; includes each following gate.                                                                                                                                                                            |
| `npm run check:repo`                          | Passed working-tree/history privacy scan; final documentation-only scan is recorded in the local reports.                                                                                                                                                                           |
| `npm run lint`                                | Passed, via launch gate.                                                                                                                                                                                                                                                            |
| `npm run typecheck`                           | Passed, via launch gate.                                                                                                                                                                                                                                                            |
| `npm test`                                    | **18 passed**, zero skipped locally, including exact private-CSV comparison, original-record hash, new six prices, no-private-CSV reimport/idempotence, approval/stock/expiry and workflow guards.                                                                                  |
| `npm audit --omit=dev --audit-level=moderate` | **0 vulnerabilities**, via launch gate.                                                                                                                                                                                                                                             |
| `npm run build`                               | Passed production static export, including catalog prebuild/public validation and Windows RSC-path repair; Next generated 970 static entries.                                                                                                                                       |
| `node scripts/check-export.mjs`               | Passed: **969 HTML pages / 966 canonical pages / 817 offer routes / 149 indexable sitemap URLs / 16 pagination routes**. **59,389** internal references checked; **zero broken targets**, confidential fields or duplicate indexable descriptions. **3,031** JSON-LD blocks parsed. |
| `npm run test:browser`                        | **39 passed** in local Chrome. All 149 sitemap URLs returned direct 200 and indexable self-canonicals locally.                                                                                                                                                                      |
| Lighthouse 13.5.0 CLI                         | Five sequential simulated-mobile runs completed against the local production export; results below.                                                                                                                                                                                 |

The full dependency audit still reports the existing **unpatched dev-only braces advisory** and its five-package lint chain. The release gate permits only that exact advisory/chain, rejects new or production advisories and enforces a clean production audit. It is an accepted disclosed limitation, not a zero-finding full audit. See [launch checklist](../LAUNCH_CHECKLIST.md). No `audit fix --force`, framework downgrade or broad exception was introduced. ESLint 9 remains a toolchain maintenance limitation until installed plugins support its successor.

Interim checks caught a TypeScript fixture cast issue and it was corrected before the final gate. An initial Lighthouse invocation had a PowerShell argument-binding error and produced no report; corrected CLI arguments generated the five actual results below. The earlier 33-browser-case export is superseded by the final **39-case** run with current pending-offer rules and SEO content.

## URL coverage

The existing public release was directly checked in Chrome for these paths, with HTTP 200 on final HTTPS destinations and working assets:

```text
/
/tools/
/categories/
/plans/chatgpt/
/plans/gemini/
/category/ai-chat/
/how-to-order/
/faq/
/contact/
/privacy-policy/
/terms/
/refund-policy/
/sitemap.xml
/robots.txt
/tools/page/2/
/plans/chatgpt/page/2/
/tool/chatgpt-plus-30d-warranty-24h-pk-048eced3cefb/
```

Direct HTTP separately confirmed HTTP-apex and HTTPS-www **301** to HTTPS-apex **200**. Correct public GitHub DNS, HTTPS enforcement and approved certificate were verified read-only. Public evidence describes release `d7c06c6c56a4ceba9d07a22cc1f57211cc99adcb`, successful [Pages run 39859695658](https://github.com/omiijutt120/aitoolspk/actions/runs/39859695658). The current source has not been deployed.

Local browser coverage adds all **149 sitemap URLs**, all twelve priority collections, their page-two behavior, every new premium URL above, `/guides/`, `/guides/choosing-ai-subscriptions-pakistan/`, `/guides/understanding-credits-and-plan-duration/`, query/tracking copies and all 52 original ChatGPT variants. An unknown guide path returns a real 404. The export checker covers every normal HTML canonical and referenced internal route/asset, not just these samples.

The 39 cases include nine widths **320, 375, 390, 600, 768, 820, 1024, 1280, 1440**, touch, keyboard dialogs, fuzzy search/filter/sort/pagination, query persistence, native links without JavaScript, Midjourney selection/history, exact intercepted WhatsApp messages, no console errors in covered flows and automated WCAG AA checks. WhatsApp messages were never sent. Chrome emulation and automated accessibility scans do not certify physical Android/iOS, Safari or manual screen-reader behavior.

An additional **45 route/viewport checks passed** for the guide index, both articles, ChatGPT collection and Helium 10 Platinum across the same nine widths: each returned 200 with no horizontal overflow. Phone/tablet/desktop guide screenshots and the Midjourney phone/desktop screenshots were visually inspected. This additional one-off check is recorded in ignored `reports/seo-responsive.json`.

## Mobile lab performance

Measured on 23 October 2026 against `http://127.0.0.1:3000` serving `out/`. Lighthouse **13.5.0**, default mobile simulation, 412×823 viewport, CPU slowdown 4× and simulated network. These are single local diagnostic runs, not production field data, regional latency tests, a statistical comparison with the previous release or proof of field Core Web Vitals. The export scan was also active on the same workstation.

| Template / path                           | Performance | Accessibility | Best practices | SEO    | LCP  | TBT  | CLS    | Script transfer |
| ----------------------------------------- | ----------- | ------------- | -------------- | ------ | ---- | ---- | ------ | --------------- |
| Home `/`                                  | 96          | 100           | 100            | 100    | 2.7s | 80ms | 0      | 142 KiB         |
| Directory `/tools/`                       | 97          | 100           | 100            | 100    | 2.6s | 30ms | 0.0004 | 164 KiB         |
| Category `/category/ai-chat/`             | 95          | 100           | 100            | 100    | 3.0s | 60ms | 0.0004 | 164 KiB         |
| Collection `/plans/chatgpt/`              | 95          | 100           | 100            | 100    | 3.0s | 50ms | 0      | 164 KiB         |
| Held product `/tool/midjourney-standard/` | 99          | 100           | 100            | **69** | 2.0s | 30ms | 0      | 167 KiB         |

The product SEO score is intentionally reduced by its **correct noindex** safeguard; do not remove it to improve a score. The four indexable templates scored 100 in the lab SEO audit. Lab accessibility scores do not replace manual accessibility review. Metrics are rounded; raw JavaScript boot-up time ranged from approximately 313 to 497ms across the five reports and is separate from TBT.

**Remaining performance work:** home/directory/category/collection lab LCP exceed the 2.5s target in these runs. The LCP candidates were already server-rendered text, not hidden/lazy hero images. Lighthouse identifies shared React/Next unused-code potential and the global stylesheet; estimated savings are diagnostics, not measured fixes. Avoid deleting working controls or visual styles to chase a score. Server-only collection/editorial additions, local WebP thumbnails, static pagination, low-priority catalog fetching and the existing homepage's exclusion of the full search index are preserved. CSS transfer was approximately 15 KiB per template. Raw local reports include JavaScript parse/evaluation and network details. Consider a measured CSS/client-boundary investigation after public field data and an isolated repeatable baseline are available; no unmeasured speed improvement is claimed.

Live homepage cache-control was `max-age=600`; HTTP/2/CDN or custom cache/header changes were not configured in this batch. PageSpeed Insights API returned **429 quota exceeded**, so this audit obtained **no CrUX or field INP**. TBT is not INP. Current field targets are LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 at the 75th percentile; none is certified by these lab scores.

## Commercial and external blockers

- All **817 local offers** are pending commercial review. Original 811 availability was owner-confirmed; the six new variants have unconfirmed stock. All held detail pages remain noindex, excluded from sitemap and without Product/Offer schema. Their native WhatsApp enquiries still work. Pending status is an intentional business rule, not a technical SEO error.
- The owner must provide authorization/safe-delivery evidence and exact actual access, duration, warranty/renewal terms before approving sale/indexing. The new full-duration warranty is explicitly the seller's stated warranty, not the vendor's. Original risk flags and missing terms remain honest.
- Google Search Console credentials, actual verification TXT and reports were unavailable. No property verification, sitemap submission, indexing request, Google-selected canonical check, manual-action/security report check or AI-control/report inspection was performed. [Owner setup](GOOGLE_SEARCH_CONSOLE_SETUP.md) contains the real steps and a deliberately unusable TXT placeholder.
- Local schema parsing/invariant checks passed. Google Rich Results Test and Schema.org validation of unpublished new public URLs remain post-publication owner actions; the local gate is not an official validator. Merchant listing eligibility is distinct from Product snippet validity and cannot be assumed from WhatsApp fulfilment.
- Actual Pages response headers lack HSTS, HTTP CSP, X-Frame-Options and Permissions-Policy. Existing HTML CSP remains. Full headers require a capable host/CDN and verified configuration; source `_headers` or `vercel.json` alone cannot change GitHub Pages.
- The older domain has overlapping branding/contact but ownership/migration authority is unproven. It was inspected read-only and left untouched. Backlinks, Google rank/traffic and actual indexed-URL overlap were unavailable.
- No controlled keyword volumes, numerical difficulty/CPC or competitor traffic, mobile speed or schema measurements were available. Research clearly distinguishes dated seller claims, observations and editorial hypotheses.

## Remaining actions by priority

| Priority | Owner / action                                                                  | Acceptance                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| P0       | Owner reviews commercial eligibility and current prices before approved selling | Documented evidence and exact public terms; keep pending where unresolved.                                                                 |
| P0       | Owner explicitly authorizes publishing this local batch                         | Reviewed commit, green CI/release/browser gates, manual Pages dispatch, then fresh public route/asset/SEO checks. No auto-publish.         |
| P1       | Owner completes Search Console Domain verification and sitemap submission       | Real Google TXT retained, submission status saved, homepage/category/collection/pagination inspected, eligible indexing requests recorded. |
| P1       | Maintainer/owner validates public schema and field performance                  | Actual validator results, PSI/CrUX scope/date or explicit unavailable status; investigate unexpected eligibility/index exclusions.         |
| P1       | Maintainer investigates LCP with an isolated reproducible baseline              | Compare same five templates and configuration before/after justified changes; target ≤2.5s without losing controls or quality.             |
| P1       | Owner maintains prices, stock, missing terms, logo/risk reviews                 | Factual dated updates and no blanket commercial approval; weekly price/stock review.                                                       |
| P1       | Owner completes real-device/WhatsApp and host-header review                     | Physical Android/iOS/Safari handoff record; response headers measured if host/CDN changes authorized.                                      |
| P2       | Owner evaluates optional analytics/Bing and old-domain strategy                 | Real owner account IDs/access, privacy review and migration permission first.                                                              |
| P2       | Editor expands only validated useful content                                    | Select next brief using real queries/questions; review source facts and link relevant existing pages.                                      |

## Measurable 30 / 60 / 90-day roadmap

Start this clock after an authorized public deployment and owner verification; do not pretend search data exists today.

| Milestone | Measurable work and evidence                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Day 30    | Verify Domain property; record sitemap fetch/discovered counts; inspect homepage, tools, one category, one collection, one later page, one guide and one intentionally held offer. Record Google-selected canonical/exclusion reason where available. Save the first consistent Pakistan/mobile and overall Web performance baseline, or explicitly mark unavailable. Measure five-template lab/available field vitals and classify all issues. |
| Day 60    | Compare two equal available 28-day windows with identical filters. Review top 10 relevant queries/landing pages, or all if fewer; separate brand, price, comparison and support intent. Review AI impressions only if its actual report is present. Record three evidence-backed content/technical actions with owner and deadline; review enquiry quality separately from clicks.                                                              |
| Day 90    | Reinspect the same sample and sitemap consistency; close or explicitly defer every prior action. Compare available mobile field/lab evidence and expected noindex versus unexpected exclusions. Update only content whose facts or buyer questions changed; choose next-quarter priorities from observed data.                                                                                                                                  |

Track clicks, impressions, CTR, average position, eligible canonical landing pages, nonindex reasons, query intent, mobile vitals and optional non-identifying enquiry outcomes. No numeric uplift, #1 rank, index count or AI appearance is promised. See [monitoring details](SEO_MONITORING_PLAN.md).

## Exact changed files

The following is the complete public working-tree change list for both requested local tasks, relative to the previously published commit. Generated exports, screenshots, private data and local tools remain ignored. The legacy workflow is a deletion; the other listed paths are additions or modifications.

- `.github/workflows/nextjs.yml` ? deleted legacy workflow
- `LAUNCH_CHECKLIST.md`
- `PREMIUM_PRODUCTS.md`
- `README.md`
- `SEO_CANONICAL_CHECKLIST.md`
- `VERIFICATION.md`
- `data/brand-asset-map.csv`
- `data/brands.json`
- `data/catalog.json`
- `data/logo-sources.json`
- `data/premium-products.json`
- `data/storefront.json`
- `docs/AI_SEARCH_OPTIMIZATION.md`
- `docs/COMPETITOR_SEO_RESEARCH.md`
- `docs/DOMAIN_AND_VENDOR_RESEARCH.md`
- `docs/GOOGLE_SEARCH_CONSOLE_SETUP.md`
- `docs/KEYWORD_RESEARCH.md`
- `docs/SEO_AUDIT_REPORT.md`
- `docs/SEO_IMPLEMENTATION_SUMMARY.md`
- `docs/SEO_MONITORING_PLAN.md`
- `public/catalog/index.json`
- `public/logos/envato.webp`
- `public/logos/helium-10.webp`
- `public/logos/midjourney.webp`
- `public/logos/vidiq.webp`
- `scripts/check-export.mjs`
- `scripts/fetch-official-logos.mjs`
- `scripts/import-catalog.mjs`
- `scripts/premium-catalog.mjs`
- `scripts/validate-public.mjs`
- `src/app/category/[slug]/page.tsx`
- `src/app/faq/page.tsx`
- `src/app/guides/[slug]/page.tsx`
- `src/app/guides/page.tsx`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/plans/[slug]/page.tsx`
- `src/app/sitemap.ts`
- `src/app/storefront.css`
- `src/app/terms/page.tsx`
- `src/app/tool/[slug]/page.tsx`
- `src/app/tools/page.tsx`
- `src/components/collection-guide.tsx`
- `src/components/collection-schema.tsx`
- `src/components/document.tsx`
- `src/components/duration-selector.tsx`
- `src/components/faq.tsx`
- `src/components/footer.tsx`
- `src/components/product-card.tsx`
- `src/components/purchase-ui.tsx`
- `src/lib/categories.ts`
- `src/lib/collection-guides.ts`
- `src/lib/commerce.mjs`
- `src/lib/guides.ts`
- `src/lib/types.ts`
- `tests/browser/premium-products.spec.ts`
- `tests/browser/seo-content.spec.ts`
- `tests/browser/site.spec.ts`
- `tests/catalog.test.mjs`
- `tests/premium-products.test.mjs`
- `tests/seo-release.test.mjs`

## Deliverables and evidence locations

All seven requested documents are present: this summary, [audit report](SEO_AUDIT_REPORT.md), [keyword research](KEYWORD_RESEARCH.md), [competitor research](COMPETITOR_SEO_RESEARCH.md), [Search Console setup](GOOGLE_SEARCH_CONSOLE_SETUP.md), [AI search guidance](AI_SEARCH_OPTIMIZATION.md), [monitoring plan](SEO_MONITORING_PLAN.md). Additional [domain/vendor research](DOMAIN_AND_VENDOR_RESEARCH.md) and [premium package report](../PREMIUM_PRODUCTS.md) explain source and commercial boundaries.

Ignored evidence includes `reports/launch-check.json`, `reports/export-check.json`, `reports/launch-dependency-audit.json`, `reports/production-phase0.json`, `reports/production-host-details.json`, `reports/seo-performance-{home,directory,category,collection,product}.json`, `reports/seo-performance-summary.json` and browser screenshots. Do not upload private/raw reports wholesale. Re-run the documented gates before a later authorized release; publishing and domain configuration remain separate from local verification.
