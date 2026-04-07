/**
 * Users API endpoints backed by localStorage
 */

import type { ApiResponse } from '../types';
import type {
  CreateUserInput,
  UpdateUserInput,
  UsersResponse,
  PaginationParams,
  User,
} from '../features/users/types';

const STORAGE_KEY = 'tanstack-dashboard-users';

const defaultUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Turner',
    email: 'alex.turner@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-01T12:00:00.000Z',
    updatedAt: '2025-01-01T12:00:00.000Z',
  },
  {
    id: 'user-2',
    name: 'Mia Johnson',
    email: 'mia.johnson@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2025-02-15T14:30:00.000Z',
    updatedAt: '2025-02-15T14:30:00.000Z',
  },
  {
    id: 'user-3',
    name: 'Noah Kim',
    email: 'noah.kim@example.com',
    role: 'viewer',
    status: 'inactive',
    createdAt: '2025-03-20T09:45:00.000Z',
    updatedAt: '2025-03-20T09:45:00.000Z',
  },
];

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const parseStoredUsers = (value: string | null): User[] => {
  if (!value) return defaultUsers;

  try {
    return JSON.parse(value) as User[];
  } catch {
    return defaultUsers;
  }
};

const getStoredUsers = (): User[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const users = parseStoredUsers(raw);

  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  return users;
};

const setStoredUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const applySearch = (users: User[], search?: string) => {
  if (!search) return users;

  const query = search.trim().toLowerCase();
  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.status.toLowerCase().includes(query)
  );
};

const applySort = (
  users: User[],
  sortBy?: keyof User,
  sortOrder: 'asc' | 'desc' = 'asc'
) => {
  if (!sortBy) return users;

  return [...users].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    if (valueA === valueB) return 0;
    const result = valueA > valueB ? 1 : -1;
    return sortOrder === 'desc' ? -result : result;
  });
};

const buildResponse = <T>(data: T): ApiResponse<T> => ({
  data,
  status: 200,
});

export const usersApi = {
  getUsers: (params?: PaginationParams): Promise<ApiResponse<UsersResponse>> => {
    const page = Math.max(1, params?.page ?? 1);
    const limit = Math.max(1, params?.limit ?? 10);

    const users = getStoredUsers();
    const filtered = applySort(applySearch(users, params?.search), params?.sortBy, params?.sortOrder ?? 'asc');
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const pagedUsers = filtered.slice(startIndex, startIndex + limit);

    return Promise.resolve(
      buildResponse({
        users: pagedUsers,
        total,
        page,
        limit,
      })
    );
  },

  getUserById: (id: string): Promise<ApiResponse<User>> => {
    const users = getStoredUsers();
    const user = users.find((item) => item.id === id);

    if (!user) {
      return Promise.reject({ message: 'User not found', status: 404 });
    }

    return Promise.resolve(buildResponse(user));
  },

  createUser: (data: CreateUserInput): Promise<ApiResponse<User>> => {
    const users = getStoredUsers();
    const now = new Date().toISOString();
    const newUser: User = {
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      ...data,
    };

    const updatedUsers = [newUser, ...users];
    setStoredUsers(updatedUsers);

    return Promise.resolve(buildResponse(newUser));
  },

  updateUser: (id: string, data: UpdateUserInput): Promise<ApiResponse<User>> => {
    const users = getStoredUsers();
    const index = users.findIndex((item) => item.id === id);

    if (index === -1) {
      return Promise.reject({ message: 'User not found', status: 404 });
    }

    const updatedUser: User = {
      ...users[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    users[index] = updatedUser;
    setStoredUsers(users);

    return Promise.resolve(buildResponse(updatedUser));
  },

  deleteUser: (id: string): Promise<ApiResponse<void>> => {
    const users = getStoredUsers();
    const updatedUsers = users.filter((item) => item.id !== id);

    setStoredUsers(updatedUsers);
    return Promise.resolve(buildResponse(undefined));
  },

  bulkDeleteUsers: (ids: string[]): Promise<ApiResponse<void>> => {
    const users = getStoredUsers();
    const updatedUsers = users.filter((item) => !ids.includes(item.id));

    setStoredUsers(updatedUsers);
    return Promise.resolve(buildResponse(undefined));
  },
};