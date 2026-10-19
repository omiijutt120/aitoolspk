import type { Metadata, Viewport } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { JsonLd, origin } from '@/lib/seo';
import './globals.css';
import './storefront.css';
import localFont from 'next/font/local';
const GeistSans = localFont({
  src: '../../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'optional',
});
import { EventBridge } from '@/components/event-bridge';
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: 'AItoolsPK — Digital tools, clearer choices.',
    template: '%s | AItoolsPK',
  },
  description:
    'Compare AI tools and digital subscriptions in Pakistan. Explore exact plans, PKR prices and warranty details, then confirm your order on WhatsApp.',
  applicationName: 'AItoolsPK',
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
    <html lang="en-PK" className={GeistSans.variable}>
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
            name: 'AItoolsPK',
            url: origin,
            logo: `${origin}/brand/logo.png`,
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
            name: 'AItoolsPK',
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
