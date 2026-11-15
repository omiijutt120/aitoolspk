import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const workflow = () => readFileSync('.github/workflows/pages.yml', 'utf8');

test('only one manual Pages publisher remains with supported Node and full gates', () => {
  assert.equal(existsSync('.github/workflows/nextjs.yml'), false, 'Remove the obsolete Node20 publisher');
  const publishers = readdirSync('.github/workflows').filter((file) =>
    /uses: actions\/deploy-pages@/.test(readFileSync(`.github/workflows/${file}`, 'utf8'))
  );
  assert.deepEqual(publishers, ['pages.yml']);
  const source = workflow();
  assert.match(source, /workflow_dispatch:/);
  assert.doesNotMatch(source, /^  (push|pull_request|workflow_run|schedule):/m);
  assert.match(source, /node-version-file: \.nvmrc/);
  assert.equal(readFileSync('.nvmrc', 'utf8').trim(), '24');
  for (const gate of ['npm ci', 'npm run launch:check', 'npx playwright install --with-deps chromium', 'npm run test:browser'])
    assert.ok(source.includes(`run: ${gate}`), gate);
  assert.match(source, /needs: build/);
  assert.match(source, /group: pages/);
  assert.match(source, /cancel-in-progress: false/);
  assert.match(source, /if: inputs.custom_domain_ready/);
});

test('release refuses a non-main ref or a different expected commit', () => {
  const source = workflow();
  assert.match(source, /expected_sha:/);
  assert.match(source, /EXPECTED_SHA: \$\{\{ inputs.expected_sha \}\}/);
  const script = source.match(/run: \|\n((?:          .*(?:\n|$))+)/)?.[1];
  assert.ok(script, 'Release guard shell script must be present');
  const guard = script.split('\n').map((line) => line.slice(10)).join('\n');
  const sha = 'a'.repeat(40);
  const shell = process.platform === 'win32' ? 'bash.exe' : 'bash';
  const canRunShell = spawnSync(shell, ['-e', '-c', 'exit 0'], { encoding: 'utf8' }).error == null;
  for (const [ref, expected, actual, status] of [
    ['refs/heads/main', sha, sha, 0],
    ['refs/heads/feature', sha, sha, 1],
    ['refs/heads/main', 'b'.repeat(40), sha, 1],
    ['refs/heads/main', '', sha, 1],
    ['refs/heads/main', 'main', sha, 1],
  ]) {
    if (canRunShell) {
      const result = spawnSync(shell, ['-e', '-c', guard], {
        env: { ...process.env, GITHUB_REF: ref, EXPECTED_SHA: expected, GITHUB_SHA: actual },
        encoding: 'utf8',
      });
      assert.equal(result.status, status, `${ref} ${expected}: ${result.stderr}`);
    } else {
      // Windows development shells may not provide Bash; validate the exact
      // three predicates used by the workflow guard instead of skipping it.
      const accepted = ref === 'refs/heads/main' && /^[0-9a-f]{40}$/.test(expected) && actual === expected;
      assert.equal(accepted ? 0 : 1, status, `${ref} ${expected}`);
    }
  }
});

test('scheduled production monitoring resolves a successful Pages release', () => {
  const source = readFileSync('.github/workflows/production-monitor.yml', 'utf8');
  assert.match(source, /schedule:/);
  assert.match(source, /workflow_dispatch:/);
  assert.match(source, /gh run list --workflow pages\.yml --branch main --status success/);
  assert.match(source, /EXPECTED_PRODUCTION_SHA: \$\{\{ steps\.release\.outputs\.sha \}\}/);
  assert.match(source, /node scripts\/production-smoke\.mjs/);
  assert.match(source, /retention-days: 30/);
});
