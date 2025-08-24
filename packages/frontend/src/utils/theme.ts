/* Theme toggle helper */
export type AppTheme = 'dark' | 'light';

const THEME_KEY = 'app-theme';

export function applyTheme(theme: AppTheme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

export function getStoredTheme(): AppTheme | null {
  const v = localStorage.getItem(THEME_KEY);
  if (v === 'light' || v === 'dark') return v;

  return null;
}

export function initTheme() {
  const stored = getStoredTheme();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial: AppTheme = stored ?? (prefersDark ? 'dark' : 'light');
  applyTheme(initial);
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'light' ? 'dark' : 'light');
}
