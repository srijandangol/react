/**
 * Generic data table: client-side filter, sort, and pagination (TanStack Table).
 */

import React, { useCallback, useId, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import type {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  Row,
  SortingState,
} from '@tanstack/react-table';
import { Button } from '../ui/Button';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;

  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;

  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;

  enableGlobalFilter?: boolean;
  searchPlaceholder?: string;
}

export function DataTable<TData>({
  data,
  columns,
  getRowId,
  isLoading = false,
  loadingMessage = 'Loading…',
  emptyMessage = 'No rows to display.',
  pagination,
  onPaginationChange,
  enableGlobalFilter = false,
  searchPlaceholder = 'Search…',
}: DataTableProps<TData>) {
  const pageSizeId = useId();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const onGlobalFilterChange: OnChangeFn<string> = useCallback(
    (updater) => {
      setGlobalFilter(updater);
      onPaginationChange((p) => ({ ...p, pageIndex: 0 }));
    },
    [onPaginationChange]
  );

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = useCallback(
    (updater) => {
      setColumnFilters(updater);
      onPaginationChange((p) => ({ ...p, pageIndex: 0 }));
    },
    [onPaginationChange]
  );

  const showColumnFilterRow = useMemo(
    () =>
      columns.some(
        (c) =>
          Boolean((c as { enableColumnFilter?: boolean }).enableColumnFilter) &&
          Boolean((c as { meta?: { enableColumnFilter?: boolean } }).meta?.enableColumnFilter)
      ),
    [columns]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: {
      sorting,
      columnFilters,
      pagination,
      ...(enableGlobalFilter ? { globalFilter } : {}),
    },
    onSortingChange: setSorting,
    onColumnFiltersChange,
    onPaginationChange,
    ...(enableGlobalFilter ? { onGlobalFilterChange } : {}),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
  });

  const rows = table.getRowModel().rows;
  const showEmpty = !isLoading && rows.length === 0;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {enableGlobalFilter && (
        <div className="px-6 py-3 border-b border-gray-200">
          <input
            type="search"
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-label="Search table"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                <tr>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ${
                        header.column.getCanSort()
                          ? 'cursor-pointer hover:bg-gray-100'
                          : ''
                      }`}
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
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
                {showColumnFilterRow ? (
                  <tr>
                    {headerGroup.headers.map((header) => (
                      <th key={`${header.id}-filter`} className="px-6 py-2">
                        {header.column.columnDef.meta?.enableColumnFilter &&
                        header.column.getCanFilter() ? (
                          <input
                            type="text"
                            value={(header.column.getFilterValue() as string) ?? ''}
                            onChange={(e) =>
                              header.column.setFilterValue(e.target.value || undefined)
                            }
                            placeholder="Filter…"
                            className="w-full rounded border border-gray-200 px-2 py-1 text-xs font-normal normal-case text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : null}
                      </th>
                    ))}
                  </tr>
                ) : null}
              </React.Fragment>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  {loadingMessage}
                </td>
              </tr>
            ) : showEmpty ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 py-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <label htmlFor={pageSizeId} className="font-medium">
            Rows per page:
          </label>
          <select
            id={pageSizeId}
            value={pagination.pageSize}
            onChange={(event) =>
              onPaginationChange({
                pageIndex: 0,
                pageSize: Number(event.target.value),
              })
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
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
}
