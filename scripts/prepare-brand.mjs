import sharp from 'sharp';
import { writeFileSync, readFileSync } from 'node:fs';
await sharp('public/brand/logo.png')
  .resize(256, 256)
  .webp({ quality: 90 })
  .toFile('public/brand/symbol.webp');
for (const [name, size] of [
  ['favicon-16', 16],
  ['favicon-32', 32],
  ['apple-touch-icon', 180],
  ['logo-192', 192],
])
  await sharp('public/brand/logo.png')
    .resize(size, size)
    .png()
    .toFile(`public/brand/${name}.png`);
const png = readFileSync('public/brand/favicon-32.png');
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = 32;
header[7] = 32;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
writeFileSync('public/favicon.ico', Buffer.concat([header, png]));
const social = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f7f8fa"/><path d="M60 525H1140" stroke="#dfe2e6"/><text x="65" y="290" font-family="Arial, sans-serif" font-size="95" font-weight="700" letter-spacing="-5" fill="#15171a">AiToolsPk</text><text x="70" y="365" font-family="Arial, sans-serif" font-size="32" fill="#626871">Digital tools. Clearer choices. Prices in PKR.</text><text x="70" y="572" font-family="Arial, sans-serif" font-size="23" fill="#626871">AiToolsPk.tech</text></svg>'
);
await sharp(social)
  .composite([
    {
      input: await sharp('public/brand/logo.png').resize(200).toBuffer(),
      top: 207,
      left: 935,
    },
  ])
  .png()
  .toFile('public/brand/social.png');
console.log(
  'Generated favicon, Apple icon, app icon and social card from supplied branding.'
);
