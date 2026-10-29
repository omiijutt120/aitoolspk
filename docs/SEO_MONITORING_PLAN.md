# SEO monitoring plan

Prepared **23 October 2026 (Asia/Karachi)** using official documentation linked below. This is a measurement plan, not a report of search results. No verified Search Console data, Google impressions/rank history, CrUX data, analytics measurement ID, or completed-order data was provided.

## Ownership and the baseline

The business owner retains Search Console/DNS access, reviews Google alerts, confirms offer eligibility and business claims, and records actual inquiry/order outcomes. The maintainer investigates reproducible technical issues, keeps a dated change log, and supplies validation evidence. Use [Search Console setup](GOOGLE_SEARCH_CONSOLE_SETUP.md) first. Keep exports and account details in owner-controlled storage, not a public repository.

Create a baseline worksheet with date range, export date, report, filters, URL, value, source, and caveat. Use `not available` for unavailable reports; never substitute an invented zero. Record the deployment date separately from the local change date.

| Measure                | What to record and how to interpret it                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Eligible URLs          | Count intended indexable canonical URLs from the deployed sitemap; separately count intentionally excluded offers.                 |
| Index coverage         | Compare eligible samples with Page indexing and URL Inspection; record unexpected exclusion reasons and Google-selected canonical. |
| Impressions and clicks | Overall Web totals plus page, device, country, and date views; compare equal windows and consistent filters.                       |
| CTR                    | Clicks divided by impressions; interpret with query intent, result appearance, and volume.                                         |
| Average position       | An aggregate of result positions, not a fixed universal rank or a traffic guarantee.                                               |
| Query intent           | Group available queries into brand, comparison, plan/price, and ordering/support intent; review relevance.                         |
| AI impressions         | Record the dedicated Search generative AI report if visible; keep its impressions separate from overall Web totals.                |
| Field performance      | Record real-user LCP, INP, CLS, device, page/origin scope, and data window if available.                                           |
| Inquiry outcomes       | Currently unavailable as an automated metric; optionally maintain non-identifying aggregate operational counts.                    |

Google can omit anonymized queries and truncate rows; query-table totals need not equal chart totals. Most page performance data is assigned to Google's canonical. Compare filters consistently, and avoid calling a manual search a rank baseline. [Google: dimensions and limitations](https://support.google.com/webmasters/answer/17011259), [clicks, impressions, and position](https://support.google.com/webmasters/answer/7042828)

The dedicated AI report covers AI Overviews/AI Mode impressions and can be absent with insufficient data. Do not add its totals to Web impressions: the AI report includes data already in Web reporting. Note its Pacific Time dates when comparing with Karachi operational records. [Google: Generative AI performance report](https://support.google.com/webmasters/answer/16984139)

## Cadence

| When                            | Responsible person and review                                                                                                                                                                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| After an authorized deployment  | Maintainer checks representative routes, assets, canonicals, robots, sitemap, native pagination, and visible/schema consistency. Owner inspects key eligible URLs and records any indexing requests.                                            |
| Weekly during the first month   | Owner checks sitemap processing, Page indexing changes, security/manual-action alerts, relevant query intent, and unexpected canonical choices; maintainer investigates actionable errors.                                                      |
| Monthly afterward               | Owner exports comparable 28-day windows, annotates content/price/availability changes, and reviews eligible landing pages and inquiry quality. Maintainer checks representative performance and accessibility.                                  |
| On a sharp drop or Google alert | Owner checks report filters, dates, [known reporting anomalies](https://support.google.com/webmasters/answer/6211453), and security/manual actions; maintainer checks availability, robots/noindex, canonicals, redirects, and recent releases. |

Do not fix expected duplicates or eligibility-held `noindex` offers by making every URL indexable. Investigate eligible important pages first. [Google: Page indexing interpretation](https://support.google.com/webmasters/answer/7440203)

## Performance evidence

[PageSpeed Insights](https://pagespeed.web.dev/) separates CrUX real-user data from Lighthouse lab diagnostics. CrUX uses a rolling 28-day period and may have only origin-level data or none. Record the scope and dates. No field data means **insufficient evidence**, not a pass or fail. [Google: PSI data sources](https://developers.google.com/speed/docs/insights/v5/about)

Good field thresholds at the 75th percentile are **LCP ≤ 2.5 seconds, INP ≤ 200 milliseconds, CLS ≤ 0.1**. Review mobile and desktop separately. Lighthouse scores are controlled-test diagnostics; lab Total Blocking Time can suggest responsiveness problems but cannot establish the site's INP. [Google: PSI thresholds](https://developers.google.com/speed/docs/insights/v5/about), [web.dev: TBT and INP](https://web.dev/articles/tbt)

For lab comparisons, record URL, deployed revision, device profile, tool version, throttling, run date, and the report artifact. Repeat only to investigate variation or a relevant change. Prioritize user-visible regressions and large payloads rather than promising a score or rank.

## Privacy-conscious inquiry measurement

The current `aitoolspk:analytics` CustomEvents are local browser integration hooks for `search`, `filter_apply`, `product_open`, `whatsapp_click`, and `out_of_stock_interest`. There is no collector in these hooks. They do not provide stored search/WhatsApp totals or a conversion baseline. A WhatsApp link click also cannot prove a conversation, paid order, or completed delivery.

Start with Search Console and optional aggregate business records. If the owner later chooses a collector, document the purpose, access, retention, privacy disclosure, and consent behavior before enabling it. Avoid collecting search text, WhatsApp message contents, phone numbers, credentials, customer identifiers, and full destination URLs that contain messages. Use bounded event names and reviewed non-sensitive identifiers only.

GA4 is optional. It requires the owner's actual web data-stream measurement ID and an approved disclosure/collection design; no tag or analytics account is installed or created by this plan. Configure data sharing and enhanced measurement deliberately, then validate accepted and declined consent paths where applicable. [Google: GA4 account, stream, and collection setup](https://support.google.com/analytics/answer/9304153)

## 30 / 60 / 90-day review milestones

Start the clock when owner verification and an authorized deployment establish a baseline, not on this document's creation date.

| Review | Measurable completion criterion                                                                                                                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Day 30 | Record property verification/sitemap status; inspect homepage, catalog, one category, one collection, one pagination URL, and one held offer; classify every finding; export available baseline or explicitly log missing data. |
| Day 60 | Compare two equal 28-day windows with identical filters; review the available top 10 relevant queries and landing pages, or all if fewer; record three prioritized actions with an owner and evidence.                          |
| Day 90 | Recheck the same URL sample; close or explicitly defer each prior action with a reason; compare available field/lab evidence and inquiry quality; choose the next quarter's priorities from observed problems.                  |

These milestones measure monitoring and follow-through. They do not guarantee traffic growth, indexing, AI inclusion, rankings, or Core Web Vitals data availability.
