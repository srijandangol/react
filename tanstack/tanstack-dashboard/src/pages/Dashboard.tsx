/**
 * Dashboard Page - Main dashboard with overview and stats
 */

import React, { useState } from 'react';
import { useUsers } from '../features/users/hooks/useUsers';
import { useCreateUser } from '../features/users/hooks/useCreateUser';
import { useUpdateUser } from '../features/users/hooks/useUpdateUser';
import { useDeleteUser } from '../features/users/hooks/useDeleteUser';
import { UsersTable } from '../features/users/components/UsersTable';
import { UserForm } from '../features/users/components/UserForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import type { User, CreateUserInput, UpdateUserInput } from '../features/users/types';

export const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Queries and mutations
  const { data: usersData, isLoading: isLoadingUsers } = useUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });
  const createUserMutation = useCreateUser(() => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  });
  const updateUserMutation = useUpdateUser(() => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  });
  const deleteUserMutation = useDeleteUser();

  const handleOpenModal = (user?: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleFormSubmit = (data: CreateUserInput | UpdateUserInput) => {
    if ('id' in data) {
      updateUserMutation.mutate(data as UpdateUserInput);
    } else {
      createUserMutation.mutate(data as CreateUserInput);
    }
  };

  const handleDelete = (user: User) => {
    deleteUserMutation.mutate(user.id);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Button
          variant="primary"
          onClick={() => handleOpenModal()}
        >
          + New User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm font-medium">Total Users</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {usersData?.total || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm font-medium">Active Users</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {usersData?.users?.filter((u) => u.status === 'active').length || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm font-medium">Admins</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {usersData?.users?.filter((u) => u.role === 'admin').length || 0}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable
        data={usersData?.users || []}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        isLoading={isLoadingUsers}
        totalCount={usersData?.total || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedUser ? 'Edit User' : 'Create New User'}
        footer={null}
      >
        <UserForm
          key={selectedUser ? selectedUser.id : 'new'}
          user={selectedUser}
          isLoading={createUserMutation.isPending || updateUserMutation.isPending}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};
