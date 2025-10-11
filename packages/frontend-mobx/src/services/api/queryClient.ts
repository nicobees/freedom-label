import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: 0,
    },
    queries: {
      gcTime: 5 * 60_000,
      retry: 1,
      staleTime: 30_000,
    },
  },
});
