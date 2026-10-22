import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { parse } from 'csv-parse/sync';

export function clean(value = '') {
  return String(value)
    .normalize('NFKC')
    .replace(/<[^>]*>/g, '')
    .replace(/(?:https?:\/\/|www\.)\S+/gi, '')
    .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
const slug = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const brandRules = [
  ['chatgpt', 'ChatGPT', /chat\s?gpt|\bgpt\b/i, 'ai-chat'],
  ['claude', 'Claude', /claude/i, 'ai-chat'],
  [
    'gemini',
    'Gemini',
    /gemini|google ai|veo\s?3|google one|antigravity/i,
    'ai-chat',
  ],
  ['grok', 'Grok', /grok/i, 'ai-chat'],
  ['deepseek', 'DeepSeek', /deepseek/i, 'ai-chat'],
  ['perplexity', 'Perplexity', /perplexity/i, 'ai-chat'],
  ['canva', 'Canva', /canva/i, 'design'],
  ['figma', 'Figma', /figma/i, 'design'],
  ['adobe', 'Adobe', /adobe/i, 'design'],
  ['leonardo', 'Leonardo AI', /leonardo/i, 'design'],
  ['freepik', 'Freepik', /freepik/i, 'design'],
  ['capcut', 'CapCut', /capcut/i, 'video'],
  ['elevenlabs', 'ElevenLabs', /elevenlabs/i, 'video'],
  ['kling', 'Kling AI', /kling/i, 'video'],
  ['heygen', 'HeyGen', /heygen/i, 'video'],
  ['runway', 'Runway', /runway/i, 'video'],
  ['suno', 'Suno', /suno/i, 'video'],
  ['cursor', 'Cursor', /cursor/i, 'coding'],
  ['lovable', 'Lovable', /lovable/i, 'coding'],
  ['replit', 'Replit', /replit/i, 'coding'],
  ['jetbrains', 'JetBrains', /jetbrains/i, 'coding'],
  ['n8n', 'n8n', /\bn8n\b/i, 'coding'],
  ['manus', 'Manus', /manus/i, 'ai-chat'],
  ['notion', 'Notion', /notion/i, 'productivity'],
  [
    'microsoft',
    'Microsoft',
    /microsoft|office|windows|outlook|onedrive/i,
    'software',
  ],
  ['youtube', 'YouTube', /youtube/i, 'entertainment'],
  ['google', 'Google', /google|gmail/i, 'productivity'],
  ['netflix', 'Netflix', /netflix/i, 'entertainment'],
  ['spotify', 'Spotify', /spotify/i, 'entertainment'],
  ['nordvpn', 'NordVPN', /nordvpn/i, 'security'],
  ['surfshark', 'Surfshark', /surfshark/i, 'security'],
  ['grammarly', 'Grammarly', /grammarly/i, 'writing'],
  ['quillbot', 'QuillBot', /quillbot/i, 'writing'],
  ['linkedin', 'LinkedIn', /linkedin/i, 'productivity'],
  ['zoom', 'Zoom', /zoom/i, 'productivity'],
  ['discord', 'Discord', /discord/i, 'entertainment'],
  ['autodesk', 'Autodesk', /autodesk/i, 'software'],
  ['gamma', 'Gamma', /\bgamma\b/i, 'productivity'],
  ['minimax', 'MiniMax', /minimax/i, 'video'],
  ['quizlet', 'Quizlet', /quizlet/i, 'productivity'],
  ['kahoot', 'Kahoot!', /kahoot/i, 'productivity'],
  ['coursera', 'Coursera', /coursera/i, 'productivity'],
  ['duolingo', 'Duolingo', /duolingo/i, 'productivity'],
  ['icloud', 'iCloud', /icloud/i, 'productivity'],
  ['apple', 'Apple', /\bapple\b/i, 'entertainment'],
  ['kaspersky', 'Kaspersky', /kaspersky/i, 'security'],
  ['higgfield', 'Higgsfield', /higgs?field/i, 'video'],
  ['ilovepdf', 'iLovePDF', /i\s*love\s*pdf/i, 'productivity'],
  ['adguard-vpn', 'AdGuard VPN', /adguard/i, 'security'],
  ['tele', 'Telegram', /telegram|\btele\s+bot/i, 'productivity'],
  ['tiktok', 'TikTok', /tiktok/i, 'entertainment'],
  ['facebook', 'Facebook', /facebook/i, 'productivity'],
  ['akool', 'AKOOL', /akool/i, 'video'],
  ['dreamina', 'Dreamina', /dreamina/i, 'design'],
  ['xingtu', 'Xingtu', /xingtu/i, 'design'],
  ['fpt-play', 'FPT Play', /fpt\s*play/i, 'entertainment'],
  ['vieon', 'VieON', /vieon/i, 'entertainment'],
  ['gpm-login', 'GPM Login', /gpm\s*login/i, 'software'],
  ['tv360', 'TV360', /tv360/i, 'entertainment'],
  ['galaxy-play', 'Galaxy Play', /galaxy\s*play/i, 'entertainment'],
  ['muse-ai', 'Muse AI', /muse[.\s]*ai/i, 'video'],
  ['ipvanish', 'IPVanish', /ipvanish/i, 'security'],
  ['pia-vpn', 'Private Internet Access', /\bpia\s+vpn/i, 'security'],
  ['photoroom', 'Photoroom', /photoroom/i, 'design'],
  ['qwen', 'Qwen', /qwen/i, 'ai-chat'],
  ['kiro', 'Kiro', /kiro/i, 'coding'],
  ['udemy', 'Udemy', /udemy/i, 'productivity'],
  ['genspark', 'Genspark', /genspark/i, 'ai-chat'],
];
export function normalize(row, approvals = {}, brands = {}) {
  if (!row.ProductID || !row.Name) throw new Error('Missing required identity');
  const price = Number(row.SellingPricePKR);
  if (!Number.isSafeInteger(price) || price <= 0)
    throw new Error('Invalid retail price');
  const id =
    'PK-' +
    createHash('sha256')
      .update(`${row.Source}:${row.ProductID}`)
      .digest('hex')
      .slice(0, 12)
      .toUpperCase();
  const review = approvals[id] || {};
  const name = clean(row.Name);
  if (!name || name.includes('\uFFFD')) throw new Error('Invalid UTF-8 name');
  const match = brandRules.find((r) => r[2].test(`${name} ${row.Category}`));
  const brand =
    match?.[1] ??
    clean(
      row.Category === 'none'
        ? 'Digital tools'
        : row.Category.replace(/_/g, ' ')
    );
  const brandSlug = match?.[0] ?? slug(brand);
  let category = match?.[3] ?? 'software';
  if (/vpn|antivirus|kaspersky|proton|proxy/i.test(name)) category = 'security';
  else if (
    /youtube|netflix|spotify|prime video|xbox|roblox|tv360|iqiyi|fpt|galaxy play|youku|vieon/i.test(
      name
    )
  )
    category = 'entertainment';
  else if (
    /video|seedance|higgs?field|minimax|dreamina|muse ai|akool|domoai|wink|davinci|audio/i.test(
      name
    )
  )
    category = 'video';
  else if (/design|photo|krea|openart|meitu|xingtu/i.test(name))
    category = 'design';
  else if (
    /quizlet|coursera|duolingo|skillshare|icloud|gamma|kahoot|scribd|ilovepdf/i.test(
      name
    )
  )
    category = 'productivity';
  // Prefer a term after “warranty”: in “30D warranty 24H”, 30D is the plan.
  const warrantyText =
    name.match(
      /warranty\s*[:\-]?\s*\d+\s*(?:hours?|days?|months?|years?|h|d|m|y)\b/i
    )?.[0] ||
    name.match(
      /(?:no|full)\s+warranty|\d+\s*(?:hours?|days?|months?|years?|h|d|m|y)\s+warranty/i
    )?.[0];
  const warranty = warrantyText
    ? `${warrantyText} (listed; unverified)`
    : 'Not specified';
  const durationText = warrantyText ? name.replace(warrantyText, '') : name;
  const durations = Array.from(
    durationText.matchAll(
      /\b(\d+)\s*(months?|years?|days?|hours?|hrs?|d|m|y|h)\b(?!\s*(?:credits?|tokens?))/gi
    ),
    (m) =>
      `${m[1]} ${{ d: 'days', m: 'months', y: 'years', h: 'hours' }[m[2].toLowerCase()] || m[2].toLowerCase()}`
  );
  const duration = durations.length
    ? [...new Set(durations.map((x) => x.toLowerCase()))].join(' / ')
    : /lifetime/i.test(name)
      ? 'Lifetime claim — unverified'
      : 'Not specified';
  const access = /shared|sharing/i.test(name)
    ? 'Shared access'
    : /slot/i.test(name)
      ? 'Workspace slot'
      : /private/i.test(name)
        ? 'Private plan'
        : /invite|join link|link to join/i.test(name)
          ? 'Invitation'
          : /key|license/i.test(name)
            ? 'License key'
            : /upgrade|extend/i.test(name)
              ? 'Upgrade / renewal'
              : 'Not specified';
  const credits =
    name.match(/\b[\d,.]+\s*[kmb]?\s*(?:credits?|tokens?)\b/i)?.[0] || '';
  const stock =
    review.stockStatus ||
    (Number(row.AvailableStock) === 0 && row.AvailableStock !== ''
      ? 'out-of-stock'
      : row.ListingStatus === 'In stock' && Number(row.AvailableStock) > 0
        ? 'in-stock'
        : 'unconfirmed');
  if (!['in-stock', 'out-of-stock', 'unconfirmed'].includes(stock))
    throw new Error(`Invalid stock status for ${id}`);
  const risk =
    /password|credential|2fa|otp|cookie|hotmail|gmail|outlook|edu\b|student|school|unlimited|lifetime|verified account|aged account|old account/i.test(
      name
    );
  let approval = review.status || 'pending';
  if (!['pending', 'approved', 'excluded'].includes(approval))
    throw new Error(`Invalid approval for ${id}`);
  if (
    approval === 'approved' &&
    (!review.authorizationEvidence ||
      !review.deliveryEvidence ||
      !review.reviewedAt ||
      !review.stockCheckedAt ||
      !review.description ||
      !review.warranty ||
      !review.duration ||
      !review.access ||
      !review.renewal)
  )
    throw new Error(
      `Approval evidence and exact public terms required for ${id}`
    );
  if (approval === 'approved' && risk && !review.riskResolved)
    throw new Error(`Resolve flagged claims/access for ${id}`);
  if (
    review.reviewedAt &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt) ||
      !Number.isFinite(Date.parse(review.reviewedAt)))
  )
    throw new Error(`Invalid review date for ${id}`);
  const asset = brands[brandSlug];
  const logo =
    (asset?.license_review_status === 'approved' ||
      (asset?.license_review_status === 'official-identification' &&
        asset?.source_verified === true)) &&
    asset?.asset_path?.startsWith('/logos/')
      ? asset.asset_path
      : null;
  const date = review.stockCheckedAt || row.RateDate;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)))
    throw new Error(`Invalid snapshot date for ${id}`);
  return {
    id,
    slug: `${slug(review.name || name).slice(0, 100)}-${id.toLowerCase()}`,
    name: clean(review.name || name),
    brand,
    brandSlug,
    category,
    price,
    duration: clean(review.duration || duration),
    warranty: clean(review.warranty || warranty),
    access: clean(review.access || access),
    credits,
    stock,
    approval,
    description: clean(
      review.description ||
        `Catalog entry for ${brand}. The listed plan, access method and warranty require seller verification before this offer can be ordered.`
    ),
    date,
    logo,
    purchasable: approval === 'approved' && stock === 'in-stock',
    risk,
    renewal: clean(
      review.renewal ||
        'Renewal terms are not confirmed. Do not assume automatic renewal or the same renewal price.'
    ),
  };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  if (
    !existsSync('private/catalog.csv') &&
    process.argv.includes('--if-present')
  ) {
    if (!existsSync('data/catalog.json'))
      throw new Error(
        'Provide private/catalog.csv or a committed sanitized catalog.'
      );
    console.log(
      'Private CSV absent. Using committed sanitized catalog; validation follows.'
    );
  } else {
    const rows = parse(readFileSync('private/catalog.csv', 'utf8'), {
      columns: true,
      bom: true,
      skip_empty_lines: true,
    });
    const approvals = existsSync('private/approvals.json')
      ? JSON.parse(
          readFileSync('private/approvals.json', 'utf8').replace(/^\uFEFF/, '')
        )
      : {};
    const brands = JSON.parse(readFileSync('data/brands.json', 'utf8'));
    const previous = existsSync('data/catalog.json')
      ? JSON.parse(readFileSync('data/catalog.json', 'utf8'))
      : [];
    const priorSlugs = new Map(previous.map((p) => [p.id, p.slug]));
    const products = rows
      .map((row) => normalize(row, approvals, brands))
      .map((p) => ({ ...p, slug: priorSlugs.get(p.id) || p.slug }));
    if (new Set(products.map((p) => p.id)).size !== products.length)
      throw new Error('Duplicate product identity');
    if (new Set(products.map((p) => p.slug)).size !== products.length)
      throw new Error('Duplicate URL');
    for (const id of Object.keys(approvals))
      if (!products.some((p) => p.id === id))
        throw new Error(`Unknown approval ID ${id}`);
    mkdirSync('reports', { recursive: true });
    mkdirSync('public/catalog', { recursive: true });
    writeFileSync(
      'data/catalog.json',
      JSON.stringify(products, null, 2) + '\n'
    );
    writeFileSync(
      'public/catalog/index.json',
      JSON.stringify(products.filter((p) => p.approval !== 'excluded'))
    );
    const mapColumns = [
      'brand_slug',
      'official_domain',
      'logo_source',
      'asset_path',
      'license_review_status',
      'verified_date',
    ];
    const assetRows = [...new Set(products.map((p) => p.brandSlug))]
      .sort()
      .map((brand_slug) => ({
        brand_slug,
        ...(brands[brand_slug] || {
          license_review_status: 'text-only; licensed asset required',
        }),
      }));
    const cell = (value) =>
      '"' + String(value || '').replaceAll('"', '""') + '"';
    writeFileSync(
      'data/brand-asset-map.csv',
      [
        mapColumns.join(','),
        ...assetRows.map((row) =>
          mapColumns.map((k) => cell(row[k])).join(',')
        ),
      ].join('\n') + '\n'
    );
    const report = {
      rows: rows.length,
      public: products.filter((p) => p.approval !== 'excluded').length,
      approved: products.filter((p) => p.approval === 'approved').length,
      flagged: products.filter((p) => p.risk).length,
      stock: Object.fromEntries(
        ['in-stock', 'out-of-stock', 'unconfirmed'].map((s) => [
          s,
          products.filter((p) => p.stock === s).length,
        ])
      ),
      warnings: [
        'All source descriptions omitted; supplier copy is not verified.',
        'Approval evidence required before purchasing.',
        'Snapshot expires after 7 days; refresh stock and prices weekly.',
      ],
      review: products.map((p) => ({
        id: p.id,
        name: p.name,
        approval: p.approval,
        risk: p.risk,
        missingLogo: !p.logo,
        missingDuration: p.duration === 'Not specified',
        missingWarranty: p.warranty === 'Not specified',
      })),
    };
    writeFileSync(
      'reports/catalog-audit.json',
      JSON.stringify(report, null, 2)
    );
    console.log(
      `Imported ${report.rows} rows. ${report.approved} approved, ${report.flagged} flagged for review. No supplier fields exported.`
    );
  }
}
