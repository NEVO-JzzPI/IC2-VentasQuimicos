import { createContext, useContext, useState } from 'react'
import { login as loginService } from '../services/auth'

//null por defecto
const AuthContext = createContext(null)

//el provider que envuelve la app y provee el contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  
  const [isChecking, setIsChecking] = useState(false)

  const login = async (username, password) => {
    const { user } = await loginService(username, password)
    setUser(user)
  }

  const logout = () => {
    setUser(null)
    setIsChecking(false)
  }

  
  const checking = async () => {
    setIsChecking(true)
  }
  
  const stopChecking = async () => {
    setIsChecking(false)
  }

  const value = { user, login, logout, checking, stopChecking, isChecking }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

//hook para acceder
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}


