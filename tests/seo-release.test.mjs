import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

test('the sole publishing workflow uses locked installs, Node24 project runtime, release/browser gates and out export', () => {
  assert.equal(
    existsSync('.github/workflows/nextjs.yml'),
    false,
    'Retired auto-basePath template must not return'
  );
  const workflow = readFileSync('.github/workflows/pages.yml', 'utf8');
  assert.match(workflow, /workflow_dispatch/);
  assert.match(workflow, /node-version-file: \.nvmrc/);
  assert.equal(readFileSync('.nvmrc', 'utf8').trim(), '24');
  for (const command of [
    'npm ci',
    'npm run launch:check',
    'npm run test:browser',
    'path: out',
  ])
    assert.ok(workflow.includes(command));
  assert.doesNotMatch(
    workflow,
    /static_site_generator:\s*next|node-version:\s*["']?20/
  );
});

test('custom-domain config stays static and does not add repository basePath or assetPrefix', () => {
  const config = readFileSync('next.config.ts', 'utf8');
  assert.match(config, /output:\s*'export'/);
  assert.match(config, /trailingSlash:\s*true/);
  assert.doesNotMatch(config, /basePath\s*:|assetPrefix\s*:/);
});
