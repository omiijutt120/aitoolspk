import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const git = (args, extra = {}) =>
  execFileSync('git', args, {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    ...extra,
  });
const tracked = git(['ls-files', '-z']).split('\0').filter(Boolean);
const untracked = git(['ls-files', '--others', '--exclude-standard', '-z'])
  .split('\0')
  .filter(Boolean);
const current = [...new Set([...tracked, ...untracked])].filter(existsSync);
const historicalNames = git(['log', '--all', '--format=', '--name-only'])
  .split(/\r?\n/)
  .filter(Boolean);
const forbiddenPath = (name) =>
  /^(?:private|reports|node_modules|out|\.next|\.tools|test-results|playwright-report)\//.test(
    name
  ) ||
  /(?:^|\/)\.env(?!\.example$)(?:\.|$)/.test(name) ||
  /\.(?:pem|key|p12|pfx)$/i.test(name);
const issues = [];
for (const name of new Set([...current, ...historicalNames])) {
  if (forbiddenPath(name))
    issues.push({ check: 'private-or-generated-path', file: name });
}
const signatures = [
  /-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{50,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/,
];
const isText = (name) =>
  /\.(?:[cm]?[jt]sx?|json|csv|md|ya?ml|txt|html|css|svg|toml|xml|example)$/.test(
    name
  ) || /(?:^|\/)(?:\.gitignore|\.nvmrc|_headers|CNAME)$/.test(name);
function scan(text, file, historical = false) {
  if (signatures.some((signature) => signature.test(text)))
    issues.push({ check: 'credential-pattern', file, historical });
  if (
    /^data\/approvals\.json$/.test(file) &&
    /"(?:authorizationEvidence|deliveryEvidence)"\s*:/.test(text)
  )
    issues.push({ check: 'private-review-evidence', file, historical });
  if (/^(?:data\/catalog|public\/catalog\/index)\.json$/.test(file)) {
    const records = JSON.parse(text);
    for (const p of records)
      if (
        [
          'Source',
          'ProductID',
          'OriginalPrice',
          'CostPKR',
          'EstimatedGrossProfitPKR',
          'PurchaseRequirements',
          'authorizationEvidence',
          'deliveryEvidence',
        ].some((key) => Object.hasOwn(p, key))
      ) {
        issues.push({ check: 'supplier-fields', file, historical });
        break;
      }
  }
}
for (const name of current)
  if (isText(name)) scan(readFileSync(name, 'utf8'), name);
// Inspect reachable text blobs without printing credential contents or supplier values.
const objects = git(['rev-list', '--objects', '--all'])
  .split(/\r?\n/)
  .flatMap((line) => {
    const match = /^([a-f0-9]{40}) (.+)$/.exec(line);
    return match && isText(match[2]) ? [{ sha: match[1], name: match[2] }] : [];
  });
if (objects.length) {
  const batch = git(['cat-file', '--batch'], {
    input: objects.map((o) => o.sha).join('\n') + '\n',
    encoding: null,
  });
  let offset = 0;
  for (const object of objects) {
    const end = batch.indexOf(10, offset);
    const header = batch.subarray(offset, end).toString('utf8').split(' ');
    const size = Number(header[2]);
    if (header[1] !== 'blob' || !Number.isSafeInteger(size))
      throw new Error('Unable to inspect Git object');
    scan(
      batch.subarray(end + 1, end + 1 + size).toString('utf8'),
      object.name,
      true
    );
    offset = end + 1 + size + 1;
  }
}
const report = {
  checkedAt: new Date().toISOString(),
  currentFiles: current.length,
  historyTextBlobs: objects.length,
  issues,
};
mkdirSync('reports', { recursive: true });
writeFileSync(
  path.join('reports', 'repository-check.json'),
  JSON.stringify(report, null, 2) + '\n'
);
console.log(
  JSON.stringify({
    currentFiles: current.length,
    historyTextBlobs: objects.length,
    issues: issues.length,
  })
);
if (issues.length) {
  console.error(
    'Repository is not ready to publish. See reports/repository-check.json (matched values are never recorded).'
  );
  process.exitCode = 1;
}
