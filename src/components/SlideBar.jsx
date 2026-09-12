import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from './Button'
import CollapsibleMenu from './CollapsibleMenu'

export default function SlideBar(){
    const {logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () =>{
        logout();
        navigate('/');
    }

    return(
        <div>
            <aside className="flex flex-col justify-between h-screen w-64 bg-secundario p-4">
                <div className="space-y-4">
                    <CollapsibleMenu title="Reportes" items={['R. atrasos', 'R. Inasistencia', 'R. Salidas ant.']} />
                    <NavLink
                        to="/empleados"
                        className={({ isActive }) =>
                            `block font-principal ${isActive ? 'text-botonprincipal font-bold' : 'text-letra'}`
                        }
                        >
                            Gestion de Empleados
                    </NavLink>
                </div>
                <Button onClick={handleLogout}>
                    Cerrar Sesión
                </Button>
            </aside>

        </div>
    );

}