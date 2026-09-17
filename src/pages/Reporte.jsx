import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { ListReporte } from "../services/reportes"

export default function Reporte() {
    const { tipo } = useParams();
    const [reporte, setReporte] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        ListReporte(tipo)
            .then((data) => {
                setReporte(data);
                setError('');
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [tipo]);

    return (
        <div className="min-h-screen bg-bg">
            <Navbar />
            <main className="p-6">
                {loading && <p className="font-principal text-letra">Cargando...</p>}
                {error && <p className="font-principal text-botonprincipal">{error}</p>}
                {reporte && (
                    <>
                        <h1 className="text-xl font-rotulo font-semibold uppercase tracking-wide text-letra mb-4">{reporte.titulo}</h1>
                        <table className="w-full rounded-lg border border-letra/10 overflow-hidden">
                            <thead >
                                <tr className="bg-white text-left border-b border-letra/10 font-bold">
                                    <th className="p-3 font-rotulo text-xs uppercase tracking-wide text-letra-secundario">Nombre</th>
                                    <th className="p-3 font-rotulo text-xs uppercase tracking-wide text-letra-secundario">Cargo</th>
                                    {reporte.columnas.map((col) => (
                                        <th key={col.campo} className="p-3 font-rotulo text-xs uppercase tracking-wide text-letra-secundario">{col.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {reporte.data.map((persona, i) => (
                                    <tr key={persona.id} className="border-b border-letra-secundario/10 bg-checkboxtrueorinpt/30 hover:bg-checkboxtrueorinpt/40 font-bold">
                                        <td className="p-3">{persona.nombre}</td>
                                        <td className="p-3 text-letra-secundario">{persona.cargo}</td>
                                        {reporte.columnas.map((col) => (
                                            <td key={col.campo} className="p-3 font-dato text-sm text-letra-secundario">{persona[col.campo]}</td>
                                        ))}
                                    </tr>
                                ))}
                                {reporte.data.length === 0 && (
                                    <tr>
                                        <td className="p-3 text-letra-secundario" colSpan={2 + reporte.columnas.length}>Sin registros</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                )}
            </main>
        </div>
    );
}
