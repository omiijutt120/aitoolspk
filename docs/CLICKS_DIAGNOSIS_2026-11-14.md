# Why there are impressions and no clicks — research and plan

14 November 2026. Written after the owner reported "impressions but zero
clicks". Everything below is either measured today or explicitly marked as
unmeasured.

## 1. What I could not measure, and why it matters

GSC is **still not authenticated**. `tools.gsc.get_capabilities()` returns
"❌ Not authenticated", and none of the credential paths exist on this machine
(`service_account_credentials.json`, `client_secrets.json`, no `GSC_*` env
vars). So I cannot read your actual queries, pages, positions or CTR.

That is the single most important missing input. "Zero clicks" has four
possible causes and they need different fixes:

| Cause | What it looks like in GSC | Fix |
| --- | --- | --- |
| Not indexed | URL absent from the Pages report | request indexing / internal links |
| Indexed, ranking 20–100 | impressions low, average position 20+ | authority, content depth |
| Ranking 5–15, bad snippet | impressions decent, CTR under 1% | title/description/snippet |
| Brand-only impressions | queries are all "aitoolspk" | demand problem, not SEO |

Guessing between these is how sites get "optimised" for months with no change.
**Export GSC → Performance → Queries and Pages (last 3 months, CSV) and I can
answer it in one pass.** Until then this document works from what is
observable from outside.

## 2. Is the demand real? Yes — and it is Pakistan-specific

Google autocomplete (`gl=pk`, today) returns these as actual completion
phrases, which only appear if people type them:

- chatgpt price in pakistan · chatgpt price in pkr · chatgpt price in pakistan monthly · chatgpt price plan in pakistan
- chatgpt kitne paise leta hai · chatgpt kitne ka hai
- netflix price in pakistan · netflix pakistan prices · netflix pakistan packages · netflix pakistan plans
- canva pro price in pakistan · canva pro price in pakistan per month · canva pro price in pkr · canva pro subscription pakistan price · buy canva pro pakistan · canva pro cost pakistan
- ai subscription price in pakistan · buy chatgpt plus pakistan · buy chatgpt pakistan
- claude price in pakistan · claude price per month in pakistan · gemini price in pakistan

Our page titles already match this phrasing almost exactly
("ChatGPT price in Pakistan 2026: 52 plans"), so **the titles are not the
problem**.

## 3. Is the SERP winnable? Yes — it is not held by big brands

Measured today, top 10, `gl=pk`:

**chatgpt price in pakistan**
chatgpt.com/pricing · oceancomputers.pk · Facebook answers · digiteazy.com ·
Daraz · Scribd · Instagram · substore.pk · Facebook · neurotronix.pk

**netflix price in pakistan**
netflix.com (2 pages) · Daraz · subkart.pk · Reddit r/chutyapa · Instagram · X

**canva pro price in pakistan**
canva.com/pricing · digitaltools.com.pk · Daraz · canva.com/pro · Facebook ·
techtastic.pk · sastetools.com

Apart from the vendors' own pricing pages, every ranking result is a **small
Pakistani reseller**. No news site, no marketplace giant beyond Daraz, no
strong editorial page. That is a low-authority SERP, which means a site with a
few real links can enter it. It also means our 1-backlink, five-week-old domain
cannot enter it yet — which is the honest reason for zero clicks.

I cannot measure those resellers' link profiles without a paid tool, so
"winnable" here means "the result types are beatable", not "we will beat them".

## 4. The real on-page defect: our pages do not answer the question

This is measurable and it is ours to fix.

**What the searcher asks:** *how much does it cost in Pakistan?*

**What competitors answer:** a number. digitaltools.com.pk "Rs 399", substore.pk
"Rs 2,499", techtastic.pk "Rs 299–999", sastetools "cheap Canva Pro".

**What our snippet says:**

> Typical listed Canva quote PKR 675, range PKR 14–PKR 20,928 across 13 plans.

A range that spans three orders of magnitude is not an answer. It is the
by-product of comparing a gifted education slot with a 50-seat admin licence.

