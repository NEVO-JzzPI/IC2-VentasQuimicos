import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useToast } from '../context/ToastContext';

export default function Check() {
    const [now, setNow] = useState(new Date());
    const[isCheckedIn, setIsCheckedIn] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return(
        <Card className="max-w-3xl text-center">

            <div>
                <h1 className="text-4xl text-letra font-principal font-bold ">Marcar Asistencia</h1>
                <p className="mt-2 text-7xl font-bold text-letra tabular-nums">
                    {now.toLocaleTimeString('es-CL',{ hour12: false })}
                </p>
            </div>
            <div className="flex flex-row gap-6 mt-8">
                <Button className="mt-4 basis-lg py-5 text-xl bg-checkboxtrueorinpt" disabled={isCheckedIn} onClick={() => { setIsCheckedIn(true); showToast('Entrada registrada', 'entradas'); }}>
                    Entrada
                </Button>
                <Button className="mt-4 basis-lg py-5 text-xl" disabled={!isCheckedIn} onClick={() => { setIsCheckedIn(false); showToast('Salida registrada', 'salidas'); }}>
                    Salida
                </Button>
            </div>

        </Card>
    )
}