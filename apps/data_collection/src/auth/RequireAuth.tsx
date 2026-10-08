import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAppSelector } from '@/app/hooks'

interface RequireAuthProps {
  children: ReactNode
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const token = useAppSelector((state) => state.auth.token)
  if (!token) {
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}

export default RequireAuth