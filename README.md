# AiToolsPk.tech

A static-first Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 catalog. Orders are enquiries on WhatsApp at **+923714549245**. There are no customer accounts, payment forms, carts, databases or analytics trackers.

The UI uses native system fonts with no font download. `predev` and `prebuild` generate 96px WebP thumbnails from the official local logo masters, keeping full assets for larger collection logos and detail pages. Generated thumbnails are ignored by Git and recreated automatically. Use `node scripts/fetch-official-logos.mjs --only=leonardo,linkedin` to refresh selected brand assets; source declarations and provenance live in `data/logo-sources.json` and `data/brands.json`.

The homepage shows 23 featured parent collections, selected from the owner's plan IDs and five familiar brands, with one API collection last. Each card shows the full plan count and lowest listed PKR price. "Find your next tool" and "Show all tools" sit alongside the featured heading, opening the grouped directory of 104 collections containing all 811 plans. The finder focuses search. See [REDESIGN_PLAN.md](REDESIGN_PLAN.md) and [VERIFICATION.md](VERIFICATION.md).

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

All **811** original rows are imported with exact `SellingPricePKR` integer retail prices. No brand-level deduplication occurs. The initial snapshot contains 537 source-reported in-stock, 192 out-of-stock, 62 stock-unconfirmed and 20 custom offers. The last two groups normalize to 82 unconfirmed offers. Source stock is never presented as an approval to sell.

The original CSV and PRD are in ignored `private/`. **Never upload that directory, the original Downloads files, or `reports/` to a public repository or web root.** Public builds use an allowlist projection in `data/catalog.json` and `public/catalog/index.json`. Descriptions are rewritten conservatively; raw source copy, purchase requirements, supplier URLs, original prices, costs, margins, profits, sold counts and evidence are never copied. IDs are stable opaque public hashes; they do not expose supplier identifiers.

The homepage server renders its selected parent cards without fetching the full catalog or loading the search engine. Manage featured product IDs and additional brands in `data/storefront.json`. API offers live in one parent, last in the default directory order. The directory renders 24 parent cards per page; each collection renders 24 individual plans per page. The browser fetches the sanitized index and uses Fuse.js for accent-insensitive fuzzy search. Filters and sort live in the URL. Individual offers, collections and categories are static HTML with metadata and breadcrumbs. Pending individual offers are `noindex` and omitted from the sitemap. Product/Offer structured data is emitted only for approved entries, with an Offer only when purchasable.

Pagination uses real static paths such as `/tools/page/2/` and `/plans/chatgpt/page/2/`, with native links, distinct server-rendered contents and a self-canonical per page. Query-only `?page=2` is not used. Query filters, sort and tracking variants canonicalize to the clean path; robots allows crawlers to read those signals. The sitemap lists all indexable pagination pages. See [SEO_CANONICAL_CHECKLIST.md](SEO_CANONICAL_CHECKLIST.md) for the attached canonical-guide audit and remaining live-domain/Search Console checks.

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

5. Reimport, run checks and redeploy. Buy Now always opens WhatsApp. Approved, confirmed in-stock offers with a quote at most seven days old use the order message; pending, unconfirmed or expired offers use an availability-confirmation message. Out-of-stock offers show Restock and use a restock message. Approval is still required before representing a sale as ready. Refresh prices and stock weekly. Refresh dates only after actually rechecking. Price changes belong in the CSV's retail-price column.

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

1. Open the repository's **Settings > Pages** and select **GitHub Actions** as the build source. Set the custom domain to `aitoolspk.tech`. Configure the registrar/DNS using [GitHub's current instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), then verify the domain and enable HTTPS when available. The public DNS returned `127.0.0.1` during this audit; replace it with the hosting provider's actual records.
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
