import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';

const sources = JSON.parse(readFileSync('data/logo-sources.json', 'utf8'));
const brands = JSON.parse(readFileSync('data/brands.json', 'utf8'));
mkdirSync('reports', { recursive: true });
const report = [];

// ICO containers often contain a full PNG. Older first-party favicons use
// uncompressed 24/32-bit DIBs; decode those without a platform dependency.
async function decodeIcon(buffer) {
  if (
    buffer.length < 6 ||
    buffer.readUInt16LE(0) !== 0 ||
    buffer.readUInt16LE(2) !== 1
  )
    return sharp(buffer);
  const entries = Array.from({ length: buffer.readUInt16LE(4) }, (_, i) => {
    const o = 6 + i * 16;
    return {
      size: buffer.readUInt32LE(o + 8),
      offset: buffer.readUInt32LE(o + 12),
      width: buffer[o] || 256,
    };
  }).sort((a, b) => b.width - a.width);
  for (const entry of entries) {
    const data = buffer.subarray(entry.offset, entry.offset + entry.size);
    if (data[0] === 137 && data[1] === 80) return sharp(data);
  }
  for (const entry of entries) {
    const data = buffer.subarray(entry.offset, entry.offset + entry.size);
    if (data.length < 40) continue;
    const header = data.readUInt32LE(0),
      width = data.readInt32LE(4),
      height = Math.abs(data.readInt32LE(8)) / 2,
      bits = data.readUInt16LE(14);
    if (
      ![24, 32].includes(bits) ||
      width < 1 ||
      height < 1 ||
      width > 512 ||
      height > 512
    )
      continue;
    const stride = Math.ceil((width * bits) / 32) * 4;
    const rgba = Buffer.alloc(width * height * 4);
    const alphaAvailable =
      bits === 32 &&
      Array.from(
        { length: width * height },
        (_, p) =>
          data[header + Math.floor(p / width) * stride + (p % width) * 4 + 3]
      ).some((a) => a > 0);
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const input = header + (height - y - 1) * stride + x * (bits / 8),
          output = (y * width + x) * 4;
        rgba[output] = data[input + 2];
        rgba[output + 1] = data[input + 1];
        rgba[output + 2] = data[input];
        const maskRow = Math.ceil(width / 32) * 4,
          mask =
            data[
              header +
                stride * height +
                (height - y - 1) * maskRow +
                Math.floor(x / 8)
            ];
        rgba[output + 3] = alphaAvailable
          ? data[input + 3]
          : (mask ?? 0) & (1 << (7 - (x % 8)))
            ? 0
            : 255;
      }
    return sharp(rgba, { raw: { width, height, channels: 4 } });
  }
  throw new Error('Unsupported icon; keep the existing truthful brand label');
}
async function get(url) {
  const r = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    headers: { 'User-Agent': 'Mozilla/5.0 AItoolsPK asset provenance check' },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r;
}
async function prepare(slug, source) {
  if (
    brands[slug]?.asset_path &&
    (brands[slug]?.license_review_status === 'approved' ||
      brands[slug]?.source_verified)
  ) {
    report.push({ slug, result: 'existing official asset' });
    return;
  }
  const candidates = [...source.urls];
  let homepageChecked = false;
  let error = 'No valid image found';
  for (let i = 0; i < candidates.length + 1; i++) {
    if (i === candidates.length && !homepageChecked) {
      homepageChecked = true;
      try {
        const page = await get(`https://${source.domain}/`);
        const html = await page.text();
        const links = Array.from(
          html.matchAll(/<link\b[^>]*>/gi),
          (m) => m[0]
        ).filter((tag) => /rel=["'][^"']*icon[^"']*["']/i.test(tag));
        for (const tag of links) {
          const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
          if (href) {
            const url = new URL(href.replaceAll('&amp;', '&'), page.url);
            if (url.protocol === 'https:') candidates.push(url.href);
          }
        }
      } catch (e) {
        error = e.message;
      }
    }
    const url = candidates[i];
    if (!url) break;
    try {
      const response = await get(url);
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length > 2_000_000)
        throw new Error('Asset exceeds size limit');
      const input = await decodeIcon(buffer);
      await input
        .resize(192, 192, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .webp({ quality: 94 })
        .toFile(`public/logos/${slug}.webp`);
      brands[slug] = {
        official_domain: source.domain,
        logo_source: response.url,
        asset_path: `/logos/${slug}.webp`,
        license_review_status: 'official-identification',
        source_verified: true,
        verified_date: '2026-10-19',
        guidelines: source.page || `https://${source.domain}/`,
        usage_notes:
          'Vendor-owned identity asset used only to identify the named product. No partnership, endorsement or permission to resell is claimed.',
      };
      report.push({
        slug,
        result: 'official asset saved',
        source: response.url,
      });
      return;
    } catch (e) {
      error = e.message;
    }
  }
  report.push({ slug, result: 'text fallback retained', reason: error });
}
const only = process.argv
  .find((arg) => arg.startsWith('--only='))
  ?.slice(7)
  .split(',');
if (only?.some((slug) => !sources[slug]))
  throw new Error('Unknown brand in --only');
const queue = Object.entries(sources).filter(
  ([slug]) => !only || only.includes(slug)
);
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const [slug, source] = queue.shift();
      await prepare(slug, source);
    }
  })
);
writeFileSync('data/brands.json', JSON.stringify(brands, null, 2) + '\n');
writeFileSync(
  'reports/logo-provenance.json',
  JSON.stringify(report, null, 2) + '\n'
);
console.log(
  JSON.stringify({
    saved: report.filter((r) => r.result === 'official asset saved').length,
    existing: report.filter((r) => r.result === 'existing official asset')
      .length,
    unresolved: report
      .filter((r) => r.result === 'text fallback retained')
      .map((r) => r.slug),
  })
);
