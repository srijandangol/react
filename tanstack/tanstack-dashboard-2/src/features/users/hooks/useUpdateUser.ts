import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../../api/users.api';
import type { UpdateUserInput, User } from '../types';

export const useUpdateUser = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateUserInput) =>
      usersApi.updateUser(id, { id, ...data }).then((res) => res.data),

    onSuccess: async (updatedUser: User) => {
      await queryClient.invalidateQueries({
        queryKey: ['users'],
        exact: false,
      });

      queryClient.setQueryData(['user', updatedUser.id], updatedUser);

      onSuccess?.();
    },
  });
};