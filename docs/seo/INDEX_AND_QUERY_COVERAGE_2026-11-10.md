# Index and query coverage — measured 10 November 2026

Two questions came in together: why Search Console shows code-like queries
(`ai54051`, `ai10750`, …) instead of product terms, and why `netflix plan` is the
only query with impressions when 108 collections are published.

Both have answers that can be measured rather than guessed. This file records the
measurement, the method, and its limits.

---

## 1. The `ai#####` queries do not come from this site

Searched every file the site produces or reads — `out/`, `data/`, `src/`,
`public/`, `scripts/`, **7,959 files** — for `ai` followed by five digits:

```
files scanned: 7959   files with ai##### : 0
```

The strings also appear in none of this repository's 57 commits (`git log -S`).
`data/catalog.json` carries no supplier code field at all; its keys are `id`,
`slug`, `name`, `brand`, `category`, `price`, `duration`, `warranty`, `access`,
`credits`, `stock`, `approval`, `description`, `date`.

So those tokens are not titles, slugs, alt text, schema values or catalogue data.
They are **what someone typed into Google**, and Google chose to show this
domain for a fraction of them (1–2 impressions each). Two facts explain why that
is possible, and neither is a fault on the site:

- The attached master brief records that `aitoolspk.tech` previously hosted a
  separate site (**AI Tools Pak**) before this repository's first commit on
  19 Oct 2026. A domain's history stays attached to it after a rebuild.
- For obscure queries Google has almost nothing to return, and it will show a
  loosely related page rather than an empty page. A 1,000-page price catalogue is
  a plausible candidate for that fallback.

Neither point is something to optimise for: a query with no intent cannot become
a click. The important reading of that screenshot is not the strings — it is the
scale: **62 queries and 0 clicks over 24 hours is roughly ten impressions a day.**

## 2. What Google actually has — measured, not assumed

Method, 10 November 2026, signed-out Google web results, `site:` prefix queries
against the exact collection path, run in a real browser:

- **Positive result** = proof the page is in the index (a page cannot be returned
  by a `site:` query unless it is).
- **Negative result** = strong evidence but not proof. Google samples `site:`
  output and can omit a page it holds. Negatives were re-tested with a
  prefix + exact-phrase query for the page's own H1; all three stayed empty.
- `site:` is **not** a page count. Google says so itself, and this run returned
  ~56 URLs across six pages before running dry.

Probed: the 22 collections that carry the most listings.

| Collection | Listings | In Google's index | Title Google shows |
|---|---:|---|---|
| ChatGPT | 52 | **yes** (pages 1–3) | old title — `ChatGPT Plans in Pakistan` |
| Gemini | 47 | **no** | — |
| Claude | 40 | **no** | — |
| Google | 31 | page 2 only | `…compare 31 options — Page 2` |
| Microsoft | 27 | page 2 only | `…compare 27 options — Page 2` |
| Grok | 27 | **no** | — |
| Discord | 26 | **yes** | old title |
| YouTube | 20 | **no** | — |
| Tele | 20 | **no** | — |
| Digital tools | 18 | **yes** | old title |
| Adobe | 17 | **yes** | old title |
| ElevenLabs | 16 | **yes** | new title — `ElevenLabs price in Pakistan 2026: 16 plans` |
| CapCut | 16 | **no** | — |
| Notion | 16 | **no** | — |
| Kling | 16 | **no** | — |
| Facebook | 15 | **yes** | old title |
| TikTok | 14 | **no** | — |
| Gamma | 14 | **yes** | old title |
| Canva | 13 | **no** | — |
| Netflix | 5 | **yes** | new title — `5 plans \| AiToolsPk - Netflix price in Pakistan 2026` |
| Spotify | 4 | **yes** | old title |
| Grammarly | 2 | **no** | — |

**9 of 22 fully indexed, 2 more present only as their second page, 11 absent.**

The absent ones are not the weak ones. Gemini (47 listings), Claude (40), Canva
(13), YouTube (20), CapCut (16) and TikTok (14) are the commercial core of the
site, and Google has none of them. Meanwhile `gamma` (14), `digital-tools` (18)
and `netflix` (5) are in. There is no pattern in the picks that maps to quality,
price or link count — Canva has five internal links from blog posts, Netflix
three.

