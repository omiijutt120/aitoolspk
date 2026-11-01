# Verified baseline

Production was crawled on **23 October 2026, 09:11:58–09:22:05 UTC** before the new engine was completed. It is a different release from the unpublished working tree.

| Observation                            | Live production |                    Local catalog before this engine |
| -------------------------------------- | --------------: | --------------------------------------------------: |
| Individual offers                      |             811 |                                                 817 |
| Primary collections (API grouped once) |             104 |                                                 108 |
| Categories                             |               9 |                                                  13 |
| Discoverable HTML                      |             949 | 969 exported files, including three error documents |
| Indexable HTML / sitemap URLs          |             138 |                     149 verified local sitemap URLs |
| Intentional noindex offers             |             811 |                       817 pending commercial review |
| Broken HTML / unique asset responses   |           0 / 0 |                 Final export/browser gates required |

The production public catalog's SHA-256 is `182c32527870eb17fa20b419987624639d789057c8b2064fbeeb1dcade8790d4`, exactly the original 811-record preservation fixture after JSON parsing. Six local premium plans are additional, with their independently preserved prices and IDs.

All 949 live pages returned HTTP 200, one H1, a self canonical, nonempty metadata and valid JSON-LD. All 165 discovered assets returned 200. HTTP apex and HTTPS www redirect to HTTPS apex; the apex responds 200. The previous `/aitoolspk/` root-prefix/CSS failure is **not reproducible**. Preserve working DNS, CNAME and HTTPS settings.

Seventeen production browser checks passed across 390/768/1440px, including real 404, JavaScript-disabled navigation, plan/detail links and native WhatsApp messages. No browser console or failed-resource errors occurred. These are emulated Chrome checks, not physical-device certification.

Priorities:

1. **P0 commercial/content:** all offers remain pending; stock confirmation does not establish authorization, delivery or exact plan terms. Do not manufacture Product/Offer markup or indexing approval. Distinguish seller warranty from vendor warranty.
2. **P1 metadata:** live pagination has eight duplicate-description groups covering 24 URLs. The unpublished source already contains pagination-specific descriptions. Retired FAQPage markup remains on the older live release; source removes it.
3. **P1 coverage:** previously there was no durable per-offer SEO intelligence database. Implement deterministic, complete ID coverage and change/review gates.
4. **P1 differentiation:** generic source-derived descriptions cannot establish unique plan value. Use parent intent targets and reviewed specifications, not spun introductions.
5. **P2 evidence:** no current authorized GSC/GA4/backlink/citation or field-CWV dataset. Keep values unknown; use actual exports and comparable windows later.
6. **P2 hosting:** selected response security headers are absent on GitHub Pages; HTML meta CSP is separate. Changing DNS/hosts is outside this implementation.

The local architecture inventory includes static route generators, server metadata, self-canonical pagination, native links, catalog/approval/inventory import, brand provenance, WhatsApp intent gates, CI/manual Pages release, export repair and browser/unit checks. It preserves Next.js static export; no request-time backend, login/cart/payment flow or tracker was added.

Raw first-party evidence: ignored `reports/seo/{baseline,production-crawl,production-findings,production-browser}.json` and `technical-crawl.csv`. The crawl exhausted native internal HTML links below its 1,500-URL safety cap; it excludes external pages and query variants. A 200 response or sitemap membership does not establish Google indexing.

The related [aitoolspak.tech homepage](https://aitoolspak.tech/) was re-opened during this task: it presents a separate 32-tool catalog, overlapping Pakistan buying intent and a different brand identity. The current domain's web-service open failed while the complete direct crawl and browser tests succeeded; that tool failure is not an outage. [Existing domain research](../DOMAIN_AND_VENDOR_RESEARCH.md) records both self canonicals, shared public contact details and a conditional migration plan. Ownership is not established by a shared phone number. Keep `aitoolspk.tech` as this application's sole canonical origin; do not redirect, mirror, edit or disable the other site without verified control and separate authorization.
