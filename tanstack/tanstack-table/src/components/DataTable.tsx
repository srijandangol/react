import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { useMemo } from 'react'

type Props<T> = {
  data: T[]
  columns: ColumnDef<T>[]
}

export function DataTable<T>({ data, columns }: Props<T>) {
  const memoColumns = useMemo(() => columns, [columns])
  const memoData = useMemo(() => data, [data])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table border={1} cellPadding={10} style={{ width: '100%' }}>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}