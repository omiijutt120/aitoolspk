import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8')).filter(
  (p) => p.approval !== 'excluded'
);
let pageCount = 0,
  links = 0,
  seoPages = 0,
  structuredDataBlocks = 0,
  externalLinks = 0;
const origin = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://aitoolspk.tech'
).replace(/\/$/, '');
const publicPaths = new Set();
const checked = new Set();
const broken = [];
const canonicals = new Map();
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
      const pagePath = '/' + path.relative('out', file).replaceAll('\\', '/');
      const errorPage = /(?:^|\/)(?:404|_not-found)(?:\/|\.html)/.test(
        pagePath
      );
      if (!errorPage) {
        if ((html.match(/<h1(?:\s[^>]*)?>/g) || []).length !== 1)
          throw new Error(`Expected one H1: ${file}`);
        if (
          !/<title>[^<]+<\/title>/.test(html) ||
          !/<meta name="description" content="[^" ]/.test(html)
        )
          throw new Error(`Missing page metadata: ${file}`);
        const expectedUrl = origin + pagePath.replace(/index\.html$/, '');
        const head = /<head\b[^>]*>([\s\S]*?)<\/head>/.exec(html)?.[1] || '';
        const canonicalTags = [
          ...html.matchAll(/<link\b[^>]*\brel="canonical"[^>]*>/g),
        ];
        const headTags = [
          ...head.matchAll(/<link\b[^>]*\brel="canonical"[^>]*>/g),
        ];
        if (canonicalTags.length !== 1 || headTags.length !== 1)
          throw new Error(`Expected exactly one canonical in head: ${file}`);
        const canonical = /\bhref="([^"]+)"/.exec(headTags[0][0])?.[1];
        if (canonical !== expectedUrl)
          throw new Error(`Incorrect canonical: ${file}`);
        const url = new URL(canonical);
        if (
          url.protocol !== 'https:' ||
          url.search ||
          url.hash ||
          !url.pathname.endsWith('/')
        )
          throw new Error(`Non-clean canonical: ${file}`);
        if (!head.includes(`<meta property="og:url" content="${canonical}"`))
          throw new Error(`Open Graph disagrees with canonical: ${file}`);
        const noindex =
          /<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/.test(head);
        if (canonicals.has(canonical))
          throw new Error(`Duplicate canonical target: ${file}`);
        canonicals.set(canonical, { file, noindex });
        seoPages++;
      }
      for (const match of html.matchAll(
        /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
      )) {
        JSON.parse(match[1]);
        structuredDataBlocks++;
      }
      for (const match of html.matchAll(/<a\b([^>]+)>/g)) {
        const attrs = match[1];
        const href = /\bhref="([^"]*)"/.exec(attrs)?.[1];
        if (href === '#' || /^javascript:/i.test(href || ''))
          throw new Error(`Placeholder link: ${file}`);
        if (href?.startsWith('#') && !html.includes(`id="${href.slice(1)}"`))
          throw new Error(`Missing anchor: ${file}`);
        if (/\btarget="_blank"/.test(attrs)) {
          const rel = /\brel="([^"]*)"/.exec(attrs)?.[1] || '';
          if (!rel.includes('noopener') || !rel.includes('noreferrer'))
            throw new Error(`Unsafe external link: ${file}`);
          externalLinks++;
        }
      }
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
const sitemap = readFileSync('out/sitemap.xml', 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => m[1]
);
if (new Set(sitemapUrls).size !== sitemapUrls.length)
  throw new Error('Duplicate sitemap entries');
for (const url of sitemapUrls) {
  const target = canonicals.get(url);
  if (!target || target.noindex)
    throw new Error(`Sitemap target missing, noncanonical or noindex: ${url}`);
}
for (const [url, page] of canonicals)
  if (!page.noindex && !sitemapUrls.includes(url))
    throw new Error(`Indexable canonical absent from sitemap: ${url}`);
if (/Disallow:\s*\/tools\/\?/.test(readFileSync('out/robots.txt', 'utf8')))
  throw new Error(
    'Filtered copies blocked before crawlers can read their canonical'
  );
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
  seoPages,
  structuredDataBlocks,
  externalLinks,
  canonicalPages: canonicals.size,
  indexableSitemapUrls: sitemapUrls.length,
  paginatedCanonicalPages: [...canonicals.keys()].filter((url) =>
    /\/page\/\d+\/$/.test(url)
  ).length,
};
mkdirSync('reports', { recursive: true });
writeFileSync('reports/export-check.json', JSON.stringify(report, null, 2));
console.log(report);
