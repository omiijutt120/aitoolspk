import raw from '../../data/catalog.json';
import type { Product } from './types';
export const products = (raw as Product[]).filter(
  (p) => p.approval !== 'excluded'
);
export const productBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);
export const featured = [
  'chatgpt',
  'claude',
  'canva',
  'capcut',
  'perplexity',
  'notion',
  'elevenlabs',
  'cursor',
].flatMap((brand) => {
  const group = products.filter(
    (p) => p.brandSlug === brand && p.stock === 'in-stock' && !p.risk
  );
  return group
    .sort(
      (a, b) =>
        Number(b.approval === 'approved') - Number(a.approval === 'approved') ||
        a.name.length - b.name.length
    )
    .slice(0, 1);
});
