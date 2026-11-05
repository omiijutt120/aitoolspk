import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { collectionSlug } from '../src/lib/catalog-identity.mjs';

const posts = JSON.parse(readFileSync('data/blog/posts.json', 'utf8'));
const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8'));
const collections = new Set(
  catalog.filter((p) => p.approval !== 'excluded').map(collectionSlug)
);

test('editorial articles have real catalog destinations, unique sections and attributable sources', () => {
  assert.ok(posts.length > 0);
  assert.equal(new Set(posts.map((p) => p.slug)).size, posts.length);
  assert.equal(new Set(posts.map((p) => p.title)).size, posts.length);
  for (const post of posts) {
    assert.ok(collections.has(post.collection), post.collection);
    assert.match(post.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(post.checked >= post.published);
    assert.match(post.checked, /^\d{4}-\d{2}-\d{2}$/);
    const ids = [
      'quick-answer',
      'plans',
      'questions',
      'sources',
      ...post.sections.map((s) => s.id),
    ];
    assert.equal(new Set(ids).size, ids.length, post.slug);
    assert.ok(
      post.answer &&
        post.description &&
        post.questions.length &&
        post.sources.length
    );
    for (const source of post.sources) {
      const url = new URL(source.href);
      assert.equal(url.protocol, 'https:');
      assert.ok(!url.searchParams.has('utm_source'));
    }
  }
});
