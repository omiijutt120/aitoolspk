import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import {
  AI_CRAWLERS,
  extractCanonical,
  extractH1,
  extractTitle,
  metaRobots,
  parseRobots,
  parseSitemap,
  robotsAllows,
  runChecks,
} from '../scripts/seo/check-discovery.mjs';

const SITE = 'https://aitoolspk.tech';

test('the crawler list in the checker matches src/app/robots.ts', () => {
  const source = readFileSync('src/app/robots.ts', 'utf8');
  const block = source.match(/const AI_CRAWLERS = \[([\s\S]*?)\];/)?.[1];
  assert.ok(block, 'AI_CRAWLERS block not found');
  const declared = [...block.matchAll(/'([^']+)'/g)].map((match) => match[1]);
  assert.deepEqual(declared, AI_CRAWLERS);
});

test('robots parsing groups agents and picks the most specific rule', () => {
  const groups = parseRobots(`
    # comment
    User-agent: *
    Disallow: /

    User-agent: GPTBot
    Allow: /
  `);
  assert.equal(groups.length, 2);
  assert.equal(robotsAllows(groups, '*', '/'), false);
  assert.equal(robotsAllows(groups, 'GPTBot', '/'), true);
  assert.equal(robotsAllows(groups, 'Bingbot', '/plans/netflix/'), false);
});

test('an empty Disallow allows everything and a longer Allow wins', () => {
  const groups = parseRobots(`
    User-agent: *
    Disallow:
  `);
  assert.equal(robotsAllows(groups, 'Googlebot', '/anything/'), true);
  const nested = parseRobots(`
    User-agent: *
    Disallow: /plans/
    Allow: /plans/netflix/
  `);
  assert.equal(robotsAllows(nested, 'Bingbot', '/plans/netflix/'), true);
  assert.equal(robotsAllows(nested, 'Bingbot', '/plans/canva/'), false);
});

test('canonical, title, H1 and robots meta are read from real markup', () => {
  const html =
    '<html><head><title>Netflix plans and prices</title>' +
    '<link data-next-head="" rel="canonical" href="https://aitoolspk.tech/plans/netflix/"/>' +
    '<meta name="robots" content="index, follow"/></head>' +
    '<body><h1 class="x">Netflix plans <span>&amp; prices</span></h1></body></html>';
  assert.equal(extractCanonical(html), 'https://aitoolspk.tech/plans/netflix/');
  assert.equal(extractTitle(html), 'Netflix plans and prices');
  assert.equal(extractH1(html), 'Netflix plans & prices');
  assert.equal(metaRobots(html), 'index, follow');
});

test('the sitemap parser ignores whitespace inside loc', () => {
  assert.deepEqual(
    parseSitemap('<url><loc>\n https://aitoolspk.tech/a/ \n</loc></url>'),
    ['https://aitoolspk.tech/a/']
  );
});

function fixture({ robots } = {}) {
  const keyFile = readdirSync('public').find((name) =>
    /^[a-f0-9]{32}\.txt$/i.test(name)
  );
  const key = keyFile.replace(/\.txt$/i, '');
  const files = {
    '/robots.txt':
      robots ??
      `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n${AI_CRAWLERS.map(
        (agent) => `\nUser-agent: ${agent}\nAllow: /`
      ).join('')}`,
    '/sitemap.xml': `<urlset><url><loc>${SITE}/a/</loc></url><url><loc>${SITE}/b/</loc></url></urlset>`,
    '/BingSiteAuth.xml': '<users><user>ABCD1234EFGH5678</user></users>',
    '/llms.txt': '# llms\n',
    '/llms-full.txt': '# full\n',
    '/ai.txt': '# ai\n',
    [`/${keyFile}`]: key,
    '/a/': `<html><head><title>A</title><link rel="canonical" href="${SITE}/a/"><meta name="robots" content="index, follow"></head><body><h1>A</h1></body></html>`,
    '/b/': `<html><head><title>B</title><link rel="canonical" href="${SITE}/b/"><meta name="robots" content="index, follow"></head><body><h1>B</h1></body></html>`,
  };
  return async (url) => {
    const pathname = new URL(url).pathname;
    const body = files[pathname];
    if (body === undefined)
      return { status: 404, text: async () => 'not found' };
    return { status: 200, text: async () => body };
  };
}

test('an intact discovery layer passes every hard check', async () => {
  const report = await runChecks({ fetchImpl: fixture() });
  const failures = report.checks.filter((check) => check.hard && !check.passed);
  assert.deepEqual(failures, []);
  assert.equal(report.checks.length, 13);
  assert.equal(report.urlCount, 2);
});

test('a disallow-all robots.txt is caught before it hides the site', async () => {
  const report = await runChecks({
    fetchImpl: fixture({ robots: 'User-agent: *\nDisallow: /\n' }),
  });
  const check = report.checks.find((entry) =>
    entry.name.includes('allows every declared crawler')
  );
  assert.equal(check.passed, false);
  assert.match(check.detail, /blocked: \*/);
});
