import { useLocalObservable } from 'mobx-react-lite';
import { createContext, type ReactNode, useContext } from 'react';

import type { RootStore } from './types';

import { LensesStore } from './lenses';
import { ThemeStore } from './theme';

const rootStore: RootStore = {
  lensesStore: new LensesStore(),
  themeStore: new ThemeStore(),
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
