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

test('category hub titles are unique and inside the rendered 65-character limit', () => {
  const rendered = categories.map((category) => category.title + SUFFIX);
  assert.equal(
    new Set(rendered).size,
    rendered.length,
    `duplicate category titles: ${rendered.join(' / ')}`
  );
  for (const category of categories) {
    const title = category.title + SUFFIX;
    assert.ok(
      title.length <= 65,
      `${category.slug}: ${title.length} chars — ${title}`
    );
    // The browser suite holds audited landing pages to 60 rendered characters.
    assert.ok(
      title.length <= 60,
      `${category.slug}: hub title ${title.length} chars exceeds the audited 60 — ${title}`
    );
    assert.ok(
      category.title.length >= 30,
      `${category.slug}: title too short (${category.title.length} chars)`
    );
    assert.notEqual(
      category.title,
      category.name,
      `${category.slug}: title must say more than the bare category name`
    );
    const paginated = `${category.name} in Pakistan - Page 2${SUFFIX}`;
    assert.ok(
      paginated.length <= 65,
      `${category.slug}: paginated title ${paginated.length} chars — ${paginated}`
    );
    assert.ok(
      category.h1.length >= 15 && category.h1.length <= 70,
      `${category.slug}: H1 ${category.h1.length} chars — ${category.h1}`
    );
    assert.ok(
      !/\btools tools\b/i.test(category.h1),
      `${category.slug}: H1 doubles "tools" — ${category.h1}`
    );
  }
  const headings = categories.map((category) => category.h1);
  assert.equal(
    new Set(headings).size,
    headings.length,
    `duplicate category H1s: ${headings.join(' / ')}`
  );
});
