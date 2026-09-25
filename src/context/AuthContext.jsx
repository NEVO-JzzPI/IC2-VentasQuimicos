import { useState } from 'react'
import { login as loginService, logout as logoutService } from '../services/auth'
import { registrarIngreso, registrarSalida } from '../services/asistencia'
import { AuthContext } from './auth-context.js'

//el provider que envuelve la app y provee el contexto
export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user')
    return saved ? JSON.parse(saved) : null
  })

  const [isChecking, setIsChecking] = useState(false)

  const login = async (email, password, remember) => {
    const { user } = await loginService(email, password, remember)
    setUser(user)
    if (remember) {
      localStorage.setItem('auth_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('auth_user')
    }
  }

  const logout = () => {
    logoutService()
    setUser(null)
    setIsChecking(false)
    localStorage.removeItem('auth_user')
  }


  const checking = async () => {
    await registrarIngreso(user.id)
    setIsChecking(true)
  }

  const stopChecking = async () => {
    await registrarSalida(user.id)
    setIsChecking(false)
  }

  const value = { user, login, logout, checking, stopChecking, isChecking }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


