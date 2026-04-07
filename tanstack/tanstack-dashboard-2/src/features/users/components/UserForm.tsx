/**
 * UserForm Component - Form for creating/editing users
 */

import React, { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { validateUserForm } from '../utils';
import type { CreateUserInput, UpdateUserInput, User } from '../types';

interface UserFormProps {
  user?: User;
  isLoading?: boolean;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => void;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  isLoading = false,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateUserInput>({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    status: user?.status || 'active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { valid, errors: validationErrors } = validateUserForm(formData);

    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    if (user) {
      onSubmit({ id: user.id, ...formData } as UpdateUserInput);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          {errors.role && <span className="text-sm text-red-500">{errors.role}</span>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && <span className="text-sm text-red-500">{errors.status}</span>}
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isLoading}>
          {user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};
