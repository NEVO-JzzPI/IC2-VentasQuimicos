import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

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
  const { yaIngreso, estadoCargando } = useAuth()
  // Hay que esperar a que today-status/ responda: si redirigimos mientras
  // carga, cualquier recarga de /dashboard expulsa a /check aunque ya marcó.
  if (estadoCargando) return null
  // Basta con haber marcado ingreso hoy, aunque después haya marcado salida.
  if (!yaIngreso) return <Navigate to="/check" replace />
  return children
}