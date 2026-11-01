import additionalGuides from '../../data/seo/additional-guides.json';

export type BuyingGuide = {
  slug: string;
  title: string;
  description: string;
  checked: string;
  sections: {
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
    links?: { label: string; href: string }[];
  }[];
  sources: { label: string; href: string }[];
};

const originalGuides: BuyingGuide[] = [
  {
    slug: 'choosing-ai-subscriptions-pakistan',
    title: 'How to choose an AI subscription in Pakistan',
    description:
      'A practical guide to comparing PKR prices, plan duration, access, usage limits and seller warranty before a WhatsApp enquiry.',
    checked: '2026-10-23',
    sections: [
      {
        heading: 'Start with a task, then choose the tool',
        paragraphs: [
          'Choose one real task you need to complete: preparing a draft, editing a video, creating a presentation, prototyping an interface or writing code. A recognisable brand or a low starting price does not establish whether a particular offer supplies the features you need.',
          'Compare tools by the work you actually do and confirm the exact package. This guide explains buying checks; it does not rank products from a hands-on benchmark or guarantee that a plan improves your results.',
        ],
        links: [
          { label: 'AI chat plans', href: '/category/ai-chat/' },
          { label: 'Design tools', href: '/category/design/' },
          { label: 'Video and audio tools', href: '/category/video/' },
          { label: 'Coding tools', href: '/category/coding/' },
        ],
      },
      {
        heading: 'Compare the total PKR price for the same duration',
        paragraphs: [
          'Check whether the displayed amount covers one month, several months, a particular credit allowance or a single license. Compare equivalent durations and intended use. A lower total price for a different access method or feature set is not a like-for-like saving.',
          'AiToolsPk lists indicative retail prices in Pakistani rupees. Its dated quotes need reconfirmation after seven days and before payment. Ask for the current final amount and any additional charges in writing; do not assume an old price is still available.',
        ],
      },
      {
        heading: 'Establish who controls the account or workspace',
        paragraphs: [
          'A plan name does not tell you whether you receive a license, an authorised invitation, an editing seat or a different access arrangement. Ask who owns the workspace, what you can change, whether you can work independently and what happens when access ends.',
          'Shared access may introduce privacy, permissions and vendor-terms restrictions. A label saying private is not proof of a transferable license or a vendor-approved arrangement. Do not send passwords, browser cookies, recovery keys or two-factor codes to arrange delivery.',
        ],
        links: [
          {
            label: 'How enquiries and delivery checks work',
            href: '/how-to-order/',
          },
        ],
      },
      {
        heading: 'Separate features, usage limits and warranty',
        bullets: [
          'Features: identify the exact app, tools and permissions included in the seller-supplied package.',
          'Usage: ask about credits, rate limits, resets, expiry, overages and fair usage. A full subscription duration is not an unlimited-use promise.',
          'Warranty: distinguish an unverified source label from an explicit AI Tools PK seller warranty. Ask for its coverage, dates, exclusions and agreed remedy.',
          'Licensing: confirm the rights needed for your actual project. Brand logos and a plan name do not prove commercial-use rights or reseller authorization.',
        ],
        links: [
          {
            label: 'Seller warranty and fair usage terms',
            href: '/terms/#seller-warranty',
          },
          {
            label: 'Understanding credits and duration',
            href: '/guides/understanding-credits-and-plan-duration/',
          },
        ],
      },
      {
        heading: 'Use a written enquiry checklist',
        bullets: [
          'Copy the exact product ID and selected duration into the WhatsApp enquiry.',
          'Confirm current stock, final PKR price, access method, feature entitlements and usage limits.',
          'Agree the activation/start date, expiry date and seller warranty scope before paying.',
          'Read the refund policy and save the agreed order terms. A website click or enquiry does not reserve stock or complete an order.',
        ],
        links: [
          { label: 'Compare all tool collections', href: '/tools/' },
          { label: 'Read the refund policy', href: '/refund-policy/' },
          { label: 'Contact AiToolsPk', href: '/contact/' },
        ],
      },
      {
        heading: 'Can a student or freelancer use the cheapest plan?',
        paragraphs: [
          'Only if the actual tools, license eligibility, access permissions and usage allowance fit the work. Education-labelled offers need eligibility checks; do not treat a student or team label as a universally valid discount. For client work, confirm the applicable rights and privacy conditions rather than relying on the cheapest headline price.',
        ],
      },
    ],
    sources: [
      { label: 'AiToolsPk terms and order formation', href: '/terms/' },
      { label: 'AiToolsPk refund policy', href: '/refund-policy/' },
      {
        label: 'OpenAI subscription and API billing guidance',
        href: 'https://learn.chatgpt.com/docs/pricing',
      },
      {
        label: 'Figma seat and plan comparison',
        href: 'https://www.figma.com/pricing/',
      },
    ],
  },
  {
    slug: 'understanding-credits-and-plan-duration',
    title: 'Credits, usage limits and subscription duration explained',
    description:
      'Understand the difference between access duration, consumption credits, API billing, fair usage and seller warranty when comparing digital subscriptions.',
    checked: '2026-10-23',
    sections: [
      {
        heading: 'A month of access is different from a usage allowance',
        paragraphs: [
          'Duration describes how long the agreed subscription access lasts. A credit or token allowance describes consumption under a particular product, model or billing arrangement. The subscription can still have time remaining when a usage allowance is exhausted.',
          'Ask when each allowance resets, whether unused credits roll over, whether the allowance is shared, and whether extra usage stops or creates another charge. Do not assume these rules from a plan name alone.',
        ],
      },
      {
        heading: 'Compare the unit before comparing credit totals',
        bullets: [
          'Tokens and API credits: identify the provider, eligible models, input/output charging and any tool charges. One token or credit label is not a universal unit of money or output.',
          'Audio credits: consumption can vary with the model and task; a credit count does not by itself establish a fixed number of finished audio minutes.',
          'Automation executions: establish what counts as a run and what the supplied hosting plan includes, rather than treating executions as credits for every connected service.',
          'Image and creative tools: ask about the included capabilities and license conditions. A subscription label does not establish unlimited downloads, generations or commercial-use rights.',
        ],
        links: [
          { label: 'Compare API plans', href: '/plans/api/' },
          { label: 'ElevenLabs plans', href: '/plans/elevenlabs/' },
          { label: 'n8n plans', href: '/plans/n8n/' },
        ],
      },
      {
        heading: 'Chat subscriptions and APIs have different billing paths',
        paragraphs: [
          'An app subscription and a developer API are different products. OpenAI documents separate subscription and API billing paths; API token prices should not be used to estimate a ChatGPT subscription allowance. Other vendors and packages can have different arrangements, including expressly included credits, so check the actual offer.',
          'For any API offer, establish the authorised account or project, ownership and revocation controls, eligible endpoints, expiry, billing responsibility and rate limits. Never send an API key through a public page or a WhatsApp message. Keys belong in an authorised, private setup and must not be embedded in browser code.',
        ],
      },
      {
        heading: 'Full-duration warranty does not mean unlimited consumption',
        paragraphs: [
          'A seller warranty concerns the agreed package and purchased period, subject to its written scope and fair usage terms. It does not automatically remove vendor limits or create an uninterrupted-service, replacement or refund guarantee.',
          'For an explicitly marked AI Tools PK seller-warranty offer, confirm the agreed dates and coverage. Source warranty labels on unverified listings are not the same promise. Read the applicable terms before payment.',
        ],
        links: [
          { label: 'Warranty and fair usage', href: '/terms/#seller-warranty' },
          { label: 'Refund policy', href: '/refund-policy/' },
        ],
      },
      {
        heading: 'Questions to ask before paying',
        bullets: [
          'What exact unit is included, and which models, tools or services consume it?',
          'Is the allowance per person, workspace, project or shared balance?',
          'When do access and credits each expire or reset?',
          'Is overage disabled, prepaid or billed separately, and who controls spending?',
          'Which license, delivery method and warranty terms apply to this exact product ID?',
        ],
        links: [
          { label: 'Browse exact plan variants', href: '/tools/' },
          { label: 'How to order', href: '/how-to-order/' },
        ],
      },
    ],
    sources: [
      {
        label: 'OpenAI pricing and billing concepts',
        href: 'https://learn.chatgpt.com/docs/pricing',
      },
      {
        label: 'OpenAI API pricing',
        href: 'https://developers.openai.com/api/docs/pricing',
      },
      {
        label: 'OpenAI API authentication and key safety',
        href: 'https://developers.openai.com/api/reference/overview',
      },
      {
        label: 'Gemini API billing',
        href: 'https://ai.google.dev/gemini-api/docs/billing',
      },
      {
        label: 'ElevenLabs credit-based plans',
        href: 'https://elevenlabs.io/pricing',
      },
      { label: 'n8n pricing and executions', href: 'https://n8n.io/pricing/' },
    ],
  },
];

export const guides: BuyingGuide[] = [...originalGuides, ...additionalGuides];
