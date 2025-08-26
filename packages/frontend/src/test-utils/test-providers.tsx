import type { ReactElement, ReactNode } from 'react';

import { render } from '@testing-library/react';

import { FeedbackProvider } from '../contexts/FeedbackContext';
import { ReactQueryWrapper } from './react-query';
import { ThemeWrapper } from './theme-test';

const CombinedWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeWrapper>
    <ReactQueryWrapper>
      <FeedbackProvider>{children}</FeedbackProvider>
    </ReactQueryWrapper>
  </ThemeWrapper>
);

export const withProviders = (ui: ReactElement) => {
  return render(ui, { wrapper: CombinedWrapper });
};
