/**
 * useCreateUser hook - Mutation for creating new user
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../../api/users.api';
import type { CreateUserInput } from '../types';

export const useCreateUser = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) =>
      usersApi.createUser(data).then((res) => res.data),
    onSuccess: async (newUser) => {
      // Invalidate and refetch users list
      await queryClient.invalidateQueries({ queryKey: ['users'] });

      // Add to cache
      queryClient.setQueryData(['user', newUser.id], newUser);

      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      const message =
        typeof (error as { message?: unknown })?.message === 'string'
          ? (error as { message?: string }).message
          : 'Unknown error';
      console.error('Failed to create user:', message);
    },
  });
};
