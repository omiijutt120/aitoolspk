import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isGoogleVerificationAsset } from '../scripts/seo/verification-assets.mjs';

const filename = 'googledbe28a935a0df515.html';
const token = `google-site-verification: ${filename}`;

test('public ownership file preserves the exact Google verification token', () => {
  assert.equal(readFileSync(`public/${filename}`, 'utf8'), token);
});

test('only matching root-level Google tokens bypass page metadata checks', () => {
  assert.equal(isGoogleVerificationAsset(filename, token), true);
  assert.equal(isGoogleVerificationAsset(filename, `${token}\n`), true);
  for (const [name, content] of [
    [`nested/${filename}`, token],
    ['index.html', token],
    [filename, 'google-site-verification: google000.html'],
    [filename, `${token}<h1>Unexpected page</h1>`],
    [filename, `<html>${token}</html>`],
  ])
    assert.equal(isGoogleVerificationAsset(name, content), false);
});
