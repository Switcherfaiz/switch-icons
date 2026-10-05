(function () {
  const BATCH = 96;
  const names = window.SWITCH_ICON_NAMES || [];
  const grid = document.getElementById('icons-grid');
  const search = document.getElementById('icons-search-input');
  const moreWrap = document.getElementById('icons-load-more-wrap');
  const moreBtn = document.getElementById('icons-load-more');
  const dim = document.getElementById('sheet-dim');
  const toast = document.getElementById('toast');
  if (!grid) return;

  let filtered = names.slice();
  let shown = BATCH;
  let index = 0;

  function shortName(key) {
    return String(key || '').replace(/^switch_icon_/, '');
  }
  function displayName(key) {
    return shortName(key).replace(/_/g, '-');
  }
  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function filterKeys(query) {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return names.slice();
    const needle = q.replace(/\s+/g, '_');
    return names.filter((key) => {
      const label = shortName(key).replace(/_/g, ' ');
      return key.toLowerCase().includes(needle) || label.includes(q);
    });
  }
  function tile(key) {
    const label = displayName(key);
    return `<button type="button" class="icon-tile" data-icon="${escapeHtml(key)}">
      <span class="${escapeHtml(key)} icon-glyph"></span>
      <span class="icon-tooltip">${escapeHtml(label)}</span>
    </button>`;
  }
  function formatCount(n) {
    return Number(n).toLocaleString();
  }
  function paintCount() {
    const el = document.getElementById('icons-count');
    if (el) {
      el.textContent = filtered.length === names.length
        ? `${formatCount(names.length)} icons`
        : `${formatCount(filtered.length)} of ${formatCount(names.length)}`;
    }
    if (search) search.placeholder = `Search ${formatCount(names.length)} icons...`;
  }
  function paintGrid() {
    const visible = filtered.slice(0, shown);
    grid.innerHTML = visible.map(tile).join('');
    if (moreWrap) moreWrap.style.display = filtered.length > shown ? '' : 'none';
    paintCount();
  }
  function currentKey() {
    return filtered[index] || '';
  }
  function spanSnippet(key) {
    return `<span class="${key}"></span>`;
  }
  function swSnippet(key) {
    return `import 'switch-framework-icons'; // registerComponent

render() {
  return \`<sw-icon name="${shortName(key)}" size="18"></sw-icon>\`;
}`;
  }
  function showToast(text) {
    if (!toast) return;
    toast.hidden = false;
    toast.textContent = text;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { toast.hidden = true; }, 1400);
  }
  async function copyText(text, okLabel) {
    try { await navigator.clipboard.writeText(text); showToast(okLabel || 'Copied'); }
    catch (_) { showToast('Copy failed'); }
  }
  function parseUnicodeFromCssContent(content) {
    if (content == null || content === 'none' || content === 'normal') return null;
    const s = String(content).trim().replace(/^["']|["']$/g, '');
    if (s.length === 1 || [...s].length === 1) {
      const cp = s.codePointAt(0);
      if (cp && cp > 0x20) return cp;
    }
    let match = s.match(/^\\e([0-9a-fA-F]{3,6})$/i);
    if (match) return parseInt(match[1], 16);
    match = s.match(/\\([0-9a-fA-F]{2,6})/);
    if (match) return parseInt(match[1], 16);
    return null;
  }
  function iconCodePoint(key) {
    const span = document.createElement('span');
    span.className = key;
    span.style.cssText = 'position:absolute;left:-9999px;font-size:24px;';
    document.body.appendChild(span);
    try {
      return parseUnicodeFromCssContent(getComputedStyle(span, '::before').getPropertyValue('content'));
    } finally {
      document.body.removeChild(span);
    }
  }
  function updateSheet() {
    const key = currentKey();
    const preview = document.getElementById('icon-sheet-preview-glyph');
    const nameEl = document.getElementById('icon-sheet-name');
    const tagsEl = document.getElementById('icon-sheet-tags');
    const codeEl = document.getElementById('icon-sheet-code-content');
    const prevBtn = document.getElementById('icon-sheet-prev');
    const nextBtn = document.getElementById('icon-sheet-next');
    if (preview) preview.className = `${key} icon-preview-glyph`;
    if (nameEl) nameEl.textContent = displayName(key);
    if (tagsEl) tagsEl.textContent = shortName(key).split('_').join(' • ');
    if (codeEl) codeEl.textContent = swSnippet(key);
    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index >= filtered.length - 1;
  }
  function openSheet(key) {
    index = Math.max(0, filtered.indexOf(key));
    dim.classList.add('open');
    updateSheet();
  }
  function closeSheet() {
    dim.classList.remove('open');
  }

  paintGrid();
  search?.addEventListener('input', () => {
    filtered = filterKeys(search.value);
    shown = BATCH;
    paintGrid();
  });
  moreBtn?.addEventListener('click', () => {
    shown += BATCH;
    paintGrid();
  });
  grid.addEventListener('click', (event) => {
    const tileEl = event.target.closest('.icon-tile');
    if (tileEl) openSheet(tileEl.getAttribute('data-icon'));
  });
  dim?.addEventListener('click', (event) => {
    if (event.target === dim) closeSheet();
  });
  document.getElementById('icon-sheet-close')?.addEventListener('click', closeSheet);
  document.getElementById('icon-sheet-prev')?.addEventListener('click', () => {
    index = Math.max(0, index - 1);
    updateSheet();
  });
  document.getElementById('icon-sheet-next')?.addEventListener('click', () => {
    index = Math.min(filtered.length - 1, index + 1);
    updateSheet();
  });
  document.getElementById('icon-sheet-copy-code')?.addEventListener('click', () => {
    copyText(swSnippet(currentKey()), 'Copied Switch snippet');
  });
  document.getElementById('icon-sheet-copy-span')?.addEventListener('click', () => {
    copyText(spanSnippet(currentKey()), 'Copied span');
  });
  document.getElementById('icon-sheet-copy-sw')?.addEventListener('click', () => {
    copyText(`<sw-icon name="${shortName(currentKey())}" size="18"></sw-icon>`, 'Copied sw-icon');
  });
  document.getElementById('icon-sheet-copy-svg')?.addEventListener('click', async () => {
    const key = currentKey();
    const codePoint = iconCodePoint(key);
    const fontUrl = new URL('../fonts/switch-icons.woff', window.location.href).href;
    let svg;
    if (codePoint != null && Number.isFinite(codePoint)) {
      const ch = String.fromCodePoint(codePoint)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><defs><style>@font-face{font-family:swi;src:url('${fontUrl}') format('woff');}</style></defs><text x="12" y="17" font-family="swi,sans-serif" font-size="18" text-anchor="middle" fill="currentColor">${ch}</text></svg>`;
    } else {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><text x="12" y="17" text-anchor="middle">?</text></svg>`;
    }
    copyText(svg, 'Copied SVG');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeSheet();
  });
})();
