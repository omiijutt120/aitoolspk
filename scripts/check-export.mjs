import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8')).filter(
  (p) => p.approval !== 'excluded'
);
let pageCount = 0,
  links = 0;
const publicPaths = new Set();
const checked = new Set();
const broken = [];
function collect(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(file);
    else
      publicPaths.add('/' + path.relative('out', file).replaceAll('\\', '/'));
  }
}
console.log('Checking exported routes, internal links and public data…');
collect('out');
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) {
      pageCount++;
      if (pageCount % 200 === 0)
        console.log(`Checked ${pageCount} HTML pages…`);
      const html = readFileSync(file, 'utf8');
      if (
        /"(?:OriginalPrice|CostPKR|EstimatedGrossProfitPKR|PurchaseRequirements|authorizationEvidence|deliveryEvidence)"/.test(
          html
        )
      )
        throw new Error(`Confidential field in ${file}`);
      for (const match of html.matchAll(
        /(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g
      )) {
        const url = decodeURIComponent(match[1]);
        if (url.startsWith('//')) continue;
        links++;
        if (checked.has(url)) continue;
        checked.add(url);
        if (
          !publicPaths.has(url) &&
          !publicPaths.has(url.replace(/\/$/, '') + '/index.html')
        )
          broken.push({ file, url });
      }
    }
  }
}
walk('out');
for (const p of catalog) {
  const file = `out/tool/${p.slug}/index.html`;
  if (!publicPaths.has(`/tool/${p.slug}/index.html`))
    throw new Error(`Missing offer ${p.id}`);
  const html = readFileSync(file, 'utf8');
  if (!html.includes(p.id)) throw new Error(`Wrong offer ID ${p.id}`);
  if (p.approval !== 'approved' && !html.includes('noindex'))
    throw new Error(`Unapproved offer indexable ${p.id}`);
}
if (broken.length)
  throw new Error(JSON.stringify(broken.slice(0, 20), null, 2));
const report = {
  pages: pageCount,
  productRoutes: catalog.length,
  internalReferencesChecked: links,
  uniqueTargets: checked.size,
  broken: broken.length,
  confidentialFieldsFound: 0,
};
mkdirSync('reports', { recursive: true });
writeFileSync('reports/export-check.json', JSON.stringify(report, null, 2));
console.log(report);
