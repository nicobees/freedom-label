import { getItemFromLocalStorage } from './localStorage';

/* Theme toggle helper */
export type AppTheme = 'dark' | 'light';

const THEME_KEY = 'app-theme';

export function applyTheme(theme: AppTheme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

export function getStoredTheme(): AppTheme | null {
  const theme = getItemFromLocalStorage<AppTheme>(THEME_KEY);

  if (theme === 'light' || theme === 'dark') return theme;

  return null;
}

export function initTheme() {
  const stored = getStoredTheme();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultTheme = prefersDark ? 'dark' : 'light';
  const initial: AppTheme = stored ?? defaultTheme;

  applyTheme(initial);
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'light' ? 'dark' : 'light');
}
