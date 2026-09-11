let MOCK_EMPLOYEES =[
     { id: 1, usuario: 'jperez', nombre: 'Juan Pérez', direccion: 'Av. Siempre Viva 123', cargo: 'Operario'  },
  { id: 2, usuario: 'mgonzalez', nombre: 'María González', direccion: 'Calle Falsa 456', cargo: 'Supervisora' },
  { id: 3, usuario: 'mlopez', nombre: 'Marco Lopez', direccion: 'Calle Falsa 133', cargo: 'administrador' },
]

export async function ListEmp(){

    await new Promise((resolve) => setTimeout(resolve, 500))

    return [...MOCK_EMPLOYEES]

}

export async function CreateEmp(dates){

    await new Promise((resolve) => setTimeout(resolve, 500))

    const nuevoId = Math.max(...MOCK_EMPLOYEES.map(e => e.id), 0) + 1
    const nuevoEmpleado = { id: nuevoId, ...dates }

    MOCK_EMPLOYEES.push(nuevoEmpleado)

    return nuevoEmpleado

}
export async function DeleteEmp(id){
    await new Promise((resolve) => setTimeout(resolve, 500))
    MOCK_EMPLOYEES = MOCK_EMPLOYEES.filter(e => e.id !== id)
}
export async function UpdateEmp(id,dates){

    await new Promise((resolve) => setTimeout(resolve, 500))
    MOCK_EMPLOYEES = MOCK_EMPLOYEES.map(e =>
        e.id === id ? { ...e, ...dates } : e
    )

    return MOCK_EMPLOYEES.find(e => e.id === id)

}