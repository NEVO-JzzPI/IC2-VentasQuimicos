// CRUD de empleados sobre /accounts_api/ (usuarios). El modelo real no tiene
// "usuario" ni "dirección" — usa email como identificador y no guarda dirección.
import api, { extractErrorMessage } from './api'

function mapUser(u) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    firstLastname: u.first_lastname,
    position: u.position,
    isActive: u.is_active,
    type: u.type,
  }
}

export async function ListEmp() {
  try {
    const { data } = await api.get('/accounts_api/users/', { params: { limit: 100 } })
    return data.results.map(mapUser)
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'No se pudo cargar la lista de empleados'), { cause: err })
  }
}

export async function CreateEmp({ email, password, name, firstLastname, position }) {
  try {
    const { data } = await api.post('/accounts_api/registration/', {
      email,
      password,
      re_password: password,
      name,
      first_lastname: firstLastname,
      type: 'empleado',
    })

    if (position) {
      const { data: updated } = await api.patch(`/accounts_api/users/${data.id}/`, { position })
      return mapUser(updated)
    }

    return mapUser(data)
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'No se pudo crear el empleado'), { cause: err })
  }
}

export async function UpdateEmp(id, { email, name, firstLastname, position }) {
  try {
    const { data } = await api.patch(`/accounts_api/users/${id}/`, {
      email,
      name,
      first_lastname: firstLastname,
      position,
    })
    return mapUser(data)
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'No se pudo actualizar el empleado'), { cause: err })
  }
}

// El backend no borra, desactiva (is_active=false) y conserva el historial.
export async function DeleteEmp(id) {
  try {
    await api.delete(`/accounts_api/users/${id}/`)
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'No se pudo desactivar el empleado'), { cause: err })
  }
}

export async function SetEmpActive(id, isActive) {
  try {
    const { data } = await api.patch(`/accounts_api/users/${id}/`, { is_active: isActive })
    return mapUser(data)
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'No se pudo actualizar el estado del empleado'), { cause: err })
  }
}
