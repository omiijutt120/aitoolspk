import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateSchemas } from '../scripts/seo/schema.mjs';

const URL = 'https://aitoolspk.tech/blog/example/';

const post = (overrides = {}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'A post',
  image: ['https://aitoolspk.tech/og/blog/example.png'],
  datePublished: '2026-10-19T00:00:00+05:00',
  dateModified: '2026-10-24T00:00:00+05:00',
  author: { '@type': 'Person', name: 'Muhammad Umar' },
  publisher: { '@id': 'https://aitoolspk.tech/#organization' },
  ...overrides,
});

test('accepts a complete BlogPosting', () => {
  assert.deepEqual(validateSchemas([post()], URL), []);
});

test('rejects a BlogPosting with no image', () => {
  const problems = validateSchemas([post({ image: undefined })], URL);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /BlogPosting\)\.image: missing/);
});

test('rejects a Person with no name', () => {
  const problems = validateSchemas(
    [post({ author: { '@type': 'Person', url: 'https://aitoolspk.tech/' } })],
    URL
  );
  assert.equal(problems.length, 1);
  assert.match(problems[0], /Person\)\.name: missing/);
});

test('rejects a relative URL where an absolute one is required', () => {
  const problems = validateSchemas([post({ image: ['/og/blog/example.png'] })], URL);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /expected absolute URL/);
});

test('rejects a non-ISO date', () => {
  const problems = validateSchemas([post({ dateModified: '24 October 2026' })], URL);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /expected ISO 8601 date/);
});

test('rejects an empty list', () => {
  const problems = validateSchemas([post({ image: [] })], URL);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /image: empty list/);
});

test('allows a reference-only publisher node', () => {
  assert.deepEqual(
    validateSchemas(
      [
        post(),
        { '@id': 'https://aitoolspk.tech/#organization' },
        { '@type': 'Organization', '@id': 'https://aitoolspk.tech/#organization' },
      ],
      URL
    ),
    []
  );
});

test('validates an @graph container', () => {
  const problems = validateSchemas(
    [
      {
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'WebSite', name: 'AiToolsPk', url: 'https://aitoolspk.tech' },
          { '@type': 'Organization', name: '' },
        ],
      },
    ],
    URL
  );
  assert.equal(problems.length, 2);
  assert.match(problems[0], /Organization\)\.name: expected non-empty text/);
  assert.match(problems[1], /Organization\)\.url: missing/);
});

test('flags an unmapped type instead of passing it silently', () => {
  const problems = validateSchemas([{ '@type': 'Recipe', name: 'x' }], URL);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /unmapped @type Recipe/);
});

test('flags a page that ships no JSON-LD at all', () => {
  assert.deepEqual(validateSchemas([], URL), [
    `${URL}: no JSON-LD blocks`,
  ]);
});

test('accepts the HowTo the order page emits', () => {
  const howTo = {
    '@type': 'HowTo',
    name: 'How to order',
    step: [
      { '@type': 'HowToStep', position: 1, name: 'One', text: 'Do one thing.' },
      { '@type': 'HowToStep', position: 2, name: 'Two', text: 'Do another.' },
    ],
  };
  assert.deepEqual(validateSchemas([howTo], URL), []);
});

test('accepts a SearchAction target written as an EntryPoint', () => {
  const website = {
    '@type': 'WebSite',
    name: 'AiToolsPk',
    url: 'https://aitoolspk.tech',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://aitoolspk.tech/tools/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
  assert.deepEqual(validateSchemas([website], URL), []);
});
