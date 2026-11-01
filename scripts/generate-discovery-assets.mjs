import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { collectionSlug } from '../src/lib/catalog-identity.mjs';

// Derived from the public catalogue only. No supplier or operational data is read.
const catalog = JSON.parse(await readFile('data/catalog.json', 'utf8'));
const groups = new Map();
for (const product of catalog.filter((p) => p.approval !== 'excluded')) {
  const slug = collectionSlug(product);
  if (!groups.has(slug)) groups.set(slug, []);
  groups.get(slug).push(product);
}
await mkdir('public/og/collections', { recursive: true });
await mkdir('reports/seo', { recursive: true });
const cachePath = 'reports/seo/discovery-assets-cache.json';
const cache = JSON.parse(await readFile(cachePath, 'utf8').catch(() => '{}'));
const nextCache = {};
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
      })[c]
  );
const money = (amount) =>
  `PKR ${new Intl.NumberFormat('en-PK').format(amount)}`;
let written = 0;
for (const [slug, plans] of groups) {
  const brand = slug === 'api' ? 'APIs & developer tools' : plans[0].brand;
  const price = Math.min(...plans.map((p) => p.price));
  const logoPath = slug === 'api' ? null : plans.find((p) => p.logo)?.logo;
  const logo = logoPath
    ? await readFile(`public${logoPath}`).catch(() => null)
    : null;
  const logoData = logo
    ? (
        await sharp(logo)
          .resize(100, 100, { fit: 'contain', background: '#ffffff' })
          .png()
          .toBuffer()
      ).toString('base64')
    : null;
  const chunks = brand.match(/.{1,30}(?:\s|$)|\S{1,30}/g) || [brand];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#f5f5f3"/><rect x="32" y="32" width="1136" height="566" rx="30" fill="#fff" stroke="#dededb"/>
    <text x="82" y="107" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#18191b">AiToolsPk</text>
    <text x="1118" y="105" text-anchor="end" font-family="Arial,sans-serif" font-size="22" fill="#666">aitoolspk.tech</text>
    ${logoData ? `<image href="data:image/png;base64,${logoData}" x="82" y="154" width="100" height="100"/>` : ''}
    ${chunks
      .slice(0, 2)
      .map(
        (line, i) =>
          `<text x="82" y="${322 + i * 65}" font-family="Arial,sans-serif" font-size="57" font-weight="700" fill="#18191b">${escape(line.trim())}</text>`
      )
      .join('')}
    <text x="82" y="453" font-family="Arial,sans-serif" font-size="27" fill="#555">${plans.length} listed ${plans.length === 1 ? 'plan' : 'plans'} · From ${escape(money(price))}</text>
    <line x1="82" y1="489" x2="1118" y2="489" stroke="#e4e4e0"/>
    <text x="82" y="542" font-family="Arial,sans-serif" font-size="25" fill="#333">Compare duration, access &amp; seller warranty</text>
    <text x="1118" y="542" text-anchor="end" font-family="Arial,sans-serif" font-size="21" fill="#666">Confirm current quote</text>
  </svg>`;
  const hash = createHash('sha256').update(svg).digest('hex');
  const output = `public/og/collections/${slug}.png`;
  nextCache[slug] = hash;
  if (cache[slug] === hash && (await stat(output).catch(() => null))) continue;
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(output);
  written++;
}
await writeFile(cachePath, `${JSON.stringify(nextCache, null, 2)}\n`);
const extraGuides = JSON.parse(
  await readFile('data/seo/additional-guides.json', 'utf8')
);
const guideLinks = [
  [
    'How to choose an AI subscription in Pakistan',
    'choosing-ai-subscriptions-pakistan',
  ],
  [
    'Understanding credits and plan duration',
    'understanding-credits-and-plan-duration',
  ],
  ...extraGuides.map((g) => [g.title, g.slug]),
];
const lines = [
  '# AiToolsPk',
  '',
  '> Independent catalogue of AI tools and digital subscriptions for Pakistan, with listed PKR prices and WhatsApp enquiries.',
  '',
  'Prices are dated seller quotes, not vendor list prices. Confirm the exact package, legitimate access, current price, usage limits and seller warranty before payment. A listed brand does not establish vendor affiliation. There is no on-site checkout or customer login.',
  '',
  'This optional discovery file is a navigation aid, not an indexing directive or guarantee of AI citations. Public page content and robots.txt remain authoritative.',
  '',
  '## Store and policies',
  '',
  ...[
    ['About', '/about/'],
    ['All tools', '/tools/'],
    ['Categories', '/categories/'],
    ['How to order', '/how-to-order/'],
    ['Contact: WhatsApp +923714549245', '/contact/'],
    ['Editorial policy', '/editorial-policy/'],
    ['Terms', '/terms/'],
    ['Refund policy', '/refund-policy/'],
    ['Privacy policy', '/privacy-policy/'],
    ['XML sitemap', '/sitemap.xml'],
  ].map(([name, path]) => `- [${name}](https://aitoolspk.tech${path})`),
  '',
  '## Buying guides',
  '',
  ...guideLinks.map(
    ([name, slug]) => `- [${name}](https://aitoolspk.tech/guides/${slug}/)`
  ),
  '',
  '## Plan collections',
  '',
  ...[...groups]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([slug, plans]) =>
        `- [${slug === 'api' ? 'API plans' : `${plans[0].brand} plans`}](https://aitoolspk.tech/plans/${slug}/)`
    ),
  '',
];
await writeFile('public/llms.txt', lines.join('\n'));
console.log(
  `Prepared ${groups.size} collection previews (${written} updated) and public llms.txt navigation.`
);
