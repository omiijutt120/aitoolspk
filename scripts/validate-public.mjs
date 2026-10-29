import { readFileSync, existsSync } from 'node:fs';
const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8'));
const allowed = [
  'id',
  'slug',
  'name',
  'brand',
  'brandSlug',
  'category',
  'price',
  'duration',
  'warranty',
  'access',
  'credits',
  'stock',
  'approval',
  'description',
  'date',
  'logo',
  'purchasable',
  'risk',
  'renewal',
  'sourceType',
  'sellerWarranty',
  'summary',
  'features',
  'exclusions',
  'fairUsage',
  'notes',
  'variantGroup',
  'durationMonths',
  'referencePrice',
];
if (!Array.isArray(catalog) || !catalog.length)
  throw new Error('Catalog is empty');
for (const p of catalog) {
  if (Object.keys(p).some((k) => !allowed.includes(k)))
    throw new Error('Unexpected public field');
  if (!Number.isSafeInteger(p.price) || p.price <= 0)
    throw new Error(`Invalid retail price ${p.id}`);
  if (!/^PK-[A-F0-9]{12}$/.test(p.id)) throw new Error('Invalid public ID');
  if (p.logo && !existsSync(`public${p.logo}`))
    throw new Error(`Missing logo ${p.logo}`);
  if (p.purchasable && (p.approval !== 'approved' || p.stock !== 'in-stock'))
    throw new Error('Unsafe purchase state');
}
const publicIndex = JSON.parse(
  readFileSync('public/catalog/index.json', 'utf8')
);
if (
  JSON.stringify(publicIndex) !==
  JSON.stringify(catalog.filter((p) => p.approval !== 'excluded'))
)
  throw new Error('Public index is out of sync; reimport');
console.log(
  `Validated ${catalog.length} sanitized records and matching public index.`
);
