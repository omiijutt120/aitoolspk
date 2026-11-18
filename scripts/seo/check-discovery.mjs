#!/usr/bin/env node
/**
 * One command to prove the discovery layer is intact on production.
 *
 * Everything indexed by Google, Bing, Copilot and the answer engines starts
 * with six files and two tags: robots.txt, sitemap.xml, the IndexNow key, the
 * Bing verification file, the three machine-readable summaries, and a
 * self-canonical URL on every page. A deploy can silently break any of them,
 * and neither Search Console nor Bing reports the break for days.
 *
 *   npm run seo:discovery
 *   npm run seo:discovery -- --all          # also HEAD every sitemap URL
 *   npm run seo:discovery -- --base http://localhost:3000
 *
 * Exit code 1 means a hard failure. Warnings never fail the run.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from '../lib/args.mjs';

export const ORIGIN = 'https://aitoolspk.tech';

/**
 * Kept in step with src/app/robots.ts by tests/discovery-check.test.mjs: the
 * test parses the route and fails if the two lists drift.
 */
export const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'ClaudeBot',
  'Claude-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bingbot',
];

export function parseRobots(text) {
  const groups = [];
  let current = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const [rawKey, ...rest] = line.split(':');
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(':').trim();
    if (key === 'user-agent') {
      if (!current || current.rules.length) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      if (value) current.agents.push(value);
      continue;
    }
    if (!current) continue;
    if (key === 'allow' || key === 'disallow')
      current.rules.push({ type: key, value });
  }
  return groups;
}

export function robotsAllows(groups, agent, target = '/') {
  const exact = groups.filter((group) =>
    group.agents.some((value) => value.toLowerCase() === agent.toLowerCase())
  );
  const selected = exact.length
    ? exact
    : groups.filter((group) => group.agents.includes('*'));
  if (!selected.length) return true;
  const rules = selected
    .flatMap((group) => group.rules)
    .filter((rule) => rule.value)
    .filter((rule) => target.startsWith(rule.value));
  if (!rules.length) return true;
  const longest = Math.max(...rules.map((rule) => rule.value.length));
  const decisive = rules.filter((rule) => rule.value.length === longest);
  return decisive.some((rule) => rule.type === 'allow');
}

export function parseSitemap(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((match) =>
    match[1].trim()
  );
}

export function extractCanonical(html) {
  const link = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (!link) return '';
  return link[0].match(/href=["']([^"']+)["']/i)?.[1] ?? '';
}

const decodeEntities = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

export function extractTitle(html) {
  return decodeEntities(
    html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? ''
  );
}

export function extractH1(html) {
  const inner = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '';
  return decodeEntities(inner.replace(/<[^>]+>/g, '')).trim();
}

export function metaRobots(html) {
  const tag = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i);
  if (!tag) return '';
  return tag[0].match(/content=["']([^"']+)["']/i)?.[1] ?? '';
}

async function fetchText(fetchImpl, url, { cacheBust = false } = {}) {
  const target = cacheBust
    ? `${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`
    : url;
  const response = await fetchImpl(target, {
    headers: { 'cache-control': 'no-cache' },
    signal: AbortSignal.timeout(30000),
  });
  return {
    status: response.status,
    body: await response.text(),
    url: target,
  };
}

