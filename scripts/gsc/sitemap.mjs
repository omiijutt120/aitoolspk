/**
 * The sitemap is the only list of URLs this repository trusts for search work,
 * so every script reads it through this module rather than globbing `out/`.
 * `--live` exists for the same reason it does in the IndexNow script: the
 * deployed sitemap proves which URLs the host is actually serving.
 */
import { readFile } from 'node:fs/promises';

export const ORIGIN = 'https://aitoolspk.tech';

export function parseSitemapUrls(xml, origin = ORIGIN) {
  const urls = [];
  for (const match of xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)) {
    const value = match[1].trim();
    let parsed;
    try {
      parsed = new URL(value);
    } catch {
      throw new Error(`sitemap contains a loc that is not a URL: ${value}`);
    }
    if (parsed.origin !== new URL(origin).origin)
      throw new Error(
        `sitemap loc is outside ${origin}: ${value}. Refusing to submit another host's URL.`
      );
    urls.push(parsed.href);
  }
  return [...new Set(urls)];
}

export async function loadSitemap({
  from = 'out/sitemap.xml',
  origin = ORIGIN,
  fetchImpl = globalThis.fetch,
} = {}) {
  const live = from === 'live' || from === 'production';
  const body = live
    ? await (async () => {
        const response = await fetchImpl(`${origin}/sitemap.xml`, {
          headers: { 'cache-control': 'no-cache' },
          signal: AbortSignal.timeout(30000),
        });
        if (!response.ok)
          throw new Error(
            `Could not read ${origin}/sitemap.xml (HTTP ${response.status}).`
          );
        return response.text();
      })()
    : await readFile(from, 'utf8').catch(() => {
        throw new Error(`Run \`npm run build\` first: ${from} is missing.`);
      });
  return parseSitemapUrls(body, origin);
}
