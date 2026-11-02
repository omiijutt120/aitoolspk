import { readdirSync, readFileSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

// Manual, non-build-gating check. Vendor sites may block automated requests.
// Only repeatable HTTP 404/410 GET responses should prompt link replacements.
const exec = promisify(execFile);
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
  try {
    const { stdout } = await exec(
      'curl',
      [
        '-sS',
        '-L',
        ...(method === 'HEAD' ? ['-I'] : []),
        '--max-time',
        '15',
        '-o',
        '/dev/null',
        '-w',
        '%{http_code}',
        '--user-agent',
        'Mozilla/5.0 (compatible; AiToolsPkLinkAudit/1.0)',
        url,
      ],
      { timeout: 18000 }
    );
    return Number(stdout.trim()) || null;
  } catch {
    return null;
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
const uncertain = results.filter(
  ({ status }) => !status || status >= 400 && status !== 404 && status !== 410
);
console.log(
  JSON.stringify(
    {
      checked: results.length,
      accessible: results.length - broken.length - uncertain.length,
      broken,
      uncertain,
      note: 'HEAD failures are retried with GET. 403/429/5xx and network failures are not proof that a link is broken. External inbound backlinks require a separate provider export.',
    },
    null,
    2
  )
);
if (broken.length) process.exitCode = 1;
