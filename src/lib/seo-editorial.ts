import raw from '../../data/seo/editorial.json';
import {
  publicationDecision,
  type EditorialReview,
} from './seo-publication.mjs';
import type { Product } from './types';
const reviews = raw as Record<string, EditorialReview>;
export const productPublication = (product: Product) =>
  publicationDecision(product, reviews[product.id]);
