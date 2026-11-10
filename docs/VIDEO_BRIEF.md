# Video brief — the one thing standing between 97 and 100

The GEO rubric scores `p3.video` out of 3. It reaches 2 when a sampled page carries a
channel link or an embedded player, and 3 when a page also declares a `VideoObject` for
that same video. Nothing on-site can substitute for a real recording: the check reads the
HTML of the eight sampled pages, and a self-hosted `<video>` file is not one of the
players it recognises.

Measured arithmetic, from `cli/geo_score.py` v1.8.3:

| State | Points earned | Observable maximum | Bonus | Normalised |
|---|---|---|---|---|
| today | 77 | 86 | 6 | `round(100 × 83/86)` = **97** |
| with a real video | 80 | 86 | 6 | `round(100 × 86/86)` = **100** |

The knowledge-graph check is **not** on the path to 100. It stays at 0/4 and the score
still reaches 100, because the four unearned points sit inside the denominator and the
video's three points close the gap exactly. So the whole remaining task is one recording.

What is not acceptable, and will not be done:

- Marking up a `VideoObject` for a video that does not exist.
- Embedding a vendor's product video and presenting it as the site's own.
- A channel link to a channel the site does not control.

## Record this (60–75 seconds, screen recording + voice)

A single take of the real site is enough. No actor, no stock footage, no music.

**Shots**

1. `0:00–0:08` — Home page, scrolled to the category grid.
   *"Every price on this site is a seller quote in Pakistani rupees — not the vendor's list
   price."*
2. `0:08–0:20` — Open `/plans/chatgpt/`, point at the range and the quote dates.
   *"For ChatGPT alone there are fifty-two listings, from a twenty-four-hour trial to a
   two-year package. The range is real, and so is the spread."*
3. `0:20–0:34` — Click through to `/price-index/`, show a row, its date and its anchor.
   *"Each of those numbers links back to the row it came from, with the date it was
   captured. That is the whole idea: a price you can check, not a price you have to
   trust."*
4. `0:34–0:48` — Open an article, scroll to a sample card, follow the vendor link.
   *"Where the maker publishes its own price, we link to it, and we say plainly that the
   rupee figure beside it is a different thing."*
5. `0:48–0:62` — Open a listing that is still pending.
   *"Offers the seller has not confirmed stay marked and stay out of search results. Fewer
   pages, fewer guesses."*
6. `0:62–0:72` — Back to the home page.
   *"AiToolsPk. Seller quotes, dated, in rupees."*

**Rules while recording**

- Show the live site only. Do not show an admin view, a seller's contact details, or a
  WhatsApp thread.
- Read the prices that are on screen at the moment of recording. If a figure changed
  since this brief, say the new one — do not read the numbers above as a script.
- No captions that claim a partnership, a review score, or a delivery promise.

## Upload

- **Platform:** YouTube (public or unlisted-but-embeddable). The rubric recognises
  `youtube.com/embed`, `youtu.be`, Vimeo and Bilibili players; a self-hosted file does
  not count.
- **Title:** `How the AiToolsPk price index works`
- **Description:**

  > A one-minute walkthrough of how AiToolsPk records Pakistani seller quotes for AI and
  > software subscriptions: where each figure comes from, when it was captured, and how to
  > check it against the vendor's own price.
  >
  > Price index: https://aitoolspk.tech/price-index/
  > How ordering works: https://aitoolspk.tech/how-to-order/
  >
  > Prices shown are seller quotes, not vendor list prices.

- **Visibility:** public. **Made for kids:** no. **Comments:** on (it is a support video).
- **Thumbnail:** a real frame from the recording, with the words `PRICE INDEX` — no faces,
  no badges, no arrows.

## Then publish it on the site

`src/lib/site-video.ts` is the single switch. Replace `null` with the real record:

```ts
export const siteVideo: SiteVideo | null = {
  id: '<11-character YouTube id>',
  title: 'How the AiToolsPk price index works',
  description:
    'A one-minute walkthrough of how seller quotes are captured, dated and checked against the vendor price.',
  uploadDate: '2026-11-15', // the real upload date
  durationSeconds: 72, // the real running time
  transcript: [
    'Every price on this site is a seller quote in Pakistani rupees, not the vendor list price.',
    // …the rest, as actually spoken
  ],
};
```

That is all. `src/components/site-video.tsx` renders the embed, the transcript and the
`VideoObject` on the homepage only when the record is complete, and the section does not
exist while it is `null` — so nothing claims a video before there is one.

After deploying, re-score with the same eight pinned pages; `p3.video` should read 3/3 and
the total 100/100.

## What the recording must not contain

- Invented prices, invented dates or an invented runtime.
- A `VideoObject` claiming a duration or date that differs from the upload.
- Any claim of vendor affiliation. The catalogue resells nothing directly and the video
  should not imply otherwise.
