import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card"
import AsistenciaBadge from "../components/AsistenciaBadge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { resumenHoy } from "../services/asistencia";
import { useToast } from "../hooks/useToast";

const ESTADO_POR_RECORD_TYPE = {
    present: 'Presente',
    absence: 'Ausente',
    anticipated_absence: 'S. Anticipada',
}

const DIAS_SEMANA = [
    { key: 'monday', label: 'Lun' },
    { key: 'tuesday', label: 'Mar' },
    { key: 'wednesday', label: 'Mié' },
    { key: 'thursday', label: 'Jue' },
    { key: 'friday', label: 'Vie' },
]

export default function Dashboard() {
    const [resumen, setResumen] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        resumenHoy()
            .then(setResumen)
            .catch((err) => showToast(err.message ?? 'No se pudo cargar el dashboard', 'info'))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const asistenciaHoy = resumen
        ? [
            { estado: 'Presente', cantidad: resumen.todays_records.present },
            { estado: 'Ausente', cantidad: resumen.todays_records.absence },
            { estado: 'S. Anticipada', cantidad: resumen.todays_records.anticipated_absence },
        ]
        : [];

    // `weekly_rate[dia]` viene en `null` cuando ese día todavía no tiene ningún
    // dato histórico (ver API.md). Se deja como `null` a propósito: convertirlo
    // en 0 dibujaría un día "sin datos" como si fuera "0% de asistencia".
    const tendenciaSemanal = resumen
        ? DIAS_SEMANA.map(({ key, label }) => ({ dia: label, asistencia: resumen.weekly_rate[key] ?? null }))
        : [];

    return (

        <div className="min-h-screen bg-bg">
            <Navbar />
            <main className="p-6">
                {loading && <p className="font-principal text-letra">Cargando...</p>}
                {!loading && resumen && (
                    <>
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
                                <h2 className="font-rotulo uppercase tracking-wide text-letra mb-2">Tasa histórica de asistencia por día</h2>
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
                                {resumen.today_list.map((emp, i) => (
                                    <tr key={`${emp.name}-${i}`} className="border border-letra-secundario bg-checkboxtrueorinpt/30 font-bold hover:bg-checkboxtrueorinpt/40">
                                        <td className=" p-4">{emp.name}</td>
                                        <td className="p-4 text-letra-secundario">{emp.position ?? '—'}</td>
                                        <td className="p-4"><AsistenciaBadge estado={ESTADO_POR_RECORD_TYPE[emp.record_type]} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </main>
        </div>

    );
}
