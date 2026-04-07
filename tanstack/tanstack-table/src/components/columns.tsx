import type { ColumnDef } from '@tanstack/react-table'
import type { User } from './types'


export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: info => (
      <span style={{ textTransform: 'capitalize' }}>
        {info.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: info => {
      const status = info.getValue<string>()
      return (
        <span style={{ color: status === 'active' ? 'green' : 'red' }}>
          {status}
        </span>
      )
    },
  },
]