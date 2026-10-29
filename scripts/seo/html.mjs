import { readdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { isGoogleVerificationAsset } from './verification-assets.mjs';

export function decode(value = '') {
  return value.replace(
    /&(?:#(x[\da-f]+|\d+)|amp|quot|apos|lt|gt);/gi,
    (entity, code) => {
      if (code) {
        const n =
          code[0].toLowerCase() === 'x'
            ? parseInt(code.slice(1), 16)
            : Number(code);
        return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : entity;
      }
      return (
        {
          '&amp;': '&',
          '&quot;': '"',
          '&apos;': "'",
          '&lt;': '<',
          '&gt;': '>',
        }[entity.toLowerCase()] || entity
      );
    }
  );
}
export function attrs(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((m) => [
      m[1].toLowerCase(),
      decode(m[2] ?? m[3]),
    ])
  );
}
const text = (s) =>
  decode(
    s
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
export function inspectHtml(html, url) {
  const schemas = [];
  const errors = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (attrs(m[1]).type !== 'application/ld+json') continue;
    try {
      schemas.push(JSON.parse(m[2]));
    } catch {
      errors.push('invalid-json-ld');
    }
  }
  // RSC and script strings are data, not native links/headings rendered in the document.
  const document = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  const metas = [...document.matchAll(/<meta\b([^>]*)>/gi)].map((m) =>
    attrs(m[1])
  );
  const links = [...document.matchAll(/<link\b([^>]*)>/gi)].map((m) =>
    attrs(m[1])
  );
  const canonicalTags = links.filter((a) => a.rel === 'canonical');
  const nativeLinks = [...document.matchAll(/<a\b([^>]*)>/gi)]
    .map((m) => attrs(m[1]).href)
    .filter(Boolean);
  const headings = (n) =>
    [
      ...document.matchAll(
        new RegExp(`<h${n}\\b[^>]*>([\\s\\S]*?)<\\/h${n}>`, 'gi')
      ),
    ].map((m) => text(m[1]));
  const robots =
    metas.find((a) => a.name === 'robots')?.content || 'index, follow';
  const internalLinks = [
    ...new Set(
      nativeLinks.flatMap((href) => {
        try {
          const target = new URL(href, url);
          return target.origin === new URL(url).origin &&
            !/\.[a-z\d]+$/i.test(target.pathname)
            ? [target.origin + target.pathname]
            : [];
        } catch {
          return [];
        }
      })
    ),
  ];
  const schemaTypes = new Set();
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (node['@type'])
      for (const type of [node['@type']].flat()) schemaTypes.add(type);
    for (const child of Object.values(node))
      if (typeof child === 'object') {
        if (Array.isArray(child)) child.forEach(visit);
        else visit(child);
      }
  };
  schemas.forEach(visit);
  return {
    url,
    canonical: canonicalTags[0]?.href || null,
    canonicalCount: canonicalTags.length,
    title: text(/<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(document)?.[1] || ''),
    description: metas.find((a) => a.name === 'description')?.content || null,
    robots,
    indexable: !/noindex/i.test(robots),
    h1: headings(1),
    h2: headings(2),
    internalLinks,
    ogUrl: metas.find((a) => a.property === 'og:url')?.content || null,
    schemaTypes: [...schemaTypes],
    errors,
  };
}
export async function inspectExport(directory, origin) {
  const pages = [];
  const files = [];
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.name.endsWith('.html')) {
        files.push(file);
      }
    }
  }
  walk(directory);
  // Bound parallel file reads to avoid serial filesystem latency on Windows.
  // Parse one batch at a time rather than retaining the entire export in memory.
  for (let offset = 0; offset < files.length; offset += 16) {
    const batch = files.slice(offset, offset + 16);
    const documents = await Promise.all(
      batch.map((file) => readFile(file, 'utf8'))
    );
    for (const [index, file] of batch.entries()) {
      const relative = path.relative(directory, file).replaceAll('\\', '/');
      if (isGoogleVerificationAsset(relative, documents[index])) continue;
      const pathname = '/' + relative.replace(/index\.html$/, '');
      const errorPage = /(?:^|\/)(?:404|_not-found)(?:\/|\.html)/.test(
        pathname
      );
      pages.push({
        ...inspectHtml(documents[index], origin + pathname),
        file,
        errorPage,
      });
      if (pages.length % 200 === 0)
        console.log(`SEO metadata inspected: ${pages.length} HTML pages`);
    }
  }
  return pages;
}
