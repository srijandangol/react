/**
 * useDeleteUser hook - Mutation for deleting user
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../../api/users.api';

export const useDeleteUser = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: async (_, userId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['user', userId] });

      // Invalidate and refetch users list
      await queryClient.invalidateQueries({ queryKey: ['users'] });

      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      const message =
        typeof (error as { message?: unknown })?.message === 'string'
          ? (error as { message?: string }).message
          : 'Unknown error';
      console.error('Failed to delete user:', message);
    },
  });
};
