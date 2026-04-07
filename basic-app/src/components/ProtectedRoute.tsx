import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { Role } from '../types/role'
import { useAuthStore } from '../store/authStore'

export type ProtectedRouteProps = {
  children: ReactNode
  allowedRoles?: Role[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const ok = allowedRoles.includes(user.role)
    if (!ok) return <Navigate to="/access-denied" replace />
  }

  return <>{children}</>
}

