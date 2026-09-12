import { useState } from 'react'
import { login as loginService } from '../services/auth'
import { AuthContext } from './auth-context.js'

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


