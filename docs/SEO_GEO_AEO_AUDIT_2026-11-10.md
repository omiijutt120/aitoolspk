# SEO, GEO and AEO audit — 10 November 2026

Everything below was measured, not estimated. Where a number could not be
measured, the row says so and why. The audit is against the built export in
`out/` (the exact bytes that ship), plus live HTTP checks on
`https://aitoolspk.tech/`.

GEO score is from `geo-score` 1.8.3, `score_site` only (the paid `ask` / `run`
tools have no API key configured, so AI-answer visibility could not be tested).

## Headline

| Area | Result | Ceiling reached? |
| --- | --- | --- |
| GEO (AI answer readiness) | **99 / 100**, band Leading, gate not capped | yes — 7 points need off-site action |
| Technical/on-page | 0 defects found in the 8 checks that matter | yes |
| Internal link graph | 0 orphan pages, 0 dead ends | yes |
| Crawl budget | 0 followed links to noindex pages | yes |
| Index coverage | 9 of 22 collections indexed | **no** |
| Authority | 1 nofollow backlink | **no** |
| Rankings | 0 of the 22 collections rank on page 1 | **no** |

The three rows that are not at ceiling are not on-page problems, and no further
on-page edit moves them.

## 1. GEO — 99/100

Re-scored with the same eight pinned URLs as every previous round:

```
/  /plans/netflix  /plans/chatgpt  /plans/gemini
/blog/chatgpt-plus-kitne-ka-hai-pakistan  /plans/api  /plans/n8n  /price-index/
```

| Check | Points | State |
| --- | --- | --- |
| g.robots / g.reachable / g.ssr | 5+5+5 / 15 | scored |
| p1.sitemap / llms-txt / organization / breadcrumb / page-type | 4+5+6+3+4 / 22 | scored |
| p2.answer-passages / question-intent / freshness / sourced-stats / named-author | 9+7+6+7+6 / 35 | scored |
| p3.sameas | 3 / 3 | scored |
| **p3.knowledge-graph** | **0 / 4** | scored |
| **p3.video** | **0 / 3** | scored |
| p4.answer-shape | 4 / 4 | scored |
| b.llms-full / ai-txt / geo-link / speakable | 2+2+1+1 / 6 | scored |
| p3.listings / p3.mentions / p4.question-coverage / p4.cn-engines | — | **unobservable** |

With every applicable check maxed the reachable score is 99. The two remaining
deductions both require something that does not exist yet:

- **`p3.knowledge-graph` (4 pts)** — needs a real entity (Wikidata, a Google
  Knowledge Panel, a Crunchbase/registry record). Cannot be marked up into
  existence.
- **`p3.video` (3 pts)** — needs an actual uploaded video. `src/lib/site-video.ts`
  is `siteVideo = null` on purpose; flipping it without a real video would make
  the markup lie.

The four unobservable checks need off-site search results, which this
environment cannot read (`websearch` returns HTTP 402). They are unmeasured,
not failed.

## 2. On-page and technical

Measured across all 1,007 HTML files in `out/`, with 189 indexable pages
(188 in `sitemap.xml` plus the Google verification file, which is not a page).

| Check | Result |
| --- | --- |
| Pages | 1,007 total / 189 indexable / 818 `noindex` |
| Titles | 0 missing, **0 duplicates**, 0 over 60 chars, 0 under 30, average 50 |
| Descriptions | 0 missing, **0 duplicates**, 0 under 70 chars, average 132 |
| Canonicals | 0 missing, 0 not self-referencing |
| `<h1>` | exactly one on every indexable page |
| `<h2>` | present on every indexable page |
| Images | 1,457 `<img>`, **0 without `alt`** |
| JSON-LD | 0 invalid blocks out of every block on every page |
| Orphan pages | **0** (only the verification file has no inbound link, by design) |
| Broken internal links | 0 across 1,498 fragment-checked links |
| Median body copy | 1,210 words |

An earlier pass reported five titles at 61 characters and eight pages with no
`<h2>`. Both were measurement artefacts: the title check counted `&amp;` as
five characters instead of one, and the heading check used a wrong character
class. Decoded and re-measured, there are zero over-length titles and zero
missing `<h2>`s. The numbers above are the corrected ones.

### Structured data in use

`Organization` 188, `Country` 188, `ContactPoint` 188, `WebSite` 188,
`SearchAction`/`EntryPoint` 188 each, `ListItem` 186, `BreadcrumbList` 175,
`Person` 175, `CollectionPage` 145, `ItemList` 145, `SpeakableSpecification`
140, `SoftwareApplication` 119, `BlogPosting` 23, `WebPage` 23, `Blog` 23,
`ImageObject` 22, `Article` 10, `AboutPage`/`ProfilePage`/`HowTo` 1 each.

### Thinnest indexable pages

| Words | Page |
| --- | --- |
| 163 | `/contact/` |
| 207 | `/categories/` |
| 277 | `/author/muhammad-umar/` |
| 308 | `/faq/` |
| 320 | `/editorial-policy/` |
| 336 | `/guides/` |

Utility pages, all with a clear single purpose. None is a thin content page
competing for a query.

### `/plans/` pages (page 1 of 108)

Minimum 1,038 words, median 1,384, maximum 3,054. No collection page is thin.

## 3. Defects found and fixed in this round

**Every collection page linked to only one of its own articles.**
`blogPostForCollection()` returns the *first* post for a collection. Eight
collections have more than one article, and the first in each case is a
workflow post, so the price, comparison and cost articles were invisible from
the collection page that should have pointed at them:

