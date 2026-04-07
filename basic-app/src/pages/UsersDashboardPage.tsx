import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import LogoutIcon from '@mui/icons-material/Logout'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Role } from '../types/role'
import type { User } from '../types/user'
import { deleteUser, listUsers, createUser, updateUser, exportSeedData } from '../api/usersApi'
import { useAuthStore } from '../store/authStore'
import { UserForm } from '../components/UserForm'
import type { UserFormValues } from '../components/UserForm'

function getErrorMessage(e: unknown) {
  const err = e as { response?: { data?: { message?: string } }; message?: string }
  return err?.response?.data?.message ?? err?.message ?? 'Request failed'
}

export default function UsersDashboardPage() {
  const navigate = useNavigate()
  const authUser = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const isAdmin = authUser?.role === Role.admin

  const [rows, setRows] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [createOpen, setCreateOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const columns = useMemo<GridColDef<User>[]>(
    () => [
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 160 },
      { field: 'email', headerName: 'Email', flex: 1, minWidth: 220 },
      {
        field: 'role',
        headerName: 'Role',
        width: 120,
      },
      {
        field: 'phone',
        headerName: 'Phone',
        flex: 1,
        minWidth: 170,
      },
      {
        field: 'address',
        headerName: 'Address',
        flex: 1.5,
        minWidth: 220,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 130,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<User>) => {
          if (!isAdmin) return null
          const row = params.row
          return (
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                onClick={() => setEditUser(row)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  void (async () => {
                    try {
                      setSubmitting(true)
                      await deleteUser(row.id)
                      toast.success('User deleted')
                      await refresh()
                    } catch (e: unknown) {
                      toast.error(getErrorMessage(e))
                    } finally {
                      setSubmitting(false)
                    }
                  })()
                }}
                disabled={submitting}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          )
        },
      },
    ],
    [isAdmin, submitting],
  )

  async function refresh() {
    try {
      setLoading(true)
      const data = await listUsers()
      setRows(data)
    } catch (e: unknown) {
      toast.error(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  async function handleExportSeed() {
    try {
      const seedData = await exportSeedData()
      const dataStr = JSON.stringify(seedData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'users.seed.json'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Seed data exported successfully')
    } catch (e: unknown) {
      toast.error('Failed to export seed data: ' + getErrorMessage(e))
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h4">User Management</Typography>
          <Typography variant="body2" color="text.secondary">
            {isAdmin ? 'Admin dashboard' : 'Your account'}
          </Typography>
        </Box>

        {isAdmin ? (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="contained"
              onClick={() => setCreateOpen(true)}
            >
              Add User
            </Button>
            <Button
              variant="outlined"
              onClick={() => void handleExportSeed()}
            >
              Export Seed
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={() => {
                logout()
                toast.success('Logged out')
                navigate('/login')
              }}
            >
              Logout
            </Button>
          </Stack>
        ) : (
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => {
              logout()
              toast.success('Logged out')
              navigate('/login')
            }}
          >
            Logout
          </Button>
        )}
      </Stack>

      <Box sx={{ height: 620, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
          pageSizeOptions={[5, 10, 25]}
        />
      </Box>

      <Dialog
        open={createOpen}
        onClose={() => {
          if (submitting) return
          setCreateOpen(false)
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <UserForm
            mode="create"
            submitLabel="Create"
            isSubmitting={submitting}
            onCancel={() => setCreateOpen(false)}
            onSubmit={async (values: UserFormValues) => {
              try {
                setSubmitting(true)
                await createUser(values)
                toast.success('User created')
                setCreateOpen(false)
                await refresh()
              } catch (e: unknown) {
                toast.error(getErrorMessage(e))
              } finally {
                setSubmitting(false)
              }
            }}
          />
        </DialogContent>
        <DialogActions />
      </Dialog>

      <Dialog
        open={!!editUser}
        onClose={() => {
          if (submitting) return
          setEditUser(null)
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editUser ? (
            <UserForm
              mode="edit"
              submitLabel="Save changes"
              defaultValues={editUser}
              isSubmitting={submitting}
              onCancel={() => setEditUser(null)}
              onSubmit={async (values: UserFormValues) => {
                try {
                  setSubmitting(true)
                  await updateUser(editUser.id, values)
                  toast.success('User updated')
                  setEditUser(null)
                  await refresh()
                } catch (e: unknown) {
                  toast.error(getErrorMessage(e))
                } finally {
                  setSubmitting(false)
                }
              }}
            />
          ) : null}
        </DialogContent>
        <DialogActions />
      </Dialog>
    </Box>
  )
}

