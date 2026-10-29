# AiToolsPk.tech

A static-first Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 catalog. Orders are enquiries on WhatsApp at **+923714549245**. There are no customer accounts, payment forms, carts, databases or analytics trackers.

The UI uses native system fonts with no font download. `predev` and `prebuild` generate 96px WebP thumbnails for small icons and 144px thumbnails for collection cards and detail logos. `src/lib/logo-thumbnail.ts` selects these files consistently; official master assets remain available for social previews and other larger uses. Generated thumbnails are ignored by Git and recreated automatically. Use `node scripts/fetch-official-logos.mjs --only=leonardo,linkedin` to refresh selected brand assets; source declarations and provenance live in `data/logo-sources.json` and `data/brands.json`.

The homepage shows 27 featured parent collections, selected from the owner's plan IDs, familiar brands and four new premium brands, with one API collection last. Each card shows the full plan count and lowest listed PKR price. "Find your next tool" and "Show all tools" sit alongside the featured heading, opening the grouped directory of 108 collections containing 815 active plans. The catalog retains 817 records, including two excluded Gemini duplicates. The finder focuses search. See [REDESIGN_PLAN.md](REDESIGN_PLAN.md), [VERIFICATION.md](VERIFICATION.md) and [PREMIUM_PRODUCTS.md](PREMIUM_PRODUCTS.md).

