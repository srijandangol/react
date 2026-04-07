/**
 * User feature types
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive';
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  id: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: keyof User;
  sortOrder?: 'asc' | 'desc';
}
