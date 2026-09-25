// El backend no expone reportes de atrasos/inasistencias/salidas-anticipadas
// como endpoints propios todavía (specs/002, 003, 004 — estado "Pendiente" o
// "Parcial"). Las specs sí definen la regla de negocio exacta, así que la
// aplicamos aquí cruzando /assistance_api/assistances/ con /accounts_api/users/,
// sin tocar Reporte.jsx.
import { listarRegistros } from './asistencia'
import { ListEmp } from './emp'
import { extractErrorMessage } from './api'

const ATRASO_THRESHOLD = '09:30:00' // specs/002: atraso = ingreso estrictamente posterior a las 9:30
const SALIDA_TEMPRANA_THRESHOLD = '17:30:00' // specs/003: salida estrictamente antes de las 17:30

async function buildUserLookup() {
  const empleados = await ListEmp()
  const lookup = new Map()
  empleados.forEach((e) => {
    lookup.set(e.id, {
      nombre: [e.name, e.firstLastname].filter(Boolean).join(' '),
      cargo: e.position,
      activo: e.isActive,
      tipo: e.type,
    })
  })
  return lookup
}

function enumerarDiasHabiles(fechas) {
  if (fechas.length === 0) return []
  const min = fechas.reduce((a, b) => (a < b ? a : b))
  const max = fechas.reduce((a, b) => (a > b ? a : b))
  const dias = []
  const cursor = new Date(`${min}T00:00:00`)
  const fin = new Date(`${max}T00:00:00`)
  while (cursor <= fin) {
    const diaSemana = cursor.getDay() // 0 domingo ... 6 sábado
    if (diaSemana >= 1 && diaSemana <= 5) {
      const year = cursor.getFullYear()
      const month = String(cursor.getMonth() + 1).padStart(2, '0')
      const day = String(cursor.getDate()).padStart(2, '0')
      dias.push(`${year}-${month}-${day}`)
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return dias
}

export async function ListReporte(tipo) {
  if (!['atrasos', 'inasistencias', 'salidas-anticipadas'].includes(tipo)) {
    throw new Error('Tipo de reporte no encontrado')
  }

  try {
    const [registros, lookup] = await Promise.all([listarRegistros(), buildUserLookup()])
    const persona = (userId) => {
      const info = lookup.get(userId)
      return { nombre: info?.nombre ?? `Usuario #${userId}`, cargo: info?.cargo ?? null }
    }

    if (tipo === 'atrasos') {
      // El flag `delay` que calcula el backend usa un umbral de 9:00, no de
      // 9:30 (brecha conocida, ver specs/002) — se recalcula acá con la regla real.
      const data = registros
        .filter((r) => r.type === 'ingreso' && r.time > ATRASO_THRESHOLD)
        .map((r) => ({ id: r.id, ...persona(r.user), hora: r.time, fecha: r.date }))
      return {
        titulo: 'Reporte de Atrasos',
        data,
        columnas: [
          { label: 'Hora de llegada', campo: 'hora' },
          { label: 'Fecha', campo: 'fecha' },
        ],
      }
    }

    if (tipo === 'salidas-anticipadas') {
      const data = registros
        .filter((r) => r.type === 'salida' && r.time < SALIDA_TEMPRANA_THRESHOLD)
        .map((r) => ({ id: r.id, ...persona(r.user), hora: r.time, fecha: r.date }))
      return {
        titulo: 'Reporte de Salidas Anticipadas',
        data,
        columnas: [
          { label: 'Hora de salida', campo: 'hora' },
          { label: 'Fecha', campo: 'fecha' },
        ],
      }
    }

    // 'inasistencias': día hábil sin ingreso ni salida, para empleados activos
    // tipo 'empleado'. Un `falta_anticipada` ese día la marca como justificada
    // (specs/004). El rango cubierto es el que ya tiene datos en /assistances/
    // — la API todavía no acepta un from/to explícito.
    const fechas = [...new Set(registros.map((r) => r.date))]
    const diasHabiles = enumerarDiasHabiles(fechas)

    const marcasPorUsuarioFecha = new Map()
    registros.forEach((r) => {
      const key = `${r.user}-${r.date}`
      const set = marcasPorUsuarioFecha.get(key) ?? new Set()
      set.add(r.type)
      marcasPorUsuarioFecha.set(key, set)
    })

    const empleadosActivos = [...lookup.entries()].filter(
      ([, info]) => info.tipo === 'empleado' && info.activo
    )

    const data = []
    diasHabiles.forEach((fecha) => {
      empleadosActivos.forEach(([userId, info]) => {
        const tipos = marcasPorUsuarioFecha.get(`${userId}-${fecha}`) ?? new Set()
        const marco = tipos.has('ingreso') || tipos.has('salida')
        if (marco) return
        const justificada = tipos.has('falta_anticipada')
        data.push({
          id: `${userId}-${fecha}`,
          nombre: info.nombre,
          cargo: info.cargo,
          fecha,
          estado: justificada ? 'Justificada' : 'Sin justificar',
        })
      })
    })

    return {
      titulo: 'Reporte de Inasistencia',
      data,
      columnas: [
        { label: 'Fecha', campo: 'fecha' },
        { label: 'Estado', campo: 'estado' },
      ],
    }
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'No se pudo cargar el reporte'), { cause: err })
  }
}
