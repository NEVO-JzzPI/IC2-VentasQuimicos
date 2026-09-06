import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Check() {
    const [now, setNow] = useState(new Date());
    const[isCheckedIn, setIsCheckedIn] = useState(false);

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
                <Button className="mt-4 basis-lg py-5 text-xl bg-checkboxtrueorinpt" disabled={isCheckedIn} onClick={() => { console.log('Entrada'); setIsCheckedIn(true); }}>
                    Entrada
                </Button>
                <Button className="mt-4 basis-lg py-5 text-xl" disabled={!isCheckedIn} onClick={() => { console.log('Salida'); setIsCheckedIn(false); }}>
                    Salida
                </Button>
            </div>

        </Card>
    )
}