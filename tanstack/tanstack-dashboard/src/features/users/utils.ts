/**
 * User feature utility functions
 */

import type { CreateUserInput, User } from './types';

type UserFormValidationData = Partial<Record<keyof CreateUserInput, unknown>>;

export const getUserStatusColor = (status: User['status']): string => {
  return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

export const getUserRoleBadgeColor = (role: User['role']): string => {
  const colors: Record<User['role'], string> = {
    admin: 'bg-purple-100 text-purple-800',
    user: 'bg-blue-100 text-blue-800',
    viewer: 'bg-gray-100 text-gray-800',
  };
  return colors[role];
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUserForm = (
  data: UserFormValidationData
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  const name = String(data.name ?? '');
  const email = String(data.email ?? '');
  const role = String(data.role ?? '');
  const status = String(data.status ?? '');

  if (!name.trim()) errors.name = 'Name is required';
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Invalid email format';
  }
  if (!role) errors.role = 'Role is required';
  if (!status) errors.status = 'Status is required';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
