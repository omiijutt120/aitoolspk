/**
 * The person answerable for the catalogue pages.
 *
 * One record, used by four places: the byline on a collection guide, the
 * `author` field of the CollectionPage JSON-LD, the `author` on every blog post
 * and guide, and the /author/<slug>/ page that name links to. Change it here
 * and all four follow.
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
  /** First day this person worked on the catalogue, from repository history. */
  since: string;
  basedIn: string;
  /** Subjects this person actually edits. Used for Person.knowsAbout. */
  knowsAbout: string[];
  profiles: { label: string; url: string }[];
  /** ISO date this record was last reviewed, not the build date. */
  reviewed: string;
};

export const author: Author = {
  slug: 'muhammad-umar',
  name: 'Muhammad Umar',
  role: 'Catalogue editor',
  bio: 'Keeps the AiToolsPk plan catalogue in order: confirming listed durations, PKR quotes and warranty labels, and writing the buying guides that explain what to check before paying.',
  since: '2026-10-19',
  basedIn: 'Pakistan',
  knowsAbout: [
    'AI subscription plans',
    'PKR pricing for digital tools',
    'Seller warranty terms',
    'Buying guides for Pakistan',
  ],
  profiles: [{ label: 'GitHub', url: 'https://github.com/omiijutt120' }],
  reviewed: '2026-11-07',
};

export const authorPath = `/author/${author.slug}/`;

/** Shared Person node so the author page, posts and guides resolve to one entity. */
export function authorSchema(origin: string) {
  return {
    '@type': 'Person',
    '@id': `${origin}/#author-${author.slug}`,
    name: author.name,
    url: `${origin}${authorPath}`,
    jobTitle: author.role,
    description: author.bio,
    knowsAbout: author.knowsAbout,
    sameAs: author.profiles.map((profile) => profile.url),
    worksFor: { '@id': `${origin}/#organization` },
  };
}
