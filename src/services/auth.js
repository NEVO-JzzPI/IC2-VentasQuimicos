// Login real contra el backend Django (QuimicosBackend).
// AuthContext.jsx sigue esperando exactamente la misma forma de siempre:
// login(email, password) -> Promise<{ user: { email, nombre, rol } }>
// Asi que toda la adaptacion (tokens, claims del JWT, nombres de campo)
// queda encapsulada aca adentro, sin tocar AuthContext ni Login.jsx.
import api from './api'

// El payload de un JWT es solo JSON codificado en base64 en la 2da seccion
// del token (header.payload.signature). No hace falta una libreria para
// leerlo, ya que no necesitamos verificar la firma en el frontend (eso lo
// hace el backend en cada request).
function decodeJwt(token) {
  const payload = token.split('.')[1]
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(base64))
}

// El backend usa type: 'administrador' | 'empleado'.
// El frontend (Guards.jsx, etc.) usa rol: 'admin' | 'empleado'.
function mapTypeToRol(type) {
  return type === 'administrador' ? 'admin' : 'empleado'
}

export async function login(email, password) {
  const { data } = await api.post('/token/', { email, password })

  // Guardados en localStorage para que el interceptor de api.js los use en
  // cada request, y para poder refrescar la sesion tras recargar la pagina.
  localStorage.setItem('access_token', data.access)
  localStorage.setItem('refresh_token', data.refresh)

  // El access token trae name/first_lastname/type porque el backend los
  // agrega como claims (ver accounts/serializers.py -> CustomTokenObtainPairSerializer).
  const claims = decodeJwt(data.access)

  return {
    user: {
      id: claims.user_id,
      email,
      nombre: `${claims.name} ${claims.first_lastname}`,
      rol: mapTypeToRol(claims.type),
    },
  }
}
