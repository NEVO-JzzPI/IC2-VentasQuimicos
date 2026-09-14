// Mock de autenticación mientras el backend Django no está listo.
// Cuando el backend esté disponible, "login" se cambia para que llame a la API real
// (ej. fetch a POST /api/auth/login/), sin tener que tocar el componente Login.

// Lista de usuarios "de mentira" para poder probar el login sin backend
const MOCK_USERS = [
  { email: 'admin@empresa.cl', password: '1234', nombre: 'Admin Principal', rol: 'admin' },
  { email: 'empleado@empresa.cl', password: '1234', nombre: 'Juan Pérez', rol: 'empleado' },
]

// Simula el login: recibe correo y contraseña, y responde como si fuera el servidor
export async function login(email, password) {
  // Espera medio segundo para simular el tiempo que tardaría una petición real
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Busca si existe un usuario con ese correo y esa password (correo sin distinguir mayúsculas)
  const user = MOCK_USERS.find(
    (u) => u.email === email.trim().toLowerCase() && u.password === password
  )

  // Si no lo encontró, avisamos con un error (así funciona el catch en Login.jsx)
  if (!user) {
    throw new Error('Correo o contraseña incorrectos')
  }

  // Si lo encontró, devolvemos un token falso y los datos del usuario
  return {
    token: 'mock-token-123',
    user: { email: user.email, nombre: user.nombre, rol: user.rol },
  }
}
