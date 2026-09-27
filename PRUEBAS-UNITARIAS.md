# Pruebas unitarias recomendadas (Vitest)

Este proyecto no tiene test runner configurado todavía. Acá van las **5 pruebas más importantes** para escribir primero, y por qué — priorizando la lógica que programamos al conectar el backend, que es la más fácil de romper sin darse cuenta.

## Setup (una sola vez)

```bash
npm install -D vitest
```

Como los tests de esta lista solo prueban funciones de `src/services/` (no componentes React), **no hace falta** `jsdom` ni `@testing-library/react` todavía — se agregan después si se decide testear páginas.

Agregar en `package.json`:

```json
"scripts": {
  "test": "vitest run"
}
```

Cada archivo de test va al lado del archivo que prueba, con el sufijo `.test.js` (ej. `src/services/asistencia.test.js`).

---

## 1. `asistencia.js` — la fecha se calcula en horario local, no UTC

**Por qué importa:** este fue un bug real que encontramos probando la app a mano. `todayDate()` usaba `toISOString()`, que da la fecha en UTC; pasadas las 21:00 en Chile eso ya es "mañana". Un test con hora del sistema simulada lo habría atrapado antes de tocar el navegador.

```js
import { describe, it, expect, vi, afterEach } from 'vitest'

describe('todayDate', () => {
  afterEach(() => vi.useRealTimers())

  it('no se adelanta de día por culpa de UTC en la noche', async () => {
    vi.useFakeTimers()
    // 23:40 hora de Chile (UTC-3) del 24 de septiembre
    vi.setSystemTime(new Date('2026-09-24T23:40:00-03:00'))

    // todayDate() no está exportada hoy; para testearla hay que exportarla
    // desde asistencia.js (export function todayDate() {...}).
    const { todayDate } = await import('./asistencia')
    expect(todayDate()).toBe('2026-09-24')
  })
})
```

---

## 2. `reportes.js` — el umbral de atraso es 9:30, no 9:00

**Por qué importa:** el campo `delay` que calcula el backend usa un umbral distinto (9:00, es un bug documentado en `specs/002-reporte-atrasos`). El frontend lo recalcula solo — si alguien "corrige" ese código sin saber por qué, vuelve a usar el umbral equivocado sin que nadie lo note.

```js
import { describe, it, expect, vi } from 'vitest'
import { ListReporte } from './reportes'
import { listarRegistros } from './asistencia'
import { ListEmp } from './emp'

vi.mock('./asistencia')
vi.mock('./emp')

describe('ListReporte("atrasos")', () => {
  it('9:30 en punto NO es atraso, 9:31 sí', async () => {
    ListEmp.mockResolvedValue([{ id: 1, name: 'Ana', firstLastname: 'Torres', position: 'QA', isActive: true, type: 'empleado' }])
    listarRegistros.mockResolvedValue([
      { id: 1, user: 1, type: 'ingreso', date: '2026-09-24', time: '09:30:00', delay: false },
      { id: 2, user: 1, type: 'ingreso', date: '2026-09-25', time: '09:31:00', delay: false },
    ])

    const reporte = await ListReporte('atrasos')

    expect(reporte.data).toHaveLength(1)
    expect(reporte.data[0].fecha).toBe('2026-09-25')
  })
})
```

---

## 3. `reportes.js` — inasistencias: fin de semana no cuenta, falta anticipada sí justifica

**Por qué importa:** es la lógica más compleja que se escribió (cruza días hábiles × empleados activos × tipos de registro). Es la que más fácil se rompe con un refactor.

```js
it('no marca inasistencia en sábado/domingo, y "falta_anticipada" justifica', async () => {
  ListEmp.mockResolvedValue([
    { id: 1, name: 'Ana', firstLastname: 'Torres', position: 'QA', isActive: true, type: 'empleado' },
  ])
  listarRegistros.mockResolvedValue([
    // rango que incluye un fin de semana (2026-09-26 sáb, 27 dom) y un feriado sin marca (2026-09-28 lun)
    { id: 1, user: 1, type: 'ingreso', date: '2026-09-25', time: '08:00:00', delay: false },
    { id: 2, user: 1, type: 'falta_anticipada', date: '2026-09-29', time: '00:00:00' },
  ])

  const reporte = await ListReporte('inasistencias')
  const fechas = reporte.data.map((r) => r.fecha)

  expect(fechas).not.toContain('2026-09-26') // sábado
  expect(fechas).not.toContain('2026-09-27') // domingo
  expect(fechas).toContain('2026-09-28')     // lunes sin marca -> inasistencia
  expect(reporte.data.find((r) => r.fecha === '2026-09-29').estado).toBe('Justificada')
})
```

---

## 4. `auth.js` — el `type` del backend se traduce bien a `rol` del frontend

**Por qué importa:** todo el sistema de permisos (`Guards.jsx`) decide con `user.rol === 'admin'`. Si esta traducción falla, un empleado podría entrar al dashboard, o un admin quedar bloqueado.

```js
import { describe, it, expect, vi } from 'vitest'
import api from './api'
import { login } from './auth'

vi.mock('./api')

describe('login', () => {
  it('mapea type "administrador" del backend a rol "admin" del frontend', async () => {
    api.post.mockResolvedValue({ data: { access: 'a', refresh: 'r' } })
    api.get.mockResolvedValue({ data: { id: 1, name: 'Laura', first_lastname: 'Gomez', type: 'administrador' } })

    const { user } = await login('laura@example.com', '1234', false)

    expect(user.rol).toBe('admin')
  })

  it('credenciales incorrectas dan un mensaje de error legible', async () => {
    api.post.mockRejectedValue({ response: { status: 401 } })

    await expect(login('x@x.com', 'mala', false)).rejects.toThrow('Correo o contraseña incorrectos')
  })
})
```

---

## 5. `components/Guards.jsx` — las 3 reglas de acceso por separado

**Por qué importa:** son funciones puras y baratas de testear, pero protegen rutas sensibles (dashboard de admin, gestión de empleados). Un error de tipeo ahí (ej. comparar contra `'Admin'` en vez de `'admin'`) deja pasar a cualquiera, o bloquea a todo el mundo.

```js
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RequireAdmin } from './Guards'
import { useAuth } from '../hooks/useAuth'

vi.mock('../hooks/useAuth')

describe('RequireAdmin', () => {
  it('deja pasar a un admin', () => {
    useAuth.mockReturnValue({ user: { rol: 'admin' } })
    render(<MemoryRouter><RequireAdmin>secreto-admin</RequireAdmin></MemoryRouter>)
    expect(screen.getByText('secreto-admin')).toBeInTheDocument()
  })

  it('redirige a un empleado', () => {
    useAuth.mockReturnValue({ user: { rol: 'empleado' } })
    const { container } = render(<MemoryRouter><RequireAdmin>secreto-admin</RequireAdmin></MemoryRouter>)
    expect(container).not.toHaveTextContent('secreto-admin')
  })
})
```

Este último test sí necesita `jsdom` + `@testing-library/react` (`npm install -D jsdom @testing-library/react` y `test: { environment: 'jsdom' }` en `vite.config.js`).

---

## Lo que queda fuera de esta lista (a propósito)

`api.js` (el interceptor de refresh de token) también vale la pena testear, pero es más elaborado de simular (requests en paralelo, mockear axios dos niveles) — se deja para una segunda ronda una vez que estos 5 estén funcionando.
