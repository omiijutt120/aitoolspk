# Website, SEO, GEO and AEO audit execution

Requested 25 October 2026 after the SEO-pro audit. This is a broader functional and failure-state review of the same prepared website, not a claim that the unpublished changes are live.

## Plan before implementation

1. **Baseline:** inspect current source and the dated SEO-pro results; refresh representative live responses. Preserve the existing work and owner-confirmed product data.
2. **Functionality:** check normal navigation plus cases the previous suite did not cover: campaign URLs, catalog network failure, invalid catalog response, retry/recovery, empty search and parameter handling. Check anchor fragments and duplicate IDs throughout the export.
3. **Usability:** verify phone/tablet/desktop layouts, keyboard/focus, reduced motion and accessible error messages. Reuse the just-passed 47 browser checks; add meaningful regressions for reproduced defects.
4. **SEO/GEO/AEO:** review source/rendered metadata, canonical/query consistency, crawl access, sitemap, JSON-LD, answer/source clarity and intentional offer noindex. Separate source-backed improvements from unknown search/AI outcomes.
5. **Fix:** implement only confirmed defects, then build and run the relevant functional, export, content and privacy checks. Do not alter prices, package claims, publication approvals, vendor logos or business contact details to manufacture an audit pass.
6. **Close:** record findings, test results, the new plan's completion status and external dependencies. Production deployment retains the owner's earlier separate authorization requirement.

## Evidence baseline

The preceding SEO-pro audit checked all 138 live sitemap URLs plus eleven additional routes, 48 live assets/verification files and all 977 local normal/error HTML documents. All existing live sitemap entries worked; the three new informational sections remain unpublished. Local build, 35 unit tests and 47 browser tests passed. There were no broken local targets or duplicate indexable metadata. This evidence is reused, not reported as a new execution.

The new inspection uses SEO-pro's audit/GEO guidance and the `tlc-web-quality-audit` workflow, with its compatibility corrections. No arbitrary title-length, word-count or unverified ranking/citation score is treated as a requirement. Account analytics and real-user CWV are unavailable.

## Findings and fixes

| ID | Priority / evidence | Finding | Implemented fix | Verification |
| --- | --- | --- | --- | --- |
| WA01 | Medium; browser reproduction | `/tools/?utm_source=google&utm_campaign=launch` downloaded the full catalog, treated tracking values as active filters and announced “matching your filters”. | Explicit catalog-parameter allowlist. Campaign values stay in the arrival URL but do not trigger search, become chips, or propagate to collection/pagination links. Canonical remains unchanged. | Browser test checks no catalog request until a real search, clean internal links and correct result wording. |
| WA02 | High; browser reproduction | A valid JSON error object made the client call `.filter` on a non-array, replacing the catalog with the application error screen. | Validate downloaded catalog shape and essential item fields before committing React state. Malformed input becomes a recoverable catalog error. | Regressions for an error object and invalid array row; no page error, static browsing retained, retry succeeds. |
| WA03 | Medium; browser reproduction/source | After HTTP 503, the unfiltered 815-plan catalog was still described as matching the requested search. Mobile filter action also used the current page's 24 items as the total before data loaded. | Honest loading/failure text; explicitly label fallback as unfiltered. Use the actual catalog/matched total in the mobile action. | Failed-response and retry tests assert wording and recovered results. |
| WA04 | Medium; source review | Retry reloaded the entire document; a stalled request had no deadline and could remain loading. | Retry only the data request, retain query/navigation state, abort after 15 seconds, clean up on unmount and keep an explicit retry control. | Browser checks one document navigation across retry, plus a clock-controlled stalled-request test. |
| WA05 | Medium; source review | Roman Urdu answer paragraphs inherited the English page language. | Added `lang="ur-Latn"` to the Roman Urdu question and answer in all 25 collection guides, retaining left-to-right Latin text. | Source/browser checks language attributes; supporting [W3C language-of-parts guidance](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html). This is semantic/accessibility markup, not a citation guarantee. |
| WA06 | Preventive check; full export | Existing route checks did not independently report missing fragment IDs or duplicate HTML IDs. No actual defect was found in this pass. | Added `npm run check:fragments` and integrated it into `launch:check`. It inspects rendered HTML tags, not serialized React/script data. | 978 HTML files including the Google verification file; 1,027 fragment references; zero missing targets or duplicate IDs in baseline. |

Reproduction evidence: `reports/seo/website-audit-baseline.json`. Code changes: `src/components/catalog-browser.tsx`, `src/lib/catalog-response.ts`, `src/components/collection-guide.tsx`, `scripts/seo/check-fragments.mjs`, `scripts/verify-launch.mjs`, package scripts and the two affected browser test files. No catalog facts or dependencies changed.

## SEO, GEO and AEO review

