/**
 * Display titles for catalogue listings.
 *
 * The catalogue stores the seller's own product name verbatim so that an
 * enquiry can quote it back exactly. Some of those names arrive in capitals or
 * repeat the warranty label that the record already carries in its own field,
 * so rendered raw on a collection page they read like a supplier spreadsheet
 * rather than a product list.
 *
 * `displayName` is a presentation layer only. It never invents a plan, an
 * allowance or a claim: it fixes capitalisation, unifies separators, puts a
 * bracketed provider name first and removes a trailing warranty clause only
 * when that exact clause is already recorded in the warranty field. The
 * supplied name still travels in the WhatsApp enquiry, so the seller and the
 * buyer always see the same string.
 */

/** Genuine acronyms and marks, not shouting. Anything else in full capitals is sentence-cased. */
const KEEP_UPPER = new Set([
  'AI',
  'API',
  'APIS',
  'APP',
  'CEO',
  'CPU',
  'GB',
  'GPT',
  'GPU',
  'HD',
  'ID',
  'IOS',
  'IP',
  'MB',
  'OTP',
  'PC',
  'PDF',
  'PK',
  'RAM',
  'RPM',
  'SEO',
  'SIM',
  'SSD',
  'TB',
  'UK',
  'US',
  'USD',
  'VIP',
  'VPN',
  'YTB',
  '2FA',
  '3D',
  '4K',
  '8K',
]);

/** Units and joining words read better lowercase after the first word. */
const LOWER_MID = new Set([
  'Day',
  'Days',
  'Hour',
  'Hours',
  'Month',
  'Months',
  'Week',
  'Weeks',
  'Year',
  'Years',
  'Credit',
  'Credits',
  'Token',
  'Tokens',
  'A',
  'An',
  'And',
  'At',
  'By',
  'For',
  'From',
  'Has',
  'In',
  'Is',
  'Not',
  'Of',
  'Old',
  'On',
  'Or',
  'The',
  'To',
  'With',
]);

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Two-letter words that are words, not acronyms, when they appear mid-title. */
const SHORT_LOWER = new Set(['to', 'of', 'in', 'on', 'at', 'by', 'or', 'an']);

/** Marks whose casing is fixed whichever way the supplier typed them. */
const FIXED_CASE: Record<string, string> = {
  ai: 'AI',
  api: 'API',
  gpt: 'GPT',
  vpn: 'VPN',
  otp: 'OTP',
  sms: 'SMS',
  pdf: 'PDF',
  gpu: 'GPU',
  cpu: 'CPU',
  ssd: 'SSD',
  ram: 'RAM',
  seo: 'SEO',
  vip: 'VIP',
  rpm: 'RPM',
  '2fa': '2FA',
  '3d': '3D',
  '4k': '4K',
};

function caseToken(token: string) {
  const leading = token.match(/^[^A-Za-z0-9]*/)?.[0] ?? '';
  const trailing = token.match(/[^A-Za-z0-9]*$/)?.[0] ?? '';
  const core = token.slice(leading.length, token.length - trailing.length);
  if (!core) return token;

  const fixed = FIXED_CASE[core.toLowerCase()];
  if (fixed) return `${leading}${fixed}${trailing}`;

  // Quantities keep their conventional suffix: 1K, 26K, 200M, 5GB.
  const size = core.match(/^(\d+(?:\.\d+)?)([KMB])$/i);
  if (size) {
    return `${leading}${size[1]}${size[2].toUpperCase()}${trailing}`;
  }

  const short = core.toLowerCase();
  if (core.length < 3) {
    if (SHORT_LOWER.has(short)) return `${leading}${short}${trailing}`;
    return token;
  }
  if (!/^[A-Z0-9][A-Z0-9.&-]*$/.test(core)) return token;
  if (KEEP_UPPER.has(core)) return token;
  return `${leading}${short.charAt(0).toUpperCase()}${short.slice(1)}${trailing}`;
}

/**
 * Canonical casing for the brand words the listing itself belongs to. A brand
 * stored entirely in lower case (`meitu`, `express`, `railway`) carries no
 * casing information, so it is skipped rather than forced back to lower case.
 */
function brandWords(brand: string | undefined) {
  if (!brand) return [];
  return brand
    .split(/[\s&]+/)
    .map((word) => word.replace(/[^A-Za-z0-9]/g, ''))
    .filter((word) => word.length >= 3 && word !== word.toLowerCase());
}

/**
 * Remove a trailing warranty clause only when the warranty field already states
 * the same thing. The field is the record of truth; the name is a duplicate.
 */
function stripWarrantyTail(value: string, warranty: string | undefined) {
  const stated = (warranty ?? '')
    .replace(/\s*\(listed;\s*unverified\)/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!stated) return value;
  // A warranty field can simply repeat the duration (`1 year`). Only the word
  // "warranty" marks a clause that is safe to remove from the title.
  if (!/warrant/i.test(stated)) return value;

  const pattern = new RegExp(
    `[\\s,;:()\\-–—]*${escapeRegExp(stated)}[\\s)]*$`,
    'i'
  );
  const match = value.match(pattern);
  if (!match || match.index === undefined || match.index === 0) return value;

  // The match may open with a separator or bracket. What matters is the
  // character immediately before the warranty wording itself: cutting a name
  // that merely contains the word is not the same as dropping a duplicate
  // suffix.
  const coreIndex =
    match.index + match[0].toLowerCase().lastIndexOf(stated.toLowerCase());
  const before = value[coreIndex - 1];
  if (before && /[A-Za-z0-9]/.test(before)) return value;

  let stripped = value
    .slice(0, match.index)
    .replace(/[\s,;:(\-–—]+$/, '')
    .trim();

  // `... (Login Type) - full warranty`: the closing bracket belonged to the
  // removed clause, so drop the dangling opener rather than ship half a pair.
  if ((stripped.match(/\(/g)?.length ?? 0) > (stripped.match(/\)/g)?.length ?? 0)) {
    stripped = stripped.replace(/\s*\([^()]*$/, '').trim();
  }

  // `Meitu Vip+ 7D includes 5D warranty` loses its meaning without the tail;
  // never leave a sentence dangling on a connective.
  if (
    stripped.length < 3 ||
    /\b(?:includes?|with|plus|and|or|for|at|of|the|a|an)$/i.test(stripped) ||
    /[&+,]$/.test(stripped)
  ) {
    return value;
  }
  return stripped;
}

export function displayName(
  name: string,
  warranty: string | undefined = undefined,
  brand: string | undefined = undefined
): string {
  let value = name.replace(/\s+/g, ' ').trim();

  // `[Astra] API 10M ...` names the provider in the catalogue; keep it first but
  // without the bracket punctuation.
  const bracket = value.match(/^\[([^\]]{2,40})\]\s*(.+)$/);
  if (bracket) value = `${bracket[1].trim()}: ${bracket[2].trim()}`;

  value = stripWarrantyTail(value, warranty);

  const cased = value
    .split(' ')
    .map(caseToken)
    .map((token, index) =>
      index > 0 && LOWER_MID.has(token) ? token.toLowerCase() : token
    )
    .join(' ');

  // Restore the catalogue's own spelling of the brand it belongs to, so
  // `CHATGPT` and `Chatgpt` both read as `ChatGPT`.
  let restored = cased;
  for (const word of brandWords(brand)) {
    restored = restored.replace(
      new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi'),
      word
    );
  }

  return restored
    .replace(/\s*[–—]\s*/g, ' — ')
    .replace(/\s{2,}/g, ' ')
    .replace(/[\s,;:\u2013\u2014-]+$/, '')
    .trim();
}
