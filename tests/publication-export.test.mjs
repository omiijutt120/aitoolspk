import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const checker = resolve('scripts/check-export.mjs');
const url = 'https://aitoolspk.tech/tool/synthetic-publication-fixture/';

// Synthetic gate fixtures only; never approve or edit a real commercial offer.
function checkFixture({ approval = 'pending', noindex, inSitemap, body = '', robotsContent }) {
  const dir = mkdtempSync(join(tmpdir(), 'aitoolspk-publication-export-'));
  try {
    mkdirSync(join(dir, 'data/seo'), { recursive: true });
    mkdirSync(join(dir, 'out/tool/synthetic-publication-fixture'), { recursive: true });
    writeFileSync(join(dir, 'data/seo/editorial.json'), '{}');
    writeFileSync(join(dir, 'data/catalog.json'), JSON.stringify([
      { id: 'SYNTHETIC-PUBLICATION', slug: 'synthetic-publication-fixture', approval },
    ]));
    writeFileSync(join(dir, 'out/tool/synthetic-publication-fixture/index.html'),
      `<html><head><title>Synthetic publication fixture</title><meta name="description" content="Synthetic test fixture"><link rel="canonical" href="${url}"><meta property="og:url" content="${url}"><meta name="robots" content="${robotsContent ?? (noindex ? 'noindex, follow' : 'index, follow')}"></head><body><h1>Synthetic fixture</h1>SYNTHETIC-PUBLICATION${body}</body></html>`);
    writeFileSync(join(dir, 'out/sitemap.xml'),
      `<urlset>${inSitemap ? `<url><loc>${url}</loc></url>` : ''}</urlset>`);
    writeFileSync(join(dir, 'out/robots.txt'), 'User-agent: *\nAllow: /\n');
    return spawnSync(process.execPath, [checker], { cwd: dir, encoding: 'utf8', timeout: 10000 });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('pending publication export keeps head noindex outside sitemap', () => {
  const result = checkFixture({ noindex: true, inSitemap: false });
  assert.equal(result.status, 0, result.stderr);
});

test('body noindex cannot substitute for pending publication head directive', () => {
  const result = checkFixture({ noindex: false, inSitemap: true, body: '<p>noindex is only body text</p>' });
  assert.notEqual(result.status, 0, 'Indexable pending fixture passed');
  assert.match(result.stderr, /Offer has not passed publication review/);
});

test('commercial approval without editorial review still needs head noindex', () => {
  const result = checkFixture({ approval: 'approved', noindex: false, inSitemap: true, body: '<p>noindex is only body text</p>' });
  assert.notEqual(result.status, 0, 'Unreviewed approved fixture passed');
  assert.match(result.stderr, /Offer has not passed publication review/);
});

test('head noindex target cannot enter the canonical sitemap', () => {
  const result = checkFixture({ noindex: true, inSitemap: true });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Sitemap target missing, noncanonical or noindex/);
});

test('a noindex substring is not a valid robots directive', () => {
  const result = checkFixture({ robotsContent: 'noindex-preview, follow', inSitemap: false });
  assert.notEqual(result.status, 0, 'Invalid robots token was accepted as noindex');
});

test('robots directives are case insensitive', () => {
  const result = checkFixture({ robotsContent: 'NOINDEX, FOLLOW', inSitemap: false });
  assert.equal(result.status, 0, result.stderr);
});
