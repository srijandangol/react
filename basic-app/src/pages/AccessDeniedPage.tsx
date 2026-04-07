import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function AccessDeniedPage() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  return (
    <Box
      sx={{
        maxWidth: 520,
        mx: 'auto',
        mt: 8,
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        textAlign: 'left',
      }}
    >
      <Typography variant="h4" sx={{ mb: 1 }}>
        Access Denied
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Your account does not have permission to view this page.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
        >
          Back to dashboard
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  )
}

