/**
 * React Query configuration and client setup
 */

import { QueryClient } from '@tanstack/react-query';
import type { DefaultOptions } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
  mutations: {
    retry: 1,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
