# SEO-pro audit — aitoolspk.tech

Audit date: 25 October 2026. Market: Pakistan; English storefront with selected Roman Urdu buying answers. Goal: discover real search, content, accessibility and performance defects and prepare tested fixes without changing prices, warranty facts or publication eligibility.

## What matters first

The live website is reachable and its existing sitemap destinations work. The main release gap is that the larger SEO/content implementation remains unpublished. The new About, editorial-policy and buying-guide sections cannot help visitors or search engines until that implementation is deployed. This audit also identified and fixed oversized logo downloads in collection cards and small UI slots.

No overall SEO, GEO or ranking score is assigned. Search Console performance/index coverage, backlinks, AI citation observations and field Core Web Vitals are not available to this audit. A local Lighthouse checklist is not a measurement of those outcomes.

## Workflow and inspection coverage

Used the installed **SEO-pro 0.2.16** plugin's `seo-audit` and `seo-geo` workflows, operating contract, technical/content/schema references and offline helpers. This package supplies skills and deterministic helpers, not authenticated Search Console, Bing, analytics or backlink access.

| Area | Inspected material | Evidence level | Limitation |
| --- | --- | --- | --- |
| Production discovery | All 138 URLs in the live sitemap, plus eight linked offer pages and three explicitly requested unpublished routes: 149 HTML responses | Fresh HTTP/source HTML | Not a complete crawl of every live offer or query variant; offer sample is biased toward the Gemini collection |
| Production resources | 48 distinct assets and ownership files from home, ChatGPT and design-category templates | Fresh HTTP/response bytes | Other assets covered in the local export, not all fetched from production |
| Domain behavior | HTTP apex, HTTP www and HTTPS www; intentionally nonexistent path | Fresh HTTP | Tested from this machine/network, not every region |
| Local implementation | Whole production export, metadata/link/schema checks and existing publication rules | Built source/export | Local success does not establish deployed behavior |
| Content and GEO | Home, 25 collection buying guides, 13 category checklists, ten buying guides, About/editorial/contact and representative offer terms | Source/editorial review | No measured AI citation share or independent test of vendor packages |
| Browser experience | Existing full suite plus fresh checks after the image change | Chrome browser emulation | No physical iOS/Android device or actual WhatsApp order |
| Speed | Prior same-day Lighthouse evidence and new post-fix samples | Local simulated-mobile lab | Field LCP/INP/CLS and geographic hosting latency remain unknown |
| Accounts and offsite | Existing owner-confirmed verification status and public verification resources | Owner statement / HTTP | No GSC/Bing dashboard report, rankings, backlink export or conversion analytics |

Discovery honored the current robots rules, stayed on the owned domain, excluded search/filter URL combinations, and used three bounded workers. The initial sequential full-link crawl was stopped after 50 pages to avoid unnecessarily prolonged remote crawling; its incomplete run is not reported as a completed crawl. The separately saved 149-page capture is the production evidence used here. Native browsing could not fetch robots.txt; direct HTTP succeeded, so the browser-tool failure was not interpreted as a site error.

## Evidence ledger and action plan

All paths below are workspace-relative. Raw reports are ignored by Git and remain outside public assets. Prior fixes are identified separately from changes made during this continuation.

