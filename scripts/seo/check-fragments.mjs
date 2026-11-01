import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { attrs } from './html.mjs';

// Check actual HTML IDs/anchors, excluding scripts and serialized React data.
const root = path.resolve('out');
const documents = new Map();
function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(file);
    else if (entry.name.endsWith('.html')) {
      const html = readFileSync(file, 'utf8').replace(
        /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,
        ''
      );
      const ids = [...html.matchAll(/<[a-z][^>]*>/gi)]
        .map((m) => attrs(m[0]).id)
        .filter(Boolean);
      documents.set(file, {
        ids: new Set(ids),
        duplicates: ids.filter((id, i) => ids.indexOf(id) !== i),
        links: [...html.matchAll(/<a\b([^>]*)>/gi)]
          .map((m) => attrs(m[1]).href)
          .filter(Boolean),
      });
    }
  }
}
collect(root);
let checked = 0;
const issues = [];
for (const [file, doc] of documents) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const url = new URL(
    '/' + relative.replace(/index\.html$/, ''),
    'https://aitoolspk.tech'
  );
  for (const id of doc.duplicates)
    issues.push({ file: relative, duplicateId: id });
  for (const href of doc.links) {
    const target = new URL(href, url);
    if (
      target.origin !== url.origin ||
      !target.hash ||
      target.hash.startsWith('#:~:text=')
    )
      continue;
    const pathname = decodeURIComponent(target.pathname);
    const destination = path.join(
      root,
      pathname,
      pathname.endsWith('/') ? 'index.html' : ''
    );
    if (!documents.has(destination)) continue; // Route availability is checked by check-export.
    checked++;
    const id = decodeURIComponent(target.hash.slice(1));
    if (!documents.get(destination).ids.has(id))
      issues.push({ file: relative, href, missingId: id });
  }
}
mkdirSync('reports/seo', { recursive: true });
const result = {
  checkedAt: new Date().toISOString(),
  htmlDocuments: documents.size,
  fragmentLinks: checked,
  issues,
};
writeFileSync(
  'reports/seo/fragment-check.json',
  JSON.stringify(result, null, 2)
);
console.log(JSON.stringify(result));
if (issues.length) process.exitCode = 1;
