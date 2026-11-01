import type { Product } from './types';
export type EditorialReview = {
  reviewedAt?: string;
  contentFingerprint?: string;
  distinctIntent?: boolean;
  usefulContent?: boolean;
  publication?: 'hold' | 'ready';
};
export type PublicationDecision = {
  state:
    | 'APPROVED_INDEXABLE'
    | 'INFORMATIONAL_NOINDEX'
    | 'NEEDS_REVIEW'
    | 'EXCLUDED';
  indexable: boolean;
  robots: string;
  sitemapEligible: boolean;
  productSchemaEligible: boolean;
  offerSchemaEligible: boolean;
  contentFingerprint: string;
  reasons: string[];
};
export const PUBLICATION_STATES: readonly string[];
export function unspecified(value: unknown): boolean;
export function contentFingerprint(product: Product): string;
export function publicationDecision(
  product: Product,
  review?: EditorialReview,
  now?: Date
): PublicationDecision;
export function productSearchCopy(product: Product): {
  title: string;
  description: string;
  h1: string;
};
