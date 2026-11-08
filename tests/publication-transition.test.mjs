import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  contentFingerprint,
  publicationDecision,
} from '../src/lib/seo-publication.mjs';
import { canBuy, whatsappIntent } from '../src/lib/commerce.mjs';

// Synthetic offers only: this does not authorize or modify a catalog record.
const now = new Date('2026-11-05T12:00:00+05:00');
const fixture = {
  id: 'TEST-TRANSITION',
  slug: 'synthetic-transition',
  name: 'Synthetic transition fixture',
  approval: 'pending',
  stock: 'in-stock',
  purchasable: false,
  risk: false,
  date: '2026-11-05',
  price: 100,
  description: 'Synthetic reviewed description for a transition regression.',
  duration: '1 month',
  warranty: 'Synthetic agreed replacement terms',
  access: 'Synthetic authorized invitation',
  renewal: 'Manual renewal with a newly confirmed quote',
};
const review = (product) => ({
  reviewedAt: '2026-11-05',
  contentFingerprint: contentFingerprint(product),
  distinctIntent: true,
  usefulContent: true,
  publication: 'ready',
});

function assertPublication(product, editorial, expected) {
  const decision = publicationDecision(product, editorial, now);
  assert.deepEqual(
    {
      indexable: decision.indexable,
      robots: decision.robots,
      sitemap: decision.sitemapEligible,
      productSchema: decision.productSchemaEligible,
      offerSchema: decision.offerSchemaEligible,
      canBuy: canBuy(product, now),
      intent: whatsappIntent(product, now),
    },
    expected
  );
}

const blocked = {
  indexable: false,
  robots: 'noindex, follow',
  sitemap: false,
  productSchema: false,
  offerSchema: false,
  canBuy: false,
  intent: 'confirm',
};

test('pending to reviewed purchasable transition couples robots, sitemap, schemas and order intent', () => {
  assertPublication(fixture, review(fixture), blocked);
  // A purchasable flag cannot substitute for commercial approval.
  const premature = { ...fixture, purchasable: true };
  assertPublication(premature, review(premature), blocked);
  const approved = { ...premature, approval: 'approved' };
  assertPublication(approved, review(approved), {
    indexable: true,
    robots: 'index, follow',
    sitemap: true,
    productSchema: true,
    offerSchema: true,
    canBuy: true,
    intent: 'order',
  });
  // Withdrawal must immediately restore the pending protections.
  const withdrawn = { ...approved, approval: 'pending' };
  assertPublication(withdrawn, review(withdrawn), blocked);
});

test('a quote or stock refresh alone never promotes pending commercial content', () => {
  const refreshed = { ...fixture, date: '2026-11-05', stock: 'in-stock' };
  assertPublication(refreshed, review(refreshed), blocked);
});

test('actual metadata, sitemap and schema consumers retain the shared publication decision', () => {
  const page = readFileSync('src/app/tool/[slug]/page.tsx', 'utf8');
  const sitemap = readFileSync('src/app/sitemap.ts', 'utf8');
  assert.match(page, /const publication = productPublication\(p\)/);
  assert.match(page, /robots: publication\.indexable/);
  assert.match(page, /publication\.productSchemaEligible &&/);
  assert.match(page, /publication\.offerSchemaEligible/);
  assert.match(sitemap, /filter\(\(p\) => productPublication\(p\)\.sitemapEligible\)/);
});
