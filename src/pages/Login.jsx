import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';



export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    // Guarda el mensaje de error 
    const [error, setError] = useState(null);
    // Indica si la petición de login está en curso, para deshabilitar el botón y mostrar aviso
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        setError(null);   // limpiar error anterior
        setLoading(true);  // petición en proceso

        try {
            await login(username, password);
            navigate('/check');  // redirigir a la página de verificación
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
}
    };

    return (
        <Card> 
            <div>
                <h2 className="text-3xl font-bold">Iniciar Sesión</h2>
                <p className="mt-2 text-sm">Ingresa tus credenciales para acceder</p>
            </div>
            <form onSubmit={handleSubmit} className="text-letra-secundario">

                <div className="space-y-1">
                    <label className="mb-1 block text-sm font-medium " htmlFor="username">Usuario</label>
                    <input
                        id="username" 
                        type="text" 
                        autoComplete="username"
                        required
                        className="w-full rounded-lg border border-black px-4 py-2 placeholder-gray-400 outline-none transition focus:border-checkboxtrueorinpt focus:ring-2 focus:ring-checkboxtrueorinpt mb-3.5"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium " htmlFor="password">Contraseña</label>
                        <a href="#" className="text-xs  hover:underline">¿La olvidaste?</a>
                    </div>
                    <input 
                        id="password"
                        type="password" 
                        placeholder="••••••••" 
                        required
                        className="w-full rounded-lg border border-black px-4 py-2  placeholder-black-400 outline-none transition focus:border-checkboxtrueorinpt focus:ring-2 focus:ring-checkboxtrueorinpt mb-3.5"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="flex items-center mb-3.5">
                    <input
                        type="checkbox"
                        id="remember"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-checkboxtrueorinpt accent-checkboxtrueorinpt checked:bg-checkboxtrueorinpt checked:border-checkboxtrueorinpt focus:ring-checkboxtrueorinpt"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600 select-none">Recordar mi sesión</label>
                </div>

               
                {error && (
                    <p className="text-red-600 text-sm mb-3.5">{error}</p>
                )}

                { console.log(loading) }
                
                <Button type="submit" disabled={loading} >
                    {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                </Button>
            </form>

        </Card>
    )
}
