import Link from 'next/link';
import guidance from '../../data/seo/category-guidance.json';
export function CategoryGuidance({ slug }: { slug: string }) {
  const content = guidance[slug as keyof typeof guidance];
  if (!content) return null;
  return (
    <section
      className="collection-buying-guide document"
      aria-label="Category buying guidance"
    >
      <h2>{content.heading}</h2>
      <p>{content.intro}</p>
      <ul>
        {content.checks.map((check) => (
          <li key={check}>{check}</li>
        ))}
      </ul>
      <p>
        Listed PKR prices describe different packages. Confirm the current
        quote, access method, eligibility and seller warranty before payment.
      </p>
      <div className="guide-links">
        <Link href={`/guides/${content.guide}/`} prefetch={false}>
          Read the buying checklist →
        </Link>
        <Link href="/how-to-order/" prefetch={false}>
          WhatsApp enquiry steps →
        </Link>
      </div>
    </section>
  );
}
