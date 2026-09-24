import api from './api'
//Agrega un 0 adelante de las horas para compatibilidad con el backend EJ: si son las 9:00 am lo transforma a 09:00
function pad(n) {
  return String(n).padStart(2, '0')
}
//Recibe un objeto Date de JavaScript y arma un string tipo "2026-09-24" (el formato que Django espera para su campo DateField).
function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
//Igual que la anterior pero arma la hora, tipo "14:05:09" 
function formatTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
//Es la función que de verdad van a usar checking()/stopChecking().

export async function registrarAsistencia(userId, tipo) {
  const now = new Date()
  const { data } = await api.post('/assistance_api/assistances/', {
    date: formatDate(now),
    time: formatTime(now),
    type: tipo, // 'ingreso' | 'salida'
    user: userId,
  })
  return data
}