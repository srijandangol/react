import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { register } from '../api/authApi'
import { useAuthStore } from '../store/authStore'

const RegisterSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type RegisterValues = z.infer<typeof RegisterSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const signIn = useAuthStore((s) => s.signIn)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const [submitting, setSubmitting] = useState(false)

  return (
    <Box
      sx={{
        maxWidth: 420,
        mx: 'auto',
        mt: 8,
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Register
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={form.handleSubmit(async (values) => {
          try {
            setSubmitting(true)
            const res = await register(values)
            signIn(res)
            toast.success('Account created')
            navigate('/dashboard')
          } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } }; message?: string }
            const message = err?.response?.data?.message ?? err?.message ?? 'Register failed'
            toast.error(message)
          } finally {
            setSubmitting(false)
          }
        })}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="Name"
          {...form.register('name')}
          error={!!form.formState.errors.name}
          helperText={form.formState.errors.name?.message}
          disabled={submitting}
          fullWidth
        />

        <TextField
          label="Email"
          {...form.register('email')}
          error={!!form.formState.errors.email}
          helperText={form.formState.errors.email?.message}
          disabled={submitting}
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          {...form.register('password')}
          error={!!form.formState.errors.password}
          helperText={form.formState.errors.password?.message}
          disabled={submitting}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          size="large"
        >
          Create Account
        </Button>

        <Typography variant="body2">
          Already have an account?{' '}
          <Button
            component={RouterLink}
            to="/login"
            variant="text"
            sx={{ p: 0, textTransform: 'none' }}
          >
            Login
          </Button>
        </Typography>
      </Box>
    </Box>
  )
}

