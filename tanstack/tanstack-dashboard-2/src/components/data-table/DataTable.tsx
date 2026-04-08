import React, { useCallback, useEffect, useId, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  Row,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import { Button } from "../ui/Button";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

type FilterableColumnMeta = {
  enableColumnFilter?: boolean;
};

type FilterableColumnDef<TData> = ColumnDef<TData, unknown> & {
  enableColumnFilter?: boolean;
  meta?: FilterableColumnMeta;
};

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;

  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;

  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  manualPagination?: boolean;
  totalItems?: number;

  enableGlobalFilter?: boolean;
  searchPlaceholder?: string;
}

function resolveUpdater<T>(updaterOrValue: Updater<T>, oldValue: T): T {
  if (typeof updaterOrValue === "function") {
    return (updaterOrValue as (prev: T) => T)(oldValue);
  }
  return updaterOrValue;
}

export function DataTable<TData>({
  data,
  columns,
  getRowId,
  isLoading = false,
  loadingMessage = "Loading…",
  emptyMessage = "No rows to display.",
  pagination,
  onPaginationChange,
  manualPagination = false,
  totalItems,
  enableGlobalFilter = false,
  searchPlaceholder = "Search…",
}: DataTableProps<TData>) {
  const pageSizeId = useId();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const resolvedTotalItems = totalItems ?? data.length;
  const totalPages = Math.max(1, Math.ceil(resolvedTotalItems / pagination.pageSize));
  const maxPageIndex = Math.max(0, totalPages - 1);

  const handleGlobalFilterChange: OnChangeFn<string> = useCallback(
    (updaterOrValue) => {
      setGlobalFilter((prev) => resolveUpdater(updaterOrValue, prev));
      onPaginationChange((prev) => ({ ...resolveUpdater(prev, pagination), pageIndex: 0 }));
    },
    [onPaginationChange, pagination.pageIndex, pagination.pageSize]
  );

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = useCallback(
    (updaterOrValue) => {
      setColumnFilters((prev) => resolveUpdater(updaterOrValue, prev));
      onPaginationChange((prev) => ({ ...resolveUpdater(prev, pagination), pageIndex: 0 }));
    },
    [onPaginationChange, pagination.pageIndex, pagination.pageSize]
  );

  const showColumnFilterRow = useMemo(() => {
    return columns.some((column) => {
      const col = column as FilterableColumnDef<TData>;
      return (
        col.enableColumnFilter === true ||
        col.meta?.enableColumnFilter === true
      );
    });
  }, [columns]);

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
    onColumnFiltersChange: handleColumnFiltersChange,
    onPaginationChange,
    manualPagination,
    pageCount: totalPages,
    ...(enableGlobalFilter ? { onGlobalFilterChange: handleGlobalFilterChange } : {}),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(!manualPagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    globalFilterFn: "includesString",
  });

  const rows = table.getRowModel().rows;
  const filteredRowCount = manualPagination
    ? resolvedTotalItems
    : table.getFilteredRowModel().rows.length;
  const showEmpty = !isLoading && rows.length === 0;

  const startRow =
    filteredRowCount === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const endRow = Math.min(startRow + rows.length - 1, filteredRowCount);

  const isPreviousDisabled = !table.getCanPreviousPage();
  const isNextDisabled = !table.getCanNextPage();
  

  useEffect(() => {
    if (pagination.pageIndex > maxPageIndex) {
      onPaginationChange((prev) => ({
        ...resolveUpdater(prev, pagination),
        pageIndex: maxPageIndex,
      }));
    }
  }, [maxPageIndex, onPaginationChange, pagination, pagination.pageIndex]);

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      {enableGlobalFilter && (
        <div className="border-b border-gray-200 px-6 py-3">
          <input
            type="search"
            value={globalFilter}
            onChange={(e) => handleGlobalFilterChange(e.target.value)}
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
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 ${
                        header.column.getCanSort()
                          ? "cursor-pointer hover:bg-gray-100"
                          : ""
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
                              {header.column.getIsSorted() === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>

                {showColumnFilterRow && (
                  <tr>
                    {headerGroup.headers.map((header) => (
                      <th key={`${header.id}-filter`} className="px-6 py-2">
                        {header.column.columnDef.meta?.enableColumnFilter === true &&
                          header.column.getCanFilter() && (
                            <input
                              type="text"
                              value={(header.column.getFilterValue() as string) ?? ""}
                              onChange={(e) =>
                                header.column.setFilterValue(
                                  e.target.value || undefined
                                )
                              }
                              placeholder="Filter…"
                              className="w-full rounded border border-gray-200 px-2 py-1 text-xs font-normal text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                      </th>
                    ))}
                  </tr>
                )}
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
                <tr key={row.id} className="transition-colors hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
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

      <div className="flex flex-col gap-4 border-t border-gray-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
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

          <div className="text-sm text-gray-600">
            Showing {startRow} to {endRow} of {filteredRowCount}{" "}
            {filteredRowCount === 1 ? "row" : "rows"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            Page {pagination.pageIndex + 1} of {totalPages}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPaginationChange((prev) => ({ ...prev, pageIndex: Math.max(0, prev.pageIndex - 1) }))}
            disabled={isPreviousDisabled}
          >
            Previous
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              onPaginationChange((prev) => ({
                ...prev,
                pageIndex: Math.min(maxPageIndex, prev.pageIndex + 1),
              }))
            }
            disabled={isNextDisabled}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}