import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guides } from '@/lib/guides';
import { metadata, JsonLd, origin } from '@/lib/seo';
export const dynamicParams = false;
export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = guides.find((item) => item.slug === slug);
  if (!g) return {};
  const meta = metadata(g.title, g.description, `/guides/${slug}/`);
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: 'article', modifiedTime: g.checked },
  };
}
export default async function Guide({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = guides.find((item) => item.slug === slug);
  if (!g) notFound();
  return (
    <>
      <article className="container document buying-guide">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/guides/">Buying guides</Link>
          <span>/</span>
          <span>{g.title}</span>
        </nav>
        <p className="eyebrow">PRACTICAL BUYING GUIDANCE</p>
        <h1>{g.title}</h1>
        <p className="policy-date">
          Prepared for AiToolsPk · Sources checked{' '}
          <time dateTime={g.checked}>{g.checked}</time>
        </p>
        <p className="lead">{g.description}</p>
        {g.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((text) => (
              <p key={text}>{text}</p>
            ))}
            {section.bullets && (
              <ul>
                {section.bullets.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            )}
            {section.links && (
              <div className="guide-links">
                {section.links.map((link) => (
                  <Link key={link.href} href={link.href} prefetch={false}>
                    {link.label} →
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
        <h2>Sources and editorial scope</h2>
        <p>
          Prepared for AiToolsPk from the linked official documentation and our
          published store terms. This is practical selection guidance, not a
          claim of independent performance testing, vendor affiliation or
          verified entitlement for every catalog offer. Reconfirm current plan
          terms before payment.
        </p>
        <ul>
          {g.sources.map((source) => (
            <li key={source.href}>
              {source.href.startsWith('/') ? (
                <Link href={source.href} prefetch={false}>
                  {source.label}
                </Link>
              ) : (
                <a href={source.href} rel="noopener noreferrer" target="_blank">
                  {source.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        <p>
          <Link href="/guides/">All buying guides</Link> ·{' '}
          <Link href="/tools/">Compare tool collections</Link> ·{' '}
          <Link href="/contact/">Contact AiToolsPk</Link>
        </p>
      </article>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          '@id': `${origin}/guides/${slug}/#article`,
          headline: g.title,
          description: g.description,
          dateModified: g.checked,
          inLanguage: 'en-PK',
          mainEntityOfPage: `${origin}/guides/${slug}/`,
          author: { '@type': 'Organization', name: 'AiToolsPk', url: origin },
          publisher: { '@id': `${origin}/#organization` },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${origin}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Buying guides',
              item: `${origin}/guides/`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: g.title,
              item: `${origin}/guides/${slug}/`,
            },
          ],
        }}
      />
    </>
  );
}
