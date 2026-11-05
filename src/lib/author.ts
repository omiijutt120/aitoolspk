/**
 * The person answerable for the catalogue pages.
 *
 * One record, used by three places: the byline on a collection guide, the
 * `author` field of the CollectionPage JSON-LD, and the /author/<slug>/ page
 * that name links to. Change it here and all three follow.
 *
 * `profiles` must be addresses that actually resolve. They are linked visibly
 * on the author page, and the rubric behind the AI-answer audit treats a name
 * without a reachable identity page as an unverifiable byline.
 */
export type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  profiles: { label: string; url: string }[];
  /** ISO date this record was last reviewed, not the build date. */
  reviewed: string;
};

export const author: Author = {
  slug: 'muhammad-umar',
  name: 'Muhammad Umar',
  role: 'Catalogue editor',
  bio: 'Keeps the AiToolsPk plan catalogue in order: confirming listed durations, PKR quotes and warranty labels, and writing the buying guides that explain what to check before paying.',
  profiles: [{ label: 'GitHub', url: 'https://github.com/omiijutt120' }],
  reviewed: '2026-11-05',
};

export const authorPath = `/author/${author.slug}/`;
