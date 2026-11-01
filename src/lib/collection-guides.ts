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
};

export const collectionGuides: Record<string, CollectionGuideContent> = {
  ...originalGuides,
  ...additionalGuides,
};
