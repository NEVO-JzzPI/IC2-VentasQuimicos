// Registros de asistencia (check-in/out, historial propio, resumen del día).
import api, { extractErrorMessage } from './api'

// OJO: no usar toISOString() acá — convierte a UTC y en Chile de noche eso
// ya cae en el día siguiente. Se arma la fecha con los componentes locales.
export function todayDate() {
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

// Estado de hoy del usuario logueado. 
// habilitar: desde 2026-09-25 el backend valida el orden de las marcas, así
// un booleano local (que se pierde al recargar) ya no alcanza.
// `next` es 'ingreso' | 'salida' | null (null = ya salió y sin permiso de reingreso).
export async function estadoHoy() {
  try {
    const { data } = await api.get('/assistance_api/assistances/today-status/')
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'No se pudo cargar el estado de asistencia de hoy'), { cause: err })
  }
}

// Horario laboral de la empresa (uno solo para todos). Lectura: cualquier
// autenticado. `entry_time` / `exit_time` en formato 'HH:MM:SS'.
export async function obtenerHorario() {
  try {
    const { data } = await api.get('/assistance_api/schedule/')
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'No se pudo cargar el horario laboral'), { cause: err })
  }
}

// Solo admin. Cambia el horario; no reescribe los flags de registros ya guardados.
export async function actualizarHorario({ entryTime, exitTime }) {
  try {
    const { data } = await api.patch('/assistance_api/schedule/', {
      ...(entryTime && { entry_time: entryTime }),
      ...(exitTime && { exit_time: exitTime }),
    })
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'No se pudo actualizar el horario laboral'), { cause: err })
  }
}

// Solo admin. Autoriza UN reingreso hoy a un empleado cuya última marca es salida.
export async function autorizarReingreso(userId) {
  try {
    const { data } = await api.post('/assistance_api/assistances/allow-reentry/', { user: userId })
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'No se pudo autorizar el reingreso'), { cause: err })
  }
}
