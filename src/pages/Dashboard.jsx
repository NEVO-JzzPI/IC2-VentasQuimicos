import Navbar from "../components/Navbar";
import Card from "../components/Card"
import AsistenciaBadge from "../components/AsistenciaBadge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const empleados = [
    { id: 1, nombre: 'Juan Pérez', cargo: 'Operario', asistencia: 'Presente' },
    { id: 2, nombre: 'María Gómez', cargo: 'Supervisora', asistencia: 'Ausente' },
    { id: 3, nombre: 'Carlos Ruiz', cargo: 'Bodeguero', asistencia: 'S. Anticipada' },
];
const asistenciaHoy = ['Presente', 'Ausente', 'S. Anticipada'].map((estado) => ({
    estado,
    cantidad: empleados.filter((e) => e.asistencia === estado).length,
}));
const tendenciaSemanal = [
    { dia: 'Lun', asistencia: 92 },
    { dia: 'Mar', asistencia: 88 },
    { dia: 'Mié', asistencia: 95 },
    { dia: 'Jue', asistencia: 90 },
    { dia: 'Vie', asistencia: 85 },
];


export default function Dashboard() {
    return (

        <div className="min-h-screen bg-bg">
            <Navbar />
            <main className="p-6">
                <div className="grid grid-cols-2 gap-4">
                    <Card className="max-w-none!">
                        <h2 className="font-rotulo uppercase tracking-wide text-letra mb-2">Asistencia de hoy</h2>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={asistenciaHoy}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="estado" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="cantidad" fill="#D25D7F" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                    <Card className="max-w-none!">
                        <h2 className="font-rotulo uppercase tracking-wide text-letra mb-2">Tendencia semanal de asistencia</h2>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={tendenciaSemanal}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="dia" />
                                <YAxis unit="%" domain={[0, 100]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="asistencia" stroke="#7A8450" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
                <table className="w-full mt-6 bg-secundario rounded-lg ">
                    <thead>
                        <tr className="text-left border rounded-t-lg font-bold ">
                            <th className="p-3 font-rotulo text-xs uppercase tracking-wide text-letra-secundario">Nombre</th>
                            <th className="p-3 font-rotulo text-xs uppercase tracking-wide text-letra-secundario">Cargo</th>
                            <th className="p-3 font-rotulo text-xs uppercase tracking-wide text-letra-secundario">Asistencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empleados.map((emp, i) => (
                            <tr key={emp.id} className="border border-letra-secundario bg-checkboxtrueorinpt/30 font-bold hover:bg-checkboxtrueorinpt/40">
                                <td className=" p-4">{emp.nombre}</td>
                                <td className="p-4 text-letra-secundario">{emp.cargo}</td>
                                <td className="p-4"><AsistenciaBadge estado={emp.asistencia} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </main>
        </div>

    );
}