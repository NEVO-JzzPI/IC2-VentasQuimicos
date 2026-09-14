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
                        <h1 className="text-xl font-principal font-bold text-letra mb-4">{reporte.titulo}</h1>
                        <table className="w-full bg-secundario rounded-lg overflow-hidden">
                            <thead>
                                <tr className="text-left border-b border-letra-secundario/20">
                                    <th className="p-3 font-principal">Nombre</th>
                                    <th className="p-3 font-principal">Cargo</th>
                                    <th className="p-3 font-principal">{reporte.columnaExtra}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reporte.data.map((persona) => (
                                    <tr key={persona.id} className="border-b border-letra-secundario/10">
                                        <td className="p-3">{persona.nombre}</td>
                                        <td className="p-3">{persona.cargo}</td>
                                        <td className="p-3">{persona[reporte.campo]}</td>
                                    </tr>
                                ))}
                                {reporte.data.length === 0 && (
                                    <tr>
                                        <td className="p-3 text-letra-secundario" colSpan={3}>Sin registros</td>
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
