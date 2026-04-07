import React, { useMemo, useState } from 'react';
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

import type { Product } from '../types';
import { Button } from '../../../components/ui/Button';

interface ProductsTableProps {
  data: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  totalCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  data,
  onEdit,
  onDelete,
  totalCount,
  pagination,
  onPaginationChange,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: (info) => (
          <span className="text-green-600 font-semibold">
            ${info.getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onEdit(info.row.original)}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete(info.row.original)}
            >
              Delete
            </Button>
          </div>
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
    pageCount: Math.ceil(totalCount / pagination.pageSize),
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">

      {/* TABLE */}
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

      {/* PAGINATION */}
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