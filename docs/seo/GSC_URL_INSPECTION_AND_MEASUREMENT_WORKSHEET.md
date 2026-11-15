# Google Search Console owner inspection worksheet

Property: `https://aitoolspk.tech/`
Prepared: 15 November 2026
Purpose: record live Google evidence. Do not fill from repository assumptions.

## Priority URL inspection

Inspect these canonical collection URLs one by one in Search Console → URL inspection. Record the exact inspection date and screenshot/export evidence.

| Priority | Canonical URL | Indexed? | Last crawl | Google-selected canonical | User-declared canonical | Referring page | Sitemap status | Live test result | Action |
|---|---|---|---|---|---|---|---|---|---|
| P0 | https://aitoolspk.tech/ | | | | | | | | |
| P0 | https://aitoolspk.tech/price-index/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/chatgpt/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/gemini/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/claude/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/canva/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/grok/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/cursor/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/elevenlabs/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/adobe/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/notion/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/capcut/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/kling/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/youtube/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/tiktok/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/gamma/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/microsoft/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/figma/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/lovable/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/runway/ | | | | | | | | |
| P1 | https://aitoolspk.tech/plans/leonardo/ | | | | | | | | |

If a route is not present in the current sitemap, mark it NOT PRESENT and do not submit a guessed URL.

## Search performance comparison

Use Search Console → Performance → Search results. Compare equal-length windows (28 days before release vs 28 days after release) after the updated branch has actually been deployed. Keep search type, country, device and page/query filters identical.

Record:
- Total clicks and impressions.
- Non-branded clicks for relevant product/collection queries.
- Price Index clicks, impressions and CTR.
- Priority collection clicks/impressions/CTR.
- Desktop vs mobile clicks/impressions/CTR.
- Pakistan-only results.
- Exact query group `^ai[0-9]+$` separately.

For the anomaly, apply the page filter separately to `/price-index/`, homepage and `/plans/chatgpt/page/3/`, then open Queries. Do not join independent Queries and Pages exports to infer individual query-to-page mapping.

## Site health

Record screenshots/exports and dates for:
- Page indexing reasons (indexed, crawled-not-indexed, discovered-not-indexed, excluded).
- Submitted sitemap status and discovered URLs.
- Manual actions and Security issues.
- Core Web Vitals field reports (mobile and desktop).
- URL Inspection live test and rendered HTML screenshot.

## Bing and answer-engine measurement

Record Bing Webmaster sitemap/indexing status and IndexNow status only if verified. For ChatGPT, Gemini, Claude, Perplexity and Copilot, save the exact query, date, country/account context, cited URL and screenshot. Absence from one sample is not proof of permanent exclusion.

## Rules

- Do not request indexing for hundreds of unapproved `/tool/` offers.
- Do not treat URL presence or sitemap membership as proof of indexing.
- Do not call the `ai#####` impressions bots, attacks or penalties without evidence.
- Do not claim rankings or AI citations improved until post-release observations exist.
