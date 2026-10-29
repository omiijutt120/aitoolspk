import Link from 'next/link';
import { JsonLd, origin } from '@/lib/seo';

export function Breadcrumbs({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        {items.map((item, index) => (
          <span key={item.href} className="breadcrumb-item">
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === items.length - 1 ? (
              <span aria-current="page">{item.name}</span>
            ) : (
              <Link href={item.href} prefetch={false}>
                {item.name}
              </Link>
            )}
          </span>
        ))}
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${origin}${item.href}`,
          })),
        }}
      />
    </>
  );
}
