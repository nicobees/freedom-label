import type { ReactElement, ReactNode } from 'react';

import { render } from '@testing-library/react';

import { FeedbackProvider } from '../contexts/FeedbackContext';
import { initI18n } from '../i18n';
import { RootStoreWrapper } from './mobx-store';
import { ReactQueryWrapper } from './react-query';

const CombinedWrapper = ({ children }: { children: ReactNode }) => {
  initI18n();

  return (
    <ReactQueryWrapper>
      <RootStoreWrapper>
        <FeedbackProvider>{children}</FeedbackProvider>
      </RootStoreWrapper>
    </ReactQueryWrapper>
  );
};

export const withProviders = (ui: ReactElement) => {
  return render(ui, { wrapper: CombinedWrapper });
};
