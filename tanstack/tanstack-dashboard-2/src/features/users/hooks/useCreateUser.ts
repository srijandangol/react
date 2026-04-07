import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../../api/users.api';
import type { CreateUserInput } from '../types';

export const useCreateUser = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) =>
      usersApi.createUser(data).then((res) => res.data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users'],
        exact: false,
      });

      onSuccess?.();
    },
  });
};