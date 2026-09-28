//Prueba el flujo de los guards
// - RequireAuth → si !user, redirige a /.
// - RequireAdmin → si user?.rol !== 'admin', redirige a /check.
// - RequireCheckedIn → si estadoCargando retorna null (no navega, solo espera); si !yaIngreso (no marcó ingreso hoy), redirige a /check.
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { RequireAuth, RequireAdmin, RequireCheckedIn } from '../../components/Guards'
import { useAuth } from '../../hooks/useAuth'

//  reemplaza automáticamente el módulo por mocks
vi.mock('../../hooks/useAuth')

//helper local para no repetir el MemoryRouter/Routes en cada it. La ruta /protegida es donde "vive" el guard; las rutas / y 
// /check son destinos falsos solo para verificar
function renderWithRouter(ui) {
  return render(
    <MemoryRouter initialEntries={['/protegida']}>
      <Routes>
        <Route path="/protegida" element={ui} />
        <Route path="/" element={<div>Pantalla Login</div>} />
        <Route path="/check" element={<div>Pantalla Check</div>} />
      </Routes>
    </MemoryRouter>
  )
}
//Simula useAuth() devolviendo { user: null } — como si nadie hubiera iniciado sesión
describe('RequireAuth', () => {
  it('redirige a / si no hay usuario', () => {
    useAuth.mockReturnValue({ user: null })
    renderWithRouter(<RequireAuth><div>Contenido protegido</div></RequireAuth>)
    expect(screen.getByText('Pantalla Login')).toBeInTheDocument()
  })
  // Mockea { user: { rol: 'empleado' } } — hay usuario, aunque no importa el rol para este guard. Como !user es false, el componente no redirige y devuelve children tal cual
  it('renderiza children si hay usuario', () => {
    useAuth.mockReturnValue({ user: { rol: 'empleado' } })
    renderWithRouter(<RequireAuth><div>Contenido protegido</div></RequireAuth>)
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
  })
})
//Mockea { user: { rol: 'empleado' } }. La condición user?.rol !== 'admin' es true (rol es "empleado", no "admin")
describe('RequireAdmin', () => {
  it('redirige a /check si el rol no es admin', () => {
    useAuth.mockReturnValue({ user: { rol: 'empleado' } })
    renderWithRouter(<RequireAdmin><div>Solo admin</div></RequireAdmin>)
    expect(screen.getByText('Pantalla Check')).toBeInTheDocument()
  })
//Mockea { user: { rol: 'admin' } }. Ahora user?.rol !== 'admin' es false, no redirige, y muestra "Solo admin"
  it('renderiza children si el rol es admin', () => {
    useAuth.mockReturnValue({ user: { rol: 'admin' } })
    renderWithRouter(<RequireAdmin><div>Solo admin</div></RequireAdmin>)
    expect(screen.getByText('Solo admin')).toBeInTheDocument()
  })
})

// Mockea { estadoCargando: true, yaIngreso: false } — simula el momento en que la app todavía está consultando si el usuario ya marcó entrada 
describe('RequireCheckedIn', () => {
  it('no renderiza nada mientras estadoCargando es true', () => {
      useAuth.mockReturnValue({ estadoCargando: true, yaIngreso: false })
      const { container } = renderWithRouter(
          <RequireCheckedIn><div>Dashboard</div></RequireCheckedIn>
        )
        expect(container.textContent).toBe('')
    })
    //Mockea { estadoCargando: false, yaIngreso: false } — ya terminó de cargar, y el resultado es que no ha marcado entrada
    it('redirige a /check si no ha marcado entrada', () => {
    useAuth.mockReturnValue({ estadoCargando: false, yaIngreso: false })
    renderWithRouter(<RequireCheckedIn><div>Dashboard</div></RequireCheckedIn>)
    expect(screen.getByText('Pantalla Check')).toBeInTheDocument()
  })
    // Mockea { estadoCargando: false, yaIngreso: true } — ya cargó y sí marcó entrada.
  it('renderiza children si ya marcó entrada', () => {
    useAuth.mockReturnValue({ estadoCargando: false, yaIngreso: true })
    renderWithRouter(<RequireCheckedIn><div>Dashboard</div></RequireCheckedIn>)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
  // El admin que ya marcó entrada y después salida (isChecking false) igual puede volver al dashboard.
  it('renderiza children si marcó entrada y después salida', () => {
    useAuth.mockReturnValue({ estadoCargando: false, isChecking: false, yaIngreso: true })
    renderWithRouter(<RequireCheckedIn><div>Dashboard</div></RequireCheckedIn>)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})
