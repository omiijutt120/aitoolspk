import sharp from 'sharp';
for (const brand of ['figma', 'cursor', 'elevenlabs']) {
  const file = `public/logos/${brand}-source.svg`;
  await sharp(file, { density: brand === 'figma' ? 600 : 100 })
    .resize(192, 192, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .webp({ quality: 95 })
    .toFile(`public/logos/${brand}.webp`);
}
console.log(
  'Prepared three first-party brand-kit assets; other brands use truthful text names.'
);
