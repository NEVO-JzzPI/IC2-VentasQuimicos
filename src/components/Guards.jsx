import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// solo autentificados
export function RequireAuth({ children }) {
    const { user } = useAuth()
    if (!user) {
        return <Navigate to="/" replace />
    }

    return children
}

// solo admins
export function RequireAdmin({ children }) {

    const {user} = useAuth()
    if(user?.rol !== 'admin'){
        return <Navigate to="/check" replace />
    }
    return children
}

// Para check-in 
export function RequireCheckedIn({ children }) {
  const { isChecking } = useAuth()
  if (!isChecking) return <Navigate to="/check" replace />
  return children
}