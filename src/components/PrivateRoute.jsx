// src/components/PrivateRoute.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Reads AuthContext; redirects unauthenticated users to /login
// Uses <Outlet /> so it wraps any child routes
// ─────────────────────────────────────────────────────────────────────────────
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './Spinner'

export default function PrivateRoute() {
  const { user, loading } = useAuth()

  if (loading) return <Spinner fullscreen />
  if (!user)   return <Navigate to="/login" replace />

  return <Outlet />
}
