/**
 * useUsers hook - Fetch all users with pagination
 */

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../../../api/users.api';
import type { PaginationParams, UsersResponse } from '../types';

export const useUsers = (params?: PaginationParams) => {
  return useQuery<UsersResponse>({
    queryKey: ['users', params],
    queryFn: () => usersApi.getUsers(params).then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * useUser hook - Fetch single user by ID
 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getUserById(id).then((res) => res.data),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};