import raw from '../../data/blog/posts.json';
import { products } from './catalog';
import { groupCollections } from './collections';
import { laterPages, pagePath } from './pagination';

export type BlogPost = {
  slug: string;
  collection: string;
  topic: string;
  title: string;
  description: string;
  published: string;
  checked: string;
  answer: string;
  sections: {
    id: string;
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
  questions: { question: string; answer: string }[];
  sources: { label: string; href: string }[];
};

export const blogPosts: BlogPost[] = raw;
export const blogCollections = groupCollections(products);
export const blogPostBySlug = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);
export const blogPostForCollection = (slug: string) =>
  blogPosts.find((post) => post.collection === slug);
/**
 * Every article filed under a collection, in editorial order. The first one
 * leads the block on the collection page; the rest are listed so a price or
 * comparison article is not stranded behind whichever workflow post happens to
 * come first in `posts.json`.
 */
export const blogPostsForCollection = (slug: string) =>
  blogPosts.filter((post) => post.collection === slug);
export const blogReviewed = blogPosts
  .map((p) => p.checked)
  .sort()
  .at(-1)!;
export const blogPageParams = () =>
  laterPages(blogCollections.length).map((page) => ({ page }));
export const blogDirectoryPaths = () => [
  '/blog/',
  ...laterPages(blogCollections.length).map((page) =>
    pagePath('/blog/', Number(page))
  ),
];
export function readingMinutes(post: BlogPost) {
  const text = [
    post.answer,
    ...post.sections.flatMap((s) => [
      s.heading,
      ...s.paragraphs,
      ...(s.bullets || []),
    ]),
    ...post.questions.flatMap((q) => [q.question, q.answer]),
  ].join(' ');
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}
export function blogDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}
