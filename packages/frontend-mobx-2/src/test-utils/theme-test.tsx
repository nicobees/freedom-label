import type { PropsWithChildren, ReactElement } from 'react';

import { render } from '@testing-library/react';

import { ThemeProvider } from '../contexts/theme';

export const ThemeWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProvider initialTheme="light">{children}</ThemeProvider>
);

export const withThemeWrapper = (ui: ReactElement) => {
  return render(ui, { wrapper: ThemeWrapper });
};
