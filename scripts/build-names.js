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

const cells = names.map((name) => {
  const short = name.replace(/^switch_icon_/, '');
  return `    <button type="button" class="cell" data-name="${name}" title="${name}"><span class="${name}" aria-hidden="true"></span><code>${short}</code></button>`;
}).join('\n');

const catalog = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>switch-icons catalog</title>
  <link rel="stylesheet" href="../style.css" />
  <link rel="stylesheet" href="./page.css" />
</head>
<body>
  <header class="hero">
    <a href="./index.html">Instructions</a>
    <h1>${names.length} icons</h1>
    <p>Click a cell to copy <code>switch_icon_…</code>. This page works after <code>npm i switch-icons</code> — open <code>node_modules/switch-icons/html/icons.html</code>.</p>
    <input id="q" type="search" placeholder="Filter icons" autocomplete="off" />
  </header>
  <main id="grid" class="grid">
${cells}
  </main>
  <p id="toast" hidden></p>
  <script>
    const q = document.getElementById('q');
    const toast = document.getElementById('toast');
    const cells = [...document.querySelectorAll('.cell')];
    q.addEventListener('input', () => {
      const value = q.value.trim().toLowerCase();
      cells.forEach((cell) => {
        cell.hidden = value ? !cell.dataset.name.toLowerCase().includes(value) : false;
      });
    });
    document.getElementById('grid').addEventListener('click', async (event) => {
      const cell = event.target.closest('.cell');
      if (!cell) return;
      const name = cell.dataset.name;
      try { await navigator.clipboard.writeText(name); } catch (_) {}
      toast.hidden = false;
      toast.textContent = 'Copied ' + name;
      clearTimeout(toast._t);
      toast._t = setTimeout(() => { toast.hidden = true; }, 1400);
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, 'html', 'icons.html'), catalog);
console.log(`Wrote ${names.length} icon names`);
