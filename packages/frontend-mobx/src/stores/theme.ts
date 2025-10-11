import { action, computed, makeObservable, observable, reaction } from 'mobx';

import { getItemFromLocalStorage } from '../utils/localStorage';

export type AppTheme = 'dark' | 'light';

const THEME_KEY = 'app-theme';

const themeIconMapping = {
  dark: '🌙',
  light: '☀️',
} as const;

export class ThemeStore {
  disposeApplyTheme: () => void;
  theme: AppTheme;

  get themeIcon() {
    return themeIconMapping[this.theme];
  }

  constructor() {
    makeObservable(this, {
      theme: observable,
      themeIcon: computed,
      toggle: action,
    });

    this.theme = this.initTheme();

    this.disposeApplyTheme = reaction(
      () => this.theme,
      (theme) => {
        this.applyTheme(theme);
      },
      { fireImmediately: true },
    );
  }

  dispose() {
    this.disposeApplyTheme();
  }

  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }

  private applyTheme(theme: AppTheme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  private getStoredTheme(): AppTheme | null {
    const theme = getItemFromLocalStorage<AppTheme>(THEME_KEY);

    if (theme === 'light' || theme === 'dark') return theme;

    return null;
  }

  private initTheme() {
    const stored = this.getStoredTheme();
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    const defaultTheme = prefersDark ? 'dark' : 'light';
    const initial: AppTheme = stored ?? defaultTheme;

    return initial;
  }
}
