// El backend no expone reportes de atrasos/inasistencias/salidas-anticipadas
// como endpoints propios todavía (specs/002, 003, 004 — estado "Pendiente" o
// "Parcial"), así que se arman aquí a partir de /assistance_api/assistances/,
// sin tocar Reporte.jsx.
//
// Desde 2026-09-25 los registros traen los flags `delay` y `early_exit` ya
// calculados contra el horario configurable de la empresa (9:30 / 17:30 por
// defecto, /assistance_api/schedule/), y además `name` y `position`. Por eso
// atrasos y salidas anticipadas ya no recalculan el umbral a mano ni necesitan
// cruzar con /accounts_api/users/; inasistencias sí, porque requiere saber
// quién NO marcó.
import { listarRegistros } from './asistencia'
import { ListEmp } from './emp'
import { extractErrorMessage } from './api'

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
    const registros = await listarRegistros()

    if (tipo === 'atrasos') {
      // `delay` lo marca el backend sobre el PRIMER ingreso del día contra
      // `entry_time` del horario vigente (un reingreso nunca cuenta como atraso).
      const data = registros
        .filter((r) => r.type === 'ingreso' && r.delay)
        .map((r) => ({ id: r.id, nombre: r.name, cargo: r.position, hora: r.time, fecha: r.date }))
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
      // `early_exit` lo marca el backend contra `exit_time` del horario vigente.
      // Pero specs/003 exige considerar solo la ÚLTIMA salida de cada día: si el
      // empleado salió, volvió con permiso de reingreso y salió de nuevo, esa
      // salida intermedia queda con early_exit=True y no debe contar como
      // salida anticipada (se fue temprano solo si su último egreso fue temprano).
      const ultimaSalidaPorDia = new Map()
      registros
        .filter((r) => r.type === 'salida')
        .forEach((r) => {
          const clave = `${r.user}-${r.date}`
          const previa = ultimaSalidaPorDia.get(clave)
          if (!previa || r.time > previa.time) ultimaSalidaPorDia.set(clave, r)
        })

      const data = [...ultimaSalidaPorDia.values()]
        .filter((r) => r.early_exit)
        .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)))
        .map((r) => ({ id: r.id, nombre: r.name, cargo: r.position, hora: r.time, fecha: r.date }))
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
    const lookup = await buildUserLookup()
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
