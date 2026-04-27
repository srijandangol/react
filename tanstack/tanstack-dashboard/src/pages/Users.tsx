import React, { useState } from 'react';
import { useUsers } from '../features/users/hooks/useUsers';
import { useCreateUser } from '../features/users/hooks/useCreateUser';
import { useUpdateUser } from '../features/users/hooks/useUpdateUser';
import { useDeleteUser } from '../features/users/hooks/useDeleteUser';

import { UsersTable } from '../features/users/components/UsersTable';
import { UserForm } from '../features/users/components/UserForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

import type {
  User,
  CreateUserInput,
  UpdateUserInput,
} from '../features/users/types';

export const Users: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // 🔹 SEARCH STATE
  const [filters, setFilters] = useState({
    search: '',
  });

  // 🔹 API CALL (SERVER SIDE SEARCH)
  const { data: usersData, isLoading } = useUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: filters.search,
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
      updateUser.mutate(data);
    } else {
      createUser.mutate(data);
    }
  };

  const handleDelete = (user: User) => {
    deleteUser.mutate(user.id);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>

        <Button onClick={() => handleOpenModal()}>
          + New User
        </Button>
      </div>

      {/* 🔍 SEARCH BAR */}
      <div className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search by name, email, role..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ search: e.target.value })
          }
          className="border px-3 py-2 rounded-lg w-80"
        />
      </div>

      {/* TABLE */}
      <UsersTable
        data={usersData?.users || []}
        isLoading={isLoading}
        totalCount={usersData?.total || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedUser ? 'Edit User' : 'Create User'}
      >
        <UserForm
          key={selectedUser ? selectedUser.id : 'new'}
          user={selectedUser}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>

    </div>
  );
};