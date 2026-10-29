# Google Search Console setup for AI Tools PK

Official guidance consulted **23 October 2026 (Asia/Karachi)**. This is an owner-run setup guide for `https://aitoolspk.tech/`. No Search Console account, DNS access, Google verification token, submission result, or private search metrics was provided. Verification and submission remain pending owner action.

## 1. Add the property

Sign in to [Google Search Console](https://search.google.com/search-console/) using the Google account the business will retain. Open the property selector, choose **Add property**, select **Domain**, and enter `aitoolspk.tech` without a protocol, path, or `www`. A Domain property covers subdomains and protocols and requires DNS verification. [Google: add a property](https://support.google.com/webmasters/answer/34592)

## 2. Verify with the real DNS token

Choose TXT in Google's verification dialog and copy the entire Google-generated value. The placeholder below is deliberately unusable; replace it with the actual value from that dialog.

| DNS field       | Value                                                          |
| --------------- | -------------------------------------------------------------- |
| Type            | `TXT`                                                          |
| Host / Name     | `@`, or blank if your DNS provider requires blank for the root |
| Value / Content | `<PASTE_GOOGLE_GENERATED_TXT_VALUE>`                           |
| TTL             | Your provider's default / automatic value                      |

Add this as a **new record at the authoritative DNS provider**: the provider serving the domain's current nameservers, which may differ from the registrar. Preserve every existing A, AAAA, CNAME, MX, TXT, and other record, including GitHub Pages and mail configuration. Do not replace hosting records or change nameservers for this task.

Save, return to Search Console, and click **Verify**. If verification fails, check the host/name and exact value, then allow DNS propagation before retrying. Retain the verification record afterward: Google rechecks ownership. Save the verification date and responsible account privately. [Google: DNS verification and ongoing ownership](https://support.google.com/webmasters/answer/9008080)

## 3. Submit the sitemap

Open `https://aitoolspk.tech/sitemap.xml` and confirm it loads as XML. In the verified property's **Sitemaps** report, submit that full URL; use `sitemap.xml` if the interface already supplies the correct site prefix. Record submission date, status, last read, and discovered URL count. Investigate fetch/parser errors. A successful sitemap submission helps discovery; it does not certify indexing of every URL. [Google: Sitemaps report](https://support.google.com/webmasters/answer/7451001)

## 4. Inspect a small representative sample

Paste each full URL into the top **URL Inspection** bar:

- Homepage: `https://aitoolspk.tech/`.
- Catalog: `https://aitoolspk.tech/tools/`.
- Category: `https://aitoolspk.tech/category/ai-chat/`.
- A collection copied from an actual brand card, such as a valid `/plans/<brand-slug>/` URL.
- A valid paginated catalog/category/collection URL copied from its Next link.
- One offer known to be intentionally `noindex`, as a control sample.

Check page fetch, indexing permission, rendered content/resources, user-declared canonical, and Google-selected canonical. **Test live URL** checks the current page; indexed results describe Google's last processed version. The live test cannot predict Google's canonical selection. [Google: URL Inspection](https://support.google.com/webmasters/answer/9012289)

For eligible, useful pages that pass the live check, use **Request indexing** after a meaningful publication or fix. Do not request indexing for offers awaiting resale/delivery eligibility. Repeated requests do not accelerate crawling, and requests do not guarantee inclusion. [Google: request a recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)

## 5. Interpret exclusions and canonicals correctly

The intended host is `https://aitoolspk.tech/`. Query/filter copies prefer the clean route; distinct paginated routes retain their own canonical. Canonical annotations are signals, and Google may choose another URL. Compare Google's choice against the actual content before changing anything. [Google: canonical signals](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

Some offers deliberately remain `noindex` pending approval evidence. This is expected, not an instruction to remove the safeguard. Google must be able to crawl a page to read its `noindex`; blocking that same URL in robots.txt can prevent that. [Google: noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)

## 6. Review the reports

| Report / setting                    | Owner action                                                                                             |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Page indexing                       | Separate expected noindex/duplicates from errors affecting eligible pages. Inspect examples.             |
| Performance, Search results         | Establish clicks, impressions, CTR, and position baseline; no baseline is available yet.                 |
| Core Web Vitals                     | Review mobile/desktop groups if field data exists; follow the [monitoring plan](SEO_MONITORING_PLAN.md). |
| Security issues / Manual actions    | Check after setup and review alerts promptly; no account-level clean status is asserted here.            |
| Structured data reports, if present | Investigate invalid eligible items; see product eligibility below.                                       |
| Settings > Search generative AI     | Record effective inclusion/inheritance; see the [current AI guidance](AI_SEARCH_OPTIMIZATION.md).        |

Not every URL should be indexed, and absent reports can reflect insufficient data. [Google: Page indexing](https://support.google.com/webmasters/answer/7440203), [getting started](https://support.google.com/webmasters/answer/10267942)

## Product results and optional Bing setup

Product snippets and merchant listings have different requirements: snippets can cover pages where direct purchase is unavailable; merchant listings concern pages where customers purchase from the merchant. This site's WhatsApp ordering and absence of on-site checkout do not establish merchant-listing eligibility. Validate the real business model, policies, supported product type, and visible offer facts before pursuing it. [Google: product structured data](https://developers.google.com/search/docs/appearance/structured-data/product)

Run Google's [Rich Results Test](https://search.google.com/test/rich-results) separately on the deployed eligible page. A local JSON/schema check is not a completed remote Google test; even a passing remote test does not guarantee a rich result. Never invent ratings, stock, shipping, returns, or authorization. [Google: structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

Optionally, the owner can add and verify this site in Bing Webmaster Tools using its actual generated verification instructions and submit the same sitemap. This has not been performed. [Bing: add and verify a site](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b)
