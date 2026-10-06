(function () {
  const KEY = 'switch-framework-icons-theme';
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (_) {}
  }
  let start = 'light';
  try { start = localStorage.getItem(KEY) || start; } catch (_) {}
  if (!localStorage.getItem(KEY) && window.matchMedia?.('(prefers-color-scheme: dark)').matches) start = 'dark';
  apply(start);
  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-theme-toggle]')) return;
    apply(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
})();
