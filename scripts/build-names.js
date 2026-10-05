import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
const names = [...new Set([...css.matchAll(/^\.(switch_icon_[A-Za-z0-9_]+):before/gm)].map((match) => match[1]))];

fs.writeFileSync(path.join(root, 'names.json'), `${JSON.stringify(names, null, 2)}\n`);
fs.writeFileSync(
  path.join(root, 'names.js'),
  `const ICON_NAMES = ${JSON.stringify(names)};\nexport default ICON_NAMES;\n`
);
fs.writeFileSync(
  path.join(root, 'html', 'names-embed.js'),
  `window.SWITCH_ICON_NAMES = ${JSON.stringify(names)};\n`
);
console.log(`Wrote ${names.length} icon names`);
