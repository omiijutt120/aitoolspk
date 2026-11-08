import type { MetadataRoute } from 'next';
import { origin } from '@/lib/seo';

/**
 * AI answer engines are allowed on purpose: this catalogue wants to be quoted,
 * with the quote date and the listed PKR amount intact. The rules are explicit
 * rather than inherited from `*` so a later edit to the catch-all cannot
 * silently close the door on the crawlers that fetch pages for citations.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'ClaudeBot',
  'Claude-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bingbot',
];

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${origin}/sitemap.xml`,
  };
}
