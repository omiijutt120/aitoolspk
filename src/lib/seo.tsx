import type { Metadata } from 'next';
export const origin = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://aitoolspk.tech'
).replace(/\/$/, '');
export function metadata(
  title: string,
  description: string,
  path: string
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${origin}${path}` },
    openGraph: {
      title,
      description,
      url: `${origin}${path}`,
      type: 'website',
      siteName: 'AItoolsPK',
      locale: 'en_PK',
      images: [{ url: '/brand/social.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/brand/social.png'],
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
