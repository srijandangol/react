/**
 * App providers - React Query, Router, and other context
 */

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/react-query';
import { Router } from './router';

export const Providers: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
};
