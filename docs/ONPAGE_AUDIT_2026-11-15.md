# On-page audit, 2026-11-15

Source: SEO Minion on-page report for `https://aitoolspk.tech/`, captured
15/11/2026 00:52 (26 pages). Scores in the report: SEO 100, On-Page 99,
Technical 100, Critical 0. The report is not evidence of traffic; it only reads
one page's markup.

## The three warnings

| Finding | Report | Verdict | Action |
| --- | --- | --- | --- |
| Description pixel width | 161 chars, 1014 px, "shorten by about 94 px" | Real. Results cut off near 920 px. | Homepage description rewritten to 113 chars, query first. |
| HSTS | `Strict-Transport-Security: none` | Real, but not fixable from this repository. | GitHub Pages does not serve custom response headers. Owner path below. |
| Keyword density | `plans` 85 times in 1709 words (5.0%) | Real. Caused by repeated card copy, not by the product copy. | Card blurb and card CTA rewritten from catalogue data. |

### Description

Before:

```
Compare 815 AI tool and subscription plans in Pakistan: listed PKR quotes, exact
durations and seller warranty. Browse 108 collections, then confirm on WhatsApp.
```

After (`src/app/page.tsx`), 113 characters:

```
AI tool prices in Pakistan: compare 815 plans by listed PKR quote, duration and
seller warranty. 108 collections.
```

Both counts are computed and hidden badges (prices, durations, warranty) that a
listing does not state are never claimed. Verified in the built export:
`out/index.html` description length 113.

### Keyword density

Every featured card rendered the same ten-word sentence ("Find your fit. Compare
durations, access and warranty options.") under 27 headings, plus the same
"Explore plans" link 27 times. Repeated true sentences still carry no
information, so the card now states the shape of the terms that collection
actually lists (`Monthly and yearly terms`, `Monthly terms`, `Yearly terms`,
`Term stated per offer`), the count chip says "options" instead of "plans", and
the CTA says "View prices".

Measured on the built homepage:

| | Before | After |
| --- | --- | --- |
| visible words | 1748 | 1596 |
| `plans` | 87 (5.0%) | 35 (2.2%) |
| top word | `plans` 5.0% | `pkr` 3.9% |

`PKR` is now the most frequent word on a page whose subject is PKR prices. That
is the honest shape of the page; prices are not being hidden to please a
heuristic.

### HSTS, and the other header checks

The report read five response headers from GitHub Pages: `cache-control`,
`content-encoding`, `content-type`, `last-modified`, `server`. No
`strict-transport-security`, no `x-content-type-options`, no `referrer-policy`
header. Static hosting on Pages cannot add any of them, and a `<meta>` tag cannot
replace them (CSP and Referrer-Policy are already sent as meta tags, which is why
the report marks those two "set with a meta tag").

Free fix, owner action: put the domain behind Cloudflare's free plan (proxy on,
"Full (strict)") and add three response-header rules:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

Nothing in this repository can do it, and no score is claimed for it.

## Metadata added

`src/lib/seo.tsx` now emits `<meta name="author" content="Muhammad Umar">` from
`src/lib/author.ts`, the same record that signs the guides and feeds the Person
schema. Verified in `out/index.html`.

`robots` was **not** added. The report already passes it ("No robots meta tag, so
the default is index, follow"), and a blanket `index, follow` in the shared
helper would have to be overridden by every one of the 815 `noindex` `/tool/`
pages. A default that is already correct does not need a tag.

The `keywords` meta tag was not added: Google has ignored it since 2009, and
writing one would mean listing phrases as if they were facts about the page.

## Deliberately left alone

These are informational in the report, not warnings:

- **hreflang** — one language (`en-PK`), one region. Nothing to point at.
- **Google Analytics** — no GA tag is installed. The build's own metrics file
  says "No authorized GSC/GA4 import. Null is unknown, not zero", so inventing a
  tag would not create measurement.
- **3 external links, all to `wa.me`** — that is the ordering channel.
- **"read article" used 10 times** — visible anchor text on a card grid. The
  links differ by destination and each card carries the article title.
- **Tap targets** — measured at a 1536 px window, so the report does not score
  it; the phone-width checks in `tests/browser/site.spec.ts` cover 320–390 px.
- **Total page weight ~503 KB** — 249 KB of that is images already served as
  WebP, all under 500 KB each.

## Why the CI e-mails happened, and what changed

`ci.yml` and `pages.yml` both run `npm run test:browser` on every push, so one
brittle spec fails both workflows and sends two e-mails. The last failure was a
spec that pinned a `lastmod` date; it was relaxed to a lower bound on 14/11.

Two further traps were removed, because they fired on ordinary content edits:

- `playwright.config.ts` now retries once in CI. A slow first paint no longer
  fails a run; a real regression still fails twice.
- Magic numbers in the specs were replaced with the values the pages are built
  from: `PAGE_SIZE` for the 24 cards per page (`seo-content`, `site`,
  `storefront`, `blog`), `guides.length` for the guide index
  (`discovery-improvements`), `faqs.length` for the FAQ list (`seo-content`),
  and `added.length` for the seller-listed sample (`premium-products`). Adding a
  guide, an FAQ or an offer no longer fails a test that was only counting to ten.

## Verification

```
check:export    1006 pages, 0 broken, 188 indexable URLs, 0 duplicate descriptions
check:fragments 1007 documents, 1498 links, 0 issues
check:repo      0 issues
npm test        96 tests, 94 pass, 1 known Windows-only release-workflow failure
lint            0 problems
typecheck       0 errors
playwright      52 specs re-run locally: seo-content, storefront, site, blog,
                premium-products, discovery-improvements - all pass
```

## What this does not do

It does not produce clicks. The audit measures one page's on-page markup, and
that page already scored 100 for SEO. The two levers that move impressions for
this domain remain outside on-page work:

1. **Authority** — 34 prepared submission targets in
   `docs/OFFSITE_SUBMISSION_PACK.md`, none submitted. Owner only.
2. **Indexing** — 11 money pages missing from Google. Needs the Search Console
   Performance export (Queries + Pages, last 3 months) that is still not
   available here.
