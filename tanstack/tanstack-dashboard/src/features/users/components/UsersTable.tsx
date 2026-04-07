/**
 * UsersTable Component - Table displaying users with TanStack Table
 */

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  OnChangeFn,
} from '@tanstack/react-table';
import type { User } from '../types';
import { formatDate } from '../../utils';
import { Button } from '../../../components/ui/Button';
import { UserActions } from './UserActions';
import { getUserStatusColor } from '../utils';

interface UsersTableProps {
  data: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isLoading?: boolean;
  totalCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  data,
  onEdit,
  onDelete,
  isLoading = false,
  totalCount,
  pagination,
  onPaginationChange,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

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
        id: 'actions',
        header: 'Actions',
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

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: Math.max(1, Math.ceil(totalCount / pagination.pageSize)),
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() && (
                        <span className="text-blue-500">
                          {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 py-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <label htmlFor="page-size" className="font-medium">
            Rows per page:
          </label>
          <select
            id="page-size"
            value={pagination.pageSize}
            onChange={(event) =>
              onPaginationChange({
                pageIndex: 0,
                pageSize: Number(event.target.value),
              })
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
