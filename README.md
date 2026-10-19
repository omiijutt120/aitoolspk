# AItoolsPK.tech

A static-first Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 catalog. Orders are enquiries on WhatsApp at **+923714549245**. There are no customer accounts, payment forms, carts, databases or analytics trackers.

`npm run build` includes a narrow post-build workaround for [Next.js issue #85374](https://github.com/vercel/next.js/issues/85374): Windows builds can emit nested RSC segment filenames while the browser requests flat filenames. The script copies the required flat aliases without modifying dependencies; native Linux exports need no changes. Keep this check when deploying an export built on Windows.

## Run locally

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

`npm start` serves the production export in `out/`. The bundled workspace-only runtime, if needed on this PC, lives in `.tools/node-v24.22.0-win-x64/`; it is ignored by Git. In PowerShell, prepend it for the current terminal only:

```powershell
$env:Path = "$PWD/.tools/node-v24.22.0-win-x64;" + $env:Path
npm.cmd run dev
```

## Catalog and privacy boundary

All **811** original rows are imported with exact `SellingPricePKR` integer retail prices. No brand-level deduplication occurs. The initial snapshot contains 537 source-reported in-stock, 192 out-of-stock, 62 stock-unconfirmed and 20 custom offers. The last two groups normalize to 82 unconfirmed offers. Source stock is never presented as an approval to sell.

The original CSV and PRD are in ignored `private/`. **Never upload that directory, the original Downloads files, or `reports/` to a public repository or web root.** Public builds use an allowlist projection in `data/catalog.json` and `public/catalog/index.json`. Descriptions are rewritten conservatively; raw source copy, purchase requirements, supplier URLs, original prices, costs, margins, profits, sold counts and evidence are never copied. IDs are stable opaque public hashes; they do not expose supplier identifiers.

Only the first 24 offers are server rendered in catalog pages. The catalog browser fetches the sanitized index, uses Fuse.js for accent-insensitive fuzzy search, and paginates rendered cards at 24. Filters and sort live in the URL. Individual offers and category pages are static HTML with metadata and breadcrumbs. Pending offers are `noindex` and omitted from the sitemap. Product/Offer structured data is emitted only for approved entries, with an Offer only when purchasable.

### Update products

1. Replace `private/catalog.csv` with a UTF-8 CSV with the original column names. Keep source and product ID values stable to preserve public IDs and URLs.
2. Run `npm run catalog:import`. Inspect `reports/catalog-audit.json` for missing durations, warranty terms, logo coverage and risky claims. Critical identity, date, price or approval errors stop the import.
3. Review each offer's commercial authorization, eligibility, delivery method and truthful terms. Do not approve credential handover, OTP rentals, unsupported education access, lifetime/unlimited claims or shared plans without resolving the concern.
4. Add the review to `data/approvals.json` under the generated `PK-…` ID. Omit entries to keep them pending; set `status: "excluded"` to remove a listing entirely. Do not enter confidential evidence contents or credentials; store evidence references to private records.

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

5. Reimport, run checks and redeploy. Buy Now activates only for approved, confirmed in-stock offers with a quote at most seven days old. Refresh prices and stock weekly. Refresh dates only after actually rechecking. Price changes belong in the CSV's retail-price column.

Every card and detail page includes View Details / Buy Now. Disabled offers have enquiry or restock links on their detail page. Order messages include product, exact variant terms, retail price, public ID, canonical product URL and a confirmation request. No message is sent automatically. No passwords or security codes are requested.

### Brands and assets

The supplied PNG is preserved at `public/brand/logo.png`; favicon sizes, Apple/app icons and social card derive from it. Run `node scripts/prepare-brand.mjs` after replacing the master. No separate favicon attachment was present.

`data/brands.json` records official domain, source, local asset path, permission review, verification date and usage notes. Official downloadable assets are stored locally; no third-party logo API or secret client ID is used. Where permission or provenance is unresolved, the UI uses a plain text brand name. Do not invent substitute logos or mark an unknown brand as licensed. Add only assets obtained from the vendor's own published kit or a licensed source, and record the applicable usage terms. Official kit sources reviewed include [Figma](https://www.figma.com/using-the-figma-brand/), [Cursor](https://cursor.com/brand), and [ElevenLabs](https://elevenlabs.io/brand). Product resale approval and trademark use are separate reviews.

## Structure

```text
src/app/                 Routes, metadata, sitemap and robots
src/components/          Layout, cards, catalog browser, dialogs and shared content
src/lib/                 Typed public catalog, categories, SEO and commerce rules
scripts/                 Private CSV import and brand asset generation
data/                    Sanitized catalog, approvals and official asset map
public/                  Public assets and sanitized searchable index
private/                 Original sources (ignored; never deploy)
reports/                 Private QA/audit output (ignored)
tests/                   Data/commerce tests and browser accessibility checks
```

## Deploy to your purchased AItoolsPK.tech domain

This repository does **not** itself configure domain ownership, DNS, HTTPS, Search Console or hosting. Deployment is complete only after a host is serving the export and DNS/SSL have been checked. Keep the launch catalog under review until resale evidence and exact offer terms are available.

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

`npm run test:browser` uses the production export at port 3000 and local Chrome. On another OS set `CHROME_PATH` to an installed Chrome executable, or adapt the Playwright config to your installed Playwright browser. Screenshots go to ignored `reports/`. Tests cover 375/390/768/1024/1440px, keyboard dialogs, query/filter behavior, console errors and automated WCAG AA scanning. Automated accessibility checks do not replace a manual screen-reader review.
