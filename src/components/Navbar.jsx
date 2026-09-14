import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from './Button'
import CollapsibleMenu from './CollapsibleMenu'

export default function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <nav className="flex items-center justify-between h-16 w-full bg-checkboxtrueorinpt/80 px-6">
            <div className="flex items-center gap-6">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `font-principal ${isActive ? 'text-botonprincipal font-bold' : 'text-secundario'}`
                    }
                >
                    Inicio
                </NavLink>
                <CollapsibleMenu
                    title="Reportes"
                    items={[
                        { label: 'R. atrasos', to: '/reportes/atrasos' },
                        { label: 'R. Inasistencia', to: '/reportes/inasistencias' },
                        { label: 'R. Salidas ant.', to: '/reportes/salidas-anticipadas' },
                    ]}
                />
                <NavLink
                    to="/empleados"
                    className={({ isActive }) =>
                        `font-principal ${isActive ? 'text-botonprincipal font-bold' : 'text-secundario'}`
                    }
                >
                    Gestion de Empleados
                </NavLink>
            </div>
            <Button onClick={handleLogout} className="w-auto! px-6">
                Cerrar Sesión
            </Button>
        </nav>
    );
}
