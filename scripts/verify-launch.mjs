import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';

const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run this check with npm run launch:check');
const results = [];
mkdirSync('reports', { recursive: true });
function run(name, args) {
  const started = Date.now();
  const r = spawnSync(process.execPath, args, { stdio: 'inherit' });
  results.push({
    check: name,
    passed: r.status === 0,
    seconds: Math.round((Date.now() - started) / 100) / 10,
  });
  writeFileSync(
    'reports/launch-check.json',
    JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2) +
      '\n'
  );
  if (r.error || r.status !== 0) process.exit(r.status || 1);
}
for (const script of ['check:repo', 'lint', 'typecheck', 'test'])
  run(script, [npmCli, 'run', script]);
const audit = spawnSync(process.execPath, [npmCli, 'audit', '--json'], {
  encoding: 'utf8',
});
if (audit.error) throw audit.error;
const full = JSON.parse(audit.stdout);
if (full.error)
  throw new Error(
    'Dependency advisory service is unavailable; retry before release'
  );
writeFileSync(
  'reports/launch-dependency-audit.json',
  JSON.stringify(full, null, 2) + '\n'
);
const findings = Object.entries(full.vulnerabilities || {});
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
// These packages are used only by linting or the local export server.
// Revisit this narrow exception when their upstream dependency chains update.
const allowedDevChain = new Set([
  'braces',
  'micromatch',
  'fast-glob',
  '@eslint-community/eslint-utils',
  '@eslint/config-array',
  '@eslint/eslintrc',
  '@next/eslint-plugin-next',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  '@typescript-eslint/type-utils',
  '@typescript-eslint/typescript-estree',
  '@typescript-eslint/utils',
  'eslint',
  'eslint-config-next',
  'eslint-plugin-import',
  'eslint-plugin-jsx-a11y',
  'eslint-plugin-react',
  'eslint-plugin-react-hooks',
  'minimatch',
  'serve',
  'serve-handler',
  'typescript-eslint',
]);
const reviewedAdvisories = new Set([
  'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm',
  'https://github.com/advisories/GHSA-g3hv-75wg-m249',
]);
const knownOnly = findings.every(
  ([name, v]) =>
    allowedDevChain.has(name) &&
    v.severity !== 'critical' &&
    v.nodes.every((node) => lock.packages[node]?.dev === true) &&
    v.via.every(
      (via) =>
        typeof via === 'string' ||
        reviewedAdvisories.has(via.url)
    )
);
results.push({
  check: 'full dependency audit',
  passed: findings.length === 0 || knownOnly,
  clean: findings.length === 0,
  acceptedBuildToolException: findings.length > 0 && knownOnly,
  reviewedAdvisoryUrls: [...reviewedAdvisories],
  advisoryPackages: findings.map(([name]) => name),
});
if (findings.length && !knownOnly)
  throw new Error(
    'New or production dependency advisory requires review; see reports/launch-dependency-audit.json'
  );
if (findings.length)
  console.warn(
    'Reviewed development-tool-only advisory remains; see LAUNCH_CHECKLIST.md. No production or unreviewed advisory is accepted.'
  );
run('production dependency audit', [
  npmCli,
  'audit',
  '--omit=dev',
  '--audit-level=moderate',
]);
run('build', [npmCli, 'run', 'build']);
run('export routes and public fields', ['scripts/check-export.mjs']);
run('HTML fragments and duplicate IDs', ['scripts/seo/check-fragments.mjs']);
console.log(
  'Automated launch checkpoints passed. Complete owner and domain checkpoints in LAUNCH_CHECKLIST.md before claiming a public domain launch.'
);
