import { Catalog } from '@/components/catalog';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'Explore all tools & subscriptions in Pakistan',
  'Search AI tools, compare exact subscriptions and retail PKR prices, and filter by brand, duration, warranty, access and availability.',
  '/tools/'
);
export default function Tools() {
  return (
    <div className="container">
      <div className="page-intro">
        <p className="eyebrow">YOUR TOOLKIT, RECONSIDERED</p>
        <h1>One tool. All its plans.</h1>
        <p>
          Browse by tool, then compare its subscriptions, durations and warranty
          options. All API offers live in one collection.
        </p>
      </div>
      <Catalog />
    </div>
  );
}
