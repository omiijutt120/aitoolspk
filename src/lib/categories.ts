// `title` is the page-1 <title> body; the root layout appends " | AiToolsPk".
// It stays <= 48 characters so the rendered title is inside both the 65-character
// SERP cut, and it names what the page actually lists. Later pages keep the
// short "in Pakistan - Page N" form so the pagination segment never pushes a
// title past that cut.
export const categories = [
  {
    slug: 'ai-chat',
    name: 'AI Chat',
    title: 'AI chat subscriptions in Pakistan: PKR prices',
    h1: 'AI Chat tools, in PKR.',
    icon: 'sparkles',
    description:
      'Explore AI assistants for research, reasoning and everyday questions.',
  },
  {
    slug: 'video',
    name: 'Video & Audio',
    title: 'Video and audio tools in Pakistan: PKR prices',
    h1: 'Video & Audio tools, in PKR.',
    icon: 'video',
    description:
      'Compare video editing, generation, voiceover and audio subscription plans.',
  },
  {
    slug: 'design',
    name: 'Design',
    title: 'Design tools with PKR prices in Pakistan',
    h1: 'Design tools, in PKR.',
    icon: 'pen',
    description:
      'Find creative tools for visuals, layouts, branding and design workflows.',
  },
  {
    slug: 'writing',
    name: 'Writing',
    title: 'Writing and grammar tools with PKR prices',
    h1: 'Writing tools, in PKR.',
    icon: 'text',
    description:
      'Explore writing, editing, grammar and language tools for client work and study.',
  },
  {
    slug: 'coding',
    name: 'Coding',
    title: 'Coding tools and developer plans in Pakistan',
    h1: 'Coding tools, in PKR.',
    icon: 'code',
    description:
      'Compare developer tools, AI coding assistants and automation plans.',
  },
  {
    slug: 'productivity',
    name: 'Productivity',
    title: 'Productivity tools in Pakistan: PKR prices',
    h1: 'Productivity tools, in PKR.',
    icon: 'grid',
    description:
      'Tools for documents, collaboration, learning and getting work done.',
  },
  {
    slug: 'security',
    name: 'Security',
    title: 'Privacy and security tools with PKR prices',
    h1: 'Security tools, in PKR.',
    icon: 'shield',
    description:
      'Compare privacy and security subscription variants and their terms.',
  },
  {
    slug: 'entertainment',
    name: 'Entertainment',
    title: 'Entertainment subscriptions with PKR prices',
    h1: 'Entertainment tools, in PKR.',
    icon: 'play',
    description:
      'Browse entertainment subscriptions with clear durations and access types.',
  },
  {
    slug: 'software',
    name: 'Software',
    title: 'Software licenses and editions: PKR prices',
    h1: 'Software tools, in PKR.',
    icon: 'monitor',
    description:
      'Compare software editions and licenses. Verify licensing before ordering.',
  },
  {
    slug: 'amazon-fba',
    name: 'Amazon FBA & E-commerce Tools',
    title: 'Amazon FBA tools in Pakistan: PKR prices',
    h1: 'Amazon FBA & E-commerce Tools, in PKR.',
    icon: 'grid',
    description:
      'Amazon product, keyword and competitor research tools for e-commerce sellers in Pakistan.',
  },
  {
    slug: 'ai-image-generation',
    name: 'AI Image Generation',
    title: 'AI image generation: PKR prices in Pakistan',
    h1: 'AI Image Generation tools, in PKR.',
    icon: 'sparkles',
    description:
      'AI image generation subscriptions for artwork, illustrations and creative concepts.',
  },
  {
    slug: 'creative-resources',
    name: 'Design & Creative Resources',
    title: 'Templates and stock media prices in Pakistan',
    h1: 'Design & Creative Resources, in PKR.',
    icon: 'pen',
    description:
      'Compare subscriptions for templates, stock media, graphics, fonts and creative resources.',
  },
  {
    slug: 'youtube-seo',
    name: 'YouTube SEO & Creator Tools',
    title: 'YouTube SEO tools in Pakistan: PKR prices',
    h1: 'YouTube SEO & Creator Tools, in PKR.',
    icon: 'play',
    description:
      'Keyword research, video ideas and optimization tools for YouTube creators.',
  },
] as const;
export function categoryName(slug: string) {
  return categories.find((c) => c.slug === slug)?.name ?? 'Software';
}
