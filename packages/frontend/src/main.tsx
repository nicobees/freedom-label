import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { SnackbarHost } from './components/Feedback/Snackbar';
import { FeedbackProvider } from './contexts/FeedbackContext';
import { initTheme, ThemeProvider } from './contexts/theme';
import { initI18n } from './i18n';
import { router } from './routes/index';
import { queryClient } from './services/queryClient';
import './styles/global.css';
// Initialize theme & i18n (synchronously for now)
const initialTheme = initTheme();
initI18n();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider initialTheme={initialTheme}>
      <QueryClientProvider client={queryClient}>
        <FeedbackProvider>
          <RouterProvider router={router} />
          <SnackbarHost />
        </FeedbackProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
