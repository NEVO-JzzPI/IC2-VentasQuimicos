import { useState, useEffect } from 'react'
import { login as loginService, logout as logoutService } from '../services/auth'
import { registrarIngreso, registrarSalida, estadoHoy } from '../services/asistencia'
import { AuthContext } from './auth-context.js'

//el provider que envuelve la app y provee el contexto
export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user')
    return saved ? JSON.parse(saved) : null
  })

  // Estado de asistencia de hoy resuelto contra el backend, como
  // `{ userId, next }`. Se guarda junto al userId para poder derivar
  // "cargando" sin un setState extra en el efecto: si el estado guardado no
  // corresponde al usuario actual, todavía no llega la respuesta.
  //
  // `next` es la siguiente marca permitida: 'ingreso' | 'salida' | null.
  // null = ya marcó salida y no tiene permiso de reingreso (NO es lo mismo que
  // "puede entrar"). Se pide a today-status/ en vez de mantenerlo en memoria
  // porque el backend valida el orden de las marcas: un booleano local se
  // pierde al recargar y el usuario terminaba recibiendo un 400 al re-marcar.
  const [estado, setEstado] = useState(null)

  useEffect(() => {
    if (!user) return

    let cancelado = false
    estadoHoy()
      .then((s) => {
        if (!cancelado) setEstado({ userId: user.id, next: s.next, yaIngreso: !!s.ingreso })
      })
      .catch(() => {
        // Si today-status/ falla no dejamos al usuario bloqueado: se le permite
        // intentar marcar entrada y que el backend decida.
        if (!cancelado) setEstado({ userId: user.id, next: 'ingreso', yaIngreso: false })
      })

    return () => {
      cancelado = true
    }
  }, [user])

  const estadoVigente = user && estado?.userId === user.id ? estado : null
  const estadoCargando = !!user && !estadoVigente
  const next = estadoVigente?.next ?? null

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
    setEstado(null)
    localStorage.removeItem('auth_user')
  }


  const checking = async () => {
    await registrarIngreso(user.id)
    setEstado({ userId: user.id, next: 'salida', yaIngreso: true })
  }

  const stopChecking = async () => {
    await registrarSalida(user.id)
    setEstado({ userId: user.id, next: null, yaIngreso: true })
  }

  // isChecking conserva el nombre para no tocar a todos los consumidores;
  // ahora significa "tiene un ingreso abierto", según el backend.
  const isChecking = next === 'salida'
  const puedeIngresar = next === 'ingreso'
  // Hubo al menos un ingreso hoy (aunque después haya marcado salida).
  const yaIngreso = !!estadoVigente?.yaIngreso

  const value = { user, login, logout, checking, stopChecking, isChecking, puedeIngresar, yaIngreso, estadoCargando }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
