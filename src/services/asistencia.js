// Registros de asistencia (check-in/out, historial propio, resumen del día).
import api, { extractErrorMessage } from './api'

// OJO: no usar toISOString() acá — convierte a UTC y en Chile de noche eso
// ya cae en el día siguiente. Se arma la fecha con los componentes locales.
function todayDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function nowTime() {
  return new Date().toTimeString().slice(0, 8)
}

export async function registrarIngreso(userId) {
  try {
    const { data } = await api.post('/assistance_api/assistances/', {
      user: userId,
      type: 'ingreso',
      date: todayDate(),
      time: nowTime(),
    })
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'No se pudo registrar la entrada'), { cause: err })
  }
}

export async function registrarSalida(userId) {
  try {
    const { data } = await api.post('/assistance_api/assistances/', {
      user: userId,
      type: 'salida',
      date: todayDate(),
      time: nowTime(),
    })
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'No se pudo registrar la salida'), { cause: err })
  }
}

export async function misRegistros() {
  try {
    const { data } = await api.get('/assistance_api/assistances/my-records/')
    return data.results
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'No se pudo cargar el historial de asistencia'), { cause: err })
  }
}

// Trae todas las páginas de /assistances/ (tamaño de página fijo del backend: 50).
export async function listarRegistros() {
  try {
    let url = '/assistance_api/assistances/'
    let results = []
    while (url) {
      const { data } = await api.get(url)
      results = results.concat(data.results)
      url = data.next
    }
    return results
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'No se pudo cargar los registros de asistencia'), { cause: err })
  }
}

export async function resumenHoy() {
  try {
    const { data } = await api.get('/assistance_api/assistances/today-summary/')
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'No se pudo cargar el resumen de asistencia'), { cause: err })
  }
}
