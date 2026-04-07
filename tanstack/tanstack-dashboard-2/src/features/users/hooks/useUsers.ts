import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usersApi } from '../../../api/users.api';
import type { PaginationParams, UsersResponse } from '../types';

export const useUsers = (params?: PaginationParams) => {
  return useQuery<UsersResponse>({
    queryKey: ['users', params?.page, params?.limit], // ✅ FIXED KEY
    queryFn: () => usersApi.getUsers(params).then((res) => res.data),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
};