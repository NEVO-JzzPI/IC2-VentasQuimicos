import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
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
                <CollapsibleMenu title="Reportes" items={['R. atrasos', 'R. Inasistencia', 'R. Salidas ant.']} />
                <NavLink
                    to="/empleados"
                    className={({ isActive }) =>
                        `font-principal ${isActive ? 'text-botonprincipal font-bold' : 'text-letra'}`
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
