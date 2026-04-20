/**
 * UsersTable Component - Table displaying users with TanStack Table
 */
import React, { useMemo } from "react";
import type { ColumnDef, OnChangeFn, PaginationState } from "@tanstack/react-table";
import type { User } from "../types";
import { formatDate } from "../../utils";
import { UserActions } from "./UserActions";
import { getUserStatusColor } from "../utils";
import { DataTable } from "../../../components/data-table";

interface UsersTableProps {
  data: User[];
  totalItems: number;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isLoading?: boolean;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  data,
  totalItems,
  onEdit,
  onDelete,
  isLoading = false,
  pagination,
  onPaginationChange,
}) => {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        filterFn: "includesString",
        // meta: { enableColumnFilter: true },s
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        filterFn: "includesString",
        enableColumnFilter: true,
        meta: { enableColumnFilter: true },
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "role",
        header: "Role",
        filterFn: "includesString",
        enableColumnFilter: true,
        meta: { enableColumnFilter: true },
        cell: (info) => {
          const role = info.getValue() as User["role"];
          return (
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
              {role}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        filterFn: "includesString",
        enableColumnFilter: true,
        meta: { enableColumnFilter: true },
        cell: (info) => {
          const status = info.getValue() as User["status"];
          return (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getUserStatusColor(
                status
              )}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: (info) => formatDate(info.getValue() as string),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        enableColumnFilter: false,
        meta: { enableColumnFilter: false },
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
      manualPagination
      totalItems={totalItems}
      enableGlobalFilter
      searchPlaceholder="Search users by name, email, role, or status…"
    />
  );
};