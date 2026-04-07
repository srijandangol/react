import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../../api/users.api';

export const useDeleteUser = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),

    onSuccess: async (_, userId) => {
      // remove single user cache
      queryClient.removeQueries({ queryKey: ['user', userId] });

      // 🔥 refetch users
      await queryClient.invalidateQueries({
        queryKey: ['users'],
        exact: false,
      });

      onSuccess?.();
    },
  });
};