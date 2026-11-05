import { JsonLd, origin } from '@/lib/seo';

export function CollectionSchema({
  name,
  description,
  path,
  items,
  dateModified,
}: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
  /** ISO date of the newest quote in the collection, not a build date. */
  dateModified?: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${origin}${path}#collection`,
        url: `${origin}${path}`,
        name,
        description,
        ...(dateModified ? { dateModified } : {}),
        isPartOf: { '@id': `${origin}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: items.length,
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            url: `${origin}${item.path}`,
          })),
        },
      }}
    />
  );
}
