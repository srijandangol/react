/**
 * UsersTable Component - Table displaying users with TanStack Table
 */

import React, { useMemo } from 'react';
import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
import type { User } from '../types';
import { formatDate } from '../../utils';
import { UserActions } from './UserActions';
import { getUserStatusColor } from '../utils';
import { DataTable } from '../../../components/data-table';

interface UsersTableProps {
  data: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isLoading?: boolean;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  data,
  onEdit,
  onDelete,
  isLoading = false,
  pagination,
  onPaginationChange,
}) => {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: (info) => {
          const role = info.getValue() as User['role'];
          return (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
              {role}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue() as User['status'];
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getUserStatusColor(
                status
              )}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: (info) => formatDate(info.getValue() as string),
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: (info) => (
          <UserActions
            user={info.row.original}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ),
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <DataTable<User>
      data={data}
      columns={columns}
      isLoading={isLoading}
      loadingMessage="Loading users…"
      emptyMessage="No users match your filters."
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      enableGlobalFilter
      searchPlaceholder="Search users by name, email, role, or status…"
    />
  );
};
