import type { Product } from './types';
const priority = [
  'chatgpt',
  'claude',
  'canva',
  'capcut',
  'gemini',
  'notion',
  'cursor',
  'elevenlabs',
  'perplexity',
  'adobe',
  'figma',
  'lovable',
  'netflix',
  'spotify',
  'nordvpn',
  'surfshark',
  'grammarly',
  'n8n',
  'deepseek',
  'leonardo',
  'kling',
  'suno',
  'freepik',
  'microsoft',
  'google',
  'replit',
  'manus',
];
export function orderCatalog(input: Product[]): Product[] {
  const groups = new Map<string, Product[]>();
  for (const p of input) {
    const group = groups.get(p.brandSlug) || [];
    group.push(p);
    groups.set(p.brandSlug, group);
  }
  for (const group of groups.values())
    group.sort(
      (a, b) =>
        Number(b.approval === 'approved') - Number(a.approval === 'approved') ||
        Number(b.stock === 'in-stock') - Number(a.stock === 'in-stock') ||
        Number(a.risk) - Number(b.risk) ||
        a.name.length - b.name.length ||
        a.id.localeCompare(b.id)
    );
  const first = priority.flatMap(
    (brand) => groups.get(brand)?.splice(0, 1) || []
  );
  return [...first, ...Array.from(groups.values()).flat()];
}
