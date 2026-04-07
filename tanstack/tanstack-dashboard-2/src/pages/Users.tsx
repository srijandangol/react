import React, { useState } from 'react';
import { UsersTable } from '../features/users/components/UsersTable';
import { UserForm } from '../features/users/components/UserForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

import { useUsers } from '../features/users/hooks/useUsers';
import { useCreateUser } from '../features/users/hooks/useCreateUser';
import { useUpdateUser } from '../features/users/hooks/useUpdateUser';
import { useDeleteUser } from '../features/users/hooks/useDeleteUser';

import type { User, CreateUserInput, UpdateUserInput } from '../features/users/types';

export const UsersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const createUser = useCreateUser(() => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  });

  const updateUser = useUpdateUser(() => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  });

  const deleteUser = useDeleteUser();

  const handleOpenModal = (user?: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleSubmit = (data: CreateUserInput | UpdateUserInput) => {
    if ('id' in data) {
      updateUser.mutate(data as UpdateUserInput);
    } else {
      createUser.mutate(data as CreateUserInput);
    }
  };

  const handleDelete = (user: User) => {
    deleteUser.mutate(user.id);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button onClick={() => handleOpenModal()}>
          + New User
        </Button>
      </div>

      {/* Table */}
      <UsersTable
        data={data?.users || []}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        isLoading={isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedUser ? 'Edit User' : 'Create User'}
      >
        <UserForm
          key={selectedUser?.id || 'new'}
          user={selectedUser}
          isLoading={createUser.isPending || updateUser.isPending}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};