/**
 * useUpdateUser hook - Mutation for updating user
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../../api/users.api';
import type { UpdateUserInput } from '../types';

export const useUpdateUser = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateUserInput & { id: string }) =>
      usersApi.updateUser(id, { id, ...data }).then((res) => res.data),
    onSuccess: async (updatedUser) => {
      // Invalidate and refetch users list
      await queryClient.invalidateQueries({ queryKey: ['users'] });

      // Update cache
      queryClient.setQueryData(['user', updatedUser.id], updatedUser);

      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      const message =
        typeof (error as { message?: unknown })?.message === 'string'
          ? (error as { message?: string }).message
          : 'Unknown error';
      console.error('Failed to update user:', message);
    },
  });
};
