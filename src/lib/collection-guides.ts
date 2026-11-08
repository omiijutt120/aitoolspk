import additionalGuides from '../../data/seo/collection-content.json';

export type CollectionGuideContent = {
  checked?: string;
  heading: string;
  intro: string;
  choose: string[];
  questions: { question: string; answer: string }[];
  related: { label: string; href: string }[];
  sources: { label: string; href: string }[];
};

const originalGuides: Record<string, CollectionGuideContent> = {
  chatgpt: {
    heading: 'Choosing a ChatGPT plan in Pakistan',
    intro:
      'ChatGPT can support drafting, research, planning and coding workflows. Start with the tasks you need to complete, then compare the actual access, duration and warranty of each listed variant. A familiar plan name does not establish its current usage allowance or resale eligibility.',
    choose: [
      'Describe your workload: everyday drafts, files, research or coding. Confirm the model/tools supplied instead of assuming every variant includes the same capabilities.',
      'Check who controls the account or workspace, whether the delivery method is authorised, and the exact start/end dates.',
      'Compare the total PKR quote for equivalent durations. Read the warranty wording for the exact product ID; source labels remain unverified until reviewed.',
    ],
    questions: [
      {
        question: 'Does a ChatGPT plan include developer API credits?',
        answer:
          'Do not assume so. Subscription and API usage follow different billing paths; a ChatGPT listing alone does not establish an API balance. If you need software integration, ask specifically about the provider, billing and authorised account setup.',
      },
      {
        question: 'What happens after I click Buy Now?',
        answer:
          'WhatsApp opens with the selected product ID, duration, warranty label and PKR price. Pending or stale offers ask for confirmation; a click does not approve eligibility, reserve access or complete a purchase.',
      },
    ],
    related: [
      { label: 'Gemini plans', href: '/plans/gemini/' },
      { label: 'Claude plans', href: '/plans/claude/' },
      { label: 'API plans', href: '/plans/api/' },
    ],
    sources: [
      {
        label: 'OpenAI training and workflows',
        href: 'https://developers.openai.com/training',
      },
      {
        label: 'OpenAI subscription/API billing guidance',
        href: 'https://learn.chatgpt.com/docs/pricing',
      },
    ],
  },
  gemini: {
    heading: 'Compare Gemini app and AI package variants',
    intro:
      'Gemini-related listings can refer to an assistant app, a broader Google AI package or a video-related offer. Those labels describe different needs. For connected-app work, account type, permissions and feature availability matter; a package name is not a promise that every Google tool is included.',
    choose: [
      'Identify the actual service: assistant access, a named Google AI package, video generation or developer API usage.',
      'Ask about the account/region requirements, included tools and any credits or limits attached to the exact offer.',
      'Treat video, storage and other bundled claims as offer-specific facts to verify, not automatic benefits of every Gemini listing.',
    ],
    questions: [
      {
        question: 'Is Gemini API billing the same as assistant-app access?',
        answer:
          'No package equivalence should be assumed. Google documents API access and billing through projects and Cloud Billing. Confirm whether you are buying app access or an API arrangement and whose project and billing are involved.',
      },
      {
        question: 'Can the seller promise a specific video allowance?',
        answer:
          'Only when that allowance is confirmed for the actual package supplied. Ask for the model, unit, reset period and expiry; a video-related title does not establish unlimited generation.',
      },
    ],
    related: [
      { label: 'AI chat tools', href: '/category/ai-chat/' },
      { label: 'Video and audio tools', href: '/category/video/' },
      { label: 'API plans', href: '/plans/api/' },
    ],
    sources: [
      {
        label: 'Gemini Connected Apps and account conditions',
        href: 'https://support.google.com/gemini/answer/13695044?hl=en',
      },
      {
        label: 'Gemini API billing',
        href: 'https://ai.google.dev/gemini-api/docs/billing',
      },
    ],
  },
  claude: {
    heading: 'Choose Claude access for your workload',
    intro:
      'Claude supports work such as drafting, synthesising information, working with data and building prototypes. File sizes, conversation context, tools and supplied access all affect the experience. Compare your actual workload with the exact offer instead of reading a plan label as an unlimited-use commitment.',
    choose: [
      'State whether you need writing, document work, coding or an API integration and confirm the appropriate app/workspace.',
      'Check the supplied plan, usage conditions and permitted access method. Long conversations and files can affect allowances.',
      'Clarify any expressly included API credits rather than assuming chat and developer billing are interchangeable.',
    ],
    questions: [
      {
        question:
          'Does every paid Claude offer include the same API allowance?',
        answer:
          'No. Official chat and Console arrangements have distinct rules, and some official plans expressly include credits while others do not. The supplier listing must confirm its exact entitlement; do not infer it from a broad paid-plan label.',
      },
      {
        question: 'Is a longer subscription an unlimited-message plan?',
        answer:
          'No. Duration and usage allowance are different. Confirm the reset period, model/tool availability and fair usage terms for your exact product ID.',
      },
    ],
    related: [
      { label: 'ChatGPT plans', href: '/plans/chatgpt/' },
      { label: 'Coding tools', href: '/category/coding/' },
      {
        label: 'Credits and duration guide',
        href: '/guides/understanding-credits-and-plan-duration/',
      },
    ],
    sources: [
      {
        label: 'Claude product overview',
        href: 'https://claude.com/product/overview',
      },
      {
        label: 'Claude subscription and API billing',
        href: 'https://support.claude.com/en/articles/9876003-i-have-a-paid-claude-subscription-pro-max-team-or-enterprise-plans-why-is-claude-api-usage-billed-separately-from-my-paid-claude-plan',
      },
    ],
  },
  canva: {
    heading: 'Check Canva permissions as well as the price',
    intro:
      'Canva is used for social graphics, presentations and adapting designs to different formats. The supplied plan, role and team permissions determine which tools you can use. An invitation, education-labelled listing and individually managed subscription should not be treated as the same product.',
    choose: [
      'Identify the design work you need and confirm the exact premium tools included.',
      'Check your role, team ownership, editing permissions and what happens to designs if the supplied access ends.',
      'Education and team labels require eligibility checks. Do not assume a long duration makes an invitation a transferable individual license.',
    ],
    questions: [
      {
        question: 'Does every Canva invitation provide the same editing tools?',
        answer:
          'No. Tools can depend on the plan and role. Confirm the actual membership and permissions, including the features needed for your workflow.',
      },
      {
        question: 'Does a paid label mean unlimited AI use?',
        answer:
          'Do not assume that. Features such as resizing and AI tools can have plan-specific allowances. Ask for the applicable package limits before payment.',
      },
    ],
    related: [
      { label: 'Adobe plans', href: '/plans/adobe/' },
      { label: 'Design tools', href: '/category/design/' },
      {
        label: 'Subscription buying checklist',
        href: '/guides/choosing-ai-subscriptions-pakistan/',
      },
    ],
    sources: [
      { label: 'Canva Pro workflows', href: 'https://www.canva.com/pro/' },
      {
        label: 'Canva resizing and permissions',
        href: 'https://www.canva.com/en_au/help/resize/',
      },
    ],
  },
  figma: {
    heading: 'Match the Figma seat to the work',
    intro:
      'Interface design, whiteboarding and developer handoff are different workflows. Figma’s official Full, Dev and Collab seats provide different product access. Compare the seat actually supplied, team control and editing rights rather than assuming every Pro or private-labelled offer has the same permissions.',
    choose: [
      'Confirm whether you need design editing, FigJam collaboration or Dev Mode handoff.',
      'Ask for the seat type, team/workspace ownership and your editing/admin permissions.',
      'Check any AI allowance separately; a paid seat does not establish unlimited AI credits.',
    ],
    questions: [
      {
        question: 'Is a team invitation the same as a Full seat?',
        answer:
          'Not necessarily. Invitations and seat assignments are different. Ask which seat you receive and which editing tools it enables.',
      },
      {
        question: 'What should be written in the order confirmation?',
        answer:
          'Record the product ID, seat and workspace arrangement, start/end dates, final PKR price and warranty scope. Confirm a legitimate delivery method that does not require passwords or security codes.',
      },
    ],
    related: [
      { label: 'Design tools', href: '/category/design/' },
      { label: 'Canva plans', href: '/plans/canva/' },
      { label: 'How to order', href: '/how-to-order/' },
    ],
    sources: [
      {
        label: 'Figma products, seats and allowances',
        href: 'https://www.figma.com/pricing/',
      },
    ],
  },
  elevenlabs: {
    heading: 'Compare ElevenLabs credits in context',
    intro:
      'ElevenLabs offers voice and audio workflows including text-to-speech, transcription and dubbing. Credit consumption depends on the model and task, so a credit total alone is not a fixed number of finished audio minutes or proof of commercial rights.',
    choose: [
      'Specify the intended audio workflow and confirm eligible models/tools.',
      'Ask whether credits are a personal or shared pool, when they expire/reset and how the selected model consumes them.',
      'Check the rights needed for the output and any voice. Voice cloning requires appropriate permission and is not automatically included in every offer.',
    ],
    questions: [
      {
        question: 'How many minutes does a credit count provide?',
        answer:
          'There is no universal conversion across every model and product. Ask for the consumption rules of the actual workflow and package supplied.',
      },
      {
        question:
          'Can I assume commercial output rights or voice-cloning access?',
        answer:
          'No. Confirm the applicable account, license and voice permissions. Official paid/free terms and cloning requirements differ; the catalog label does not establish your entitlement.',
      },
    ],
    related: [
      { label: 'Video and audio tools', href: '/category/video/' },
      {
        label: 'Credits and duration guide',
        href: '/guides/understanding-credits-and-plan-duration/',
      },
    ],
    sources: [
      {
        label: 'ElevenLabs credit-based plans',
        href: 'https://elevenlabs.io/pricing',
      },
      {
        label: 'ElevenLabs billing and rights',
        href: 'https://elevenlabs.io/docs/overview/administration/billing',
      },
    ],
  },
  adobe: {
    heading: 'Choose the exact Adobe app entitlement',
    intro:
      'Photo editing, vector design and video production need different Adobe applications. A single-app offer and a Creative Cloud suite are different entitlements. Start with the apps required for your projects, then verify the supplied license, duration and account arrangement.',
    choose: [
      'List the specific apps you need, such as photo, vector, video or motion tools, and confirm each entitlement.',
      'Check whether the offer supplies a legitimate license/invitation and who manages the workspace or account.',
      'Verify generative-credit access and resets separately. A suite name does not guarantee every premium generation feature or unlimited credits.',
    ],
    questions: [
      {
        question: 'Does an Adobe Creative listing include every app?',
        answer:
          'Do not assume so. Ask for the exact edition, app list, access method and duration in the written confirmation.',
      },
      {
        question: 'Are generative credits unlimited?',
        answer:
          'No unlimited allowance is established by this catalog. Adobe distinguishes generation features and plan allowances; confirm what is actually supplied and when it resets.',
      },
    ],
    related: [
      { label: 'Design tools', href: '/category/design/' },
      { label: 'Video tools', href: '/category/video/' },
      { label: 'Canva plans', href: '/plans/canva/' },
    ],
    sources: [
      {
        label: 'Adobe Creative Cloud applications',
        href: 'https://www.adobe.com/creativecloud.html',
      },
      {
        label: 'Adobe generative-credit guidance',
        href: 'https://helpx.adobe.com/creative-cloud/apps/generative-ai/generative-credits-faq.html',
      },
    ],
  },
  capcut: {
    heading: 'Choose CapCut for the device and workflow you use',
    intro:
      'CapCut is used for video editing across supported platforms. The app surface, region, package and feature entitlements can differ. A Pro-labelled offer should be checked against your intended editing workflow rather than treated as identical across every device.',
    choose: [
      'Confirm the supported app/platform for your editing setup.',
      'Identify the premium tools and any AI or asset allowance actually included in the supplied plan.',
      'Check export requirements, permitted access, duration and warranty terms before paying; do not assume one listing covers every device or feature.',
    ],
    questions: [
      {
        question: 'Does a Pro name establish all device and AI entitlements?',
        answer:
          'No. Confirm the specific package, supported platform and current tools. Vendor capabilities are context, not proof that every supplier offer includes them.',
      },
      {
        question: 'How do I compare one-month and longer offers?',
        answer:
          'Compare the total PKR price for equivalent access and features, then check the start/end dates and seller terms for the exact product ID.',
      },
    ],
    related: [
      { label: 'Video and audio tools', href: '/category/video/' },
      { label: 'Adobe plans', href: '/plans/adobe/' },
      {
        label: 'Buying checklist',
        href: '/guides/choosing-ai-subscriptions-pakistan/',
      },
    ],
    sources: [
      {
        label: 'CapCut official editing tools',
        href: 'https://www.capcut.com/',
      },
    ],
  },
  notion: {
    heading: 'Compare Notion workspace access and AI inclusion',
    intro:
      'Notion supports notes, databases, projects and collaboration. Its official plans distinguish workspace membership and AI availability. A member seat, guest invitation and individually controlled workspace are different arrangements, even when the listing uses the same broad plan name.',
    choose: [
      'Decide whether you need a personal workspace, team collaboration or access to someone else’s pages.',
      'Confirm membership role, workspace control and what content remains available when access ends.',
      'Ask specifically about AI features, included allowances and permissions rather than inferring them from an invitation or Business label.',
    ],
    questions: [
      {
        question: 'Does an invitation make me the workspace owner?',
        answer:
          'No ownership is established by that label. Confirm the actual role, permissions and content-control arrangement.',
      },
      {
        question: 'Is AI included in every Notion offer?',
        answer:
          'Do not assume it. Official tiers distinguish AI trials and included AI. The actual supplier package must state what is included.',
      },
    ],
    related: [
      { label: 'Productivity tools', href: '/category/productivity/' },
      { label: 'AI chat tools', href: '/category/ai-chat/' },
      { label: 'Terms of service', href: '/terms/' },
    ],
    sources: [
      {
        label: 'Notion plans, membership and AI',
        href: 'https://www.notion.com/pricing',
      },
    ],
  },
  lovable: {
    heading: 'Plan Lovable usage and project ownership together',
    intro:
      'Lovable supports building and iterating web applications from natural-language instructions. For a prototype, internal tool or client project, ownership and code control matter alongside credits. Official documentation now describes a shared workspace balance across building, chat, Cloud and deployed-app AI consumption.',
    choose: [
      'Estimate the work you need to build and the ongoing usage of the deployed application.',
      'Confirm who owns the project, workspace and code repository, and which export/sync controls you receive.',
      'Ask about shared credit consumption, expiry, top-ups and spending controls for the actual package.',
    ],
    questions: [
      {
        question: 'Are building credits the only usage I should consider?',
        answer:
          'No. Current official documentation describes a shared balance across several building and running activities. Confirm how your supplied workspace uses and controls that balance.',
      },
      {
        question: 'Does a credit purchase establish ownership of my project?',
        answer:
          'No. Clarify the workspace, project, repository and transfer arrangements independently of the credit quantity, especially for client work.',
      },
    ],
    related: [
      { label: 'Coding tools', href: '/category/coding/' },
      { label: 'n8n plans', href: '/plans/n8n/' },
      {
        label: 'Credits guide',
        href: '/guides/understanding-credits-and-plan-duration/',
      },
    ],
    sources: [
      {
        label: 'Lovable product and ownership concepts',
        href: 'https://docs.lovable.dev/introduction/welcome',
      },
      {
        label: 'Lovable current credits and usage',
        href: 'https://docs.lovable.dev/introduction/credits-and-usage',
      },
    ],
  },
  n8n: {
    heading: 'Identify n8n hosting, license and execution needs',
    intro:
      'n8n can be used as managed Cloud or through self-hosting. These arrangements involve different hosting, administration and licensing responsibilities. A server deployment is not itself proof of a paid license or an official Cloud subscription.',
    choose: [
      'Establish whether the offer is Cloud access, a self-hosted edition, a deployment service or ongoing support.',
      'Estimate workflow run frequency and confirm how the supplied plan counts executions.',
      'Ask who controls the server, workflows, backups and authorised credentials. Do not send account passwords or API keys through WhatsApp.',
    ],
    questions: [
      {
        question: 'Does self-hosted mean the same thing as a paid n8n plan?',
        answer:
          'No. n8n has different hosting and edition arrangements. Confirm the actual edition, legitimate license where required and the hosting/support included.',
      },
      {
        question: 'Is the number of workflows enough to compare plans?',
        answer:
          'No. Execution frequency and the package’s counting rules matter. Also identify any separate provider/API costs incurred by connected services.',
      },
    ],
    related: [
      { label: 'Coding and automation tools', href: '/category/coding/' },
      { label: 'API plans', href: '/plans/api/' },
      {
        label: 'Credits and duration',
        href: '/guides/understanding-credits-and-plan-duration/',
      },
    ],
    sources: [
      {
        label: 'n8n deployment options',
        href: 'https://docs.n8n.io/choose-how-to-use-n8n/',
      },
      { label: 'n8n execution-based pricing', href: 'https://n8n.io/pricing/' },
    ],
  },
  api: {
    heading: 'Compare API packages by provider, unit and controls',
    intro:
      'API offers support software integrations and automated workloads. This collection groups provider, credit and token variants together while preserving each exact product ID. App subscriptions, provider-direct APIs and intermediary endpoints should not be treated as interchangeable.',
    choose: [
      'Confirm the actual provider/endpoint, eligible models and direct-provider or intermediary arrangement.',
      'Identify the balance denomination, expiry, reset rules, rate limits and billing responsibility. A token or credit label is not a universal output allowance.',
      'Establish authorised account/project ownership, usage visibility, revocation and private credential handling. Never send a key, password or security code through WhatsApp.',
    ],
    questions: [
      {
        question: 'Does every API key represent a separately owned balance?',
        answer:
          'No. Provider billing and project rules vary. Ask who owns and funds the authorised account/project, which limits apply and how usage is visible and revoked.',
      },
      {
        question: 'Can I compare an API token price with a chat subscription?',
        answer:
          'Those products can use different billing and entitlement models. Compare the intended workload and actual supplied terms; a chat plan label does not establish API credit value.',
      },
    ],
    related: [
      { label: 'ChatGPT plans', href: '/plans/chatgpt/' },
      { label: 'n8n plans', href: '/plans/n8n/' },
      {
        label: 'Credits and usage guide',
        href: '/guides/understanding-credits-and-plan-duration/',
      },
    ],
    sources: [
      {
        label: 'OpenAI API pricing',
        href: 'https://developers.openai.com/api/docs/pricing',
      },
      {
        label: 'Gemini project billing',
        href: 'https://ai.google.dev/gemini-api/docs/billing',
      },
      {
        label: 'API key safety',
        href: 'https://developers.openai.com/api/reference/overview',
      },
    ],
  },
  /*
   * The four largest collections with no hand-written guide all turned out to
   * mix products that only look similar in a listing title. These guides are
   * written as a split: name what each row actually is, then say plainly which
   * ones transfer an account or change a public metric. Nothing here is
   * promotional — a buyer who understands the difference converts better
   * anyway, and the site should not imply a seller can grant platform
   * permission it cannot grant.
   */
  google: {
    heading: 'What the Google listings here actually are',
    intro:
      'Most rows in this collection are existing Google accounts — usually a Gmail login sold for its age or for two-factor setup — plus verification phone numbers and one Google Cloud credit. An account transfer is not a subscription bought from Google, and the seller cannot give you Google’s permission to hold it. Read the age, the recovery details and the warranty label together before comparing prices.',
    choose: [
      'Decide what you are buying: an existing Gmail login, a phone number used to verify an account, or a Google Cloud credit. Those are three different products and none of them is a new Google One or Gemini subscription.',
      'Ask who keeps recovery access. If the seller retains a recovery email, a phone number or a backup code, that person can take the account back whatever the listing says, and the warranty period will not prevent it.',
      'Weigh the stated age against your actual need. An older account is priced for its history, not for storage or extra features, so do not read the price as a monthly subscription rate.',
    ],
    questions: [
      {
        question: 'Does Google allow an account to be sold or transferred?',
        answer:
          'Google’s Terms of Service restrict transferring an account to someone else, and Google’s own help pages describe accounts being disabled. A seller’s promise is not permission from Google. Treat the price as the cost of that risk rather than a subscription fee you can rely on for a fixed term.',
      },
      {
        question: 'What does the warranty label mean on these listings?',
        answer:
          'Most rows here carry no warranty label at all, and where one appears it is a seller statement recorded when the catalog was imported. It describes that seller’s own remedy window, not a Google guarantee. Ask in writing what happens if the account is disabled in the first week, and get the answer before paying.',
      },
    ],
    related: [
      { label: 'Microsoft listings', href: '/plans/microsoft/' },
      { label: 'YouTube listings', href: '/plans/youtube/' },
      {
        label: 'Seller warranty vs vendor warranty',
        href: '/guides/seller-warranty-vs-vendor-warranty/',
      },
    ],
    sources: [
      {
        label: 'Google Terms of Service',
        href: 'https://policies.google.com/terms',
      },
      {
        label: 'Google Account Help: your account is disabled',
        href: 'https://support.google.com/accounts/answer/40695',
      },
    ],
    checked: '2026-11-09',
  },
  microsoft: {
    heading: 'Choose between a licence key, a family slot and an admin offer',
    intro:
      'This collection mixes three different products: permanent activation keys for Windows and Office editions, member seats inside a Microsoft 365 family or workspace subscription, and separate Hotmail or Outlook accounts. A key activates software you install and keep; a slot is a seat someone else administers and can remove; an account listing transfers a login. Compare like with like, because the cheapest row is often a different product from the one you wanted.',
    choose: [
      'Name the product you need first: a permanent key, a twelve-month seat with storage, or an email account. Prices in this collection are only comparable inside one of those groups.',
      'For a key, confirm the exact edition and channel — retail, OEM or volume — and ask what happens when you reactivate after a hardware change. For a slot, confirm who owns the subscription and how removal is handled.',
      'For an account listing, assume the seller may keep a recovery route. The Microsoft Services Agreement binds the account holder, not whoever bought the login, so a transfer does not move the agreement with it.',
    ],
    questions: [
      {
        question:
          'Is a Microsoft 365 family slot the same as buying Microsoft 365?',
        answer:
          'No. A slot is a member seat inside a subscription that someone else administers. The subscription stays with the admin and a member can be removed from it. Microsoft sells the same plan directly with you as the subscriber; a slot is cheaper precisely because you are not the owner and cannot renew it yourself.',
      },
      {
        question:
          'Why do the licence keys show such different warranty periods?',
        answer:
          'The warranty is set by each seller, not by Microsoft. A seven-day, sixty-day or hundred-year label describes that seller’s promise and says nothing about whether the key will still activate next year. Check the stated edition, ask about reactivation after replacing a motherboard, and treat the warranty as a return window rather than a guarantee of validity.',
      },
    ],
    related: [
      { label: 'Software listings', href: '/category/software/' },
      {
        label: 'Shared versus private access',
        href: '/guides/private-shared-workspace-access/',
      },
      {
        label: 'Seller warranty vs vendor warranty',
        href: '/guides/seller-warranty-vs-vendor-warranty/',
      },
    ],
    sources: [
      {
        label: 'Microsoft Services Agreement',
        href: 'https://www.microsoft.com/en-us/servicesagreement',
      },
      {
        label: 'Compare Microsoft 365 plans',
        href: 'https://www.microsoft.com/en-us/microsoft-365/buy/compare-all-microsoft-365-products',
      },
    ],
    checked: '2026-11-09',
  },
  youtube: {
    heading: 'Premium seats, trial-linked accounts and follower listings',
    intro:
      'Three unrelated products share this collection: YouTube Premium seats on a plan someone else administers, Gmail accounts whose value is a Premium trial the login may or may not still have, and services that add followers to a channel. A Premium seat is a subscription position; a trial-linked account is a login transfer; a follower listing changes a public number without producing viewers. YouTube’s spam policy treats bought engagement as a violation, so the risk sits with the channel owner.',
    choose: [
      'Separate the three before comparing prices: a Premium seat, a Gmail login sold for a possible trial, and a follower count. The cheapest row is unlikely to be the product you actually came for.',
      'For a Premium seat, ask who the admin is, how many of the five seats are already used, and what happens if that admin cancels mid-term. A seat is only as long as the plan behind it.',
      'For a follower listing, read YouTube’s spam policy first. Bought subscribers do not watch, which weakens engagement relative to channel size, and the policy violation is recorded against the channel rather than the seller.',
    ],
    questions: [
      {
        question: 'Does buying a Premium seat give me my own subscription?',
        answer:
          'No. You become a member of a plan the seller administers, so the plan’s country, payment method and admin stay theirs and they can remove you. Confirm the exact term, the removal policy and whether the seat includes YouTube Music before paying, because none of that is guaranteed by the listing title.',
      },
      {
        question: 'Are purchased followers against YouTube’s rules?',
        answer:
          'YouTube’s spam policy prohibits artificially inflating metrics such as subscribers, views and likes. A listing that adds ten thousand followers changes a number; it does not produce an audience, and the channel carries the enforcement risk. Decide what the number is supposed to achieve before spending on it.',
      },
    ],
    related: [
      { label: 'Google listings', href: '/plans/google/' },
      { label: 'Entertainment listings', href: '/category/entertainment/' },
      {
        label: 'Seller warranty vs vendor warranty',
        href: '/guides/seller-warranty-vs-vendor-warranty/',
      },
    ],
    sources: [
      {
        label: 'YouTube spam policy',
        href: 'https://support.google.com/youtube/answer/2801973',
      },
      {
        label: 'YouTube Premium benefits',
        href: 'https://support.google.com/youtube/answer/6308116',
      },
    ],
    checked: '2026-11-09',
  },
  discord: {
    heading: 'Nitro, decorations, boosts and transferred accounts',
    intro:
      'This collection mixes Discord Nitro, profile decorations and effects, server boosts, gifting badges and older accounts sold as clones. Nitro and boosts are real Discord products with defined terms; decorations and badges are cosmetic; a clone account is a transferred login. Discord lists what a Nitro subscription includes on its own site, and a seller delivering a token is not the same as a subscription sitting on your account.',
    choose: [
      'Identify the item first: a Nitro subscription, a one-off decoration or effect applied to your profile, a server boost that raises one server’s level, or a login. Only the first is a recurring product.',
      'For anything delivered as a token or login, ask who keeps the original email and whether the account can be recovered from you. Discord accounts are not transferable under its terms, so a seller warranty cannot restore one that Discord closes.',
      'For boosts, confirm which server and which month. A boost applies to a single server and lapses when the plan behind it stops, which matters if you are buying it to reach a server level.',
    ],
    questions: [
      {
        question:
          'What is the difference between Nitro and a decoration listing?',
        answer:
          'Nitro is a subscription with a defined set of features. A decoration or profile effect is a cosmetic item applied on top of an account, and some rows here describe a discount rather than a product at all. Check which of the two the product ID actually supplies before comparing the amounts.',
      },
      {
        question: 'Are clone accounts safe to buy?',
        answer:
          'Treat them as transferred logins. The original owner may keep a recovery route, and Discord can disable an account that breaks its terms. A seller warranty period does not undo a platform decision, so ask what the seller will actually do if the account is closed.',
      },
    ],
    related: [
      { label: 'Entertainment listings', href: '/category/entertainment/' },
      { label: 'YouTube listings', href: '/plans/youtube/' },
      {
        label: 'Seller warranty vs vendor warranty',
        href: '/guides/seller-warranty-vs-vendor-warranty/',
      },
    ],
    sources: [
      { label: 'Discord Nitro', href: 'https://discord.com/nitro' },
      { label: 'Discord Terms of Service', href: 'https://discord.com/terms' },
    ],
    checked: '2026-11-09',
  },
};

/*
 * Hand-written guides win over the imported JSON ones. The two sets overlap on
 * `microsoft` and `youtube`, and both of those collections turned out to mix
 * products a listing title makes look identical (licence keys versus family
 * seats, Premium seats versus trial-linked accounts versus follower services).
 * The hand-written versions name that split; the JSON versions do not. Spreading
 * the JSON first keeps it authoritative for every collection that has no
 * hand-written entry.
 */
export const collectionGuides: Record<string, CollectionGuideContent> = {
  ...additionalGuides,
  ...originalGuides,
};
