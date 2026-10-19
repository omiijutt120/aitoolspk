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
        <h1>Find your next advantage.</h1>
        <p>
          Every offer has its own details. Compare the plan, check the terms,
          and choose what fits your work.
        </p>
      </div>
      <Catalog />
    </div>
  );
}
