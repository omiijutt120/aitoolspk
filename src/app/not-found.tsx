import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="not-found container">
      <p className="eyebrow justify-center">404 · A DIFFERENT DIRECTION</p>
      <h1>This page isn’t here.</h1>
      <p>
        The offer may have moved or been withdrawn. Explore the current catalog.
      </p>
      <Link href="/tools/" className="button">
        Explore tools →
      </Link>
    </div>
  );
}
