import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { SnackbarHost } from './components/Feedback/Snackbar';
import { FeedbackProvider } from './contexts/FeedbackContext';
import { initTheme, ThemeProvider } from './contexts/theme';
import { router } from './routes/index';
import './styles/global.css';
import { queryClient } from './services/queryClient';

// Initialize theme
const initialTheme = initTheme();

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
