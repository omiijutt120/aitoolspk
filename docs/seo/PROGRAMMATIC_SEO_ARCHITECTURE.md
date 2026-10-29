# Catalog-wide SEO architecture

The engine is build-time Node code over the **sanitized public catalog**, with a server-side publication gate shared by metadata, sitemap and Product/Offer markup. It does not read supplier CSVs, evidence files, account configuration or credentials. Existing import code alone manages private commercial review and emits sanitized facts.

```text
private commercial review -> existing sanitized importer -> data/catalog.json
                                                       + data/seo/editorial.json
                                                       + optional ignored research/GSC inputs
                                                       -> scripts/seo/engine.mjs
                                                       -> ignored reports/seo/*
sanitized facts + editorial review -> shared publicationDecision
                                  -> metadata + sitemap + schema + export gates
```

`src/lib/catalog-identity.mjs` owns the existing primary-collection rule. UI aggregation and intelligence use the same rule: API offers belong to `/plans/api/` once, irrespective of provider. All other offers map to their brand collection. Every offer, including an excluded offer, receives one intelligence record; exclusion only suppresses its public route according to existing catalog rules.

## Intent and URL decisions

- `/plans/<brand>/` owns shared brand/plan comparison intent. `/plans/api/` owns the API inventory, with precise provider/access/credit distinctions. Do not create an indexable URL for every possible filter, city or phrasing.
- `/tool/<existing-slug>/` retains stable identity and a self canonical. Pending or weak offers remain noindex; they still support navigation, comparison and enquiries. No blanket canonical-to-parent rewrite or URL renaming.
- Individual indexable offers require commercial approval **and** specific reviewed terms, resolved claim risk, a matching public-content fingerprint, valid review date, useful content and distinct search intent. Good checklist scores cannot compensate for missing approval.
- Parent pagination remains native static HTML, self canonical with page-specific titles/descriptions. Initial screens show bounded inventories; all remaining offers are reachable without JavaScript.
- Existing twelve priority collection guides and two sourced buying guides provide buyer decisions and brand-level context. That context is not proof of reseller entitlements. Extend existing guides when intent overlaps; a new comparison/use-case page requires genuine evidence and unique utility.

## Publication states

| State                   | Meaning                                                                     | Robots / sitemap / schema                                                                                     |
| ----------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `APPROVED_INDEXABLE`    | Commercially approved and current specific, useful, distinct content review | Index/follow; sitemap; Product where truthful. Offer additionally requires current quote and buy eligibility. |
| `INFORMATIONAL_NOINDEX` | Otherwise reviewed offer explicitly held editorially                        | Noindex/follow; omitted from sitemap; no purchase schema.                                                     |
| `NEEDS_REVIEW`          | Missing commercial approval, terms, current review or differentiation       | Noindex/follow; omitted; no Product/Offer.                                                                    |
| `EXCLUDED`              | Existing commercial exclusion                                               | No public offer route or promotion; retained intelligence record.                                             |

Stock and quote freshness independently govern purchase intent. A reviewed out-of-stock page need not disappear from search automatically; it cannot emit an in-stock Offer. Merchant Center eligibility is separate, not implied by WhatsApp or Schema.org syntax. Do not use ProductGroup for duration/warranty: those are not documented supported Google variation dimensions.

## Content and quality

Per-offer specifications contain listed duration/access/warranty/credits, explicit verified-entitlement status, H2 topics, buyer questions, parent comparisons, entities, source IDs and relevant guide links. Draft questions are not automatically published as answers. Unknown features stay unknown. Public detail pages now link directly to selection and credit/duration guides.

Normalized description equality and same-parent five-word shingle overlap identify review candidates. The 0.85 threshold is an internal heuristic, not Google's duplication rule. Checklist scores expose their criteria and unknown measurements. Shared primary phrases targeting one parent are deliberate consolidation; actual cannibalization needs query/page performance evidence. Repeated global navigation and policy disclosures are not spun into fake uniqueness.

## Automation and data boundaries

`npm run build` imports/validates, prepares intelligence, exports supported Next static routes, repairs RSC asset paths, then cross-validates final HTML against publication decisions. `launch:check` additionally tests exact prices/IDs, private-field protection, links, schema and repository history. CI uses committed sanitized data; reviewed premium terms/exclusions survive a clean checkout, and changed approved authored facts require explicit local review.

Reports, raw observations, metrics and approval evidence stay ignored and absent from `out/`. Only `data/seo/editorial.json` contains safe public review flags/fingerprints. No database service, scheduled paid request, runtime external API, frontend intelligence bundle or secret is introduced. See [automation guide](SEO_AUTOMATION_GUIDE.md) for commands and the review process.
