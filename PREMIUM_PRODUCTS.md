# Premium subscription additions

Local implementation requested on 23 October 2026. This change is not published or deployed.

The existing Next.js 16 / TypeScript / Tailwind architecture, parent collections, `/plans/` and `/tool/` routes, PKR formatting and native WhatsApp links are retained. No dependencies are added. The original 811 records remain identical; a SHA-256 regression assertion covers every original field, price, slug and variant.

| Product             | Duration | Retail price | Detail page                           |
| ------------------- | -------- | ------------ | ------------------------------------- |
| Helium 10 Platinum  | 1 month  | PKR 2,500    | `/tool/helium-10-platinum/`           |
| Helium 10 Diamond   | 1 month  | PKR 4,800    | `/tool/helium-10-diamond/`            |
| Midjourney Standard | 1 month  | PKR 4,000    | `/tool/midjourney-standard/`          |
| Midjourney Standard | 3 months | PKR 8,000    | `/tool/midjourney-standard-3-months/` |
| Envato Elements     | 1 month  | PKR 2,000    | `/tool/envato-elements/`              |
| vidIQ Max           | 1 month  | PKR 3,000    | `/tool/vidiq-max/`                    |

Four new brand collections appear in the existing homepage and directory: Helium 10, Midjourney, Envato Elements and vidIQ. Helium 10 has two packages; Midjourney has two duration variants. A pre-existing vidIQ-related CSV offer retains its original price, warranty and collection.

## Data and component changes

- `data/premium-products.json`: five seller-defined products and six numeric duration/price variants; public content only.
- `scripts/premium-catalog.mjs` and `scripts/import-catalog.mjs`: merge new offers without changing the CSV records; duplicate protection; repeatable import with and without the private CSV.
- `src/components/duration-selector.tsx`: Midjourney duration control navigates to each real canonical route, updating the price, product ID, warranty duration, metadata and both desktop/mobile WhatsApp links together. Savings use actual numeric prices, not a hardcoded discount. Native duration links remain available without JavaScript.
- Product card/detail components: short descriptions, feature lists, exclusions, fair usage, full-duration seller warranty badge and official-price context. Existing products keep their existing terms.
- `src/lib/categories.ts`: four requested categories. `data/storefront.json`: four new featured brands, preserving the owner's existing featured IDs and API-last ordering.
- `src/app/terms/page.tsx`: seller warranty and fair usage sections, effective 23 October 2026. No new universal activation time, uptime, replacement or refund promise.
- `data/brands.json`, `data/logo-sources.json`, `data/brand-asset-map.csv` and four WebP assets: official-source brand identity provenance. Brand assets identify products; no vendor affiliation, blanket trademark license or permission to resell is asserted.
- Existing sitemap generation includes the new category/collection routes. All six new individual offers remain commercially pending, with unconfirmed stock, noindex and no Product/Offer JSON-LD; they are excluded from the sitemap. Active WhatsApp links request confirmation. Evidence-backed approval is required before an individual offer becomes indexable. No reviews or ratings are fabricated.

## Package limits and warranty

Individual offer indexing now also requires a current useful/distinct-content review in the safe public `data/seo/editorial.json` map, in addition to private evidence-backed commercial approval. Metadata, sitemap and Product/Offer markup share that decision; current offers remain pending/noindex. Follow [the SEO automation guide](docs/seo/SEO_AUTOMATION_GUIDE.md). Quote/stock readiness and seller warranty remain separate from indexing permission.

All six variants have AI Tools PK's seller-provided warranty for the purchased duration, subject to `/terms/#seller-warranty` and `/terms/#fair-usage`. Actual activation dates and the delivery method are confirmed on WhatsApp.

Platinum excludes Cerebro and Magnet. Diamond does not offer unlimited searches. Midjourney generation limits/access, Envato download/AI/license entitlements and vidIQ AI allowances/channel counts are not invented. The three-month Midjourney package saves PKR 4,000 against three separate PKR 4,000 monthly purchases.

Helium 10's [official pricing page](https://www.helium10.com/pricing/) was checked on 23 October 2026: monthly vendor-direct references are USD 129 for Platinum and USD 359 for Diamond. These are labeled as references for a different vendor-direct package; they are not used as crossed-out PKR prices or a claimed like-for-like discount.

Midjourney's official [trademark policy](https://docs.midjourney.com/hc/en-us/articles/32084281102349-Midjourney-Trademark-Policy) supplies the sailboat asset and the attribution/non-affiliation notice. The three other assets come from the vendors' own site icons. Exact downloaded URLs and dates are stored in `data/brands.json`.

## Verification

Final local checks passed: lint, TypeScript, 18 unit tests, production build and release gate with its disclosed existing dev-tool advisory exception. All 39 browser cases passed, including all six prices, details/WhatsApp links, Midjourney switching at phone/tablet/desktop widths, history navigation, no-JavaScript duration links, honest pending/noindex/schema exclusions, sitemap and accessibility. Tests intercept WhatsApp navigation and send no messages. The current export has 817 offers, 108 collections, 149 indexable sitemap URLs and zero broken internal targets. See [full implementation evidence](docs/SEO_IMPLEMENTATION_SUMMARY.md) for performance measurements, changed files, owner actions and limits.

The live domain and private hosted preview are intentionally unchanged by this request.
