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
] as const;
export function categoryName(slug: string) {
  return categories.find((c) => c.slug === slug)?.name ?? 'Software';
}
