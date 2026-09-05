import { createContext, useContext, useState } from 'react'
import { login as loginService } from '../services/auth'

//null por defecto
const AuthContext = createContext(null)

//el provider que envuelve la app y provee el contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = async (username, password) => {
    const { user } = await loginService(username, password)
    setUser(user)
  }

  const logout = () => {
    setUser(null)
  }

  const value = { user, login, logout }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

//el hook para acceder
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}