| ID / priority | Observation, affected area and evidence | Action / status | Owner; dependency; effort assumption | Success check |
| --- | --- | --- | --- | --- |
| SP01 / high | `/about/`, `/guides/`, `/editorial-policy/` return 404 live. Existing live navigation does not advertise these new pages. `reports/seo/seo-pro-live.json`, corresponding page records. HTTP evidence, high confidence. | Already implemented locally, along with ten guide articles. Deployment gap, not a newly broken live navigation link. | Release owner; explicit deployment authorization; one reviewed release | New routes return 200 live, correct canonical and useful HTML; sitemap points only to successful intended indexable pages. |
| SP02 / medium | Collection cards, home tool wall, collection icons and filter icons use full master logos. Prior home Lighthouse estimates approximately 45 KiB image-delivery savings. `reports/seo/pdf-performance-home.json`, image-delivery insight; source components. Lab/source, high confidence. | **Fixed in this audit:** build-time 96px and 144px WebP variants; shared `logoThumbnail()` helper; fixed dimensions and original official masters retained. No runtime image service required on GitHub Pages. | Engineering; build/deployment; small code change | Generated assets exist, all exported targets resolve, mobile/desktop images load and measured bytes decrease. |
| SP03 / medium | Live home has generic H1 and selected-plans description; collection search copy lacks the prepared Pakistan/price context. Live capture versus `src/app/page.tsx` and `src/app/plans/[slug]/page.tsx`. Source, high confidence. | Prior local fixes preserved: descriptive home heading, exact PKR comparison context, collection metadata and unique social previews. | Release owner; SP01 deployment; included in prepared batch | Source HTML exposes truthful page-specific titles/descriptions; unique indexable metadata and canonical/OG agreement. |
| SP04 / medium | Live site lacks the prepared explanatory content and editorial attribution. Existing guides and new category guidance improve actual buying decisions, not arbitrary word counts. Local content files and live unpublished-route responses. Source/editorial evidence, high confidence for availability; outcome impact unknown. | Prior local fixes preserved: 25 sourced collection guides, 13 category checklists, ten distinct buying guides, About/editorial pages and native cross-links. | Release owner then content editor; deployment/current source review; included in batch | Content appears without JS, source and check dates are visible, no fabricated credentials, vendor affiliation or package entitlement. |
| SP05 / low | Live robots contains a nonstandard `Host` directive. Generic crawling and Sitemap declaration already work. `seo-pro-live.json.robots`. Source, high confidence. | Removed locally in prior implementation; kept `Allow: /` and canonical sitemap. This is cleanup, not a proven indexing blocker. | Release owner; deployment; included | Live robots remains accessible and advertises the valid HTTPS sitemap. |
| SP06 / medium, controlled | 815 local offers await commercial/editorial approval. Eight live offer samples are noindex. `data/seo/editorial.json`, `src/lib/seo-publication.mjs`, `reports/seo/product-coverage.json`. Source/HTTP, high confidence. | Intentional control retained. Stock availability does not supply delivery/eligibility evidence. No mass removal of noindex or fabricated Product/Offer/review markup. | Catalog owner; real package/delivery evidence and editorial review; variable | Each offer passes the existing evidence gate before indexable schema/sitemap eligibility changes; supported collection pages remain discoverable. |
| SP07 / medium, data gap | Coverage diagnostics flag 788 repeated offer descriptions and 215 records without a logo. These counts include pending/noindex records and API variants; they are not counts of broken images or indexable duplicate pages. Product coverage report. Source diagnostic, high confidence in counts. | Avoided templated filler and guessed brand assets. Existing parent collections, exact comparison tables and clear text brand fallback remain. Resolve package facts and authorized assets individually when evidence exists. | Catalog/content owner; verified specifications and official asset source; variable | Approved offers have distinct useful facts; absent assets never become broken or generic fake logos; no duplicate indexable metadata. |
| SP08 / medium | Previous local home/ChatGPT LCP measured 2.89s/2.53s; field values unavailable. `pdf-performance-summary.json`. Lab evidence only. | Image delivery corrected; post-fix lab results recorded below. Framework JS and host cache policy remain separate opportunities, not assumed defects. | Engineering/hosting owner; authorized deployment and field evidence; measurement needed | Compare representative live lab runs and eligible field p75 evidence; do not substitute TBT for INP. |
| SP09 / low, host-dependent | GitHub Pages responses lack optional custom security headers; HTTPS works. Home response headers in live capture. HTTP, high confidence. | No unsupported `_headers` or Vercel config added. Retained existing CSP meta. No claim that absent headers cause ranking loss. | Hosting owner; deliberate proxy/hosting decision; optional | If host changes, validate real response headers without breaking assets or canonical redirects. |
| SP10 / measurement | No authenticated index coverage, search queries, backlink or AI citation evidence. Tool inventory and current report inputs. High confidence in availability limit. | No invented traffic, rank, authority, conversion or GEO score. Prepared follow-up measurement below. | Site owner; authorized account connection/export; variable | Dated property-scoped evidence, consistent date ranges and explicit sampled queries/platforms. |

