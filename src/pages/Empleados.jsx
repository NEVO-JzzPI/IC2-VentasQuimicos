import { useEffect, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Button from '../components/Button'
import { useToast } from '../context/ToastContext'
import { ListEmp, CreateEmp, UpdateEmp, DeleteEmp } from '../services/emp'

const FORM_VACIO = { usuario: '', nombre: '', direccion: '', cargo: '' }

export default function Empleados() {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    ListEmp().then((data) => {
      setEmpleados(data)
      setLoading(false)
    })
  }, [])

  function openCreateModal() {
    setEditingId(null)
    setForm(FORM_VACIO)
    setIsModalOpen(true)
  }

  function openEditModal(emp) {
    setEditingId(emp.id)
    setForm({ usuario: emp.usuario, nombre: emp.nombre, direccion: emp.direccion, cargo: emp.cargo })
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

  async function handleDelete(emp) {
    if (!confirm(`¿Eliminar a ${emp.nombre}?`)) return
    try {
      await DeleteEmp(emp.id)
      setEmpleados((prev) => prev.filter((e) => e.id !== emp.id))
      showToast('Empleado eliminado', 'info')
    } catch (err) {
      showToast(err.message ?? 'No se pudo eliminar el empleado', 'info')
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold font-principal text-letra">Gestión de Empleados</h1>
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
                <tr className="border-b border-letra-secundario/20">
                  <th className="p-3 font-principal">Nombre</th>
                  <th className="p-3 font-principal">Usuario</th>
                  <th className="p-3 font-principal">Cargo</th>
                  <th className="p-3 font-principal">Dirección</th>
                  <th className="p-3 font-principal">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((emp) => (
                  <tr key={emp.id} className="border-b border-letra-secundario/10">
                    <td className="p-3">{emp.nombre}</td>
                    <td className="p-3">{emp.usuario}</td>
                    <td className="p-3">{emp.cargo}</td>
                    <td className="p-3">{emp.direccion}</td>
                    <td className="p-3 space-x-2">
                      <button
                        type="button"
                        className="text-checkboxtrueorinpt hover:underline"
                        onClick={() => openEditModal(emp)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="text-botonprincipal hover:underline"
                        onClick={() => handleDelete(emp)}
                      >
                        Eliminar
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
          <DialogPanel className="w-full max-w-md rounded-2xl bg-secundario p-8 shadow-lg font-principal text-letra space-y-6">
            <DialogTitle className="text-xl font-bold">
              {editingId ? 'Editar Empleado' : 'Nuevo Empleado'}
            </DialogTitle>

            <form onSubmit={handleSubmit} className="text-letra-secundario space-y-3.5">
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="usuario">Usuario</label>
                <input
                  id="usuario"
                  type="text"
                  required
                  className="w-full rounded-lg border border-black px-4 py-2 outline-none transition focus:border-checkboxtrueorinpt focus:ring-2 focus:ring-checkboxtrueorinpt"
                  value={form.usuario}
                  onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  type="text"
                  required
                  className="w-full rounded-lg border border-black px-4 py-2 outline-none transition focus:border-checkboxtrueorinpt focus:ring-2 focus:ring-checkboxtrueorinpt"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="cargo">Cargo</label>
                <input
                  id="cargo"
                  type="text"
                  required
                  className="w-full rounded-lg border border-black px-4 py-2 outline-none transition focus:border-checkboxtrueorinpt focus:ring-2 focus:ring-checkboxtrueorinpt"
                  value={form.cargo}
                  onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="direccion">Dirección</label>
                <input
                  id="direccion"
                  type="text"
                  required
                  className="w-full rounded-lg border border-black px-4 py-2 outline-none transition focus:border-checkboxtrueorinpt focus:ring-2 focus:ring-checkboxtrueorinpt"
                  value={form.direccion}
                  onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                />
              </div>

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
