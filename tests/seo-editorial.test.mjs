import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { categories } from '../src/lib/categories.ts';

// The root layout appends " | AiToolsPk" to every page title.
const SUFFIX = ' | AiToolsPk';
const posts = JSON.parse(readFileSync('data/blog/posts.json', 'utf8'));

test('blog titles stay inside the rendered 65-character limit', () => {
  for (const post of posts) {
    const rendered = post.title + SUFFIX;
    assert.ok(
      rendered.length <= 65,
      `${post.slug}: ${rendered.length} chars — ${rendered}`
    );
    assert.ok(
      post.title.length >= 30,
      `${post.slug}: title too short (${post.title.length} chars)`
    );
  }
});

test('category descriptions compose to a complete meta description', () => {
  for (const category of categories) {
    const description = `${category.description} Compare exact plans and PKR prices.`;
    assert.ok(
      description.length >= 100,
      `${category.slug}: ${description.length} chars — ${description}`
    );
    assert.ok(
      description.length <= 165,
      `${category.slug}: ${description.length} chars — ${description}`
    );
  }
});
