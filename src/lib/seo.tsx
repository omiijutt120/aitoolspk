import type { Metadata } from 'next';
import { author, authorPath } from './author';
export const origin = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://aitoolspk.tech'
).replace(/\/$/, '');
export function metadata(
  title: string,
  description: string,
  path: string,
  image: string = '/brand/social.png'
): Metadata {
  return {
    title,
    description,
    // Renders <meta name="author"> on every page. The name is the same record
    // that signs the guides, so the tag cannot drift from the visible byline.
    authors: [{ name: author.name, url: `${origin}${authorPath}` }],
    alternates: { canonical: `${origin}${path}` },
    openGraph: {
      title,
      description,
      url: `${origin}${path}`,
      type: 'website',
      siteName: 'AiToolsPk',
      locale: 'en_PK',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
