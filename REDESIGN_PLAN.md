# AItoolsPK storefront redesign

## What changes

The homepage becomes the catalog itself. Remove the tall hero, orbit illustration, shortlist and “Find your next tool” button. Keep the full catalog on `/`: visitors search, filter, compare and scroll through every offer without moving to another page.

## Layout

1. Compact sticky header with the supplied brand mark, a prominent search field and WhatsApp support.
2. Short monochrome introduction with the real catalog count and a small branded composition using actual vendor assets.
3. Full catalog: category tabs, brand shortcuts, an offer count, numeric sorting, a desktop filter sidebar and a mobile filter drawer.
4. Product cards with prominent genuine logos, readable plan titles, distinct duration/access/warranty details, PKR prices, stock/review status and both required actions.
5. A compact help strip and policy footer. Put detailed guidance on its dedicated pages.

## Browsing

All 811 offers belong to the homepage catalog. Render the first batch immediately and automatically reveal further offers as the visitor scrolls, keeping search/filtering over the entire catalog. No “browse all” gate, homepage pagination or extra discovery CTA. Keep `/tools` and all existing category/detail URLs working.

## Logos and data

Use real assets from declared official vendor domains or published brand kits, stored locally with their source URLs. Verify source provenance, preserve native colors/proportions, and never substitute a made-up symbol. Keep unresolved brands as text. Logo provenance does not imply permission to resell a product or vendor endorsement. Keep product approval and quote expiry gates, exact prices and private supplier fields unchanged.

## Acceptance

- Products visible in the first desktop viewport; first mobile screen leads directly into search/catalog.
- All offers searchable on `/`, no “Find your next tool” button, no navigation required to browse the rest.
- Official logos visible on the main recognizable brands, with an asset provenance report.
- Working category chips, brand shortcuts, filters, sorting, automatic loading and mobile drawer.
- Check 375/390/768/1024/1440px, keyboard interaction, contrast, console/network errors, price/variant integrity, lint, TypeScript and production build.
- Update the running local preview and the existing owner-only hosted preview; do not claim the purchased domain is configured.