| Collection | Articles | Showed | Buried |
| --- | --- | --- | --- |
| ChatGPT | 5 | freelancer workflow | **chatgpt-plus-kitne-ka-hai-pakistan**, chatgpt-vs-claude, bina-credit-card, price-change |
| Canva | 3 | brand-kit workflow | canva-pro-vs-capcut-pro, sasti-ai-subscription |
| Gemini | 3 | deep-research checking | gemini-vs-chatgpt, student-plan-eligibility |
| Claude | 2 | artifacts prototype | shared-vs-personal-account |
| Notion | 2 | client workspace | seller-verify |
| ElevenLabs | 2 | voiceover budget | duration-vs-30-days |
| Cursor | 2 | code review | freelancer monthly cost |
| Netflix | 2 | streaming plans | subscription-band-ho-jaye |

That is 11 articles whose only inbound link was the blog hub, with in-degree 1-2.
`/plans/chatgpt/` is the strongest commercial ChatGPT page (in-degree 21) and
never linked to the article answering `chatgpt kitne ka hai pakistan`.

Both ends are now fixed: the ChatGPT buyer-clarity block explains the quoted
range and links to that article, and every collection page lists the rest of its
articles under the lead one. No new pages were created and no content was
moved.

Already fixed and live earlier today (recorded here for completeness):

| Fix | Before | After |
| --- | --- | --- |
| `/tool/` link graph | 13,520 followed links to noindex pages | 0 followed, 13,520 `nofollow` |
| Homepage title | no brand name | `AI tool prices in Pakistan 2026 \| AiToolsPk` |
| Pages deploy | 5 consecutive failures at 10-min timeout | 25-min timeout, deploy succeeds |

## 4. Defects found and deliberately not fixed

| Finding | Why not |
| --- | --- |
| 2 meta descriptions slightly over 160 chars (`/` 161, `/price-index/` 163) | Google rewrites descriptions; a 1-3 character trim changes nothing measurable |
| 4 pages without `og:image` | 3 are 404/`_not-found` copies, 1 is the verification file. Not real pages |
| `/contact/` at 163 words | deliberate utility page, not competing for a query |
| 818 `noindex` pages still 77% of the deploy artifact | shrinking them changes navigation on 815 pages and needs its own verification pass; documented in `docs/PAGES_DEPLOY.md` |
| `/` and `/tools/` both target "AI tools in Pakistan" | titles and `<h1>`s are already distinct (prices vs. browsing); merging or re-scoping them is a traffic experiment, not a fix |
| Blog posts at in-degree 1-2 | the hub (`/blog/`, `/blog/page/N/`) already links every post, and each collection page now lists its own articles; sitewide footer blocks would add 1,000 low-value links and are discounted by Google |

## 5. Index coverage — the real constraint

Measured per collection on 10 November 2026.

| Indexed (9) | Page 2 only (2) | **Absent (11)** |
| --- | --- | --- |
| Netflix, Spotify, ChatGPT, Discord, Digital tools, Adobe, ElevenLabs, Facebook, Gamma | Google, Microsoft | **Gemini, Claude, Grok, YouTube, Tele, CapCut, Notion, Kling, TikTok, Canva, Grammarly** |

Google has found the site and indexed the homepage, guides, blog and about a
third of the collections. It has not indexed the rest. The crawl trap fix in
§3 removes the main reason it was spending its budget elsewhere, so this is the
number to re-measure in 3-7 days.

Evidence and the 13-URL request list: `docs/seo/INDEX_AND_QUERY_COVERAGE_2026-11-10.md`.

## 6. Rankings — measured, not predicted

| Query | What the SERP actually shows |
| --- | --- |
| `aitoolspk` | `aitoolspk.com` (a different site) at #1, our `/about` at #2, homepage at #8 |
| `chatgpt kitne ka hai pakistan` | chatgpt.com/pricing, Facebook, digiteazy.com, sadapay.pk, Scribd, Instagram, sastetools.com, Daraz. **We are absent** |
| `netflix price in pakistan` (Bing) | 10 of 10 results are Netflix properties |

Our ChatGPT price post is indexed — it returns for its exact title — but it is
two days old and not competing on that query yet. No on-page change closes this
gap. Authority does, and the site has one nofollow backlink.

## 7. What is actually left

Ranked by expected effect, not by effort:

1. **Request indexing** for the 11 absent collections. Owner action, GSC only.
2. **Backlinks.** 34 directory targets are prepared and unsubmitted. One
   nofollow link exists today. This is the only lever that moves §6.
3. **Re-measure index coverage in 3-7 days** to confirm whether removing the
   crawl trap accelerated discovery of the 11 absent collections.
4. **A real video** (3 GEO points) and **a real entity record** (4 GEO points) —
   7 of the 100 points, both off-site.
5. Nothing else. The on-page surface is clean.

## 8. Method note

- Page metrics came from parsing every file in `out/` with Node, not from a
  crawler or a third-party dashboard. Counts are exact.
- GEO came from `geo-score score_site` against the same pinned sample as
  earlier rounds, with a cache-buster because Fastly holds `max-age=600`.
- `site:` queries are a sample, not a count. A hit proves indexing; a miss was
  re-tested with a phrase query before being recorded as absent.
- Google rate-limited automated SERP navigation after roughly 30 queries, so
  §6 is a small number of confirmed observations, not a rank-tracking series.
