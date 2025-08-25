import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { router } from './routes/index';
import './styles/global.css';
import { queryClient } from './services/queryClient';
import { initTheme, ThemeProvider } from './utils/theme';

// Initialize theme
const initialTheme = initTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider initialTheme={initialTheme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
