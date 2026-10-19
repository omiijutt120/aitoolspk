import Link from 'next/link';
export function Document({
  eyebrow,
  title,
  lead,
  children,
  policy = false,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  children: React.ReactNode;
  policy?: boolean;
}) {
  return (
    <article className="container document">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>{title}</span>
      </nav>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {policy && (
        <p className="policy-date">
          Effective 19 October 2026 · AiToolsPk.tech
        </p>
      )}
      <p className="lead">{lead}</p>
      {children}
    </article>
  );
}
