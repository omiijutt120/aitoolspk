# Image and Core Web Vitals evidence — 15 November 2026

## Scope

This report measures the committed static asset tree and distinguishes local/lab evidence from field data. It does not claim a Core Web Vitals pass. Production DNS, CrUX and Search Console field data were unavailable; Playwright Chromium could not run under the cloud worker's root sandbox.

## Asset inventory

- Referenced/public raster and vector assets scanned: **365**
- Total bytes in scanned assets: **6,506,544**
- Existing optimization pipeline: scripts/optimize-assets.mjs generates cached 96px and 144px WebP logo thumbnails with Sharp; scripts/generate-discovery-assets.mjs generates share cards.
- Newly verified in this PR: fixed-size logo components declare exact sizes; no already-efficient asset was re-encoded.

## Largest assets before/after

No byte-changing asset optimization was justified by source evidence in this run. The table is the measured current baseline; “after” is unchanged because re-encoding would risk quality/trademark assets without a measured LCP target.

| Asset | Bytes | Dimensions | Format | Change |
| --- | ---: | --- | --- | --- |
| `public/brand/logo.png` | 105,554 | 512×512 | png | unchanged; generated/static asset |
| `public/og/collections/canva.png` | 60,343 | 1200×630 | png | unchanged; generated/static asset |
| `public/brand/social.png` | 57,659 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/collections/lovable.png` | 55,294 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/collections/suno.png` | 52,852 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/collections/zoom.png` | 52,694 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/collections/minimax.png` | 51,757 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/collections/heygen.png` | 51,512 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/collections/grammarly.png` | 48,579 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/collections/purevpn.png` | 48,388 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/guides/private-shared-workspace-access.png` | 47,908 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/collections/higgfield.png` | 47,710 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/collections/claude.png` | 47,687 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/collections/jetbrains.png` | 47,455 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/collections/spotify.png` | 47,275 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/collections/leonardo.png` | 46,991 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/collections/coursera.png` | 46,947 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/collections/ilovepdf.png` | 46,373 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/collections/aws.png` | 46,364 | 1200×630 | png | unchanged; generated/static asset |
| `public/og/collections/perplexity.png` | 45,894 | 1200×630 | png | unchanged; generated/static asset |

## Rendering evidence

- Logo components use explicit width/height and now exact sizes values for their rendered slots.
- Header logo is the only eager/priority logo; collection/product/catalog/article logos remain below-fold or fixed-size and are not globally forced eager.
- Generated WebP thumbnails remain cached and idempotent.
- Static export and fragment checks passed after the changes.

## CWV status

| Metric | Status |
| --- | --- |
| LCP p75 ≤ 2.5s | NOT MEASURED — no CrUX/GSC field data and no permitted browser lab run |
| INP p75 ≤ 200ms | NOT MEASURED — no field data |
| CLS p75 ≤ 0.1 | NOT MEASURED — no field data |
| Mobile/desktop lab comparison | BLOCKED — Chromium sandbox refuses root launch |

Owner action: run PageSpeed Insights/CrUX and a non-root Playwright/CI run against the exact deployed commit; record mobile and desktop URLs, dates, LCP/INP/CLS and throttling settings.
