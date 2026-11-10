# Publishing to GitHub Pages

Deploy is only ever a manual dispatch of `pages.yml` at an exact reviewed
commit:

```bash
gh workflow run pages.yml --ref main \
  -f custom_domain_ready=true \
  -f expected_sha=<full 40-char sha>
```

Nothing else publishes. There is no push trigger, and the workflow refuses to
run unless `main` is at exactly `expected_sha`.

## The export is large, and Pages syncing it is slow

`next build` writes about **237 MB across ~7,460 files** to `out/`. Of that:

| Path      | Size    | Files | Indexable |
| --------- | ------- | ----- | --------- |
| `/tool/`  | ~183 MB | 815   | no        |
| `/plans/` | ~32 MB  | 119   | yes       |
| everything else | ~22 MB | — | yes |

815 product detail pages carry `noindex` and are absent from the sitemap, but
they are 77% of the artifact. GitHub Pages has to sync every byte of it on each
deploy.

## Symptom when the sync does not finish in time

The deploy job reaches `syncing_files`, polls for a while, gets an empty status
and aborts with:

```
##[error]Timeout reached, aborting!
##[error]Canceling Pages deployment...
Canceled deployment with ID <sha>
```

The **build job passes**. The site keeps serving the previous good deploy
throughout, so a failed deploy is never an outage.

On 10 November 2026 this hit five dispatches in a row. Deploys of the same
export had taken 3-7 minutes end to end earlier that day, so the sync had
simply started running past the 10 minute default in `actions/deploy-pages`.

## Fix

`deploy-pages` is configured with `timeout: 1500000` (25 minutes) in
`.github/workflows/pages.yml`. Do not lower it back to the default without
first shrinking `out/`.

## If it fails again

1. Re-dispatch at the same `expected_sha`. Several failures in a row are normal
   during a slow Pages period and a later attempt usually lands.
2. Confirm the live build is the previous commit, not broken:
   `Invoke-WebRequest https://aitoolspk.tech/?cb=<random>`
3. Only then consider the structural fix below.

## Known structural follow-up (not done)

The durable fix is to stop shipping sidecar files for pages that will never be
indexed. Each `/tool/` route emits `index.txt` plus four `__next.*.txt` RSC
payloads (~130 KB of the ~224 KB per page), which exist only for client-side
navigation between routes. Making the 815 noindex product links plain anchors
and stripping those payloads in a post-build step would roughly halve the
artifact.

It is deliberately not done yet: it changes navigation behaviour on 815 pages
and needs its own verification pass. The timeout change unblocks deploys
without it.
