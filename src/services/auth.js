// Autenticación real contra RegistroAsistencia API (JWT vía DRF Simplejwt).
// login() hace /token/ + /accounts_api/users/me/ y devuelve un `user` con la
// forma que ya esperaban los componentes (incluye `rol`, alias de `type`).
import api, { setTokens, clearTokens, extractErrorMessage } from './api'

function mapUser(me) {
  return {
    id: me.id,
    name: me.name,
    firstLastname: me.first_lastname,
    nombre: [me.name, me.first_lastname].filter(Boolean).join(' '),
    type: me.type,
    // Guards.jsx compara contra 'admin'/'empleado'; el backend usa 'administrador'/'empleado'.
    rol: me.type === 'administrador' ? 'admin' : 'empleado',
  }
}

export async function login(email, password, remember = false) {
  let tokens
  try {
    const { data } = await api.post('/token/', { email, password })
    tokens = data
  } catch (err) {
    if (err?.response?.status === 401) {
      throw new Error('Correo o contraseña incorrectos', { cause: err })
    }
    throw new Error(extractErrorMessage(err, 'No se pudo iniciar sesión'), { cause: err })
  }

  setTokens(tokens, remember)

  try {
    const { data: me } = await api.get('/accounts_api/users/me/')
    return { token: tokens.access, user: mapUser(me) }
  } catch (err) {
    clearTokens()
    throw new Error(extractErrorMessage(err, 'No se pudo obtener el usuario autenticado'), { cause: err })
  }
}

export function logout() {
  clearTokens()
}