## Confirmed healthy controls

- Every one of the 138 live sitemap URLs returned HTTP 200, had exactly one H1, nonempty title/description, self-canonical and no observed noindex. This is technical eligibility evidence, not proof of Google indexing.
- All 48 sampled production assets/verification files returned HTTP 200. Both Google HTML and Bing XML remain at their required root paths.
- All three alternate host/protocol tests returned 301 to `https://aitoolspk.tech/`. A nonexistent path returned a real 404, not a homepage soft error.
- Pending offer noindex remains crawlable so search engines can see the directive. No contradictory blanket robots disallow was added.
- Pagination keeps native links and page-specific self-canonicals. Search/filter URL copies are not added to the sitemap.
- The local implementation preserves Gemini Pro 18 months at PKR 1,200, its explicit seller warranty, product IDs and owner-confirmed inventory. No supplier costs, customer login, credential collection or payment gateway is introduced.
- Business markup uses the real brand/contact number. No unwanted seller legal name, invented address, email, social profiles, opening hours, reviews or certifications are added.

## GEO/AEO and structured-data interpretation

The prepared site makes its identity, listed PKR amounts, package distinctions, sources and contact path readable in native HTML. Comparison tables, direct questions/answers, dated vendor context and useful guides support comprehension. They do not establish citation performance.

The live generic robots allow rule does not declare a search-crawler block. This is a policy observation, not a test of verified Googlebot/OpenAI traffic or every network. The optional generated `llms.txt` is supplemental navigation; no ranking benefit is assigned. Pending offers intentionally cannot qualify as indexed supporting links until their publication criteria are met.

The local markup describes actual visible Organization/WebSite, collection lists, breadcrumbs and articles. The old live FAQPage is not treated as a critical syntax error; local content does not depend on FAQ rich-result eligibility. No fake stars, software-vendor claims or unverified purchase offers were added. JSON parsing and selected fact comparisons are not a substitute for Google's full eligibility assessment.

## Verification results

The post-fix production build passed, including TypeScript and postbuild SEO validation. Changed application/script/test files passed ESLint. All 35 unit tests passed. The complete browser suite passed **47/47**, with zero skipped, flaky or failed tests. It covers 320–1440px viewports, automatic WCAG AA checks on sampled templates, search/filtering, exact WhatsApp messages, all sitemap URLs, native pagination and no-JavaScript flows. The added regression verifies generated logo files load in home, collection and detail views at phone and desktop widths.

Whole-export validation checked 977 normal/error HTML documents plus the separate Google ownership file: 815 product routes, 974 canonical pages, 159 indexable sitemap URLs, 16 paginated canonical pages, and 64,325 internal references. There were zero broken targets, duplicate indexable titles/descriptions or detected confidential fields. SEO-pro's crawl helper independently analyzed all 974 non-error local website pages and found no duplicate titles or pages without observed inlinks; its 815 index-intent observations correspond to intentionally pending offers.

SEO-pro's sitemap helper reported no XML/URL/date findings. Its structured-data helper checked all 3,071 JSON-LD blocks and eleven explicit facts (ten visible article headlines and the owner-supplied contact number), with no reported findings. This is syntax and selected-fact validation, not a Google Rich Results Test or full vocabulary/eligibility certification. The earlier project's schema/browser checks also remain in place.

The homepage now references 101,204 bytes of unique logo variants versus 153,142 bytes of deduplicated master files previously: **51,938 bytes / 33.9% less**. This measures all homepage logo references, including lazy images; actual first-load savings depend on viewport and loading behavior. Full-resolution source assets are preserved. Build-created `.small.webp` and `.card.webp` files remain ignored by Git and are recreated in CI.

