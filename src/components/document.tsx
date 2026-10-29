import Link from 'next/link';
import { Breadcrumbs } from './breadcrumbs';
export function Document({
  eyebrow,
  title,
  lead,
  children,
  policy = false,
  effectiveDate = '19 October 2026',
  path,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  children: React.ReactNode;
  policy?: boolean;
  effectiveDate?: string;
  path?: string;
}) {
  return (
    <article className="container document">
      {path ? (
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: title, href: path },
          ]}
        />
      ) : (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{title}</span>
        </nav>
      )}
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {policy && (
        <p className="policy-date">
          Effective {effectiveDate} · AiToolsPk.tech
        </p>
      )}
      <p className="lead">{lead}</p>
      {children}
    </article>
  );
}
