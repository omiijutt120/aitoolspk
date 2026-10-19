// Next.js #85374: Windows export writes nested RSC segment filenames.
// Copy to the flat filenames requested by the client. Native POSIX exports
// already have the correct paths, so this is a no-op on those builds.
import { readdirSync, copyFileSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
let repaired = 0;
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (file.endsWith('.txt')) {
      const parts = path.relative('out', file).split(path.sep);
      const index = parts.findIndex((part) => part.startsWith('__next.'));
      if (index < 0 || index === parts.length - 1) continue;
      const flat = path.join(
        'out',
        ...parts.slice(0, index),
        parts.slice(index).join('.')
      );
      if (existsSync(flat)) {
        if (!readFileSync(flat).equals(readFileSync(file)))
          throw new Error('Conflicting RSC export path');
      } else {
        copyFileSync(file, flat);
        repaired++;
      }
    }
  }
}
walk('out');
console.log(
  `Static export path check: ${repaired} Windows RSC paths repaired.`
);
