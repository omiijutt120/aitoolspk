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
// Entertainment is the one category with measured Pakistani demand outside the
// AI/software core: the Netflix collection alone accounts for 378 impressions in
// the current Search Console export, more than every non-Netflix query combined.
// Listing those collections together makes the index answer that query instead of
// burying five streaming collections inside 108 alphabetical rows.
const streaming = rows
  .filter((row) => row.categories.includes('entertainment'))
  .sort((a, b) => a.from - b.from || a.title.localeCompare(b.title, 'en'));
const priorityRows = [...rows]
  .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, 'en'))
  .slice(0, 32);

export const metadata = makeMetadata(
  // This is the largest impression row in the Search Console export and the
  // title never named the query. "Price index" is our internal name; people
  // type "AI tool prices in Pakistan" and the currency, so the title says that.
  `AI tool prices in Pakistan 2026: ${stats.tools} tools in PKR`,
  `Every listed AI tool price in Pakistan: ${stats.tools} tools and ${stats.offers.toLocaleString('en-PK')} seller quotes, lowest quoted PKR figure, plan counts, durations and warranty labels.`,
  '/price-index/'
);

function PriceTable({
  items,
  caption,
  ariaLabel,
  showCeiling = false,
  anchorRows = false,
}: {
  items: typeof rows;
  caption: string;
  ariaLabel: string;
  showCeiling?: boolean;
  /* Only the A–Z table carries the row ids: the same collection appears in the
     under-PKR-1,000 table too, and duplicate ids would break fragment links. */
  anchorRows?: boolean;
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
            <th scope="col">Quoted</th>
            <th scope="col">Durations</th>
            <th scope="col">Review status</th>
            <th scope="col">Quote freshness</th>
            <th scope="col">Warranty as listed</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.slug} id={anchorRows ? `tool-${row.slug}` : undefined}>
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
              <td className="comparison-price">{money(row.from)}</td>
              {showCeiling && <td>{money(row.to)}</td>}
              <td>
                <time dateTime={row.fromDate}>{row.fromDate}</time>
              </td>
              <td>{summarise(row.durations)}</td>
              <td>
                {row.pendingOffers > 0
                  ? `${row.pendingOffers} pending verification`
                  : 'Seller review recorded'}
              </td>
              <td>
                {row.staleOffers > 0
                  ? `${row.staleOffers} quotes need refresh`
                  : 'Within 7-day quote window'}
              </td>
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
        {stats.oldestQuote === stats.newestQuote ? (
          <>
            All {stats.offers.toLocaleString('en-PK')} quotes in this index were
            recorded on{' '}
            <time dateTime={stats.newestQuote}>
              {new Date(`${stats.newestQuote}T00:00:00Z`).toLocaleDateString(
                'en-GB',
                {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC',
                }
              )}
            </time>
            , the seller&apos;s latest listing date.
          </>
        ) : (
          <>
            Quote dates in this index run from{' '}
            <time dateTime={stats.oldestQuote}>
              {new Date(`${stats.oldestQuote}T00:00:00Z`).toLocaleDateString(
                'en-GB',
                {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC',
                }
              )}
            </time>{' '}
            to{' '}
            <time dateTime={stats.newestQuote}>
              {new Date(`${stats.newestQuote}T00:00:00Z`).toLocaleDateString(
                'en-GB',
                {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC',
                }
              )}
            </time>
            .
          </>
        )}{' '}
        Every figure is a seller quote, not a vendor list price, and a brand
        name does not imply vendor affiliation. Confirm the exact package,
        legitimate access and warranty before paying.
      </p>
      <p className="collection-price-context">
        Automated catalog check run on{' '}
        <time dateTime={stats.asOf}>{stats.asOf}</time>. Of {stats.offers}{' '}
        listed offers, {stats.pendingOffers} are awaiting commercial
        verification and {stats.staleOffers} have quotes older than seven days.
        No offer should be treated as currently purchasable from its catalog
        label alone.
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
        <Link href="#method" prefetch={false}>
          Method and sources
        </Link>
        <Link href="#catalog-priority" prefetch={false}>
          Largest catalog collections
        </Link>
        <Link href="#under-1000" prefetch={false}>
          Under PKR 1,000
        </Link>
        <Link href="#streaming" prefetch={false}>
          Streaming subscriptions
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
          <strong>Plans</strong> counts the separate listings the seller
          publishes for that tool. Each listing carries its own duration, access
          method and warranty label.
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
          quote is a starting point for a question, not a guaranteed total. The{' '}
          <strong>Quoted</strong> column gives the capture date of the starting
          price in that row, not today&apos;s date.
        </li>
        <li>
          <strong>Linking a figure.</strong> Every row has its own address —
          this page, <code>#tool-</code> and the collection slug — so a price
          quoted from here can be opened, dated and rechecked in one jump.
        </li>
      </ul>

      <h2 id="method">Method and sources</h2>
      <p>
        Each amount is copied from the seller&apos;s own listing on the date in
        the <strong>Quoted</strong> column and stored against that exact
        listing. The index does not estimate a market average, convert a
        vendor&apos;s dollar price into rupees or infer a discount. Where a
        seller left the duration or the warranty blank, the row says so instead
        of filling the gap.
      </p>
      <p>
        A brand name identifies the product the seller names. It does not mean
        the software maker sells through this catalog, authorises the listing or
        sponsors it. Prices here are quotes to question, not offers to accept:
        open the collection, read the exact package, then confirm the current
        amount and delivery terms in writing.
      </p>

      <h2 id="catalog-priority">Largest current catalog collections</h2>
      <p>
        These 32 collections currently contain the most listed plans in the
        public catalog. They are a navigation aid, not a search-volume or
        popularity claim. Each link leads to the collection page, where the
        exact listed plans, durations and seller terms are shown together.
      </p>
      <ul className="price-index-priority-links">
        {priorityRows.map((row) => (
          <li key={row.slug}>
            <Link href={`/plans/${row.slug}/`} prefetch={false}>
              {row.isApi ? 'API plans' : row.brand}
            </Link>{' '}
            <span>
              from {money(row.from)} · {row.count}{' '}
              {row.count === 1 ? 'listed plan' : 'listed plans'}
            </span>
          </li>
        ))}
      </ul>

      <h2 id="under-1000">Tools with a listed price under PKR 1,000</h2>
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

      <h2 id="streaming">Entertainment and streaming subscriptions</h2>
      <p>
        {streaming.length} of the {stats.tools} collections are entertainment
        accounts rather than work tools. They are listed here because they are
        sold the same way: a dated seller quote, a stated duration and a
        warranty label. Several are shared slots rather than whole-account
        plans, which is why a month can cost less than the vendor&apos;s own
        price, so open the collection and read the access type before assuming
        the quote buys a private account.
      </p>
      <PriceTable
        items={streaming}
        caption={`${streaming.length} entertainment and streaming collections, lowest listed quote first`}
        ariaLabel="Entertainment and streaming subscriptions, scroll horizontally if needed"
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
        anchorRows
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
