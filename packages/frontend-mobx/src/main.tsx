import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { FeedbackProvider } from './contexts/FeedbackContext';
import { initI18n } from './i18n';
import { router } from './routes/index';
import { queryClient } from './services/api/queryClient';
import './styles/global.css';
import { RootStoreProvider } from './stores';
// Initialize i18n (synchronously for now)
initI18n();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RootStoreProvider>
        <FeedbackProvider>
          <RouterProvider router={router} />
        </FeedbackProvider>
      </RootStoreProvider>
    </QueryClientProvider>
  </StrictMode>,
);
