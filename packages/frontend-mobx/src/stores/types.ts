import type { LabelStore } from './lenses';
import type { LabelListStore } from './lensesList';
import type { ThemeStore } from './theme';

export type RootStore = {
  labelsListStore: LabelListStore;
  labelsStore: LabelStore;
  themeStore: ThemeStore;
};
