// Reportes de atrasos / salidas anticipadas / inasistencias (RE-01..03).
// El backend filtra y agrupa por empleado (reports/late|early-exits|absences/);
// aquí solo se aplanan los días de cada empleado a filas para Reporte.jsx.
import api, { extractErrorMessage } from './api'

const REPORTES = {
  atrasos: {
    url: '/assistance_api/assistances/reports/late/',
    titulo: 'Reporte de Atrasos',
    columnas: [
      { label: 'Hora de llegada', campo: 'hora' },
      { label: 'Fecha', campo: 'fecha' },
    ],
  },
  'salidas-anticipadas': {
    url: '/assistance_api/assistances/reports/early-exits/',
    titulo: 'Reporte de Salidas Anticipadas',
    columnas: [
      { label: 'Hora de salida', campo: 'hora' },
      { label: 'Fecha', campo: 'fecha' },
    ],
  },
  inasistencias: {
    url: '/assistance_api/assistances/reports/absences/',
    titulo: 'Reporte de Inasistencia',
    columnas: [
      { label: 'Fecha', campo: 'fecha' },
      { label: 'Estado', campo: 'estado' },
    ],
  },
}

export async function ListReporte(tipo) {
  const reporte = REPORTES[tipo]
  if (!reporte) throw new Error('Tipo de reporte no encontrado')

  try {
    // Paginado por empleado (50 por página): se traen todas las páginas.
    let url = reporte.url
    let empleados = []
    while (url) {
      const { data } = await api.get(url)
      empleados = empleados.concat(data.results)
      url = data.next
    }

    const data = empleados.flatMap((e) =>
      e.days.map((d) => ({
        id: `${e.user}-${d.date}`,
        user: e.user,
        nombre: e.name,
        cargo: e.position,
        fecha: d.date,
        hora: d.time,
        estado: d.justified ? 'Justificada' : 'Sin justificar',
      }))
    )

    return { titulo: reporte.titulo, columnas: reporte.columnas, data }
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'No se pudo cargar el reporte'), { cause: err })
  }
}
