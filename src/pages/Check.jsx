import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { useToast } from '../hooks/useToast';

export default function Check() {
    
    const navigate = useNavigate();
    const [now, setNow] = useState(new Date());
    const{  user, checking, stopChecking, isChecking } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return(
        <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-3xl text-center relative overflow-hidden bg-bg border-panel-oscuro-borde! text-secundario!">

            <span className="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l-2 border-t-2 border-acento-hazard/70" />
            <span className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r-2 border-t-2 border-acento-hazard/70" />
            <span className="pointer-events-none absolute left-4 -bottom-2 h-3 w-3 border-l-2 border-b-2 border-acento-hazard/70" />
            <span className="pointer-events-none absolute right-4 -bottom-2 h-3 w-3 border-r-2 border-b-2 border-acento-hazard/70" />

            <div>
                <p className="font-rotulo text-xs font-semibold uppercase tracking-[0.25em] text-acento-hazard">Registro de Asistencia</p>
                <h1 className="mt-1 text-2xl font-rotulo font-semibold uppercase tracking-wide text-checkboxtrueorinpt">Marcar Asistencia</h1>
                <p className="mt-6 rounded-md border border-panel-oscuro-borde bg-bg/40 py-4 font-dato text-7xl font-semibold text-acento-hazard tabular-nums">
                    {now.toLocaleTimeString('es-CL',{ hour12: false })}
                </p>
            </div>
            <div className="flex flex-row gap-6 mt-8">
                <Button className="mt-4 basis-lg py-5 text-xl bg-checkboxtrueorinpt hover:bg-checkboxtrueorinpt/60" disabled={isChecking}
                onClick={() =>{
                    showToast('Entrada registrada', 'entradas');
                    checking();
                    if (user?.rol === 'admin') navigate('/dashboard');
                    }}>
                    ● Entrada
                </Button>
                <Button className="mt-4 basis-lg py-5 text-xl hover:bg-botonhover/60" disabled={!isChecking} onClick={() => {
                    stopChecking();
                    navigate('/')
                    showToast('Salida registrada', 'salidas'); }}>
                    ● Salida
                </Button>
            </div>

        </Card>
        </div>
    )
}