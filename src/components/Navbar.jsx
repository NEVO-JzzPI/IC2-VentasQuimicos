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
        <nav className="flex items-center justify-between h-16 w-full bg-secundario border-b border-letra px-6">
            <div className="flex items-center gap-8">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `font-rotulo text-sm uppercase tracking-wide transition-colors ${isActive ? 'text-botonprincipal font-semibold' : 'text-letra-secundario hover:text-letra'}`
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
                        `font-rotulo text-sm uppercase tracking-wide transition-colors ${isActive ? 'text-botonprincipal font-semibold' : 'text-letra-secundario hover:text-letra'}`
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