Final Lighthouse 13.5.0 samples used the local production export at port 3001, fresh Chrome profiles and default mobile simulation, with no concurrent build, browser suite or scanner:

| Template | Performance | Accessibility / best practices / SEO checklist | LCP | TBT | CLS | Transfer |
| --- | ---: | --- | ---: | ---: | ---: | ---: |
| Home | 97 | 100 / 100 / 100 | 2.54s | 68ms | 0 | 241.8 KiB |
| ChatGPT collection | 97 | 100 / 100 / 100 | 2.53s | 63ms | 0 | 233.2 KiB |
| API/subscription guide | 100 | 100 / 100 / 100 | 1.93s | 25ms | 0 | 202.4 KiB |

All three runs had no runtime warnings. Home and collection LCP remain slightly above the 2.5s lab target; no field CWV pass is claimed. Home transfer was 277,777 bytes in the previous same-day sample and 247,620 bytes in the new one. Single-run timing differences are subject to machine noise; the deterministic logo-byte reduction is stronger evidence of the implemented change than the score difference. Field INP remains unknown.

Evidence files: `reports/seo/seo-pro-live.json`, `seo-pro-redirects.json`, `seo-pro-sitemap.json`, `seo-pro-live-analysis.json`, `seo-pro-local-analysis.json`, `seo-pro-schema-analysis.json`, `seo-pro-image-savings.json`, `seo-pro-browser-results.json`, `seo-pro-performance-summary.json` and the three raw performance reports. `reports/export-check.json` and `reports/seo/local-technical-audit.json` contain refreshed export results. Repository/privacy scan checked 246 current files and 345 reachable historical text blobs with zero detected issues; `git diff --check` passed. A fresh full dependency audit reported zero vulnerabilities (`seo-pro-dependency-audit.json`); the build introduced no package dependency.

## Measurement and release sequence

1. Finish build, export checks, changed-file lint, browser regression and post-fix local Lighthouse measurements. Preserve exact catalog and ownership assets.
2. Obtain the separate deployment authorization required by the owner's earlier master brief; prepare a reviewed release from the dirty working tree without resetting user work or overwriting the already-released verification commits.
3. After authorized deployment, retest representative templates, all sitemap URLs, robots, verification files and static assets. Confirm production, not just localhost, shows the new pages and thumbnails.
4. In the already-verified Search Console property, check sitemap processing and URL Inspection on home, one collection, one guide and one intentionally noindex offer. A sitemap acceptance or request does not guarantee indexing. Review equivalent 28-day Pakistan page/query periods when data exists.
5. For AI visibility, use a small repeatable observation set: “ChatGPT plans price in Pakistan”, “Gemini subscription Pakistan seller warranty”, “compare AI subscription versus API credits”, and the branded “AiToolsPk”. Record engine/model, locale, date, answer, source URLs and whether the site is merely mentioned or actually cited. No current citation outcome is asserted.

## Primary guidance

- [Google AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): ordinary SEO, index/snippet eligibility, useful content; no guaranteed inclusion or special AI markup.
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap): canonical intended URLs and truthful significant-change dates.
- [Google pagination guidance](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading): crawlable pages and individual canonical URLs.
- [Next.js image documentation installed with this repository](../../node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md) informed the static-export image changes; dimensions and generated files are used instead of an unavailable image optimization server.

Current Google AI and sitemap pages were reopened for this audit. The Web Vitals browser fetch failed; no new field-performance assertion is inferred from it. Prior sourced thresholds and local metric units are retained with explicit lab limitations.

## Release authorization boundary

The owner's master brief, `.codex/attachments/6520a121-6e6c-4df5-b03a-9d6b07370c01/Pasted text.txt`, line 608, says: “Do not push to production until critical changes pass tests and deployment is explicitly permitted.” This audit request authorizes audit and fixes, but does not explicitly release that separate deployment gate. SEO-pro's operating contract also keeps publication behind explicit authorization. No production deployment is claimed here.
