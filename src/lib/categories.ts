export const categories = [
  {
    slug: 'ai-chat',
    name: 'AI Chat',
    icon: 'sparkles',
    description:
      'Explore AI assistants for research, reasoning and everyday questions.',
  },
  {
    slug: 'video',
    name: 'Video & Audio',
    icon: 'video',
    description:
      'Compare video editing, generation and audio subscription plans.',
  },
  {
    slug: 'design',
    name: 'Design',
    icon: 'pen',
    description:
      'Find creative tools for visuals, layouts and design workflows.',
  },
  {
    slug: 'writing',
    name: 'Writing',
    icon: 'text',
    description: 'Explore writing, editing and language tools.',
  },
  {
    slug: 'coding',
    name: 'Coding',
    icon: 'code',
    description:
      'Compare developer tools, AI coding assistants and automation plans.',
  },
  {
    slug: 'productivity',
    name: 'Productivity',
    icon: 'grid',
    description:
      'Tools for documents, collaboration, learning and getting work done.',
  },
  {
    slug: 'security',
    name: 'Security',
    icon: 'shield',
    description:
      'Compare privacy and security subscription variants and their terms.',
  },
  {
    slug: 'entertainment',
    name: 'Entertainment',
    icon: 'play',
    description:
      'Browse entertainment subscriptions with clear durations and access types.',
  },
  {
    slug: 'software',
    name: 'Software',
    icon: 'monitor',
    description:
      'Compare software editions and licenses. Verify licensing before ordering.',
  },
  {
    slug: 'amazon-fba',
    name: 'Amazon FBA & E-commerce Tools',
    icon: 'grid',
    description:
      'Amazon product, keyword and competitor research tools for e-commerce sellers in Pakistan.',
  },
  {
    slug: 'ai-image-generation',
    name: 'AI Image Generation',
    icon: 'sparkles',
    description:
      'AI image generation subscriptions for artwork, illustrations and creative concepts.',
  },
  {
    slug: 'creative-resources',
    name: 'Design & Creative Resources',
    icon: 'pen',
    description:
      'Compare subscriptions for templates, stock media, graphics, fonts and creative resources.',
  },
  {
    slug: 'youtube-seo',
    name: 'YouTube SEO & Creator Tools',
    icon: 'play',
    description:
      'Keyword research, video ideas and optimization tools for YouTube creators.',
  },
] as const;
export function categoryName(slug: string) {
  return categories.find((c) => c.slug === slug)?.name ?? 'Software';
}
