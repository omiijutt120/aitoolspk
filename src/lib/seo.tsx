import type { Metadata } from 'next';
export const origin = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://aitoolspk.tech'
).replace(/\/$/, '');
export function metadata(
  title: string,
  description: string,
  path: string,
  image: string = '/brand/social.png'
): Metadata {
  const normalizedTitle = title.replace(/(?:\s*\|\s*AiToolsPk)+$/gi, '');
  return {
    title: normalizedTitle,
    description,
    alternates: { canonical: `${origin}${path}` },
    openGraph: {
      title: normalizedTitle,
      description,
      url: `${origin}${path}`,
      type: 'website',
      siteName: 'AiToolsPk',
      locale: 'en_PK',
      images: [{ url: image, width: 1200, height: 630, alt: normalizedTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: normalizedTitle,
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
