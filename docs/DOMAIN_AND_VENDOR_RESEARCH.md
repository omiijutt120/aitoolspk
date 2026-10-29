# Domain and vendor research

Checked **23 October 2026**. Read-only public-page research for the current AiToolsPk implementation. This is a reference for authored buying guides, not proof of supplier entitlements or reseller authorization. Applied the **OpenAI Docs** skill to the ChatGPT/API research; opened official OpenAI documentation before drawing conclusions. No application, catalog, account, DNS, publishing, or older-domain changes are part of this audit.

## Domain evidence

Direct HTTPS requests through PowerShell returned these results. The browsing service could read the older homepage but could not fetch the current homepage; a separate direct request successfully fetched both. Thus the browsing-service error is not evidence that the current site is down.

| Signal                 | `aitoolspak.tech`                                                                            | `aitoolspk.tech`                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Homepage HTTP response | 200, content served at requested domain                                                      | 200, content served at requested domain                                                         |
| Page title             | Cheap AI Tools Pakistan / AI Tools Sale & PKR Prices                                         | AI tools & subscriptions in Pakistan / selected plans                                           |
| Visible brand          | AI Tools Pak                                                                                 | AiTools Pk / AiToolsPk                                                                          |
| Self canonical         | `https://aitoolspak.tech/`                                                                   | `https://aitoolspk.tech/`                                                                       |
| Contact                | WhatsApp +92 371 454 9245; claims `support@aitoolspak.com`                                   | Same WhatsApp +92 371 4549245; contact page does not publish fixed support hours                |
| Catalog presentation   | Homepage states 32 tools; individual Pakistan product guides, comparisons, blog and services | Homepage states 811 plans in 104 collections; `/plans/{brand}/`, categories and catalog filters |
| Robots                 | Allows main pages; advertises its own sitemap; additional data/script exclusions             | Allows all; advertises its own sitemap                                                          |
| Sitemap sample         | 233 `<loc>` entries                                                                          | 138 `<loc>` entries                                                                             |

