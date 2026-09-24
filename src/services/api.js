// Cliente HTTP unico para hablar con el backend Django (QuimicosBackend).
// Ningun componente/pagina debe usar axios directo: siempre pasan por aca
// (o por los servicios de src/services/ que usan esta instancia), para que
// un cambio en la API (URLs, headers, manejo de tokens) no obligue a tocar
// componentes.
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// --- Interceptor de request ---
// Antes de que salga cualquier request, le pega el access token guardado
// en localStorage (si existe) en el header Authorization.
// Importante: el backend usa SIMPLE_JWT.AUTH_HEADER_TYPES = ('JWT',), o sea
// el prefijo del header es "JWT", NO "Bearer" (que es lo mas comun en otros
// backends, por eso se deja este comentario).
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token')
  if (accessToken) {
    config.headers.Authorization = `JWT ${accessToken}`
  }
  return config
})

// --- Interceptor de response ---
// El access token dura solo 5 minutos (ACCESS_TOKEN_LIFETIME en el backend).
// Si una request falla con 401 (token vencido), intentamos renovarlo UNA vez
// usando el refresh token (dura 1 hora) contra POST /token/refresh/, y
// reintentamos la request original con el token nuevo. Si el refresh tambien
// falla (ej. el refresh token ya vencio), limpiamos todo y dejamos que la
// app trate al usuario como deslogueado.
let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const isAuthError = error.response?.status === 401
    const alreadyRetried = originalRequest._retry
    const isRefreshCall = originalRequest.url?.includes('/token/refresh/')

    if (!isAuthError || alreadyRetried || isRefreshCall) {
      return Promise.reject(error)
    }

    originalRequest._retry = true
    const refreshToken = localStorage.getItem('refresh_token')

    if (!refreshToken) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      return Promise.reject(error)
    }

    try {
      // Si ya hay un refresh en curso (ej. varias requests fallaron a la vez),
      // reusamos la misma promesa en vez de pedir varios refresh en paralelo.
      if (!refreshPromise) {
        refreshPromise = api
          .post('/token/refresh/', { refresh: refreshToken })
          .finally(() => {
            refreshPromise = null
          })
      }

      const { data } = await refreshPromise
      localStorage.setItem('access_token', data.access)

      originalRequest.headers.Authorization = `JWT ${data.access}`
      return api(originalRequest)
    } catch (refreshError) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      return Promise.reject(refreshError)
    }
  }
)

export default api
