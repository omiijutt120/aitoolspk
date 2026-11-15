import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const gsc = new Map(
  [
    ['/', 120, 3, '2.50%', 5.12],
    ['/price-index/', 827, 0, '0%', 6.88],
    ['/plans/netflix/', 434, 1, '0.23%', 11.44],
    ['/plans/wink/', 11, 2, '18.18%', 7.27],
    ['/plans/chatgpt/', 20, 0, '0%', 6.85],
    ['/plans/adobe/', 16, 0, '0%', 22.31],
    ['/faq/', 12, 0, '0%', 11.42],
  ].map(([p, impressions, clicks, ctr, position]) => [
    p,
    { impressions, clicks, ctr, position },
  ])
);

const sitemap = readFileSync('out/sitemap.xml', 'utf8');
const sitemapUrls = new Set(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname
  )
);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, out);
    else if (entry.name.endsWith('.html')) out.push(file);
  }
  return out;
}

function typeOf(route) {
  if (route === '/') return 'homepage';
  if (route === '/price-index/') return 'price-index';
  if (route === '/tools/' || route.startsWith('/tools/page/'))
    return 'tool-directory';
  if (/^\/plans\/[^/]+\/page\/\d+\/$/.test(route))
    return 'collection-paginated';
  if (/^\/plans\/[^/]+\/$/.test(route)) return 'collection';
  if (/^\/category\/[^/]+\/page\/\d+\/$/.test(route))
    return 'category-paginated';
  if (/^\/category\/[^/]+\/$/.test(route)) return 'category';
  if (/^\/tool\/[^/]+\/$/.test(route)) return 'product-detail';
  if (route === '/blog/' || route.startsWith('/blog/page/'))
    return 'blog-index';
  if (/^\/blog\/[^/]+\/$/.test(route)) return 'blog-article';
  if (route === '/guides/') return 'guide-index';
  if (/^\/guides\/[^/]+\/$/.test(route)) return 'guide';
  return 'static';
}

function actionFor(route, type, indexable) {
  const row = gsc.get(route);
  if (type === 'product-detail')
    return 'Noindex, absent from sitemap. Keep noindex: 817/817 quotes dated 2026-10-19, 0 approving reviews.';
  if (route === '/price-index/')
    return 'Fixed in this branch: title names the query and currency; method + sources section added; quote dates stated.';
  if (route === '/plans/netflix/')
    return 'Snippet already leads with from-PKR and typical; constraint is average position 11.4, not the snippet.';
  if (route === '/plans/chatgpt/')
    return 'Title and snippet answer the query; page was absent from the 22-collection index probe on 2026-11-10. Owner: request indexing.';
  if (route === '/plans/adobe/')
    return 'Average position 22.3. On-page metadata already specific; needs authority/internal links, not a rewrite.';
  if (route === '/faq/')
    return 'Snippet is generic because the page answers many questions. Linked from footer; no change this round.';
  if (!indexable) return 'Not indexable by design; excluded from sitemap.';
  if (row) return 'Measured row; no change this round.';
  return 'Indexable, in sitemap; no Search Console page row was supplied for it.';
}

const rows = [];
for (const file of walk('out')) {
  const html = readFileSync(file, 'utf8');
  const relative = '/' + path.relative('out', file).replaceAll('\\', '/');
  const route = relative.replace(/index\.html$/, '');
  const isError = /(?:^|\/)(?:404|_not-found)(?:\/|\.html)/.test(relative);
  const head = /<head\b[^>]*>([\s\S]*?)<\/head>/.exec(html)?.[1] || '';
  const canonical =
    /<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/.exec(head)?.[1] || '';
  const robots =
    /<meta\b[^>]*name="robots"[^>]*content="([^"]*)"/i.exec(head)?.[1] || '';
  const indexable = !isError && !/noindex/i.test(robots);
  const title = /<title>([^<]*)<\/title>/.exec(head)?.[1] || '';
  const description =
    /<meta name="description" content="([^"]*)"/.exec(head)?.[1] || '';
  const row = gsc.get(route);
  const verificationAsset =
    !isError && !canonical && /^\/[0-9a-z]+\.html$/.test(relative);
  rows.push({
    url_path: isError ? relative : route,
    page_type: isError
      ? 'error-page'
      : verificationAsset
        ? 'verification-asset'
        : typeOf(route),
    indexable: isError || verificationAsset ? 'n/a' : indexable ? 'yes' : 'no',
    in_sitemap: sitemapUrls.has(route) ? 'yes' : 'no',
    canonical:
      canonical || '(host-root verification file, no canonical by design)',
    title_chars: title.length,
    description_chars: description.length,
    impressions: row ? row.impressions : '',
    clicks: row ? row.clicks : '',
    ctr: row ? row.ctr : '',
    avg_position: row ? row.position : '',
    action: verificationAsset
      ? 'Google Search Console verification file; not a content page.'
      : actionFor(route, typeOf(route), indexable),
  });
}

rows.sort((a, b) => a.url_path.localeCompare(b.url_path));
mkdirSync('reports', { recursive: true });
const header = Object.keys(rows[0]);
const csv = [
  header.join(','),
  ...rows.map((r) =>
    header
      .map((key) => {
        const value = String(r[key] ?? '');
        return /[",\n]/.test(value)
          ? `"${value.replaceAll('"', '""')}"`
          : value;
      })
      .join(',')
  ),
].join('\n');
writeFileSync('reports/SEO_URL_INVENTORY.csv', csv + '\n');
console.log({
  rows: rows.length,
  indexable: rows.filter((r) => r.indexable === 'yes').length,
  sitemap: rows.filter((r) => r.in_sitemap === 'yes').length,
  withGsc: rows.filter((r) => r.impressions !== '').length,
});
