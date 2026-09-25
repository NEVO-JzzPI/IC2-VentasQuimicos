import { useEffect, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Button from '../components/Button'
import { useToast } from '../hooks/useToast'
import { ListEmp, CreateEmp, UpdateEmp, SetEmpActive } from '../services/emp'

const FORM_VACIO = { email: '', name: '', firstLastname: '', position: '', password: '' }

export default function Empleados() {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    ListEmp()
      .then((data) => setEmpleados(data))
      .catch((err) => showToast(err.message ?? 'No se pudo cargar la lista de empleados', 'info'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openCreateModal() {
    setEditingId(null)
    setForm(FORM_VACIO)
    setIsModalOpen(true)
  }

  function openEditModal(emp) {
    setEditingId(emp.id)
    setForm({ email: emp.email, name: emp.name, firstLastname: emp.firstLastname ?? '', position: emp.position ?? '', password: '' })
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        const actualizado = await UpdateEmp(editingId, form)
        setEmpleados((prev) => prev.map((emp) => (emp.id === editingId ? actualizado : emp)))
        showToast('Empleado actualizado', 'info')
      } else {
        const creado = await CreateEmp(form)
        setEmpleados((prev) => [...prev, creado])
        showToast('Empleado creado', 'info')
      }
      closeModal()
    } catch (err) {
      showToast(err.message ?? 'No se pudo guardar el empleado', 'info')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(emp) {
    const accion = emp.isActive ? 'desactivar' : 'reactivar'
    if (!confirm(`¿Seguro que quieres ${accion} a ${emp.name}?`)) return
    try {
      const actualizado = await SetEmpActive(emp.id, !emp.isActive)
      setEmpleados((prev) => prev.map((e) => (e.id === emp.id ? actualizado : e)))
      showToast(`Empleado ${emp.isActive ? 'desactivado' : 'reactivado'}`, 'info')
    } catch (err) {
      showToast(err.message ?? `No se pudo ${accion} al empleado`, 'info')
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-rotulo font-semibold uppercase tracking-wide text-letra">Gestión de Empleados</h1>
          <Button onClick={openCreateModal} className="w-auto! px-6">
            + Nuevo Empleado
          </Button>
        </div>

        <Card className="max-w-none">
          {loading ? (
            <p className="text-letra-secundario">Cargando empleados...</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-letra/10">
                  <th className="p-3 font-rotulo text-xs uppercase tracking-wide text-letra-secundario">Nombre</th>
                  <th className="p-3 font-rotulo text-xs uppercase tracking-wide text-letra-secundario">Email</th>
                  <th className="p-3 font-rotulo text-xs uppercase tracking-wide text-letra-secundario">Cargo</th>
                  <th className="p-3 font-rotulo text-xs uppercase tracking-wide text-letra-secundario">Estado</th>
                  <th className="p-3 font-rotulo text-xs uppercase tracking-wide text-letra-secundario">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((emp, i) => (
                  <tr key={emp.id} className={`border-b border-letra-secundario/10 ${i % 2 === 1 ? 'bg-bg/40' : ''}`}>
                    <td className="p-3">{[emp.name, emp.firstLastname].filter(Boolean).join(' ')}</td>
                    <td className="p-3 font-dato text-sm text-letra-secundario">{emp.email}</td>
                    <td className="p-3 text-letra-secundario">{emp.position ?? '—'}</td>
                    <td className="p-3 text-letra-secundario">{emp.isActive ? 'Activo' : 'Inactivo'}</td>
                    <td className="p-3 space-x-3">
                      <button
                        type="button"
                        className="font-rotulo text-xs uppercase tracking-wide text-checkboxtrueorinpt hover:underline"
                        onClick={() => openEditModal(emp)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="font-rotulo text-xs uppercase tracking-wide text-botonprincipal hover:underline"
                        onClick={() => handleToggleActive(emp)}
                      >
                        {emp.isActive ? 'Desactivar' : 'Reactivar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </main>

      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-lg border border-letra/10 bg-secundario p-8 shadow-lg font-principal text-letra space-y-6">
            <DialogTitle className="font-rotulo text-xl font-semibold uppercase tracking-wide">
              {editingId ? 'Editar Empleado' : 'Nuevo Empleado'}
            </DialogTitle>

            <form onSubmit={handleSubmit} className="text-letra-secundario space-y-3.5">
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full rounded-md border border-letra/25 px-4 py-2 outline-none transition focus:border-checkboxtrueorinpt focus:ring-2 focus:ring-checkboxtrueorinpt"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full rounded-md border border-letra/25 px-4 py-2 outline-none transition focus:border-checkboxtrueorinpt focus:ring-2 focus:ring-checkboxtrueorinpt"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="firstLastname">Apellido</label>
                <input
                  id="firstLastname"
                  type="text"
                  required
                  className="w-full rounded-md border border-letra/25 px-4 py-2 outline-none transition focus:border-checkboxtrueorinpt focus:ring-2 focus:ring-checkboxtrueorinpt"
                  value={form.firstLastname}
                  onChange={(e) => setForm({ ...form, firstLastname: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="position">Cargo</label>
                <input
                  id="position"
                  type="text"
                  className="w-full rounded-md border border-letra/25 px-4 py-2 outline-none transition focus:border-checkboxtrueorinpt focus:ring-2 focus:ring-checkboxtrueorinpt"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                />
              </div>

              {!editingId && (
                <div>
                  <label className="mb-1 block text-sm font-medium" htmlFor="password">Contraseña</label>
                  <input
                    id="password"
                    type="password"
                    required
                    className="w-full rounded-md border border-letra/25 px-4 py-2 outline-none transition focus:border-checkboxtrueorinpt focus:ring-2 focus:ring-checkboxtrueorinpt"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="button" className="bg-letra-secundario! hover:bg-letra!" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}
