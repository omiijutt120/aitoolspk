import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const checker = resolve('scripts/check-export.mjs');
const origin = 'https://aitoolspk.tech';
const url = `${origin}/tool/synthetic-export-fixture/`;

// Synthetic HTML exercises the real export gate, not the production catalog.
// No fixture approves a real offer or changes its public business terms.
function checkFixture({ approval, noindex, inSitemap, body = '' }) {
  const dir = mkdtempSync(join(tmpdir(), 'aitoolspk-export-test-'));
  try {
    mkdirSync(join(dir, 'data'));
    mkdirSync(join(dir, 'out/tool/synthetic-export-fixture'), { recursive: true });
    writeFileSync(join(dir, 'data/catalog.json'), JSON.stringify([
      { id: 'SYNTHETIC-EXPORT-FIXTURE', slug: 'synthetic-export-fixture', approval },
    ]));
    writeFileSync(join(dir, 'out/tool/synthetic-export-fixture/index.html'),
      `<html><head><title>Synthetic fixture</title><meta name="description" content="Synthetic fixture only"><link rel="canonical" href="${url}"><meta property="og:url" content="${url}"><meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow'}"></head><body><h1>Synthetic fixture</h1>SYNTHETIC-EXPORT-FIXTURE${body}</body></html>`);
    writeFileSync(join(dir, 'out/sitemap.xml'),
      `<urlset>${inSitemap ? `<url><loc>${url}</loc></url>` : ''}</urlset>`);
    writeFileSync(join(dir, 'out/robots.txt'), 'User-agent: *\nAllow: /\n');
    return spawnSync(process.execPath, [checker], {
      cwd: dir,
      encoding: 'utf8',
      timeout: 10000,
    });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('pending export remains noindex and absent from sitemap', () => {
  const result = checkFixture({ approval: 'pending', noindex: true, inSitemap: false });
  assert.equal(result.status, 0, result.stderr);
});

test('synthetic approval transition couples indexability with sitemap membership', () => {
  const approved = checkFixture({ approval: 'approved', noindex: false, inSitemap: true });
  assert.equal(approved.status, 0, approved.stderr);
  const missing = checkFixture({ approval: 'approved', noindex: false, inSitemap: false });
  assert.notEqual(missing.status, 0);
  assert.match(missing.stderr, /Indexable canonical absent from sitemap/);
  const inconsistent = checkFixture({ approval: 'pending', noindex: true, inSitemap: true });
  assert.notEqual(inconsistent.status, 0);
  assert.match(inconsistent.stderr, /Sitemap target missing, noncanonical or noindex/);
});

test('body noindex text cannot satisfy the pending offer head directive gate', () => {
  const result = checkFixture({
    approval: 'pending', noindex: false, inSitemap: true,
    body: '<p>The word noindex here is not a robots directive.</p>',
  });
  assert.notEqual(result.status, 0, 'Unapproved offer with indexable head passed export gate');
  assert.match(result.stderr, /Unapproved offer indexable/);
});
