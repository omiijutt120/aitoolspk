import type { Metadata, Viewport } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { JsonLd, origin } from '@/lib/seo';
import './globals.css';
import './storefront.css';
import { EventBridge } from '@/components/event-bridge';
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: 'AiToolsPk — Digital tools, clearer choices.',
    template: '%s | AiToolsPk',
  },
  description:
    'Compare AI tools and digital subscriptions in Pakistan. Explore exact plans, PKR prices and warranty details, then confirm your order on WhatsApp.',
  applicationName: 'AiToolsPk',
  referrer: 'strict-origin-when-cross-origin',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/brand/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};
export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-PK" data-scroll-behavior="smooth">
      <head>
        {process.env.NODE_ENV === 'production' && (
          <meta
            httpEquiv="Content-Security-Policy"
            content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'"
          />
        )}
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <EventBridge />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': `${origin}/#organization`,
            name: 'AiToolsPk',
            url: origin,
            logo: `${origin}/brand/logo.png`,
            description:
              'Independent AI tools and digital subscription catalog for Pakistan, with listed PKR prices and WhatsApp enquiries.',
            areaServed: { '@type': 'Country', name: 'Pakistan' },
            knowsAbout: [
              'AI tools',
              'Digital subscription comparisons',
              'PKR plan pricing',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+923714549245',
              contactType: 'customer support',
              areaServed: 'PK',
            },
          }}
        />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${origin}/#website`,
            publisher: { '@id': `${origin}/#organization` },
            name: 'AiToolsPk',
            url: origin,
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${origin}/tools/?q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          }}
        />
      </body>
    </html>
  );
}
