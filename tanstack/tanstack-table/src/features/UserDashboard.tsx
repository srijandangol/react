import { userColumns } from '../components/columns'
import { DataTable } from '../components/DataTable'
import { useUsers } from '../hooks/useUsers'


export default function UserDashboard() {
  const { data, isLoading } = useUsers()

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <h2>User Dashboard</h2>
      <DataTable data={data} columns={userColumns} />
    </div>
  )
}