Counts above describe responses on this date, not indexed pages or traffic. Sources: [older homepage](https://aitoolspak.tech/), [older about page](https://aitoolspak.tech/about-us/), [older robots](https://aitoolspak.tech/robots.txt), [older sitemap](https://aitoolspak.tech/sitemap.xml), [current homepage](https://aitoolspk.tech/), [current contact](https://aitoolspk.tech/contact/), [current robots](https://aitoolspk.tech/robots.txt), [current sitemap](https://aitoolspk.tech/sitemap.xml).

Reachable comparison samples:

- [Older ChatGPT guide](https://aitoolspak.tech/chatgpt-plus-pakistan/) returns 200 with a self canonical. It describes a single one-month offer, buying checks, activation and non-affiliation. [Current ChatGPT collection](https://aitoolspk.tech/plans/chatgpt/) returns 200 with its own self canonical and lists 52 variants with duration/access/warranty filters. These are different page structures serving overlapping buying intent.
- Both sites target Pakistani subscription buyers, show PKR prices, use WhatsApp ordering and cover ChatGPT, Claude, Gemini, Canva, CapCut, ElevenLabs, Lovable and APIs. The same phone number is evidence of shared public contact details; it does **not** establish domain ownership, common legal ownership, migration authorization, or control of hosting/Search Console.
- Older-site `/about/` and `/contact/` returned 404; `/about-us/` is reachable and the homepage links a contact section. Current `/contact/` is reachable; `/about/` returned 404. Those individual 404s are not a full broken-link audit.
- Public search samples on this date: `site:aitoolspak.tech`, `site:aitoolspk.tech`, and quoted hostname queries. This search provider returned no first-party site URL samples; one third-party result mentioned the older domain. This does **not** prove either domain has zero Google-indexed URLs. Search Console access is needed for indexing, selected canonical, query, click and impression evidence. No backlink, authority, traffic or ranking metrics were established.

### Recommended posture and blockers

Use **AiToolsPk.tech** consistently in current-site identity, contact links and self canonicals. Position its collection pages around comparing exact offer variants, practical uses and pre-order checks, using original explanatory copy. Do not copy older-site prose or describe the current site as an official migration. The overlap creates potential brand confusion; the available evidence does not quantify ranking impact or establish duplication penalties.

The older domain has not been shown to be controlled by the user. Do not redirect, remove, edit, request deindexing of, or change canonicals on it. A documented migration becomes an option only after ownership/access and authorization are proven, an old-to-new URL map is reviewed, and redirect capability is confirmed. Google requires the same Google account to own both Search Console properties and calls for the old homepage (and corresponding canonical pages) to redirect before using Change of Address. [Google Change of Address](https://support.google.com/webmasters/answer/9370220?hl=en)

If either site is hosted on GitHub Pages, its static output does not itself provide application-server redirect rules: GitHub documents static publishing and no server-side language execution. Its documented custom-domain handling covers apex/www behavior, not an arbitrary old-domain-to-new-domain per-URL migration. Confirm a host/CDN capable of the required HTTP redirects; an HTML refresh or client-side script is not proof of an HTTP 301. This audit did not verify hosting-account settings or DNS control. [GitHub static publishing](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [GitHub custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)

Missing migration inputs: domain/registrar control evidence, hosting access, both Search Console ownerships, current Google-selected canonicals, actual indexed legacy URLs, traffic/backlink exports if available, agreed destination mapping, and an approved redirect/rollback plan. None is inferred from the shared telephone number.

## Official vendor context for collection guides

All sources below were opened on 23 October 2026. Descriptions are paraphrases. Vendor products change; do not turn these facts into a promise that a supplier listing includes a feature, license, seat, credit quantity or API balance. A vendor plan name alone does not establish the supplier's access method or authorization. Each practical selection question below is editorial guidance, not a verified package entitlement.

### ChatGPT

- Official training describes document/slide work, research, planning and coding workflows. Suitable guide examples: prepare a draft, organize research, work through a spreadsheet, or ask for coding help. [OpenAI training](https://developers.openai.com/training)
- Subscription usage and API-key usage have different billing paths; OpenAI explicitly cautions against estimating subscription allowance using API token prices. Confirm the actual product, account/workspace access and displayed limits. [ChatGPT pricing documentation](https://learn.chatgpt.com/docs/pricing)
- API billing can include model input/output tokens and additional tool charges. An offer titled ChatGPT is not sufficient evidence of an API balance. [OpenAI API pricing](https://developers.openai.com/api/docs/pricing)

### Gemini

- Connected Apps can support tasks such as Gmail summaries and calendar actions, with user permission. Availability depends on account type, app surface and relevant activity settings; work/school accounts have separate guidance. [Gemini Connected Apps](https://support.google.com/gemini/answer/13695044?hl=en)
- Gemini API paid access uses a project linked to Cloud Billing; free/paid tiers and rate limits are distinct from the consumer app workflow. Ask whether the offer is Gemini app access or API access, and whose billing project/credentials are involved. [Gemini API billing](https://ai.google.dev/gemini-api/docs/billing)

### Claude

- Claude's official overview supports drafting, synthesizing information, working with data and developing prototypes. Describe a concrete workload and ask which app/workspace is supplied. [Claude overview](https://claude.com/product/overview)
- Claude chat plans and the Console API are separate products and API usage is billed separately. **Current exception:** official help says Max and Team include monthly API credits; do not write that every paid Claude plan excludes API credits. Console setup is still required. [Claude subscription/API distinction](https://support.claude.com/en/articles/9876003-i-have-a-paid-claude-subscription-pro-max-team-or-enterprise-plans-why-is-claude-api-usage-billed-separately-from-my-paid-claude-plan)
- Pro specifically excludes Console API usage; its chat allowance varies with files, conversation length, model and feature use. Confirm the supplied plan and current limits instead of promising unlimited messages. [Claude Pro help](https://support.claude.com/en/articles/8325606-what-is-the-pro-plan)

### Canva

- Useful workflows include social graphics, presentations and adapting assets for different formats; the official Pro page describes Brand Kit, resizing and photo/background editing. [Canva Pro](https://www.canva.com/pro/?facet2=pdf)
- Magic Resize is restricted by plan/role and each use counts against monthly AI usage. Ask whether the buyer needs one-person design work or membership in a managed team and confirm the actual included tools. [Canva resize help](https://www.canva.com/en_au/help/resize/)

### Figma

- Figma Design supports interface design and interactive prototypes; FigJam supports collaborative whiteboarding and Dev Mode supports developer handoff. These are different workflow needs. [Figma product and plan comparison](https://www.figma.com/pricing/)
- Full, Dev and Collab seats have different product access; view/comment access need not require a paid seat. Confirm the seat type, team ownership and editing permissions instead of treating every team invitation as a Full seat. [Figma seat comparison](https://www.figma.com/pricing/)
- AI credits/add-ons are a separate allowance dimension. Do not infer unlimited AI use from a paid seat. [Figma pricing and add-ons](https://www.figma.com/pricing/)

### ElevenLabs

- Official products include text-to-speech, transcription, voice design and dubbing. Compare the intended output and voice workflow before comparing credit labels. [ElevenLabs product comparison](https://elevenlabs.io/pricing)
- Its pricing page describes a shared credit pool and model-dependent consumption. A credit count is not a fixed number of audio minutes across every model/product. [ElevenLabs credits](https://elevenlabs.io/pricing)
- Paid and free commercial-use terms differ; voice cloning also requires appropriate rights and Professional Voice Cloning is limited to the verified owner's voice. Confirm license applicability and clone type for the actual account. [ElevenLabs billing](https://elevenlabs.io/docs/overview/administration/billing), [Professional Voice Cloning](https://elevenlabs.io/docs/eleven-creative/voices/voice-cloning/professional-voice-cloning)

### Adobe

- Photoshop/Lightroom cover photo workflows, Illustrator vector graphics, and Premiere/After Effects video and motion work. A single-app offer is different from a suite; confirm the exact app entitlement. [Adobe Creative Cloud](https://www.adobe.com/creativecloud.html)
- Generative credits vary by plan and feature; Adobe distinguishes standard and premium generation. Credits reset monthly without rollover. Ask which app, AI feature and credit allowance are actually supplied. [Adobe generative credits FAQ](https://helpx.adobe.com/creative-cloud/apps/generative-ai/generative-credits-faq.html)

### CapCut

- CapCut supports video editing, templates, captions and timeline/effect workflows across web, desktop and mobile. Choose by editing workload and target device. [CapCut product guide](https://www.capcut.com/resource/capcut-standard-vs-pro)
- AI access can depend on region, device/app version, active membership and valid credits. Pro status alone does not establish that every AI operation is available without additional consumption. [CapCut AI access help](https://www.capcut.com/help/ai-function-not-working-after-login)

### Notion

- Pages, databases, forms and collaboration can organize notes, projects and team knowledge. AI capabilities include document drafting, meeting notes and connected search, with plan-specific availability. [Notion plan comparison](https://www.notion.com/pricing)
- Plans are presented per member; AI trials and included AI differ across tiers. Ask whether the offer is a workspace member seat, guest access or an individual workspace and confirm AI inclusion and permissions. Do not equate an invitation with workspace ownership. [Notion pricing](https://www.notion.com/pricing)

### Lovable

- Lovable builds and iterates web applications from natural language, with editable frontend/backend code and Git sync. Useful guide examples: a prototype, internal tool or small web application. [Lovable introduction](https://docs.lovable.dev/introduction/welcome)
- **Current billing model:** official docs describe one workspace credit balance for building, chat, Cloud/backend hosting and deployed-app AI. Avoid older copy claiming these always have separate balances. Ask about shared workspace usage, credit expiry/top-ups and deployed-app consumption. [Lovable credits and usage](https://docs.lovable.dev/introduction/credits-and-usage)
- Workspace/project ownership and code portability matter independently of a credit count. Clarify who owns the project and controls access before using it for client work. [Lovable workspace/project explanation](https://docs.lovable.dev/introduction/welcome)

### n8n

- n8n offers fully managed Cloud and self-hosting; self-hosting requires infrastructure and technical administration. Confirm whether the purchase is hosting, an official plan/edition, a deployment service or ongoing support. [n8n deployment comparison](https://docs.n8n.io/choose-how-to-use-n8n)
- Official pricing uses monthly workflow executions as a billing measure. Compare the expected run frequency, not only the number of workflows or integration names. [n8n pricing](https://n8n.io/pricing/)
- Community is available self-hosted; adding a license enables paid self-hosted editions. A server deployment does not by itself establish a paid license. [n8n hosting and editions](https://docs.n8n.io/deploy/host-n8n.md)

### API credits

- APIs are for software integrations and automated usage, while hosted app subscriptions serve interactive workflows. OpenAI token/tool billing, Gemini project billing and Claude Console access have provider-specific rules; do not describe all credit products as interchangeable. [OpenAI pricing](https://developers.openai.com/api/docs/pricing), [Gemini billing](https://ai.google.dev/gemini-api/docs/billing), [Claude API distinction](https://support.claude.com/en/articles/9876003-i-have-a-paid-claude-subscription-pro-max-team-or-enterprise-plans-why-is-claude-api-usage-billed-separately-from-my-paid-claude-plan)
- Before comparing an offer, obtain its provider and endpoint, direct-provider versus intermediary access, eligible models, balance denomination/expiry, billing owner, rate limits and usage visibility. These are verification questions; this audit establishes none of those properties for a supplier package. Google explicitly ties keys to projects and billing status, rather than giving each key an independent billing account. [Gemini project/key billing](https://ai.google.dev/gemini-api/docs/billing)
- OpenAI says API keys are secret and should not be shared or exposed in browser/client code. Guides should recommend the buyer's authorized credential/account setup without asking them to send a key through WhatsApp. [OpenAI authentication](https://developers.openai.com/api/reference/overview)

## Copy boundaries for implementation

Vendor facts can explain what a tool commonly does and which question helps select it. Supplier price, duration, activation route, stock, warranty, private/shared access, seats and included credits must come from the actual reviewed offer. Do not attach official plan quotas/prices to supplier variants, claim a vendor partnership, promise perpetual access or imply that a lower local price proves license equivalence. Keep dated source links near the collection guidance; preserve unverified-offer labels and written confirmation before payment.
