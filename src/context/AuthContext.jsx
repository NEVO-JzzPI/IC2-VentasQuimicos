import { useState } from 'react'
import { login as loginService } from '../services/auth'
import { AuthContext } from './auth-context.js'

//el provider que envuelve la app y provee el contexto
export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user')
    return saved ? JSON.parse(saved) : null
  })

  const [isChecking, setIsChecking] = useState(false)

  const login = async (email, password, remember) => {
    const { user } = await loginService(email, password)
    setUser(user)
    if (remember) {
      localStorage.setItem('auth_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('auth_user')
    }
  }

  const logout = () => {
    setUser(null)
    setIsChecking(false)
    localStorage.removeItem('auth_user')
  }


  const checking = () => {
    setIsChecking(true)
  }

  const stopChecking = () => {
    setIsChecking(false)
  }

  const value = { user, login, logout, checking, stopChecking, isChecking }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


