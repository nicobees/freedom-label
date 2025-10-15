import type { HeaderStore } from './header';
import type { LabelStore } from './labels';
import type { LabelListStore } from './labelsList';
import type { ThemeStore } from './theme';

export type RootStore = {
  headerStore: HeaderStore;
  labelsListStore: LabelListStore;
  labelsStore: LabelStore;
  themeStore: ThemeStore;
};