**Inside the page, the same problem.** On `/plans/canva/` the first 1,100
characters of `<main>` are: breadcrumb, "13 PLANS · ONE COLLECTION", the H1, one
sentence, `Listed range: PKR 14 – PKR 20,928`, a vendor link, quote dates, then
a search/filter panel. The section that could answer the question ("How much do
Canva plans cost in Pakistan?") appears ~9,000 characters later.

`/plans/netflix/` is the exception and it is also the page with proven
impressions: it opens with *"Netflix's own signup page for Pakistan states that
plans range from Rs 250 to Rs 1,100 per month"*. That is why it is the best
page on the site. The pattern is proven on our own data.

### The underlying cause is unnormalized duration data

`data/catalog.json` has **47 distinct duration strings**. Among them:
`1 month`, `1 months / 1 year`, `30 days`, `1 year`, `1 years`, `12 months`,
`100 years`, `20 years`, `Not specified`.

So "1 year" and "12 months" are different buckets even though they are the same
duration, and the collection range mixes a 3-year plan with a 1-day trial.

Normalizing the duration into bands produces an answer that is actually useful:

| Canva band | Listings | Listed range |
| --- | --- | --- |
| 1 month | 4 | Rs 72 – Rs 675 |
| 1 year | 5 | Rs 141 – Rs 1,224 |
| 3 years | 3 | Rs 14 – Rs 3,441 |
| 12 months | 1 | Rs 20,928 |

Coverage: **92 of 109 collections have a month band or a year band** (28 have
both). So this is not a special case for Canva.

## 5. Indexing and authority, as last measured

- 10 Nov measurement: 9 of 22 money collections indexed, 2 page-2 only,
  **11 absent** (Gemini, Claude, Grok, YouTube, Tele, CapCut, Notion, Kling,
  TikTok, Canva, Grammarly). Needs re-checking — only GSC can confirm.
- Backlinks: **1**, and it is nofollow (GitHub profile).
- Bing: property verification was published but never confirmed; Bing had 0
  pages of ours indexed at last check.
- Domain age: about five weeks.

## 6. Diagnosis, in order of impact

1. **Authority.** One nofollow link cannot outrank any reseller that has been
   trading for years. Nothing on-site fixes this.
2. **Indexing.** 11 money pages are outside the index, so they cannot rank at
   all, whatever their quality.
3. **Answer quality.** Where we do rank, the snippet gives a three-order-of-
   magnitude range instead of a price, so even a viewer has little reason to
   click. This is the only one of the three that is genuinely ours to fix and
   the only one that changes CTR at constant position.

## 7. Plan

### P0 — Answer the question (on-page, this repo)

- Normalize duration into bands with a pure function, no data rewriting. Only
  `1 month` / `1 months` / `28–31 days` and `1 year` / `1 years` / `12 months`
  / `365 days` band. Everything else returns `null` rather than being guessed,
  so no listing is folded into a duration it does not state.
- Compute, per band: listing count, cheapest listed quote, middle listed quote.
- Put a "What it costs" table directly under the H1 on page 1 of every
  collection page: duration, cheapest, typical, with the listing count under
  the duration.
- Rewrite the meta description to lead with the month and year figures instead
  of the global range, keeping every description unique.
- Keep the old global range, but move it below the band table where it is
  context rather than the headline.
- Do not call a middle figure "typical" when a band spans more than one order
  of magnitude. `1 month` for Gemini holds both a Rs 419 shared slot and a
  Rs 151,234 credit pack; their median is not a price a buyer would pay.
  Where the middle quote is more than 10× the cheapest, the description quotes
  the count instead, the table header says "Median" rather than "Typical", and
  a note explains that the listings are different products. 11 of 120 band
  instances fall in that group today.
- Keep every description inside 160 characters, which is the width Google
  shows. When the two-band form is too long the second duration's qualifier is
  dropped before the figure itself, and paginated pages pay for their
  "Page N:" prefix out of the same budget. `scripts/check-export.mjs` now fails
  if a `/plans/` description grows past 160.
- `tests/duration-band.test.mjs` covers the duration whitelist and the 10×
  rule against the labels that are actually in `data/catalog.json`.

Expected effect: better snippet-to-query match and a page that answers on
arrival. **This does not create rankings and I am not promising clicks from
it.** At unchanged position it can only raise the click rate.

### P1 — Make the 11 unindexed pages reachable (this repo)

The internal-link part of this is already done and measuring it again showed
nothing to add: every collection already has 15–21 inbound links from indexable
pages (freepik 4, api 142), so more internal links would not change how
discoverable those 11 are.

- Re-ping IndexNow for all indexable URLs after deploy. Free, and it is the only
  crawl nudge available without GSC access.
- Keep the sitemap `lastmod` derived from real quote dates so a re-crawl sees a
  genuine change.

Expected effect: crawl priority. Google decides whether to index; we only make
it cheaper to find. The faster path is the owner-side Request Indexing in GSC
(P2), which is not available to an agent without authentication.

### P2 — Authority (owner-only, cannot be done by an agent)

- `docs/OFFSITE_SUBMISSION_PACK.md`: 34 targets, measured status, copy-paste
  fields. Bing Places first, then Google Business Profile, then the Pakistani
  directories.
- The one email blocker: `hello@aitoolspk.tech` bounces (no apex MX). Use
  WhatsApp until fixed, because a directory listing is usually one-time.
- The three pitches that can earn a followed link lead with `/price-index/`,
  not with the shop.

### P3 — Proof assets (owner-only)

- A real video (3 points on the GEO score, owner records and uploads).
- Knowledge panel needs a verified business listing plus real third-party
  mentions; both come from P2.

### P4 — Then measure

After P0–P2 deploy: wait 7 days, then re-probe index coverage and check whether
the new snippets changed CTR at the same positions using the GSC export.

## 8. What this plan refuses to do

- Promise clicks or rankings from on-page work.
- Invent prices, reviews, ratings, or a "from Rs X" figure that no listing
  states.
- Create new thin pages to chase autocomplete phrases we already cover.
- Mark the site up with FAQ/video schema we do not have.
- Call a three-order-of-magnitude range an answer.

## 9. The one thing that unblocks everything

**A GSC export.** Without it, P0 and P1 are sensible defaults; with it, they
become targeted — we would know which queries already produce those
impressions, at what position, and which page earned them.
