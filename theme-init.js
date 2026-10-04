// Apply the saved theme before the page paints. Kept external for the CSP.
(() => {
  let theme = 'dark';
  try {
    const saved = localStorage.getItem('theme');
    theme = saved === 'light' || saved === 'dark'
      ? saved
      : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  } catch (_) { /* Use the default if browser storage is unavailable. */ }
  document.documentElement.setAttribute('data-theme', theme);
})();