The fresh live sample still returns 200 for home, robots and sitemap, with the earlier deployed revision; `/about/` is still 404 because that new section is unpublished. Evidence: `reports/seo/website-audit-live-refresh.json`. The preceding complete live-sitemap check is retained rather than unnecessarily repeating every remote request.

Local structured data, self-canonicals, pagination, quote tables and publication controls continue to use the evidence-based implementation described in [the SEO-pro audit](SEO_PRO_AUDIT_2026-10-25.md). A source review confirmed that missing commercial approval remains intentional, availability does not imply verified delivery, and factual answer paragraphs distinguish vendor capabilities from seller packages. No invented reviews, affiliations, addresses, source-review dates or ranking claims were added. Campaign-copy handling now avoids unnecessary internal tracking parameters as well as unnecessary downloading.

Checked all 42 distinct external references in the collection and buying-guide source files: 33 returned HTTP 200, eight returned HTTP 403 and one connection failed. No 404 or 410 was observed. The nine unverified fetches remain explicit limitations, not confirmed broken links; protected vendor sources were not replaced with guessed URLs. Evidence: `reports/seo/editorial-links.json`. HTTP availability alone does not revalidate every statement in a vendor document, so source-review dates were not artificially refreshed.

Google's [AI-search guidance](https://developers.google.com/search/docs/appearance/ai-features) was reopened: readable useful content, ordinary crawl/index controls and consistent visible/schema facts remain the relevant foundations. The 25 collection guides, 13 category checklists, ten buying guides, original price/variant data and clear enquiry paths are retained. No special AI schema, mandatory AI file, mass-generated filler or guaranteed citation claim is introduced. Actual GSC indexing, AI citations, backlinks and field CWV remain unknown without their corresponding account/measurement evidence.

## Final verification

Completed across 25–27 October Pakistan time. The final production export compiled/typechecked and completed postbuild validation (`reports/seo/local-technical-audit.json`, original final-build timestamp 25 October UTC; later refreshed by the audit). The first intermediate postbuild scan was superseded while the language correction was added and is not counted as the final check.

- Changed-file ESLint passed; 35/35 unit tests passed, preserving price/identity/warranty/approval invariants.
- **52/52 browser tests passed**, zero failed, skipped or flaky, on the final export. Evidence: `reports/seo/website-audit-browser-results.json`, 26 October UTC / 27 October Pakistan time. This includes all five new campaign/failure/retry/timeout cases and the existing responsive, accessibility, no-JavaScript, schema, canonical, pagination and WhatsApp flows.
- Export: 977 normal/error HTML documents, 815 product routes, 974 canonical pages, 159 indexable sitemap URLs and 3,071 JSON-LD blocks. **64,325 internal references, zero broken targets**, no duplicate indexable metadata and no detected confidential fields.
- Fragment checker: 978 HTML files including verification, **1,027 section links, zero missing targets or duplicate IDs**. Integrated into the launch gate.
- Repository/privacy scan and `git diff --check` passed. No new dependency was installed. The previous full dependency audit reported zero vulnerabilities.
- Existing same-day mobile Lighthouse samples remain separately identified as pre-resilience-change evidence: performance 97/97/100, no layout shifts, home/collection LCP approximately 2.54/2.53 seconds. These are not fresh post-change speed results or field CWV. This patch avoids campaign-triggered downloads; it does not claim a new measured speed score.

The 27 October indexing escalation is tracked separately in [the reason-specific recovery plan](INDEXING_RECOVERY_2026-10-27.md). Supplied counts are 384 noindex, six canonical alternatives and 37 crawled-but-not-indexed; URL examples and selected property are still needed to attribute the exclusions.

Date-sensitive catalog review now flags 810 retained price snapshots (808 active offers plus two excluded duplicates) dated 19 October as requiring reconfirmation under the existing seven-day rule. Prices and checked dates were not changed without owner evidence. The storefront already exposes snapshot dates and asks buyers to confirm prices; this finding does not establish why Google excluded a page.

## Remaining dependencies

- The broad SEO/premium changes are still local. The owner's earlier master brief requires separate explicit deployment authorization; this audit does not assert a live release.
- Original commercial/editorial verification, unknown package facts and unresolved official logo provenance still need real evidence. The existing safe display/indexing behavior remains in place.
- No newly configured external accounts, tracking collectors, campaigns, index submissions, DNS changes or outbound messages are part of this work.

## Completion checklist

- [x] Source and production baseline compared.
- [x] Failure-state behavior reproduced and findings recorded.
- [x] Confirmed application defects fixed.
- [x] Export fragments, IDs, metadata and index controls checked.
- [x] GEO/AEO content and source consistency checked within stated source/access limits.
- [x] Affected browser tests, production build and export/repository checks passed.
- [x] Remaining business/account/deployment dependencies documented.
- [ ] Map Search Console examples to exact intended pages and confirm Google's reason for priority-page exclusion.
- [ ] Authorize and verify the prepared release on production.
