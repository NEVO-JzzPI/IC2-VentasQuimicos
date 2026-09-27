// Cliente HTTP único hacia el backend Django. Todo lo que sepa de axios,
// JWT, refresh de tokens y el formato de errores de DRF vive aquí; el resto
// de services/ solo importa `api` y llama endpoints.
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const ACCESS_KEY = 'auth_access'
const REFRESH_KEY = 'auth_refresh'

// Si `remember` es false los tokens solo viven en memoria (se pierden al
// recargar), igual que el usuario en AuthContext hoy no persiste sin "recordar".
let memoryAccess = null
let memoryRefresh = null

export function setTokens({ access, refresh } = {}, remember = false) {
  if (remember) {
    if (access) localStorage.setItem(ACCESS_KEY, access)
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
  } else {
    if (access) memoryAccess = access
    if (refresh) memoryRefresh = refresh
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  }
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY) ?? memoryAccess
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY) ?? memoryRefresh
}

export function clearTokens() {
  memoryAccess = null
  memoryRefresh = null
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `JWT ${token}`
  }
  return config
})

// Evita disparar varios refresh en paralelo si varias requests reciben 401 a la vez.
let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error
    const refreshToken = getRefreshToken()

    if (response?.status === 401 && config && !config._retry && refreshToken) {
      config._retry = true
      try {
        if (!refreshPromise) {
          const wasRemembered = !!localStorage.getItem(REFRESH_KEY)
          refreshPromise = axios
            .post(`${BASE_URL}/token/refresh/`, { refresh: refreshToken })
            .then(({ data }) => {
              setTokens({ access: data.access }, wasRemembered)
              return data.access
            })
            .finally(() => {
              refreshPromise = null
            })
        }
        const newAccess = await refreshPromise
        config.headers.Authorization = `JWT ${newAccess}`
        return api(config)
      } catch (refreshError) {
        clearTokens()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Normaliza los distintos formatos de error de DRF ({detail: "..."} o
// {campo: ["mensaje"]}) a un string listo para mostrar en un toast.
export function extractErrorMessage(error, fallback = 'Ocurrió un error inesperado') {
  const data = error?.response?.data
  if (!data) return error?.message || fallback

  if (typeof data.detail === 'string') return data.detail

  const firstKey = Object.keys(data)[0]
  const firstValue = firstKey ? data[firstKey] : null
  if (Array.isArray(firstValue) && typeof firstValue[0] === 'string') return firstValue[0]
  if (typeof firstValue === 'string') return firstValue

  return fallback
}

export default api
