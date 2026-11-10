# Off-page submission pack — 10 November 2026

Off-page is the only thing standing between a clean 188-page site and a
ranking. Nothing here can be done by an agent: every entry needs a logged-in
account, a phone verification, or a human-written pitch. This file makes each
submission a copy-paste job instead of a research job.

Targets come from `data/seo/backlinks.csv` and were re-checked live today.

## Read this first: one blocker

`hello@aitoolspk.tech` **bounces**. The apex domain has no MX record. Do not
put that address in a directory profile — a directory submission is usually
one-time, and a dead contact address on it cannot be edited easily.

Use WhatsApp `+923714549245` as the contact field everywhere, and add the email
only after the mailbox actually receives mail.

## Status of all 34 targets, measured today

| Code | Meaning | Targets |
| --- | --- | --- |
| **200** | form opens, submittable now | Google Business Profile, Bing Places, Apple Business Connect, Trustpilot Business, BusinessList.pk, OLX Pakistan, Foursquare, TechJuice, ProPakistani, Featured, Qwoted, SourceBottle, Dev.to, Hashnode, BetaList, Uneed, Microlaunch, SaaSHub, DevHunt, StartupStash, Aixploria, Submit AI Tools, AI Tools Directory, Insidr AI, GitHub repository |
| **308** | redirects, follow it | Future Tools |
| **403** | bot-gated — open in a normal browser | LinkedIn Company Page, Cybo Pakistan, GoodFirms, Startup Pakistan, Medium, Product Hunt |
| **400** | wrong endpoint | Facebook — use `facebook.com/pages/create` in a browser, not `/business` |

A 403 here is the host refusing an automated client, not a dead page. Open it
in a browser and it works.

## Copy-paste listing fields

Use these verbatim so 30 listings describe the same business the same way.

**Name**
```
AiToolsPk
```

**URL**
```
https://aitoolspk.tech/
```

**Short description (128 chars)**
```
Independent catalogue of 815 AI tool and subscription plans for Pakistan, with dated PKR seller quotes and WhatsApp ordering.
```

**Directory description (~160 chars)**
```
Compare 815 AI tool and subscription plans in Pakistan: dated PKR seller quotes, exact durations and warranty terms. No checkout — confirm on WhatsApp.
```

**Long description (~330 chars)**
```
AiToolsPk lists 815 AI tool and digital subscription plans across 108 collections for buyers in Pakistan. Every price is a dated seller quote in PKR, shown with the exact duration, access method and warranty label. There is no checkout and no customer login: you compare plans on the site, then confirm the final price on WhatsApp.
```

**Category** — pick the closest in each directory's own taxonomy:
`Software` → `Internet Services` → `AI Tools` → `Technology`

**Location** — Pakistan. Online service, service-area business, **hide the street
address**. Every directory that forces an address should get the city only, and
only if the field is mandatory.

**Phone / WhatsApp**
```
+92 371 4549245
```

**Email** — leave blank until the mailbox works. See the blocker above.

**Logo** — `https://aitoolspk.tech/brand/logo.png` (512px available in `public/brand/`).

**Hours** — online enquiry only, no fixed hours. Do not invent opening times.

## What never goes in a listing

- No reviews, ratings or testimonials. Claim the profile, never seed it.
- No "authorised reseller", "official partner" or vendor affiliation — the site
  itself says a brand name does not establish affiliation, and a listing that
  contradicts the site is a trust problem the moment someone checks.
- No paid placement. Where a directory offers a paid review, decline it; the
  free tier is the only thing worth having.
- No prices in the description. They are dated seller quotes and go stale.

## Order of work

1. **Bing Places** first. Bing feeds several answer engines, and the site already
   has `BingSiteAuth.xml` published. One listing, disproportionate reach.
2. **Google Business Profile**, service-area, address hidden. This is the only
   target that can produce a Knowledge Panel signal.
3. **BusinessList.pk** and **OLX Pakistan** — the two Pakistani directories with
   real local traffic. OLX allows one ad per service; use one.
4. **Foursquare** — POI record, feeds several downstream map products.
5. **Apple Business Connect** — needs an existing Apple ID.
6. **The AI directories** (Submit AI Tools, Future Tools, Aixploria, AI Tools
   Directory, Insidr AI, Uneed, Microlaunch, SaaSHub, DevHunt, StartupStash).
   Free forms, no login on most. These are nofollow but they are where an
   answer engine looks when it decides whether a tool site exists.
7. **Dev.to / Hashnode** — write one original post each. No reposting the same
   text twice, and no link-only posts.
8. **Product Hunt, BetaList, Peerlist** last. One launch only, so the assets
   have to exist first.

## The three pitches that can earn a followed link

TechJuice, ProPakistani and Startup Pakistan are the only dofollow candidates
in the list. The angle is not the shop — it is `/price-index/`: a public,
dated table of what 815 AI subscriptions cost in Pakistan.

Lead with the dataset, offer it for use with attribution, and do not ask for a
link. A price table is publishable; a shop is not.

Guardrail: never quote a price from this site as a vendor's list price. The
site says the opposite, and a pitch that misstates it is the fastest way to get
corrected in public.

## Tracking

Fill this in as each one lands. `listing_url` stays empty until something is
actually live — an empty row is honest, a guessed URL is not.

| Platform | Submitted | Listing URL | Live check |
| --- | --- | --- | --- |
| Bing Places | | | |
| Google Business Profile | | | |
| BusinessList.pk | | | |
| OLX Pakistan | | | |
| Foursquare | | | |
| Apple Business Connect | | | |
| Trustpilot (claim only) | | | |
| Submit AI Tools | | | |
| Future Tools | | | |
| Aixploria | | | |
| AI Tools Directory | | | |
| Insidr AI | | | |
| Uneed | | | |
| Microlaunch | | | |
| SaaSHub | | | |
| DevHunt | | | |
| StartupStash | | | |
| Dev.to | | | |
| Hashnode | | | |
| TechJuice pitch | | | |
| ProPakistani pitch | | | |
| Startup Pakistan pitch | | | |
| Product Hunt | | | |

Once a row has a `listing_url`, `npm run seo:backlinks` verifies it and reports
whether the anchor is live and whether it is dofollow — so the table cannot
quietly fill up with links that do not exist.
