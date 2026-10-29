# Search Console owner setup and safe data integration

Checked **23 October 2026** for **aitoolspk.tech**. No authenticated property, verification token, sitemap-submission result, Google-selected canonical or private performance data was available. These are exact owner-side instructions and a future read-only integration contract. Nothing here claims setup is complete. Existing live hosting remains separate from the unpublished enterprise source changes.

## Verify the real property without disrupting hosting

In [Search Console](https://search.google.com/search-console/), sign in with the business owner's retained Google account. Add a **Domain** property named `aitoolspk.tech` (no protocol/path/www). It covers protocols and subdomains. Follow Google's DNS verification dialog. [Property types](https://support.google.com/webmasters/answer/34592?hl=en)

| DNS field | Owner enters                                                                                                     |
| --------- | ---------------------------------------------------------------------------------------------------------------- |
| Type      | TXT                                                                                                              |
| Host      | `@`, or the provider's root/blank equivalent                                                                     |
| Value     | `<PASTE_GOOGLE_GENERATED_TXT_VALUE>` — replace this deliberately unusable placeholder with Google's actual value |
| TTL       | Provider default/automatic                                                                                       |

Add a new record at the authoritative nameserver provider. Preserve every existing hosting/mail/verification record; do not replace GitHub Pages A records, the www CNAME, MX, TXT or nameservers. Click Verify and retain the actual successful verification date privately. Keep the record afterward because ownership is rechecked. No token should be invented, committed or requested in chat. [Verification](https://support.google.com/webmasters/answer/9008080?hl=en)

## Submit and inspect only deployed content

After verification, open the real live `https://aitoolspk.tech/sitemap.xml`. Submit that URL in **Sitemaps**, then save status, last read, discovered count and errors. An unpublished local sitemap is not the deployed sitemap; do not report new pages as submitted before an authorized release. Success indicates sitemap processing, not indexing every URL. [Sitemaps report](https://support.google.com/webmasters/answer/7451001)

Inspect this representative sample after a meaningful authorized release:

| URL/sample                                        | What to check                                                                                       |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `https://aitoolspk.tech/`                         | Successful fetch, rendered styling, intended canonical and indexing permission                      |
| `https://aitoolspk.tech/tools/`                   | Native collection links, metadata, visible content                                                  |
| `https://aitoolspk.tech/category/ai-chat/`        | Category content and canonical                                                                      |
| `https://aitoolspk.tech/plans/chatgpt/`           | Collection content/links and Google's selected canonical                                            |
| `https://aitoolspk.tech/tools/page/2/`            | Distinct content, self canonical, next/previous links                                               |
| One actual deployed guide                         | Main text, Article/Breadcrumb consistency and related collection links                              |
| One actual held offer copied from catalog         | Intentional noindex; do not request indexing                                                        |
| One legitimately approved/indexable offer, if any | Actual public facts, eligibility and matching markup; this is conditional, not a fabricated example |

Use **URL Inspection** for Google's last indexed state and **Test live URL** for the current fetch/render. Only indexed data can show Google's selected canonical; a live pass does not certify commercial authorization, quality, no manual action or future indexing. Request indexing only for legitimately eligible useful pages after meaningful publication/fixes. [Inspection UI](https://support.google.com/webmasters/answer/9012289?hl=en)

Expected noindex offers are not an indexing error to remove. Google must crawl them to see the directive. Canonicals express preference for equivalent copies; they are not a substitute for intentional commercial exclusion. Distinct pagination keeps its own canonical. [Noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [canonical signals](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [pagination](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)

## Owner report checklist

| Report or setting                     | Record and act on                                                                                                             |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Page indexing                         | Unexpected exclusions among intended eligible pages; expected noindex separately; example URLs and reasons                    |
| Search results performance            | Equal date windows, search type, Pakistan/all-country scope, devices, relevant pages/queries, clicks/impressions/CTR/position |
| Core Web Vitals                       | Available mobile/desktop field groups, window, page/origin scope; absent data stays unavailable                               |
| Product enhancements, if present      | Only actual eligible item reports; absence does not prove a defect or eligibility                                             |
| Security Issues and Manual Actions    | Actual account status and alerts; no clean-status claim is made here                                                          |
| Settings > Search generative AI       | Effective include/exclude/inherit and parent property                                                                         |
| Generative AI performance, if present | Actual impressions and dimensions; report absence remains unexplained without account evidence                                |

The Search AI control is documented worldwide since 31 August 2026. Dedicated reporting is impressions-focused; its dates use Pacific Time. Do not label ordinary Web clicks as measured AI clicks or invent an AI CTR/query baseline. [Control](https://support.google.com/webmasters/answer/16908024?hl=en), [AI report](https://support.google.com/webmasters/answer/16984139?hl=en)

## Read-only API or owner-export path

The installed skills do **not** contain a connected Google account. A future integration must use the official authorized connection flow, property permission and minimum appropriate OAuth scope. Keep client secrets, refresh/access tokens and raw account exports outside the public repository and all browser bundles. An API key alone does not authorize private Search Console data. No credentials were created or loaded in this task. [API authorization](https://developers.google.com/webmaster-tools/v1/how-tos/authorizing)

| Capability                      | Appropriate operation and limit                                                                                                                                 |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Verify permitted property scope | Read `sites.list`; confirm `sc-domain:aitoolspk.tech` or correct URL-prefix property before querying                                                            |
| Performance                     | `searchanalytics.query` with explicit dates, dimensions and country/device/search-type filters; bounded pagination, rate-limit backoff and row-limit disclosure |
| Indexed canonical/status        | `urlInspection.index.inspect` only for a small prioritized sample; indexed data only, no live test/force-index endpoint                                         |
| Sitemap status                  | Read list/get when authorized; submission is a separate owner-authorized write                                                                                  |
| Search AI impressions           | Use owner export/UI unless an actual documented API/report route is available and tested; do not invent an endpoint                                             |

See the [API reference](https://developers.google.com/webmaster-tools/v1/api_reference_index), [Search Analytics query](https://developers.google.com/webmaster-tools/v1/searchanalytics/query) and [Inspection API](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect). Google's separate Indexing API is limited to supported job/livestream page types; it is not used to submit this catalog or guides. [Indexing API scope](https://developers.google.com/search/apis/indexing-api/v3/using-api)

For an export-based review, provide selected non-sensitive CSV/JSON plus a sidecar recording property, report, start/end dates, time zone, export date, dimensions, filters and known row cap. Store operational data privately. Map page URLs to stable public IDs; an unmatched URL is unmapped, not a zero-performing product. Missing/private queries and top-row limits mean table totals can differ from property totals. [Reporting limits](https://support.google.com/webmasters/answer/17011259?hl=en)

Derived reports must distinguish:

- Observed zero in an actual returned report from unknown/not returned.
- GSC clicks from analytics sessions, WhatsApp clicks, conversations and completed orders.
- Low-CTR hypotheses from established causation; use comparable impressions/position/device/intent before changing titles.
- URL-level versus origin-level field performance, and mobile versus desktop.

## Performance and structured data follow-up

PSI combines lab diagnostics with CrUX field data where available. Record p75 LCP/INP/CLS, window, device and URL/origin scope. Good thresholds are LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. Field values remain null if unavailable; lab TBT is not INP. [PSI data and thresholds](https://developers.google.com/speed/docs/insights/v5/about)

Validate eligible deployed markup with the [Rich Results Test](https://search.google.com/test/rich-results) and inspect results honestly. A local parser or passing remote test does not prove merchant/free-listing eligibility or rich-result display. This WhatsApp-first digital catalog must review actual product type/purchase model separately; no shipping or on-site checkout is invented. [Product types](https://developers.google.com/search/docs/appearance/structured-data/product)

GA4 remains optional and requires an actual owner-controlled measurement ID, approved privacy/retention/consent design and separate authorization. No measurement ID, collector or claim of stored conversions is introduced here. Use [the roadmap](SEO_30_60_90_DAY_ROADMAP.md) to assign follow-through.
