import SlideBar from "../components/SlideBar";
import Card from "../components/Card"
import AsistenciaBadge from "../components/AsistenciaBadge";

const empleados = [
    { id: 1, nombre: 'Juan Pérez', cargo: 'Operario', asistencia: 'Presente' },
    { id: 2, nombre: 'María Gómez', cargo: 'Supervisora', asistencia: 'Ausente' },
    { id: 3, nombre: 'Carlos Ruiz', cargo: 'Bodeguero', asistencia: 'S. Anticipada' },
];

export default function Dashboard() {
    return (

        <div className="flex min-h-screen bg-bg">
            <SlideBar/>
            <main  className="flex-1 p-6">
                <div className="grid grid-cols-2 gap-4">
                        <Card> <h1>GRAFICO DE BARRAS </h1></Card>
                        <Card> <h1>GRAFICO DE LINEAS </h1></Card>
                </div>
                <div>
                    <table className="w-full mt-6 bg-secundario rounded-lg overflow-hidden">
                        <thead>
                            <tr className="text-left border-b border-letra-secundario/20">
                                <th className="p-3 font-principal">Nombre</th>
                                <th className="p-3 font-principal">Cargo</th>
                                <th className="p-3 font-principal">Asistencia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleados.map((emp) => (
                                <tr key={emp.id} className="border-b border-letra-secundario/10">
                                    <td className="p-3">{emp.nombre}</td>
                                    <td className="p-3">{emp.cargo}</td>
                                    <td className="p-3"><AsistenciaBadge estado={emp.asistencia} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
        
    );
}