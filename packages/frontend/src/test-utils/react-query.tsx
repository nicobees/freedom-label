import type { PropsWithChildren, ReactElement } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ turns retries off
      retry: false,
    },
  },
});

const ReactQueryWrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export const withReactQuery = (ui: ReactElement) => {
  return render(<ReactQueryWrapper>{ui}</ReactQueryWrapper>);
};
