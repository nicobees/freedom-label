import type { PropsWithChildren, ReactElement } from 'react';

import { render } from '@testing-library/react';

import { ReactQueryWrapper } from './react-query';
import { ThemeWrapper } from './theme-test';

type Provider = React.ComponentType<PropsWithChildren>;

const composeProviders =
  (...providers: Provider[]): Provider =>
  ({ children }) =>
    providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children,
    );

// Compose in desired order (outermost first in the list)
const CombinedWrapper = composeProviders(ThemeWrapper, ReactQueryWrapper);

export const withProviders = (ui: ReactElement) => {
  return render(ui, { wrapper: CombinedWrapper });
};