export async function runChecks({
  base = ORIGIN,
  all = false,
  sample = 5,
  fetchImpl = globalThis.fetch,
} = {}) {
  const checks = [];
  const record = (name, passed, detail, { hard = true } = {}) =>
    checks.push({ name, passed, detail, hard });

  const robots = await fetchText(fetchImpl, `${base}/robots.txt`);
  record(
    'robots.txt is served',
    robots.status === 200,
    `HTTP ${robots.status}`
  );
  if (robots.status === 200) {
    const groups = parseRobots(robots.body);
    const blocked = [];
    for (const agent of ['*', ...AI_CRAWLERS])
      if (!robotsAllows(groups, agent, '/')) blocked.push(agent);
    record(
      'robots.txt allows every declared crawler',
      blocked.length === 0,
      blocked.length
        ? `blocked: ${blocked.join(', ')}`
        : `${AI_CRAWLERS.length + 1} agents allowed`
    );
    record(
      'robots.txt names the sitemap',
      /sitemap:\s*https?:\/\/[^\s]+/i.test(robots.body),
      robots.body.match(/sitemap:\s*(\S+)/i)?.[1] ?? 'missing Sitemap: line'
    );
  }

  const sitemap = await fetchText(fetchImpl, `${base}/sitemap.xml`);
  const urls = sitemap.status === 200 ? parseSitemap(sitemap.body) : [];
  const duplicates = urls.length - new Set(urls).size;
  const foreign = urls.filter((url) => {
    try {
      return new URL(url).origin !== new URL(base).origin;
    } catch {
      return true;
    }
  });
  record(
    'sitemap.xml is served',
    sitemap.status === 200,
    `HTTP ${sitemap.status}`
  );
  record(
    'sitemap.xml lists unique same-origin URLs',
    urls.length > 0 && duplicates === 0 && foreign.length === 0,
    `${urls.length} URLs, ${duplicates} duplicate(s), ${foreign.length} foreign`
  );

  const keyFiles = readdirSync('public').filter((name) =>
    /^[a-f0-9]{32}\.txt$/i.test(name)
  );
  if (keyFiles.length !== 1) {
    record(
      'IndexNow key file',
      false,
      `${keyFiles.length} key files in public/`
    );
  } else {
    const keyFile = keyFiles[0];
    const key = keyFile.replace(/\.txt$/i, '');
    const live = await fetchText(fetchImpl, `${base}/${keyFile}`);
    const expected = readFileSync(path.join('public', keyFile), 'utf8').trim();
    record(
      'IndexNow key is published and matches',
      live.status === 200 && live.body.trim() === key && expected === key,
      `HTTP ${live.status}, body ${live.body.trim() === key ? 'matches' : 'differs'}`
    );
  }

  const bing = await fetchText(fetchImpl, `${base}/BingSiteAuth.xml`);
  const bingUser = bing.body.match(/<user>\s*([^<\s]+)\s*<\/user>/i)?.[1] ?? '';
  record(
    'BingSiteAuth.xml is served',
    bing.status === 200 && Boolean(bingUser),
    `HTTP ${bing.status}${bingUser ? `, user ${bingUser}` : ', no <user>'}`
  );

  const deadEmail = /hello@aitoolspk\.tech|mailto:/i;
  for (const file of ['llms.txt', 'llms-full.txt', 'ai.txt']) {
    const asset = await fetchText(fetchImpl, `${base}/${file}`);
    record(
      `${file} is served without a dead address`,
      asset.status === 200 &&
        asset.body.length > 0 &&
        !deadEmail.test(asset.body),
      `HTTP ${asset.status}, ${asset.body.length} bytes`
    );
  }

  const targets = urls.filter((url) => {
    try {
      return new URL(url).pathname !== '/';
    } catch {
      return false;
    }
  });
  const picked = all
    ? urls
    : [
        urls[0],
        targets[0],
        targets[Math.floor(targets.length / 2)],
        urls.at(-1),
      ]
        .filter(Boolean)
        .filter((url, index, list) => list.indexOf(url) === index)
        .slice(0, sample);
  const badCanonical = [];
  const noH1 = [];
  const noindexed = [];
  const opaqueTokens = [];
  for (const url of picked) {
    const page = await fetchText(fetchImpl, url, { cacheBust: true });
    if (page.status !== 200) {
      badCanonical.push(`${url} → HTTP ${page.status}`);
      continue;
    }
    const canonical = extractCanonical(page.body);
    let canonicalPath = '';
    try {
      canonicalPath = canonical ? new URL(canonical).pathname : '';
    } catch {
      canonicalPath = '';
    }
    // Compare the path so a local base can be checked against the same build;
    // the host must match too when the base is the production origin.
    if (canonicalPath !== new URL(url).pathname)
      badCanonical.push(`${url} → ${canonical || 'no canonical'}`);
    else if (base === ORIGIN && new URL(canonical).origin !== ORIGIN)
      badCanonical.push(`${url} → ${canonical}`);
    if (!extractH1(page.body)) noH1.push(url);
    if (/noindex/i.test(metaRobots(page.body))) noindexed.push(url);
    if (/\bai[0-9]{4,}\b/i.test(page.body)) opaqueTokens.push(url);
  }
  record(
    'sampled pages are self-canonical',
    badCanonical.length === 0,
    badCanonical.length
      ? badCanonical.slice(0, 5).join('; ')
      : `${picked.length} checked`
  );
  record(
    'sampled pages have an H1',
    noH1.length === 0,
    noH1.length ? noH1.slice(0, 5).join('; ') : `${picked.length} checked`
  );
  record(
    'sampled pages are indexable',
    noindexed.length === 0,
    noindexed.length
      ? noindexed.slice(0, 5).join('; ')
      : `${picked.length} checked`
  );
  record(
    'sampled pages contain no opaque ai-number tokens',
    opaqueTokens.length === 0,
    opaqueTokens.length
      ? opaqueTokens.slice(0, 5).join('; ')
      : `${picked.length} checked`
  );

  return {
    checkedAt: new Date().toISOString(),
    base,
    urlCount: urls.length,
    checks,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2), {
    known: ['base', 'all', 'sample', 'out', 'help'],
  });
  if (args.has('help')) {
    console.log(
      'Usage: node scripts/seo/check-discovery.mjs [--base https://aitoolspk.tech] [--all] [--sample 5] [--out reports/seo]'
    );
    return 0;
  }
  const report = await runChecks({
    base: args.get('base', ORIGIN),
    all: args.has('all'),
    sample: args.number('sample', 5),
  });
  const outDir = args.get('out', path.join('reports', 'seo'));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    path.join(outDir, 'discovery-check.json'),
    `${JSON.stringify(report, null, 2)}\n`
  );
  for (const check of report.checks)
    console.log(
      `${check.passed ? (check.hard ? 'PASS' : 'WARN') : 'FAIL'}  ${check.name}${
        check.detail ? ` — ${check.detail}` : ''
      }`
    );
  const failures = report.checks.filter((check) => check.hard && !check.passed);
  console.log(
    `\n${report.checks.length - failures.length}/${report.checks.length} checks passed on ${report.base} (${report.urlCount} sitemap URLs).`
  );
  return failures.length ? 1 : 0;
}

if (
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url
) {
  main().then(
    (code) => {
      process.exitCode = code;
    },
    (error) => {
      console.error(error.message);
      process.exitCode = 1;
    }
  );
}
