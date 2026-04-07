import React, { useMemo } from 'react';
import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
import type { Product } from '../types';
import { DataTable } from '../../../components/data-table';
import { ProductActions } from './ProductActions';

interface ProductsTableProps {
  data: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  data,
  onEdit,
  onDelete,
  pagination,
  onPaginationChange,
}) => {
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        filterFn: 'includesString',
        enableColumnFilter: true,
        meta: { enableColumnFilter: true },
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
        filterFn: 'includesString',
        enableColumnFilter: true,
        meta: { enableColumnFilter: true },
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        enableSorting: false,
        enableColumnFilter: false,
        meta: { enableColumnFilter: false },
        cell: (info) => (
          <ProductActions
            product={info.row.original}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ),
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <DataTable<Product>
      data={data}
      columns={columns}
      emptyMessage="No products match your filters."
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      enableGlobalFilter
      searchPlaceholder="Search products by name, category…"
    />
  );
};
