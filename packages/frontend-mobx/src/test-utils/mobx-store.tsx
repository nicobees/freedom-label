import type { PropsWithChildren, ReactElement } from 'react';

import { render } from '@testing-library/react';

import { RootStoreProvider } from '../stores';

export const RootStoreWrapper = ({ children }: PropsWithChildren) => (
  <RootStoreProvider>{children}</RootStoreProvider>
);

export const withRootStoreWrapper = (ui: ReactElement) => {
  return render(ui, { wrapper: RootStoreWrapper });
};
