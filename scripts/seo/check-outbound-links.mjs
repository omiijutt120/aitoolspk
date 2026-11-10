import { readdirSync, readFileSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

// Manual, non-build-gating check. Vendor sites may block automated requests.
// Only repeatable HTTP 404/410 GET responses should prompt link replacements.
const root = resolve(process.argv[2] || 'out');
const links = new Map();

function inspect(directory) {
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, item.name);
    if (item.isDirectory()) {
      inspect(file);
      continue;
    }
    if (!item.name.endsWith('.html')) continue;
    const html = readFileSync(file, 'utf8').replace(
      /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,
      ''
    );
    for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)) {
      let url;
      try {
        url = new URL(match[1].replaceAll('&amp;', '&'));
      } catch {
        continue;
      }
      if (!['http:', 'https:'].includes(url.protocol)) continue;
      if (
        url.hostname === 'aitoolspk.tech' ||
        url.hostname === 'wa.me' ||
        url.hostname.endsWith('.whatsapp.com')
      ) continue;
      url.hash = '';
      const key = url.toString();
      if (!links.has(key)) links.set(key, []);
      if (links.get(key).length < 2)
        links.get(key).push(relative(root, file));
    }
  }
}

async function requestStatus(url, method) {
  // Node's fetch instead of curl: the previous version shelled out to
  // `curl -o /dev/null`, which does not exist on Windows, so every URL
  // reported a null status and the check silently passed on this machine.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      method,
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; AiToolsPkLinkAudit/1.0)',
        accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
      },
    });
    return response.status;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

inspect(root);
const candidates = [...links].map(([url, from]) => ({ url, from }));
const results = [];
let cursor = 0;

async function worker() {
  while (cursor < candidates.length) {
    const candidate = candidates[cursor++];
    const headStatus = await requestStatus(candidate.url, 'HEAD');
    const status =
      !headStatus || headStatus >= 400
        ? await requestStatus(candidate.url, 'GET')
        : headStatus;
    results.push({ ...candidate, status });
  }
}

await Promise.all(Array.from({ length: 8 }, worker));
const broken = results.filter(({ status }) => status === 404 || status === 410);
// Bot gating and no-answer are different problems and used to be reported as
// one "uncertain" pile, which meant a 403 from Cloudflare and a dead host
// looked identical. They are separated so only the second needs a browser.
const blocked = results.filter(
  ({ status }) => status === 403 || status === 429 || status === 999
);
const unreachable = results.filter(({ status }) => !status);
const otherErrors = results.filter(
  ({ status }) =>
    status &&
    status >= 400 &&
    status !== 403 &&
    status !== 429 &&
    status !== 999 &&
    status !== 404 &&
    status !== 410
);
console.log(
  JSON.stringify(
    {
      checked: results.length,
      accessible:
        results.length -
        broken.length -
        blocked.length -
        unreachable.length -
        otherErrors.length,
      broken,
      blocked,
      unreachable,
      otherErrors,
      note: 'HEAD failures are retried with GET. 403/429 means the host refuses automated clients, not that the page is gone - open blocked URLs in a browser before replacing them. External inbound backlinks require a separate provider export.',
    },
    null,
    2
  )
);
if (broken.length) process.exitCode = 1;
