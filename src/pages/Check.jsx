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
        <Card className="max-w-3xl text-center">

            <div>
                <h1 className="text-4xl text-letra font-principal font-bold ">Marcar Asistencia</h1>
                <p className="mt-2 text-7xl font-bold text-letra tabular-nums">
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
                    Entrada
                </Button>
                <Button className="mt-4 basis-lg py-5 text-xl hover:bg-botonhover/60" disabled={!isChecking} onClick={() => {  
                    stopChecking();
                    
                    showToast('Salida registrada', 'salidas'); }}>
                    Salida
                </Button>
            </div>

        </Card>
        </div>
    )
}