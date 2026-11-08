# AiToolsPk blog and product library — 30 October 2026

## Scope and plan

The owner requested a blog containing product information for SEO/GEO/AEO. SEO-pro's content, programmatic and GEO workflows informed this implementation. The design separates useful workflow articles from existing buying and plan-comparison pages to avoid duplicating those pages merely to add indexable URLs.

1. Review the catalog, existing guides and official vendor documentation.
2. Build a responsive blog hub and a complete searchable product-family library.
3. Publish eight original, task-specific articles with direct answers, visible FAQs, illustrative examples and linked sources.
4. Connect navigation, relevant collections, exact catalog details, canonical metadata, structured data and sitemap.
5. Run release and browser checks, inspect responsive layouts, then publish only the tested commit under the owner's existing release authorization.

## Coverage

- `/blog/` plus four paginated library pages cover all 108 active collections and their 815 active plan variants through existing detail/comparison routes. Excluded offers are omitted; API offers remain grouped last.
- Eight original articles cover ChatGPT, Gemini, Claude, Canva, Figma, Notion, ElevenLabs and Cursor. Other collections have library entries and their existing plan pages, not newly invented long-form articles.
- The original 38 collection guides and ten buying guides remain in place. Existing URL paths, prices, stock, approval decisions and warranties are preserved.
- Prices, warranty text, IDs and plan destinations are derived from the public catalog. Article samples are explicitly labeled; every article links to its complete collection.

## Search and editorial decisions

Each article has a self-canonical URL, unique metadata, BlogPosting and breadcrumb data, real organization authorship, visible review dates and official references. The hub exposes Blog/CollectionPage information and server-rendered native directory pagination. Visible questions answer the article's actual topic; no FAQ rich-result eligibility or ranking benefit is promised.

The workflows are editorial examples, not claimed customer case studies, benchmarks or hands-on performance tests. Vendor functionality is kept separate from seller-package entitlements. No new credentials, supplier data, fabricated reviews, contact details or affiliation claims are published. Pending commercial offers retain their existing indexing restrictions.

The optional `llms.txt` links provide navigation only. Google states that normal SEO practices also apply to its AI search features; no special AI markup is required. Creating many substantially similar pages for ranking manipulation is not the objective. Sources: [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features) and [Google scaled-content policy](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content).

## Maintenance and verification

Edit `data/blog/posts.json`, review the cited documentation, and use actual review dates. Keep article intent distinct from existing buying guides. New collection entries appear automatically when eligible catalog products are imported. Rebuild before deployment so sitemap, export and discovery links agree.

Required checks: `npm run launch:check` and `npm run test:browser`. Browser coverage includes all library pages without JavaScript, search/reset, pagination, mobile menu, exact sample-plan data, schema/canonical/sitemap agreement, accessibility and 375/768/1280/1440px layouts. Generated logs, screenshots and final publication evidence belong in ignored `reports/seo/` and must not be represented as Search Console indexing or traffic results.

This document describes implementation and verification requirements. Actual test and deployment status is recorded separately after execution; it does not claim that Google has crawled or indexed the new pages.
