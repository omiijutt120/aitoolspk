import Link from 'next/link';
import { Document } from '@/components/document';
import { CollectionSchema } from '@/components/collection-schema';
import { guides } from '@/lib/guides';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'AI subscription buying guides for Pakistan',
  'Practical guides to comparing PKR prices, access, usage credits, subscription duration and seller warranty before a WhatsApp enquiry.',
  '/guides/'
);
export default function Guides() {
  return (
    <>
      <Document
        eyebrow="MAKE AN INFORMED CHOICE"
        title="AI subscription buying guides"
        lead="Practical explanations for comparing digital tools and subscriptions in Pakistan. These guides explain buying checks rather than promise product rankings or outcomes."
      >
        {guides.map((guide) => (
          <section key={guide.slug}>
            <h2>
              <Link href={`/guides/${guide.slug}/`} prefetch={false}>
                {guide.title}
              </Link>
            </h2>
            <p>{guide.description}</p>
            <p>
              <Link
                href={`/guides/${guide.slug}/`}
                prefetch={false}
                className="text-link"
              >
                Read the guide →
              </Link>
            </p>
          </section>
        ))}
      </Document>
      <CollectionSchema
        name="AI subscription buying guides"
        description="Original buying guidance for Pakistani subscription customers."
        path="/guides/"
        items={guides.map((g) => ({
          name: g.title,
          path: `/guides/${g.slug}/`,
        }))}
      />
    </>
  );
}
