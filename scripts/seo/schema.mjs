/**
 * Structural validation for the JSON-LD this site emits.
 *
 * `inspectHtml` already proves each block parses; this proves each block says
 * what its `@type` promises. A parse-only check let two regressions through in
 * earlier rounds — an `Article` with no `image` and a `Person` with no `name` —
 * because JSON that parses still fails when Google reads it as a rich result.
 *
 * Deliberately narrow: it checks the required properties of the types actually
 * emitted here, plus the shape rules that are cheap to get wrong (absolute URLs,
 * ISO dates, non-empty strings, reference-only nodes). It is not a Schema.org
 * conformance suite and does not claim to be.
 */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;

/** Properties each type cannot ship without, and what shape they must take. */
const REQUIRED = {
  Organization: { name: 'text', url: 'url' },
  WebSite: { name: 'text', url: 'url' },
  WebPage: { name: 'text', url: 'url' },
  AboutPage: { name: 'text', url: 'url' },
  ContactPage: { name: 'text', url: 'url' },
  CollectionPage: { name: 'text', url: 'url' },
  ProfilePage: { name: 'text', url: 'url', mainEntity: 'node' },
  Blog: { name: 'text', url: 'url' },
  BlogPosting: {
    headline: 'text',
    image: 'url-list',
    datePublished: 'date',
    dateModified: 'date',
    author: 'node',
    publisher: 'node',
  },
  Article: {
    headline: 'text',
    image: 'url-list',
    datePublished: 'date',
    dateModified: 'date',
    author: 'node',
    publisher: 'node',
  },
  HowTo: { name: 'text', step: 'node-list' },
  HowToStep: { text: 'text' },
  Product: { name: 'text', image: 'url-list', offers: 'node' },
  SoftwareApplication: {
    name: 'text',
    applicationCategory: 'text',
    operatingSystem: 'text',
    url: 'url',
  },
  Offer: { price: 'number', priceCurrency: 'text', availability: 'text' },
  BreadcrumbList: { itemListElement: 'node-list' },
  ItemList: { itemListElement: 'node-list' },
  ListItem: { position: 'number' },
  Person: { name: 'text' },
  ImageObject: { url: 'url' },
  Country: { name: 'text' },
  ContactPoint: { contactType: 'text' },
  EntryPoint: { urlTemplate: 'text' },
  SearchAction: { target: 'node-or-url', 'query-input': 'text' },
  SpeakableSpecification: {},
};

const EMPTYABLE = new Set(['review', 'aggregateRating']);

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isAbsolute(value) {
  return typeof value === 'string' && /^https?:\/\//.test(value);
}

/** A node that carries only `@id` (and optionally its type) is a reference. */
function isReference(node) {
  return (
    isPlainObject(node) &&
    '@id' in node &&
    Object.keys(node).every((key) => key === '@id' || key === '@type')
  );
}

/**
 * @returns {string[]} human-readable problems, empty when the page is clean
 */
