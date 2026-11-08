import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Document } from '@/components/document';
import { JsonLd, metadata as makeMetadata, origin } from '@/lib/seo';
import { author, authorPath, authorSchema } from '@/lib/author';

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ slug: author.slug }];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== author.slug) return {};
  return makeMetadata(
    `${author.name} — catalogue editor`,
    `${author.name} maintains the AiToolsPk plan catalogue and its buying guides: listed durations, PKR quotes, warranty labels and the checks to make before paying.`,
    authorPath
  );
}
export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== author.slug) notFound();
  return (
    <>
      <Document
        path={authorPath}
        eyebrow="WHO MAINTAINS THIS"
        title={author.name}
        lead={`${author.role} at AiToolsPk, based in ${author.basedIn}, editing the catalogue since ${author.since}.`}
      >
        <h2>Who is Muhammad Umar?</h2>
        <p>
          Muhammad Umar is the catalogue editor at AiToolsPk, working from
          Pakistan since {author.since}. {author.bio} This is a named editorial
          role with a public profile, not a stock byline: the same person keeps
          the listings, the quote dates and the buying guides, and answers
          corrections sent to the site.
        </p>
        <h2>What does this editor work on?</h2>
        <ul>
          {author.knowsAbout.map((subject) => (
            <li key={subject}>{subject}</li>
          ))}
        </ul>
        <h2>How is the catalogue checked?</h2>
        <p>
          Every listing is a seller quote, not a vendor list price. Each record
          keeps the product ID, the duration label, the PKR amount and the
          warranty label exactly as they were supplied, together with the date
          of the quote, so a price can be traced back to when it was quoted.
          Where a seller has not confirmed access, eligibility or warranty, the
          record says so instead of filling the gap with a guess.
        </p>
        <p>
          Guides are rewritten when the checks change, not when the page needs a
          newer date. Dates shown on a collection are the newest quote date it
          contains, and corrections follow the published{' '}
          <Link href="/editorial-policy/">comparison and correction policy</Link>
          .
        </p>
        <h2>Where else can this name be checked?</h2>
        <p>
          {author.profiles.map((profile, index) => (
            <span key={profile.url}>
              {index > 0 && ' · '}
              <a
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {author.name} on {profile.label}
              </a>
            </span>
          ))}
          . The profile is the public record behind this byline; it does not
          verify any individual offer.
        </p>
        <p className="policy-date">
          Record reviewed{' '}
          <time dateTime={author.reviewed}>{author.reviewed}</time>.
        </p>
        <div className="guide-links">
          <Link href="/about/">How this catalogue works</Link>
          <Link href="/how-to-order/">Ordering checklist</Link>
          <Link href="/guides/">Practical buying guides</Link>
        </div>
      </Document>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          '@id': `${origin}${authorPath}#page`,
          url: `${origin}${authorPath}`,
          name: `${author.name} — ${author.role}`,
          about: { '@id': `${origin}#author-${author.slug}` },
          isPartOf: { '@id': `${origin}/#website` },
          inLanguage: 'en-PK',
          mainEntity: authorSchema(origin),
        }}
      />
    </>
  );
}
