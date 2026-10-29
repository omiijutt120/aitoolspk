import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { isGoogleVerificationAsset } from '../scripts/seo/verification-assets.mjs';
import { inspectExport } from '../scripts/seo/html.mjs';

const filename = 'googledbe28a935a0df515.html';
const token = `google-site-verification: ${filename}`;

test('public ownership file contains the Google token without page markup', () => {
  assert.equal(readFileSync(`public/${filename}`, 'utf8'), token);
});

test('only root Google files with a matching complete token bypass page SEO checks', () => {
  assert.equal(isGoogleVerificationAsset(filename, token), true);
  assert.equal(isGoogleVerificationAsset(filename, `${token}\n`), true);
  for (const [name, contents] of [
    [`nested/${filename}`, token],
    ['index.html', token],
    [filename, 'google-site-verification: google000.html'],
    [filename, `${token}<h1>Unexpected page</h1>`],
    [filename, `<html>${token}</html>`],
  ])
    assert.equal(isGoogleVerificationAsset(name, contents), false);
});

test('export inspection keeps ordinary pages and malformed Google files in the audit', async () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'aitoolspk-verification-'));
  try {
    writeFileSync(path.join(directory, filename), token);
    writeFileSync(path.join(directory, 'index.html'), '<h1>Website</h1>');
    writeFileSync(
      path.join(directory, 'google000.html'),
      '<h1>Needs an audit</h1>'
    );
    const pages = await inspectExport(directory, 'https://aitoolspk.tech');
    assert.deepEqual(pages.map((page) => page.url).sort(), [
      'https://aitoolspk.tech/',
      'https://aitoolspk.tech/google000.html',
    ]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