### Two findings that follow directly

1. **"Only Netflix" is an index artefact, not a content verdict.** Netflix is
   indexed *and* has real Pakistani demand for `netflix plan`, so it is the only
   page in the sample that could produce an impression. Canva, Gemini, Claude and
   YouTube cannot produce one yet, because they are not in the index to be shown.
2. **Google is showing cached titles from before 9 November.** ChatGPT, Discord,
   Adobe, Gamma, Facebook and Spotify all appear under the older
   `X Plans in Pakistan` title, while ElevenLabs and Netflix carry the current
   `X price in Pakistan 2026: N plans` title. Those pages have not been recrawled
   since the retitle, so the better-targeted title is not yet the one competing.

## 3. What the site's own state says

Re-verified against the built export on the same day:

| Property | Result |
|---|---|
| URLs in `sitemap.xml` | 188 (188 unique) |
| Canonical on every sitemap URL | self-referencing, 188/188 |
| `noindex` inside the sitemap | 0 |
| Meta description length | all 188 inside 70–180 characters |
| Internal links into each sitemap URL | none below 2 (0 orphans) |
| Homepage → `/plans/` links | 27 |
| `/price-index/` → `/plans/` links | 108 |
| `/blog/` → `/plans/` links | 24 |

Nothing is broken, orphaned, canonicalised away or hidden. Which is why no
on-site change was made for this: the missing pages are missing because Google
has not fetched them, not because the site hides them.

## 4. Bing, same day

`site:aitoolspk.tech` on Bing returned unrelated third-party results — the
fallback Bing serves when its index holds nothing for the prefix. So Bing still
has **0 pages** two days after `BingSiteAuth.xml` was published: the file is
there, the property is not verified. Bing feeds Copilot and several answer
surfaces, so this is an AEO gap as much as a traffic one, and it closes only with
the owner's click on Verify in Bing Webmaster Tools.

## 5. The only action that moves this — owner, in Search Console

URL Inspection → Request Indexing, these twelve, biggest first. Two minutes each
in the same session; Google will re-crawl and refresh the title at the same time.

1. `https://aitoolspk.tech/plans/gemini/`
2. `https://aitoolspk.tech/plans/claude/`
3. `https://aitoolspk.tech/plans/grok/`
4. `https://aitoolspk.tech/plans/youtube/`
5. `https://aitoolspk.tech/plans/capcut/`
6. `https://aitoolspk.tech/plans/notion/`
7. `https://aitoolspk.tech/plans/kling/`
8. `https://aitoolspk.tech/plans/tiktok/`
9. `https://aitoolspk.tech/plans/canva/`
10. `https://aitoolspk.tech/plans/tele/`
11. `https://aitoolspk.tech/plans/grammarly/`
12. `https://aitoolspk.tech/plans/google/` and `https://aitoolspk.tech/plans/microsoft/`
    (page 1 not returned; page 2 is)

Then export the **Pages** report, not the Queries report. Queries alone cannot
say which URL earned an impression; Pages can, and that is the file that would
let the next round tune real pages instead of guessing.

## 6. What was deliberately not done

- No new thin pages to "cover" the code queries — they have no demand.
- No `noindex` removal on `/tool/` while 817 quotes are stale.
- No invented search volume, difficulty or rank. `site:` presence is the only
  index fact stated here, and its limits are stated with it.
- No sitemap or `lastmod` change to chase a recrawl. The sitemap already lists the
  pages; asking Google to fetch them is the owner's click, not a markup trick.
- **No change to the pagination policy — recorded as a decision, not applied.**
  Google returns `/plans/microsoft/page/2/` and `/plans/google/page/2/` while
  their page 1 does not come back, and four `blog/page/N/` URLs plus
  `ChatGPT … Page 3` are in the index. `noindex, follow` on those paginated
  archives is the standard treatment and may let page 1 take the slot, but it
  removes ~9 URLs from the index and changes what the site publishes, so it needs
  the owner's decision rather than a unilateral edit.
