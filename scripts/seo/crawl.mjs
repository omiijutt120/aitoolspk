import { inspectHtml } from './html.mjs';
import { csv, ORIGIN } from './engine.mjs';
import { writeFileSync } from 'node:fs';

export function disallowedPaths(robots) {
  let agents = [],
    directives = false;
  const rules = [];
  for (const raw of robots.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    const match = /^(user-agent|disallow|allow):\s*(.*)$/i.exec(line);
    if (!match) continue;
    if (match[1].toLowerCase() === 'user-agent') {
      if (directives) {
        agents = [];
        directives = false;
      }
      agents.push(match[2].toLowerCase());
    } else {
      directives = true;
      if (agents.includes('*') && match[2])
        rules.push({
          allow: match[1].toLowerCase() === 'allow',
          pattern: match[2],
        });
    }
  }
  return rules;
}
export function robotsAllows(pathname, rules) {
  const matches = rules
    .filter((r) => {
      const pattern = r.pattern
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replaceAll('*', '.*')
        .replace(/\\\$$/, '$');
      return new RegExp('^' + pattern).test(pathname);
    })
    .sort(
      (a, b) =>
        b.pattern.length - a.pattern.length || Number(b.allow) - Number(a.allow)
    );
  return !matches.length || matches[0].allow;
}
/** Explicit owner-site, sequential audit. Never runs during builds or publication. */
export async function crawlProduction(directory) {
  let lastStart = 0,
    requests = 0;
  const checkedAt = new Date().toISOString();
  const fetchPage = async (url) => {
    const delay = Math.max(0, 600 - (Date.now() - lastStart));
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    lastStart = Date.now();
    requests++;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'AiToolsPkOwnerSEOAudit/1.0' },
    });
    if (new URL(response.url).origin !== ORIGIN)
      throw new Error('Unexpected cross-origin redirect');
    return response;
  };
  const robotsResponse = await fetchPage(`${ORIGIN}/robots.txt`);
  if (robotsResponse.status !== 200)
    throw new Error('Cannot verify robots.txt; live crawl stopped');
  const rules = disallowedPaths(await robotsResponse.text());
  const sitemapResponse = await fetchPage(`${ORIGIN}/sitemap.xml`);
  if (sitemapResponse.status !== 200) throw new Error('Sitemap unavailable');
  const sitemapUrls = [
    ...(await sitemapResponse.text()).matchAll(/<loc>([^<]+)<\/loc>/g),
  ].map((m) => m[1]);
  const queue = [ORIGIN + '/', ...sitemapUrls],
    seen = new Set(),
    pages = [],
    robotsExcluded = [];
  for (let i = 0; i < queue.length && seen.size < 1500; i++) {
    const url = queue[i];
    const parsed = new URL(url);
    if (
      seen.has(url) ||
      parsed.origin !== ORIGIN ||
      parsed.search ||
      parsed.hash
    )
      continue;
    seen.add(url);
    if (!robotsAllows(parsed.pathname, rules)) {
      robotsExcluded.push(url);
      continue;
    }
    try {
      const response = await fetchPage(url);
      const html = await response.text();
      const page = {
        ...inspectHtml(html, url),
        finalUrl: response.url,
        status: response.status,
        bodyBytes: Buffer.byteLength(html),
        sitemapMember: sitemapUrls.includes(url),
      };
      pages.push(page);
      queue.push(...page.internalLinks);
    } catch (error) {
      pages.push({
        url,
        status: null,
        errors: [error.message],
        internalLinks: [],
      });
    }
    if (pages.length % 50 === 0)
      console.log(`Live SEO crawl: ${pages.length} pages`);
  }
  const result = {
    checkedAt,
    completedAt: new Date().toISOString(),
    origin: ORIGIN,
    pages,
    sitemapUrls,
    summary: {
      htmlPages: pages.length,
      requests,
      pageErrors: pages.filter((p) => p.status !== 200 || p.errors.length)
        .length,
      robotsExcluded,
      crawlCapReached: seen.size >= 1500,
    },
    limitations: [
      'Native HTML URL crawl only; assets, browser rendering, redirects and field performance require separate checks. Query copies excluded.',
    ],
  };
  writeFileSync(
    `${directory}/production-crawl.json`,
    JSON.stringify(result, null, 2) + '\n'
  );
  writeFileSync(
    `${directory}/technical-crawl.csv`,
    csv(pages, [
      'url',
      'finalUrl',
      'status',
      'canonical',
      'title',
      'description',
      'robots',
      'h1',
      'h2',
      'schemaTypes',
      'bodyBytes',
      'sitemapMember',
      'internalLinks',
      'errors',
    ])
  );
  return result;
}
