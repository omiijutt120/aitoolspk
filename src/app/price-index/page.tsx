import Link from 'next/link';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { CollectionSchema } from '@/components/collection-schema';
import { categoryName } from '@/lib/categories';
import { money } from '@/lib/commerce.mjs';
import {
  displayedWarranty,
  priceIndex,
  priceIndexStats,
  summarise,
} from '@/lib/price-index';
import { author, authorPath } from '@/lib/author';
import { metadata as makeMetadata } from '@/lib/seo';

const rows = priceIndex();
const stats = priceIndexStats();
const underThousand = rows
  .filter((row) => row.from <= 1000)
  .sort((a, b) => a.from - b.from || a.title.localeCompare(b.title));
const alphabetical = [...rows].sort((a, b) =>
  a.title.localeCompare(b.title, 'en')
);

export const metadata = makeMetadata(
  'AI subscription price index for Pakistan',
  `Every listed AI and digital subscription price for Pakistan in one index: ${stats.tools} tools with their lowest quoted PKR price, plan counts, durations and warranty labels.`,
  '/price-index/'
);

function PriceTable({
  items,
  caption,
  ariaLabel,
  showCeiling = false,
}: {
  items: typeof rows;
  caption: string;
  ariaLabel: string;
  showCeiling?: boolean;
}) {
  return (
    <div
      className="comparison-scroll"
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Tool</th>
            <th scope="col">Category</th>
            <th scope="col">Plans</th>
            <th scope="col">Starting price</th>
            {showCeiling && <th scope="col">Highest listed</th>}
            <th scope="col">Durations</th>
            <th scope="col">Warranty as listed</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.slug}>
              <th scope="row">
                <Link href={`/plans/${row.slug}/`} prefetch={false}>
                  {row.isApi ? 'API plans' : row.brand}
                </Link>
              </th>
              <td>
                {row.isApi
                  ? 'Developer APIs'
                  : row.categories.map(categoryName).join(', ')}
              </td>
              <td>{row.count}</td>
              <td className="comparison-price">
                <Link href={`/plans/${row.slug}/`} prefetch={false}>
                  {money(row.from)}
                </Link>
              </td>
              {showCeiling && <td>{money(row.to)}</td>}
              <td>{summarise(row.durations)}</td>
              <td>{displayedWarranty(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PriceIndex() {
  return (
    <div className="container">
      <div className="page-intro">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Price index', href: '/price-index/' },
          ]}
        />
        <p className="eyebrow">PRICE INDEX</p>
        <h1>Every listed price, one index.</h1>
        <p>
          {stats.offers.toLocaleString('en-PK')} seller quotes across{' '}
          {stats.tools} tools, gathered on one page. Each row starts with the
          lowest listed PKR price, then shows how many plans that tool has,
          which durations they cover and what warranty the seller attached.
        </p>
      </div>

      <p className="collection-price-context">
        Quote dates in this index run from{' '}
        <time dateTime={stats.oldestQuote}>
          {new Date(`${stats.oldestQuote}T00:00:00Z`).toLocaleDateString(
            'en-GB',
            { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }
          )}
        </time>{' '}
        to{' '}
        <time dateTime={stats.newestQuote}>
          {new Date(`${stats.newestQuote}T00:00:00Z`).toLocaleDateString(
            'en-GB',
            { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }
          )}
        </time>
        . Every figure is a seller quote, not a vendor list price, and a brand
        name does not imply vendor affiliation. Confirm the exact package,
        legitimate access and warranty before paying.
      </p>

      <p className="guide-byline">
        Index maintained by{' '}
        <Link href={authorPath} prefetch={false}>
          {author.name}
        </Link>
        , {author.role.toLowerCase()}. Read how{' '}
        <Link href="/editorial-policy/" prefetch={false}>
          we compare plans
        </Link>
        .
      </p>

      <nav aria-label="Price index sections" className="price-index-nav">
        <Link href="#how-to-read" prefetch={false}>
          How to read a starting price
        </Link>
        <Link href="#under-1000" prefetch={false}>
          Under PKR 1,000
        </Link>
        <Link href="#all-tools" prefetch={false}>
          All {stats.tools} tools
        </Link>
      </nav>

      <h2 id="how-to-read">How to read a starting price</h2>
      <p>
        The starting price is the cheapest quote listed for that tool on the
        date shown. It is not automatically the vendor&apos;s entry plan. A low
        figure can mean a short duration, a shared slot, an education plan or a
        promotional batch, so open the collection and read the plan behind the
        number before comparing two tools.
      </p>
      <ul className="price-index-notes">
        <li>
          <strong>Plans</strong> counts the separate product IDs the seller
          lists for that tool. Each ID carries its own duration, access method
          and warranty label.
        </li>
        <li>
          <strong>Durations</strong> lists the labels exactly as supplied. Where
          a seller wrote &quot;Not specified&quot;, the row says to confirm
          instead of guessing a length.
        </li>
        <li>
          <strong>Warranty as listed</strong> is the seller&apos;s own label,
          not a verification. Ask for the coverage period, exclusions and remedy
          in writing.
        </li>
        <li>
          <strong>Quote dates</strong> tell you how old a figure is. An older
          quote is a starting point for a question, not a guaranteed total.
        </li>
      </ul>

      <h2 id="under-1000">
        Tools with a listed price under PKR 1,000
      </h2>
      <p>
        {underThousand.length} of the {stats.tools} tools have at least one
        listed quote at or below PKR 1,000. The lowest starting prices come
        first. Treat the figure as the entry point for a comparison, not as the
        price of a full-length plan.
      </p>
      <PriceTable
        items={underThousand}
        caption={`${underThousand.length} tools with a listed quote of PKR 1,000 or less`}
        ariaLabel="Tools under PKR 1,000, scroll horizontally if needed"
      />

      <h2 id="all-tools">All {stats.tools} tools, A to Z</h2>
      <p>
        The complete index, including the highest listed quote for each tool so
        you can see how wide a collection&apos;s range is. A wide range usually
        means the tool is sold in several lengths and access types rather than
        one product.
      </p>
      <PriceTable
        items={alphabetical}
        caption={`All ${stats.tools} tools with their listed PKR range`}
        ariaLabel="All tools and their listed PKR range, scroll horizontally if needed"
        showCeiling
      />

      <h2 id="next-steps">Check the plan, then ask</h2>
      <p>
        Prices move and stock changes. Use the{' '}
        <Link href="/tools/" prefetch={false}>
          full tool catalogue
        </Link>{' '}
        to filter by duration, warranty, access and availability, or start from{' '}
        <Link href="/categories/" prefetch={false}>
          a category
        </Link>{' '}
        if you already know the kind of work you need to do.
      </p>
      <p>
        The{' '}
        <Link href="/guides/" prefetch={false}>
          buying guides
        </Link>{' '}
        explain credits, shared versus private access, seller warranty and
        payment checks in more detail. When a plan looks right,{' '}
        <Link href="/how-to-order/" prefetch={false}>
          confirm it on WhatsApp
        </Link>{' '}
        before paying.
      </p>

      <CollectionSchema
        name="AI subscription price index for Pakistan"
        description={`Listed PKR starting prices, plan counts, durations and warranty labels for ${stats.tools} AI and digital tools sold in Pakistan.`}
        path="/price-index/"
        dateModified={stats.newestQuote}
        items={alphabetical.map((row) => ({
          name: row.isApi ? 'API plans' : `${row.brand} plans`,
          path: `/plans/${row.slug}/`,
        }))}
      />
    </div>
  );
}
