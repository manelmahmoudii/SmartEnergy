import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Role } from '../services/authService'
import { canAccess } from '../utils/access'

export default function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  if (!user) return <Navigate to="/" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  if (!canAccess(user.role, pathname)) return <Navigate to="/dashboard" replace />
  return <Outlet />
}