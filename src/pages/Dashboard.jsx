export default function Dashboard() {
    return (

        <div className="flex flex-col items-center justify-center min-h-screen bg-fondo">
            <h1 className="text-4xl text-letra font-principal font-bold ">Bienvenido al Dashboard</h1>
            <p className="mt-2 text-sm">Aquí puedes acceder a las funcionalidades de la aplicación solo si eres admin.</p>
        </div>
    );
}