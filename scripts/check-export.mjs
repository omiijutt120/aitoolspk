import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { publicationDecision } from '../src/lib/seo-publication.mjs';
import { isGoogleVerificationAsset } from './seo/verification-assets.mjs';
const editorial = JSON.parse(readFileSync('data/seo/editorial.json', 'utf8'));
const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8')).filter(
  (p) => p.approval !== 'excluded'
);
let pageCount = 0,
  links = 0,
  seoPages = 0,
  structuredDataBlocks = 0,
  externalLinks = 0,
  verificationAssets = 0;
const origin = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://aitoolspk.tech'
).replace(/\/$/, '');
if (origin !== 'https://aitoolspk.tech')
  throw new Error(
    'Export must use the canonical production origin https://aitoolspk.tech'
  );
const publicPaths = new Set();
const checked = new Set();
const broken = [];
const canonicals = new Map();
const indexableTitles = new Map();
const duplicateDescriptions = [];
const indexableDescriptions = new Map();
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
      const html = readFileSync(file, 'utf8');
      const relative = path.relative('out', file).replaceAll('\\', '/');
      if (isGoogleVerificationAsset(relative, html)) {
        if (
          !readFileSync(path.join('public', relative)).equals(
            readFileSync(file)
          )
        )
          throw new Error(
            `Verification file differs from public source: ${file}`
          );
        verificationAssets++;
        continue;
      }
      pageCount++;
      if (pageCount % 200 === 0)
        console.log(`Checked ${pageCount} HTML pages…`);
      if (
        /(?:href|src)=["'](?:https:\/\/aitoolspk\.tech)?\/aitoolspk(?:\/|["'])/i.test(
          html
        )
      )
        throw new Error(`Unexpected repository base path: ${file}`);
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
        if (!noindex) {
          const title = /<title>([^<]+)<\/title>/.exec(head)?.[1];
          const description = /<meta name="description" content="([^"]+)"/.exec(
            head
          )?.[1];
          if (indexableTitles.has(title))
            throw new Error(
              `Duplicate indexable page title: ${file}, ${indexableTitles.get(title)}`
            );
          indexableTitles.set(title, file);
          if (indexableDescriptions.has(description))
            duplicateDescriptions.push({
              file,
              other: indexableDescriptions.get(description),
            });
          indexableDescriptions.set(description, file);
        }
        if (canonicals.has(canonical))
          throw new Error(`Duplicate canonical target: ${file}`);
        canonicals.set(canonical, { file, noindex });
        seoPages++;
      }
      const singletonSchemas = new Set();
      for (const match of html.matchAll(
        /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
      )) {
        const schema = JSON.parse(match[1]);
        if (
          [
            'Organization',
            'WebSite',
            'BreadcrumbList',
            'CollectionPage',
            'Product',
            'Article',
          ].includes(schema['@type'])
        ) {
          if (singletonSchemas.has(schema['@type']))
            throw new Error(`Duplicate ${schema['@type']} schema: ${file}`);
          singletonSchemas.add(schema['@type']);
        }
        if (/"@type"\s*:\s*"(?:AggregateRating|Review)"/.test(match[1]))
          throw new Error(`Unverified review/rating schema: ${file}`);
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
  const publication = publicationDecision(p, editorial[p.id]);
  if (!publication.indexable && !html.includes('noindex'))
    throw new Error(`Offer has not passed publication review ${p.id}`);
  if (
    !publication.productSchemaEligible &&
    /"@type"\s*:\s*"(?:Product|Offer)"/.test(html)
  )
    throw new Error(`Unapproved offer has purchase schema ${p.id}`);
}
if (broken.length)
  throw new Error(JSON.stringify(broken.slice(0, 20), null, 2));
const report = {
  pages: pageCount,
  verificationAssets,
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
  duplicateIndexableDescriptions: duplicateDescriptions,
};
mkdirSync('reports', { recursive: true });
writeFileSync('reports/export-check.json', JSON.stringify(report, null, 2));
console.log(report);
