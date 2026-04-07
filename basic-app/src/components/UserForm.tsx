import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Role } from '../types/role'
import type { Role as RoleType } from '../types/role'

export type UserFormValues = {
  name: string
  email: string
  password: string
  role: RoleType
  phone: string
  address: string
}

function getSchema(requirePassword: boolean) {
  const passwordSchema = z
    .string()
    .trim()
    .refine(
      (val) => {
        if (requirePassword) return val.length >= 6
        // Edit mode: allow blank password to keep current password.
        return val.length === 0 || val.length >= 6
      },
      {
        message: requirePassword
          ? 'Password must be at least 6 characters'
          : 'Password must be at least 6 characters (or leave blank)',
      },
    )

  return z.object({
    name: z.string().trim().min(2, 'Name is required'),
    email: z.string().trim().email('Valid email is required'),
    password: passwordSchema,
    role: z.enum([Role.admin, Role.user]),
    phone: z.string().trim().min(7, 'Phone number is required'),
    address: z.string().trim().min(3, 'Address is required'),
  })
}

export type UserFormProps = {
  mode: 'create' | 'edit'
  defaultValues?: Partial<UserFormValues>
  submitLabel: string
  onSubmit: (values: UserFormValues) => Promise<void> | void
  onCancel?: () => void
  isSubmitting?: boolean
}

export function UserForm({
  mode,
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
  isSubmitting,
}: UserFormProps) {
  const schema = useMemo(() => getSchema(mode === 'create'), [mode])

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      email: defaultValues?.email ?? '',
      password: '',
      role: defaultValues?.role ?? Role.user,
      phone: defaultValues?.phone ?? '',
      address: defaultValues?.address ?? '',
    },
  })

  return (
    <Box
      component="form"
      noValidate
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values)
      })}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <TextField
        label="Name"
        {...form.register('name')}
        error={!!form.formState.errors.name}
        helperText={form.formState.errors.name?.message}
        disabled={isSubmitting}
      />

      <TextField
        label="Email"
        {...form.register('email')}
        error={!!form.formState.errors.email}
        helperText={form.formState.errors.email?.message}
        disabled={isSubmitting}
      />

      <TextField
        label="Password"
        type="password"
        {...form.register('password')}
        error={!!form.formState.errors.password}
        helperText={form.formState.errors.password?.message}
        disabled={isSubmitting}
      />

      <Controller
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              label="Role"
              {...field}
              disabled={isSubmitting}
            >
              <MenuItem value={Role.admin}>admin</MenuItem>
              <MenuItem value={Role.user}>user</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      <TextField
        label="Phone Number"
        {...form.register('phone')}
        error={!!form.formState.errors.phone}
        helperText={form.formState.errors.phone?.message}
        disabled={isSubmitting}
      />

      <TextField
        label="Address"
        {...form.register('address')}
        error={!!form.formState.errors.address}
        helperText={form.formState.errors.address?.message}
        disabled={isSubmitting}
      />

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        {onCancel ? (
          <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </Box>
    </Box>
  )
}

