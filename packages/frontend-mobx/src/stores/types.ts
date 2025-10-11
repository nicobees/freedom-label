import type { LensesStore } from './lenses';
import type { ThemeStore } from './theme';

export type RootStore = {
  lensesStore: LensesStore;
  themeStore: ThemeStore;
};
