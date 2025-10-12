import type { LabelStore } from './labels';
import type { LabelListStore } from './labelsList';
import type { ThemeStore } from './theme';

export type RootStore = {
  labelsListStore: LabelListStore;
  labelsStore: LabelStore;
  themeStore: ThemeStore;
};
