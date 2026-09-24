import api from './api'


//Diccionarios para entender frontend y backend por palabras distintas
const RECORD_TYPE_LABELS = {
  present: 'Presente',
  absence: 'Ausente',
  anticipated_absence: 'S. Anticipada',
}
const WEEKDAY_LABELS = {
  monday: 'Lun',
  tuesday: 'Mar',
  wednesday: 'Mié',
  thursday: 'Jue',
  friday: 'Vie',
}

export async function getTodaySummary() {
  const { data } = await api.get('/assistance_api/assistances/today-summary/')

  const empleados = data.today_list.map((item, index) => ({
    id: index, // el backend no manda un id de registro acá, solo nombre/cargo/estado
    nombre: item.name,
    cargo: item.position,
    asistencia: RECORD_TYPE_LABELS[item.record_type] ?? item.record_type,
  }))

  const asistenciaHoy = Object.entries(data.todays_records).map(([tipo, cantidad]) => ({
    estado: RECORD_TYPE_LABELS[tipo] ?? tipo,
    cantidad,
  }))

  const tendenciaSemanal = Object.entries(WEEKDAY_LABELS).map(([key, dia]) => ({
    dia,
    asistencia: data.weekly_rate[key] ?? 0,
  }))

  return { empleados, asistenciaHoy, tendenciaSemanal }
}