`npm run build` includes a narrow post-build workaround for [Next.js issue #85374](https://github.com/vercel/next.js/issues/85374): Windows builds can emit nested RSC segment filenames while the browser requests flat filenames. The script copies the required flat aliases without modifying dependencies; native Linux exports need no changes. Keep this check when deploying an export built on Windows.

## Run locally

The storefront visual system is in `src/app/storefront.css`: larger type, a responsive three-column featured grid, prominent collection logos and actions, generous spacing, category navigation, an API showcase, ordering steps and native FAQ accordions. Shared information-page styles live in `globals.css`. Collection pages keep individual prices, warranties and WhatsApp actions; this redesign does not change catalog eligibility or pricing.

Install Node.js 24 LTS, then from this directory:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. To test the static production application:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

For the complete release gate, run `npm run launch:check`, then `npx playwright install chromium` and `npm run test:browser`. The gate checks repository privacy, lint, types, data, dependency advisories, a production build and all exported routes. See [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) for technical results, the narrowly scoped unpatched development-tool advisory and owner-side launch requirements. Do not treat passing checks as commercial authorization or proof that the custom domain is live.

`npm start` serves the production export in `out/`. The bundled workspace-only runtime, if needed on this PC, lives in `.tools/node-v24.22.0-win-x64/`; it is ignored by Git. In PowerShell, prepend it for the current terminal only:

```powershell
$env:Path = "$PWD/.tools/node-v24.22.0-win-x64;" + $env:Path
npm.cmd run dev
```

## Catalog and privacy boundary

All **811** original rows retain their stable identities; prices use the CSV unless an explicit owner update in `data/catalog-updates.json` takes precedence. On 2026-10-24 the owner consolidated three Gemini Pro 18-month variants into `PK-1C4151BB27E1`, priced at **PKR 1,200** with **Full seller warranty (18 months)**. The two duplicate IDs are retained as excluded import-history records and omitted from public listings/search. These updates survive CSV and clean-checkout imports and do not grant commercial approval. Other durations and tools remain distinct. The initial snapshot contained 537 source-reported in-stock, 192 out-of-stock and 82 unconfirmed offers. On 2026-10-23 the owner confirmed all 811 plans available; `data/inventory.json` records these updates by public product ID. The importer applies the latest dated stock confirmation, independently of commercial approval, warranty and quote freshness. Plan badges show **Available** for in-stock offers; review status remains on the detail page.

To manage stock, edit a product's `stock` (`in-stock`, `out-of-stock` or `unconfirmed`) and actual `checkedAt` date in `data/inventory.json`, then run `npm run catalog:import`, checks and deployment. A newer dated stock review in private approvals takes precedence. Inventory confirmations never refresh retail price dates or approve unverified plan claims. On GitHub, where the private CSV is absent, commit both regenerated sanitized catalogs alongside inventory changes.

Five owner-authored premium subscriptions (six duration/price options) live in `data/premium-products.json`, separate from the original 811 CSV offers. Edit public descriptions, included features, exclusions, numeric prices and plan durations there, then run `npm run catalog:import`. Update `updatedAt` only after confirming the listed retail prices. `--if-present` also regenerates premium offers on a clean checkout without the private CSV. Keep IDs/slugs stable; duplicate IDs, URLs and existing variants are rejected. These listings record the owner's requested packages and seller warranty; they do not claim vendor endorsement or reseller authorization. The six new variants currently have unconfirmed stock and pending commercial review: their detail pages are noindex, excluded from the sitemap and carry no Product/Offer schema. WhatsApp enquiries remain active. Their stock can be managed separately by public ID in `data/inventory.json`. Official-price references have their own verification date and source; packages differ. See [PREMIUM_PRODUCTS.md](PREMIUM_PRODUCTS.md) for the six options and warranty terms.

The original CSV and PRD are in ignored `private/`. **Never upload that directory, the original Downloads files, or `reports/` to a public repository or web root.** Public builds use an allowlist projection in `data/catalog.json` and `public/catalog/index.json`. Descriptions are rewritten conservatively; raw source copy, purchase requirements, supplier URLs, original prices, costs, margins, profits, sold counts and evidence are never copied. IDs are stable opaque public hashes; they do not expose supplier identifiers.

The homepage server renders its selected parent cards without fetching the full catalog or loading the search engine. Manage featured product IDs and additional brands in `data/storefront.json`. API offers live in one parent, last in the default directory order. The directory renders 24 parent cards per page; each collection renders 24 individual plans per page. The browser fetches the sanitized index and uses Fuse.js for accent-insensitive fuzzy search. Filters and sort live in the URL. Individual offers, collections and categories are static HTML with metadata and breadcrumbs. Pending individual offers are `noindex` and omitted from the sitemap. Product/Offer structured data is emitted only for approved entries, with an Offer only when purchasable.

Pagination uses real static paths such as `/tools/page/2/` and `/plans/chatgpt/page/2/`, with native links, distinct server-rendered contents and a self-canonical per page. Query-only `?page=2` is not used. Query filters, sort and tracking variants canonicalize to the clean path; robots allows crawlers to read those signals. The sitemap lists all indexable pagination pages. See [SEO_CANONICAL_CHECKLIST.md](SEO_CANONICAL_CHECKLIST.md) for the attached canonical-guide audit and remaining live-domain/Search Console checks.

Campaign parameters do not activate catalog filtering or trigger its full-data download. Search validates the downloaded catalog and keeps the static inventory usable if the response fails or is malformed. Requests time out after 15 seconds; **Try again** retries the catalog without reloading the page or losing the search. While results are unavailable, the UI explicitly labels the displayed catalog as unfiltered.

`npm run check:fragments` checks local HTML section links and duplicate IDs. It is also part of `launch:check`, alongside the existing route, metadata and public-data checks. See the [website/SEO/GEO/AEO execution report](docs/seo/WEBSITE_AUDIT_EXECUTION_2026-10-25.md) for the broader failure-state audit and its evidence.

### Update products

1. Replace `private/catalog.csv` with a UTF-8 CSV with the original column names. Keep source and product ID values stable to preserve public IDs and URLs.
2. Run `npm run catalog:import`. Inspect `reports/catalog-audit.json` for missing durations, warranty terms, logo coverage and risky claims. Critical identity, date, price or approval errors stop the import.
3. Review each offer's commercial authorization, eligibility, delivery method and truthful terms. Do not approve credential handover, OTP rentals, unsupported education access, lifetime/unlimited claims or shared plans without resolving the concern.
4. Add the review to ignored `private/approvals.json` under the generated `PK-…` ID (create an empty `{}` file if absent). Omit entries to keep them pending; set `status: "excluded"` to remove a listing entirely. Keep evidence references private. The public repository receives only the sanitized catalog after reimport, never the approval/evidence file.

Example schema (illustrative only; **do not copy it as proof**):

```json
{
  "PK-REPLACE_WITH_REAL_ID": {
    "status": "approved",
    "reviewedAt": "YYYY-MM-DD",
    "stockCheckedAt": "YYYY-MM-DD",
    "stockStatus": "in-stock",
    "authorizationEvidence": "Reference to your verified private authorization record",
    "deliveryEvidence": "Reference to your verified safe delivery record",
    "name": "Accurate plan title without unsupported claims",
    "description": "Evidence-backed plan description, inclusions and limitations.",
    "duration": "Exact verified duration",
    "access": "Exact verified safe access method",
    "warranty": "Exact written coverage, duration, exclusions and remedy",
    "renewal": "Exact renewal terms; automatic renewal if applicable",
    "riskResolved": true
  }
}
```

5. Reimport, complete the [editorial publication review](docs/seo/SEO_AUTOMATION_GUIDE.md) for any individual offer intended for indexing, and run the release/browser checks before an authorized deployment. Buy Now always opens WhatsApp. Approved, confirmed in-stock offers with a quote at most seven days old use the order message; pending, unconfirmed or expired offers use an availability-confirmation message. Out-of-stock offers show Restock and use a restock message. Approval is still required before representing a sale as ready. Refresh prices and stock weekly. Refresh dates only after actually rechecking. Price changes belong in the CSV's retail-price column.

Every individual plan card and detail page includes View Details / Buy Now. Unverified offers open availability enquiries; out-of-stock offers have an active Restock action. Order messages include product, exact variant terms, retail price, public ID, canonical product URL and a confirmation request. No message is sent automatically. No passwords or security codes are requested.

### Parent collections and plan management

The homepage and `/tools/` directory show one parent card per tool. `/plans/chatgpt/`, for example, lists every non-API ChatGPT plan with its original price, duration, access and warranty. All API offers, including APIGPT and ZAPI entries, belong only to `/plans/api/`; they do not also appear in subscription parents. Collection counts and starting prices are calculated from the catalog. Search and filters apply to individual plans before grouping, and carry through when a collection is opened.

`src/lib/collections.ts` owns grouping; `isApiProduct` in `src/lib/catalog-order.ts` identifies API offers. The importer’s `brandSlug` selects other parent groups. Update brand mappings if a new tool arrives under an incorrect brand. A new eligible tool automatically receives a collection page and sitemap entry at build time. `data/storefront.json` still controls homepage priority: selected product IDs select their whole parent collection once, additional brands follow, and the API collection appears last. No variant is merged or discarded.

### Brands and assets

The supplied PNG is preserved at `public/brand/logo.png`; favicon sizes, Apple/app icons and social card derive from it. Run `node scripts/prepare-brand.mjs` after replacing the master. No separate favicon attachment was present.

`data/brands.json` records official domain, source, local asset path, permission review, verification date and usage notes. Official downloadable assets are stored locally; no third-party logo API or secret client ID is used. Where permission or provenance is unresolved, the UI uses a plain text brand name. Do not invent substitute logos or mark an unknown brand as licensed. Add only assets obtained from the vendor's own published kit or a licensed source, and record the applicable usage terms. Official kit sources reviewed include [Figma](https://www.figma.com/using-the-figma-brand/), [Cursor](https://cursor.com/brand), and [ElevenLabs](https://elevenlabs.io/brand). Product resale approval and trademark use are separate reviews.

The storefront also uses locally stored vendor identity assets from the official domains declared in `data/logo-sources.json`. Run `node scripts/fetch-official-logos.mjs` to fetch missing assets, then reimport the catalog. The importer distinguishes published-kit review from `official-identification` source verification; neither status approves product resale or asserts a vendor partnership. The private fetch report is `reports/logo-provenance.json`, and `data/brand-asset-map.csv` lists the exact source for every mapped brand. Unresolved identities keep text labels. The NordVPN asset is the unchanged square SVG from its [official press kit](https://nordvpn.com/press-area/), recorded with its archive member path.

## Structure

```text
src/app/                 Routes, metadata, sitemap and robots
src/components/          Layout, cards, catalog browser, dialogs and shared content
src/lib/                 Typed public catalog, categories, SEO and commerce rules
scripts/                 Private CSV import and brand asset generation
data/                    Sanitized catalog and official asset map
public/                  Public assets and sanitized searchable index
private/                 Original sources (ignored; never deploy)
reports/                 Private QA/audit output (ignored)
tests/                   Data/commerce tests and browser accessibility checks
```

## Deploy to your purchased AItoolsPK.tech domain

This repository does **not** itself configure domain ownership, DNS, HTTPS, Search Console or hosting. Deployment is complete only after a host is serving the export and DNS/SSL have been checked. Keep the launch catalog under review until resale evidence and exact offer terms are available.

### Public GitHub repository and CI

The public repository is [omiijutt120/aitoolspk](https://github.com/omiijutt120/aitoolspk). Commit only the sanitized product output and application source. Keep `private/`, reports, credentials, local runtimes and generated builds ignored. `npm run check:repo` scans the working files and reachable Git history for common secrets and confidential catalog fields; it does not replace reviewing what you publish.

The **Website checks** workflow runs on pushes and pull requests with Node 24, a locked install, release checks and Chromium browser checks. On a clean checkout the private CSV comparison is explicitly skipped; the public catalog, synthetic import and commerce tests still run. The original 811-row comparison must also pass locally before catalog releases. Browser configuration uses local Chrome on this Windows PC and Playwright Chromium on CI; `CHROME_PATH` can override the executable.

### GitHub Pages with your custom domain

1. Open the repository's **Settings > Pages** and select **GitHub Actions** as the build source. Set the custom domain to `aitoolspk.tech`. Configure the registrar/DNS using [GitHub's current instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), then verify the domain and enable HTTPS when available. **Already verified on 23 October 2026:** the existing public release loads, DNS returns the four correct GitHub addresses, HTTPS is enforced and HTTP/www redirect to the canonical HTTPS apex. Preserve these working settings. New local changes still require a separate authorized release.
2. This export uses root-relative URLs for **https://aitoolspk.tech/**. It is not configured for the project subpath `https://omiijutt120.github.io/aitoolspk/`. Set the custom domain before publishing. Changing hosts is fine; use that provider's instructions instead of combining DNS records from different providers.
3. Once the domain and Pages settings are ready and CI is green, open **Actions > Publish custom-domain website > Run workflow** and explicitly select the domain-ready checkbox. The workflow builds, verifies and publishes only `out/`. It does not run automatically on pushes.
4. Verify HTTPS, deep links, images, filters, WhatsApp, policies, `/sitemap.xml`, `/robots.txt` and 404 responses on the actual domain. GitHub Pages ignores `_headers` and `vercel.json`; production HTML includes a CSP and referrer policy, but full response headers need a capable host/proxy and verification. Follow the remaining checkpoints in [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md).

To roll back, run the publishing workflow for the last known good release commit or redeploy its artifact, then repeat live checks. No domain deployment is claimed by a source push alone.

### Cloudflare Pages

1. Run `npm ci` and `npm run build` locally. Deploy **only `out/`**, using Pages Direct Upload or Wrangler (`npx wrangler pages deploy out --project-name <your-pages-project>`). Authenticate with your own account outside this repository.
2. In Pages, add `aitoolspk.tech` as a custom domain. Follow the DNS records shown by Cloudflare for your project; do not guess addresses. If Cloudflare manages the apex zone, use the nameservers it assigns at your registrar.
3. Add `www.aitoolspk.tech` if wanted and redirect it to `https://aitoolspk.tech`. Redirect HTTP to HTTPS. Wait for the certificate to become active.
4. `public/_headers` is copied into the export and provides security headers on Pages. Verify them on the deployed domain.

### Vercel

1. Import a **sanitized** Git repository into your Vercel account. Use Node.js 24, `npm ci`, build command `npm run build`, and output directory `out`.
2. The private source CSV is intentionally untracked. A host can build from the committed sanitized catalog without receiving it; product changes should be imported locally and committed as sanitized output.
3. Set `NEXT_PUBLIC_SITE_URL=https://aitoolspk.tech`. Add your purchased domain in Project → Settings → Domains, then enter exactly the DNS records Vercel gives you at your DNS provider. Configure www-to-apex and HTTPS redirects.
4. `vercel.json` supplies security headers. CSP allows Next.js's inline hydration scripts; tighten to hashes only if your deployment pipeline generates and tests those hashes.

### Verify launch

- Check homepage, catalog queries, every approved detail page, sitemap.xml, robots.txt and 404 responses on the real domain.
- Verify WhatsApp on Android, iOS and WhatsApp Web; a click is enquiry intent, not a completed order.
- Operate according to the published privacy, terms and refund policies. Per the owner's preference, contact details use AItoolsPK and the supplied WhatsApp number; no legal seller name or business address is added. No operating hours were invented.
- Finish review of logo usage and all products you wish to sell. Unsupported offers stay pending or are excluded.
- Add the verified domain to Google Search Console, submit `https://aitoolspk.tech/sitemap.xml`, and test approved Product structured data using the Rich Results Test. WhatsApp fulfilment does not guarantee merchant-listing eligibility.
- Measure representative mobile Lighthouse and real-device performance after deployment. Target LCP ≤2.5s, INP ≤200ms, CLS ≤0.1; field metrics require real traffic and are not guaranteed by a local build.
- There is no analytics collector. The browser exposes local `aitoolspk:analytics` CustomEvents for `search`, `filter_apply`, `product_open`, `whatsapp_click` and `out_of_stock_interest`. Payloads contain an event name and, where relevant, a public product ID only. Nothing is transmitted or persisted. If you connect a collector, document it and obtain consent where required; never send search text, WhatsApp messages, phone numbers, credentials or payment details.

## Browser checks

`npm run test:browser` uses the production export at port 3000. Install Chromium with `npx playwright install chromium` on a new machine; Linux CI uses `npx playwright install --with-deps chromium`. Screenshots go to ignored `reports/`. Tests cover 320/375/390/600/768/820/1024/1280/1440px, touch, keyboard dialogs, query/filter behavior, console errors and automated WCAG AA scanning. These are emulated Chrome checks; physical devices, Safari, a real WhatsApp handoff and a manual screen-reader review remain separate checks.

## SEO maintenance and owner setup

The existing metadata, canonical, robots and static-pagination implementation is retained. Collection buying guidance lives in `src/lib/collection-guides.ts`; reviewed editorial content lives in `src/lib/guides.ts`. Guides are static HTML with source links, actual review dates and Article markup. Update facts and dates only after reviewing sources. Offer price dates do not become sitemap modification dates. Do not remove commercially pending offer restrictions to improve an indexing count.

The PDF-audit and 27 October indexing follow-up provide 33 collection guides, 13 category checklists and 10 buying guides. Additional content lives in `data/seo/collection-content.json`, `data/seo/category-guidance.json` and `data/seo/additional-guides.json`. Keep each entry specific to its tool or buying task, link its supporting sources and update its checked date only after reviewing them. Collection sitemap dates reflect later guide updates; they are never stamped with every build. About and editorial-policy pages use only the supplied WhatsApp contact; no public email, address, social profile or support hours are configured.

Category-to-collection links omit a category only when every eligible plan in the full collection belongs to it. Mixed-category collections retain the filter, as do meaningful search and price constraints. Existing shared filter URLs continue to work with a clean collection canonical. See [indexing recovery evidence and release plan](docs/seo/INDEXING_RECOVERY_2026-10-27.md); technical eligibility is not a promise that Google has indexed a page.

The importer recognises explicit hyphenated terms such as `30-day` and `1-day warranty`, keeping subscription duration separate from unverified warranty labels. Ambiguous limits remain unconfirmed. On 29 October this corrected 65 records without changing prices, IDs, slugs, quote dates or approvals. Meaningful catalog changes to collection pages are recorded in `data/seo/collection-modified.json`; update only affected collections after actual edits, independently of price and editorial review dates.

`scripts/generate-discovery-assets.mjs` runs during `predev` and `prebuild`. It generates 1200×630 collection share images from the sanitized catalog and existing official logo assets, plus optional `public/llms.txt` navigation. Generated files are ignored by Git and recreated in CI; do not hand-edit them. This file is supplemental navigation, not a ranking requirement. `src/app/sitemap.ts` contains explicit dates for content changed on 24 October; update those dates when the relevant page content actually changes, never on every build. See [the PDF recommendation decisions and validation evidence](docs/seo/PDF_AUDIT_IMPLEMENTATION_2026-10-24.md).

- [SEO audit](docs/SEO_AUDIT_REPORT.md) and [implementation evidence / exact changed files](docs/SEO_IMPLEMENTATION_SUMMARY.md).
- [SEO-pro audit, live/local evidence and remaining release dependencies — 25 October 2026](docs/seo/SEO_PRO_AUDIT_2026-10-25.md).
- [Full website, SEO/GEO/AEO audit — 29 October, finalized 30 October](docs/seo/FULL_AUDIT_2026-10-29.md): 947 live HTML URLs, 65 term-parser corrections, current validation and release dependencies.
- [Search Console exclusion diagnosis and recovery plan — 27 October 2026](docs/seo/INDEXING_RECOVERY_2026-10-27.md).
- [Pakistan keyword research](docs/KEYWORD_RESEARCH.md) and [competitor research](docs/COMPETITOR_SEO_RESEARCH.md); qualitative samples, not invented volume or rank metrics.
- [Google Search Console setup](docs/GOOGLE_SEARCH_CONSOLE_SETUP.md): owner-generated DNS TXT token, verification, sitemap submission and inspection steps. No account verification or submission is claimed by this code change.
- HTML-file verification is also supported: keep `public/googledbe28a935a0df515.html` unchanged in future releases. After deploying, confirm `https://aitoolspk.tech/googledbe28a935a0df515.html` returns the Google token, then click **Verify** in Search Console. This asset is intentionally excluded from page metadata checks and the sitemap.
- Bing Webmaster Tools uses the owner-supplied `public/BingSiteAuth.xml`. Keep its filename, case and verification token unchanged. It must return XML at `https://aitoolspk.tech/BingSiteAuth.xml`; then use **Verify** in Bing. Verification files are static root assets, not content pages or sitemap entries.
- [AI search guidance](docs/AI_SEARCH_OPTIMIZATION.md), [monitoring plan](docs/SEO_MONITORING_PLAN.md) and [domain/vendor research](docs/DOMAIN_AND_VENDOR_RESEARCH.md).

Only the manually invoked `pages.yml` publishes. The obsolete Node 20 Next template is removed locally; do not restore automatic base-path injection for the custom root domain. This batch is **local-only until explicitly authorized for publication**. GA4, DNS records, Search Console accounts and the older related domain are not changed.

## Catalog-wide SEO operations

The enterprise SEO engine covers every sanitized offer, including nonindexable offers. It keeps research, keywords, review blockers, freshness, quality heuristics and real-or-null metrics in ignored `reports/seo/`; none is bundled into the website. The public editorial map is `data/seo/editorial.json`, currently empty. Commercial approval and a matching useful/distinct-content review are both required before individual product indexing. Metadata, sitemap and purchase schema share that gate.

```bash
npm run seo:products     # full catalog analysis and private JSON/CSV
npm run seo:keywords     # keyword-to-parent map and sourced opportunities
npm run seo:audit        # inspect the existing local static export
npm run seo:validate     # enforce final HTML/publication agreement
npm run seo:report       # refresh operational reports
npm run seo:build-check  # full release gate, including a fresh build
```

For an explicit paced live HTML audit, run `npm run seo:audit -- --live`. It never runs during a build, does not publish, and is separate from asset/browser/performance checks. Builds generate source intelligence before export and validate the final HTML afterward. CI without private research or analytics exports truthfully leaves those measurements unavailable.

Read [SEO automation and editorial review instructions](docs/seo/SEO_AUTOMATION_GUIDE.md), [complete product coverage](docs/seo/PRODUCT_COVERAGE_REPORT.md), [architecture](docs/seo/PROGRAMMATIC_SEO_ARCHITECTURE.md) and [implementation/check evidence](docs/seo/IMPLEMENTATION_SUMMARY.md). The `docs/seo/` folder also contains the tool inventory, production baseline, technical audit, keyword/competitor/gap research, topic map, GEO/AEO strategy, editorial/PR plans, GSC setup and 30/60/90-day roadmap. Analytics account connection, product evidence review and publication remain explicit owner actions; this code does not claim rankings, Google indexing or AI citations.
