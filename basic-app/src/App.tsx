import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import UsersDashboardPage from './pages/UsersDashboardPage'
import { AccessDeniedPage } from './pages/AccessDeniedPage'
import { useAuthStore } from './store/authStore'

function HomeRedirect() {
  const token = useAuthStore((s) => s.token)
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UsersDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