export function validateSchemas(blocks, url) {
  const problems = [];
  const registered = new Set();

  const collect = (node) => {
    if (Array.isArray(node)) {
      node.forEach(collect);
      return;
    }
    if (!isPlainObject(node)) return;
    for (const [key, value] of Object.entries(node)) {
      if (key === '@context') continue;
      if (key === '@graph' || key === 'mainEntity' || key === 'author') {
        collect(value);
        if (Array.isArray(value)) value.forEach(collect);
        continue;
      }
      if (value && typeof value === 'object') collect(value);
    }
    const id = node['@id'];
    if (typeof id === 'string') registered.add(id);
  };

  const check = (node, path) => {
    if (Array.isArray(node)) {
      node.forEach((child, index) => check(child, `${path}[${index}]`));
      return;
    }
    if (!isPlainObject(node) || isReference(node)) return;
    const types = [node['@type']].flat().filter(Boolean);
    /** Properties the shape rules already judged; the generic sweep below
     *  would otherwise report the same empty array a second time. */
    const handled = new Set();
    for (const type of types) {
      const rules = REQUIRED[type];
      if (!rules) {
        problems.push(`${path}: unmapped @type ${type}`);
        continue;
      }
      for (const [property, shape] of Object.entries(rules)) {
        handled.add(property);
        const value = node[property];
        const at = `${path} (${type}).${property}`;
        if (value === undefined || value === null) {
          problems.push(`${at}: missing`);
          continue;
        }
        if (shape === 'text' && (typeof value !== 'string' || !value.trim())) {
          problems.push(`${at}: expected non-empty text`);
          continue;
        }
        if (shape === 'url' && !isAbsolute(value)) {
          problems.push(`${at}: expected absolute URL, got ${JSON.stringify(value)}`);
          continue;
        }
        if (shape === 'date' && !ISO_DATE.test(String(value))) {
          problems.push(`${at}: expected ISO 8601 date, got ${JSON.stringify(value)}`);
          continue;
        }
        if (shape === 'number' && typeof value !== 'number') {
          problems.push(`${at}: expected a number, got ${JSON.stringify(value)}`);
          continue;
        }
        if (shape === 'node' && !isPlainObject(value) && !Array.isArray(value)) {
          problems.push(`${at}: expected an object`);
          continue;
        }
        if (shape === 'node-or-url') {
          const candidate = isPlainObject(value) ? value.urlTemplate : value;
          if (!isPlainObject(value) && !isAbsolute(value)) {
            problems.push(`${at}: expected an object or absolute URL`);
            continue;
          }
          if (isPlainObject(value) && typeof candidate !== 'string') {
            problems.push(`${at}: expected an object carrying a URL template`);
            continue;
          }
        }
        if (shape === 'url-list') {
          const list = [value].flat();
          if (!list.length) problems.push(`${at}: empty list`);
          list.forEach((entry, index) => {
            const candidate = isPlainObject(entry) ? entry.url : entry;
            if (!isAbsolute(candidate))
              problems.push(
                `${at}[${index}]: expected absolute URL, got ${JSON.stringify(candidate)}`
              );
          });
        }
        if (shape === 'node-list') {
          const list = [value].flat();
          if (!list.length) problems.push(`${at}: empty list`);
          list.forEach((entry, index) => {
            if (!isPlainObject(entry))
              problems.push(`${at}[${index}]: expected an object`);
          });
        }
      }
    }
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith('@')) continue;
      if (value === undefined && !handled.has(key))
        problems.push(`${path}: property ${key} is undefined`);
      if (value === null && !EMPTYABLE.has(key) && !handled.has(key))
        problems.push(`${path}: property ${key} is null`);
      if (Array.isArray(value) && value.length === 0 && !handled.has(key))
        problems.push(`${path}: property ${key} is an empty array`);
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === '@context' || key === '@type') continue;
      if (value && typeof value === 'object') {
        const children = Array.isArray(value) ? value : [value];
        children.forEach((child, index) => {
          if (!isPlainObject(child)) return;
          const childPath = Array.isArray(value)
            ? `${path}.${key}[${index}]`
            : `${path}.${key}`;
          if (typeof child['@type'] === 'string') check(child, childPath);
        });
      }
    }
  };

  blocks.forEach(collect);
  blocks.forEach((block, index) => {
    if (Array.isArray(block)) {
      block.forEach((node, nodeIndex) => check(node, `block ${index}[${nodeIndex}]`));
      return;
    }
    if (isPlainObject(block) && Array.isArray(block['@graph'])) {
      block['@graph'].forEach((node, nodeIndex) =>
        check(node, `block ${index}.@graph[${nodeIndex}]`)
      );
      return;
    }
    check(block, `block ${index}`);
  });

  if (!blocks.length) problems.push('no JSON-LD blocks');

  return problems.map((problem) => `${url}: ${problem}`);
}

export const REQUIRED_TYPES = Object.keys(REQUIRED);
