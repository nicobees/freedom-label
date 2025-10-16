import { useLocalObservable } from 'mobx-react-lite';
import { createContext, type ReactNode, useContext } from 'react';

import type { RootStore } from './types';

import { EditLabelStore } from './editLabel';
import { HeaderStore } from './header';
import { LabelStore } from './labels';
import { LabelListStore } from './labelsList';
import { ThemeStore } from './theme';

const labelsStore = new LabelStore();
const labelsListStore = new LabelListStore(labelsStore);
const headerStore = new HeaderStore();
const editLabelStore = new EditLabelStore();
const themeStore = new ThemeStore();

const rootStore: RootStore = {
  editLabelStore,
  headerStore,
  labelsListStore,
  labelsStore,
  themeStore,
};

const rootStoreContext = createContext<RootStore | undefined>(undefined);

export const RootStoreProvider = ({ children }: { children: ReactNode }) => {
  const store = useLocalObservable(() => rootStore);

  return (
    <rootStoreContext.Provider value={store}>
      {children}
    </rootStoreContext.Provider>
  );
};

export function useRootStore() {
  const ctx = useContext(rootStoreContext);
  if (!ctx)
    throw new Error('useRootStore must be used within a RootStoreProvider');
  return ctx;
}
