import { readdir, stat } from 'node:fs/promises';
import sharp from 'sharp';

// Keep official master assets for details; ship small thumbnails on cards.
const assets = (await readdir('public/logos'))
  .filter((name) => name.endsWith('.webp') && !name.endsWith('.small.webp'))
  .map((name) => [
    `public/logos/${name}`,
    `public/logos/${name.replace(/\.webp$/, '.small.webp')}`,
  ]);
assets.push(['public/brand/symbol.webp', 'public/brand/symbol-small.webp']);
let written = 0;
for (const [input, output] of assets) {
  const original = await stat(input);
  const thumbnail = await stat(output).catch(() => null);
  if (thumbnail && thumbnail.mtimeMs >= original.mtimeMs) continue;
  await sharp(input)
    .resize(96, 96, { fit: 'contain', withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(output);
  written++;
}
console.log(
  `Prepared ${assets.length} local logo thumbnails (${written} updated).`
);
