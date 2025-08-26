import { createContext, type ReactNode, useContext, useState } from 'react';

import { getItemFromLocalStorage } from '../utils/localStorage';

/* Theme toggle helper */
export type AppTheme = 'dark' | 'light';

const THEME_KEY = 'app-theme';

type ThemeContextValue<T extends AppTheme = AppTheme> = {
  theme: T;
  themeIcon: (typeof themeIconMapping)[NoInfer<T>];
  toggle: () => void;
};

const themeIconMapping = {
  dark: '🌙',
  light: '☀️',
} as const;

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

  return initial;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme: AppTheme;
}) => {
  const [theme, setTheme] = useState<AppTheme>(initialTheme);
  const themeIcon = themeIconMapping[theme];

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      applyTheme(next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, themeIcon, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
